/**
 * The overnight job search.
 *
 * Poked hourly by the Cloudflare Worker's cron trigger (see `scheduled` in
 * `cloudflare-api/src/index.ts`). The Worker holds no schedule logic — it only
 * knows how to tick — so everything about *what* runs is decided here, next to
 * the pipeline it drives.
 *
 * Why not Vercel Cron: the account is on the Hobby plan, which allows two cron
 * jobs at once-a-day granularity. That collapses a per-search frequency into
 * "on or off". An hourly Worker tick plus `isDue()` gives a real choice.
 *
 * The invariants worth keeping, in order of how expensive they are to get wrong:
 *
 * 1. **Nothing after the leads are written may throw.** The email, the run
 *    record and the counters all run after `runSearch()` has persisted, each
 *    wrapped separately. A throw there would lose a completed search.
 * 2. **A failure must be reported, not swallowed.** Silence is
 *    indistinguishable from a quiet job market, and the quiet one is the story
 *    you tell yourself.
 * 3. **The tick must finish.** A run killed at the function ceiling dies
 *    mid-write, so the loop stops starting searches once the budget is spent
 *    and lets the rest roll to the next hour.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireCronSecret } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import {
  JobSearchCriteriaSchema,
  type JobLeadView,
} from '@/lib/job-search/schema'
import { runSearch } from '@/lib/job-search/run-search'
import {
  isDue,
  digestLeads,
  EMPTY_RUNS_BEFORE_PAUSE,
} from '@/lib/job-search/schedule'
import { PORTFOLIO_ORIGIN } from '@/lib/fit-brief/guardrails'
import { sendJobDigestEmail, sendJobSearchFailureEmail } from '@/lib/email'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

/**
 * Stop starting new searches after this much of the budget is gone.
 *
 * One search measures 90-170s. Starting a second at 200s cannot finish inside
 * the 300s ceiling, and a run killed mid-flight loses work that had already
 * succeeded. Whatever does not start rolls to the next tick.
 */
const START_BUDGET_MS = 150_000

/** At most this many searches per tick, however many are due. */
const MAX_PER_TICK = 2

/**
 * Monthly ceiling on scheduled spend.
 *
 * At roughly $0.03 a search a nightly sweep costs about a dollar a month, so
 * this is not a budget — it is a stop on a runaway loop nobody is watching.
 */
const MONTHLY_CAP_USD = Number(process.env.JOB_SEARCH_MONTHLY_CAP_USD || 5)

interface RunSummary {
  search: string
  status: string
  newLeads?: number
  notified?: number
  costUsd?: number
  note?: string
}

