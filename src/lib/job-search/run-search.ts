/**
 * One job search, start to finish.
 *
 * Lifted out of the route so the manual search and the overnight scheduler run
 * *the same code* rather than two copies that agree today. They differ in what
 * happens to the result — the panel renders it, the scheduler emails it — and
 * in nothing else. A scheduled run that quietly diverged from the button would
 * be the worst kind of bug here: it produces plausible output nobody is
 * watching.
 *
 * Everything about the shape of this pipeline is explained where it is
 * enforced: `sweeps.ts` for the fan-out, `verify.ts` for the liveness rules and
 * the URL filters, `lead-score.ts` for the triage.
 */

import {
  getProvider,
  addUsage,
  emptyUsage,
  estimateCostUsd,
  type AIProvider,
} from '@/lib/ai'
import { dataService } from '@/lib/data-service'
import { type JobHit, type JobSearchCriteria } from './schema'
import { runSweeps } from './sweeps'
import {
  verifyHits,
  normalizeUrl,
  hostOf,
  isPostingUrl,
  isRedirector,
  isStale,
  cleanCompanyName,
} from './verify'
import { scoreLeads } from './lead-score'

export interface RunSearchResult {
  /** Rows as stored, straight from the data layer. */
  leads: Awaited<ReturnType<typeof dataService.upsertJobLeads>>
  coverageNote: string
  droppedStale: number
  sweepsPlanned: number
  sweepsFailed: number
  usage: ReturnType<typeof emptyUsage>
  costUsd: number
  provider: string
}

/** Deduplicate on the normalised url, keeping the first (best-described) hit. */
function dedupe(hits: JobHit[]): JobHit[] {
  const seen = new Set<string>()
  const out: JobHit[] = []

  for (const hit of hits) {
    if (!/^https?:\/\//i.test(hit.url?.trim() ?? '')) continue
    const url = normalizeUrl(hit.url)
    // A homepage or a parked domain answers 200 and would be stamped
    // "Verified live". Drop it here, before it can earn a badge it does not
    // deserve — see isPostingUrl. A grounding redirect is judged after it is
    // resolved, not now, because its destination is the posting.
    if (!isPostingUrl(url) && !isRedirector(url)) continue
    if (seen.has(url)) continue
    seen.add(url)
    out.push({
      ...hit,
      url,
      source: hit.source || hostOf(url),
      companyName: cleanCompanyName(hit.companyName, url),
    })
  }
  return out
}

/** Second pass, after verification may have resolved two links to one posting. */
function dedupeVerified<T extends { url: string }>(hits: T[]): T[] {
  const seen = new Set<string>()
  return hits.filter(hit => {
    if (seen.has(hit.url)) return false
    seen.add(hit.url)
    return true
  })
}

export async function runSearch(
  criteria: JobSearchCriteria,
  provider: AIProvider = getProvider()
): Promise<RunSearchResult> {
  let usage = emptyUsage()

  // 1 + 2. Sweep and structure, one pair of calls per title x location, run
  //        concurrently.
  const swept = await runSweeps(criteria, provider)
  usage = addUsage(usage, swept.usage)

  const all = dedupe(swept.hits)

  // A vacancy older than two months is usually filled. The prompt asks for
  // recent postings and is mostly obeyed; this enforces it, because a Zurich
  // sweep returned two August-2024 postings that were still indexed and still
  // scored well. Counted rather than silently dropped — the panel says how many
  // went, so an over-eager filter is visible rather than mysterious.
  const hits = all.filter(hit => !isStale(hit.postedIso, hit.postedText))
  const droppedStale = all.length - hits.length

  const base = {
    coverageNote: swept.coverageNote,
    droppedStale,
    sweepsPlanned: swept.sweepsPlanned,
    sweepsFailed: swept.sweepsFailed,
    provider: provider.name,
  }

  if (hits.length === 0) {
    return {
      ...base,
      leads: [],
      usage,
      costUsd: estimateCostUsd(usage),
    }
  }

  // 3. Is any of it actually there?
  //
  //    Verification can rewrite a URL: grounded search reports redirect links,
  //    and the resolved target is what he opens and what dedupes against an
  //    existing brief. Two reported URLs can resolve to the same posting, so the
  //    set is deduped again on the way out — the first pass could only see the
  //    links as reported.
  const verified = dedupeVerified(await verifyHits(hits)).filter(hit =>
    // Following a redirect can also land on a homepage — a careers link that now
    // bounces to the company's front page is a posting that is gone, not a lead.
    isPostingUrl(hit.url)
  )

  // 4. Triage.
  const { scored, usage: scoreUsage } = await scoreLeads(verified, provider)
  usage = addUsage(usage, scoreUsage)

  // 5. Store. Upsert preserves `state`, so a dismissed posting stays dismissed
  //    however many searches surface it again.
  const leads = await dataService.upsertJobLeads(
    scored.map(hit => ({
      url: hit.url,
      title: hit.title,
      companyName: hit.companyName,
      location: hit.location,
      workModel: hit.workModel,
      salaryText: hit.salaryText,
      postedText: hit.postedText,
      postedIso: hit.postedIso,
      source: hit.source,
      summary: hit.summary,
      requirements: hit.requirements,
      liveness: hit.liveness,
      leadScore: hit.leadScore,
      band: hit.band,
      recommendation: hit.recommendation,
      hardBlocker: hit.hardBlocker,
      scoreDetail: hit.scoreDetail,
      criteria,
    }))
  )

  return { ...base, leads, usage, costUsd: estimateCostUsd(usage) }
}