export async function POST(request: NextRequest) {
  const unauthorized = requireCronSecret(request)
  if (unauthorized) return unauthorized

  const startedAt = Date.now()
  const now = new Date()

  try {
    const searches = (await dataService.listSavedSearches()) as {
      id: string
      name: string
      criteria: unknown
      frequency: string
      hourUtc: number
      isActive: boolean
      notifyByEmail: boolean
      minScore: number
      lastRunAt: string | null
      emptyRuns: number
    }[]

    const due = searches
      .filter(search => isDue(search, now))
      .sort((a, b) => (a.lastRunAt ?? '').localeCompare(b.lastRunAt ?? ''))
      .slice(0, MAX_PER_TICK)

    if (due.length === 0) {
      return NextResponse.json({
        ran: 0,
        results: [],
        checked: searches.length,
      })
    }

    // The ceiling is checked once per tick rather than per search: it is a stop
    // on a runaway, and one extra search past the line is not the failure mode
    // worth guarding against.
    const spent = await dataService.scheduledSpendThisMonth().catch(() => 0)
    if (spent >= MONTHLY_CAP_USD) {
      for (const search of due) {
        await dataService
          .recordScheduledRun(search.id, {
            status: 'skipped',
            note: `Monthly cap reached ($${spent.toFixed(2)} of $${MONTHLY_CAP_USD}).`,
          })
          .catch(() => undefined)
      }
      return NextResponse.json({
        ran: 0,
        skipped: due.length,
        reason: 'monthly-cap',
        spentUsd: spent,
      })
    }

    const results: RunSummary[] = []

    for (const search of due) {
      if (Date.now() - startedAt > START_BUDGET_MS) {
        results.push({ search: search.name, status: 'deferred' })
        continue
      }
      results.push(await runOne(search))
    }

    return NextResponse.json({ ran: results.length, results })
  } catch (error) {
    // A failure out here is the scheduler itself breaking — a database it
    // cannot reach, say — rather than one search failing. There is no search to
    // attribute it to, so it is logged and returned rather than emailed.
    console.error('[cron] tick failed:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}

async function runOne(search: {
  id: string
  name: string
  criteria: unknown
  notifyByEmail: boolean
  minScore: number
  lastRunAt: string | null
  emptyRuns: number
}): Promise<RunSummary> {
  const parsed = JobSearchCriteriaSchema.safeParse(search.criteria)
  if (!parsed.success) {
    await dataService
      .recordScheduledRun(search.id, {
        status: 'error',
        note: 'Saved criteria are not valid; edit the search in the panel.',
      })
      .catch(() => undefined)
    return { search: search.name, status: 'error', note: 'invalid criteria' }
  }

  let result
  try {
    result = await runSearch(parsed.data)
  } catch (error) {
    const reason = (error as Error).message
    console.error(`[cron] "${search.name}" failed:`, error)

    // Report rather than fall silent — invariant 2.
    await sendJobSearchFailureEmail(
      search.name,
      reason,
      PORTFOLIO_ORIGIN
    ).catch(() => undefined)
    await dataService
      .recordScheduledRun(search.id, { status: 'error', note: reason })
      .catch(() => undefined)
    // lastRunAt is deliberately NOT advanced: a failed run should be retried on
    // the next tick it is due, not counted as having happened.
    return { search: search.name, status: 'error', note: reason }
  }

  // --- Everything below runs after the leads are persisted, and is wrapped
  //     individually. Invariant 1: none of it may lose a completed search.

  const fresh = digestLeads(
    result.leads as JobLeadView[],
    search.lastRunAt,
    search.minScore
  )

  const emptyRuns = fresh.length > 0 ? 0 : search.emptyRuns + 1
  const shouldPause = emptyRuns >= EMPTY_RUNS_BEFORE_PAUSE
  const pausedReason = shouldPause
    ? `No new leads in ${emptyRuns} consecutive runs.`
    : ''

  let notified = 0
  if (fresh.length > 0 && search.notifyByEmail) {
    try {
      await sendJobDigestEmail(
        {
          searchName: search.name,
          leads: fresh.map(lead => ({
            url: lead.url,
            title: lead.title,
            companyName: lead.companyName,
            location: lead.location,
            salaryText: lead.salaryText,
            leadScore: lead.leadScore,
            band: lead.band,
            liveness: lead.liveness,
            verdict: lead.scoreDetail?.verdict,
          })),
          pausedReason,
        },
        PORTFOLIO_ORIGIN
      )
      notified = fresh.length
    } catch (error) {
      console.error(`[cron] digest for "${search.name}" failed:`, error)
    }
  }

  try {
    await dataService.updateSavedSearch(search.id, {
      lastRunAt: new Date().toISOString(),
      emptyRuns,
      ...(shouldPause
        ? { isActive: false, pausedReason }
        : { pausedReason: '' }),
    })
  } catch (error) {
    console.error(`[cron] could not update "${search.name}":`, error)
  }

  try {
    await dataService.recordScheduledRun(search.id, {
      status: fresh.length > 0 ? 'ok' : 'empty',
      newLeads: fresh.length,
      notified,
      costUsd: result.costUsd,
      note: shouldPause
        ? pausedReason
        : `${result.leads.length} stored from ${result.sweepsPlanned} sweeps.`,
    })
  } catch (error) {
    console.error(`[cron] could not record run for "${search.name}":`, error)
  }

  return {
    search: search.name,
    status: fresh.length > 0 ? 'ok' : 'empty',
    newLeads: fresh.length,
    notified,
    costUsd: result.costUsd,
  }
}
