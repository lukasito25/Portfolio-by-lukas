/**
 * The front half of the application engine: find the postings.
 *
 * `/api/admin/brief/*` turns one posting he has already found into an
 * application. This turns a description of what he is looking for into a list
 * of postings worth considering — the step that was still being done by hand,
 * and the one that costs the most hours for the least judgement.
 *
 * Six steps, in one request because they are useless apart:
 *
 *   1. research  — a grounded sweep of the boards. Prose out.
 *   2. structure — the prose into JobHit rows. Schema-constrained.
 *   3. verify    — an actual request to every URL, so the badges mean something.
 *   4. score     — one triage call for the whole set.
 *   5. persist   — upsert on url, preserving state so a dismissal sticks.
 *   6. decorate  — cross-reference against briefs already written.
 *
 * Steps 1 and 2 are two calls rather than one because Gemini rejects
 * `response_schema` alongside `google_search` — the same constraint that shapes
 * `/api/admin/brief/extract`, and the reason the interface in `src/lib/ai`
 * exposes `research()` and `generateStructured()` separately.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvider, addUsage, emptyUsage, estimateCostUsd } from '@/lib/ai'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import {
  JobSearchCriteriaSchema,
  JobHitListSchema,
  type JobHit,
} from '@/lib/job-search/schema'
import {
  SEARCH_SYSTEM,
  searchResearchPrompt,
  structureHitsPrompt,
} from '@/lib/job-search/prompts'
import {
  verifyHits,
  normalizeUrl,
  hostOf,
  isPostingUrl,
  isRedirector,
  isStale,
  cleanCompanyName,
} from '@/lib/job-search/verify'
import { scoreLeads } from '@/lib/job-search/lead-score'
import { withAlreadyApplied } from '@/lib/job-search/leads'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

/** Second pass, after verification may have resolved two links to one posting. */
function dedupeVerified<T extends { url: string }>(hits: T[]): T[] {
  const seen = new Set<string>()
  return hits.filter(hit => {
    if (seen.has(hit.url)) return false
    seen.add(hit.url)
    return true
  })
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

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const provider = getProvider()
    const body = await request.json()

    const parsed = JobSearchCriteriaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Give at least one job title to search for.' },
        { status: 400 }
      )
    }
    const criteria = parsed.data

    let usage = emptyUsage()

    // 1. The grounded sweep.
    const research = await provider.research({
      system: SEARCH_SYSTEM,
      prompt: searchResearchPrompt(criteria),
      maxTokens: 16000,
    })
    usage = addUsage(usage, research.usage)

    // 2. Structure it.
    const structured = await provider.generateStructured({
      schema: JobHitListSchema,
      system: SEARCH_SYSTEM,
      prompt: structureHitsPrompt(research.text),
      maxTokens: 16000,
    })
    usage = addUsage(usage, structured.usage)

    const all = dedupe(structured.value.hits)

    // A vacancy older than two months is usually filled. The prompt asks for
    // recent postings and is mostly obeyed; this enforces it, because a Zurich
    // sweep returned two August-2024 postings that were still indexed and
    // still scored well. Counted rather than silently dropped — the panel says
    // how many went, so an over-eager filter is visible rather than mysterious.
    const hits = all.filter(hit => !isStale(hit.postedIso, hit.postedText))
    const droppedStale = all.length - hits.length

    if (hits.length === 0) {
      // An empty result has two very different causes and the panel has to be
      // able to tell them apart — see `coverageNote` in the schema.
      return NextResponse.json({
        leads: [],
        coverageNote: structured.value.coverageNote,
        droppedStale,
        usage,
        costUsd: estimateCostUsd(usage),
        provider: provider.name,
      })
    }

    // 3. Is any of it actually there?
    //
    //    Verification can rewrite a URL: grounded search reports redirect links,
    //    and the resolved target is what he opens and what dedupes against an
    //    existing brief. Two reported URLs can resolve to the same posting, so
    //    the set is deduped again on the way out — the first pass could only
    //    see the links as reported.
    const verified = dedupeVerified(await verifyHits(hits)).filter(hit =>
      // Following a redirect can also land on a homepage — a careers link that
      // now bounces to the company's front page is a posting that is gone, not
      // a lead.
      isPostingUrl(hit.url)
    )

    // 4. Triage, one call for the whole set.
    const { scored, usage: scoreUsage } = await scoreLeads(verified, provider)
    usage = addUsage(usage, scoreUsage)

    // 5. Store. Upsert preserves `state`, so a dismissed posting stays
    //    dismissed however many searches surface it again.
    const stored = await dataService.upsertJobLeads(
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

    // 6. Decoration only, and wrapped for that reason.
    //
    //    The leads are written by this point. A throw here would return 500
    //    over work that is already persisted and send him to re-run a search
    //    that in fact succeeded — the same failure the brief PUT route learned
    //    to avoid when a stale Worker made every Accept report failure over a
    //    save that had worked.
    let leads = stored
    try {
      leads = await withAlreadyApplied(stored)
    } catch (error) {
      console.error('[job-search] already-applied decoration failed:', error)
    }

    return NextResponse.json({
      leads,
      coverageNote: structured.value.coverageNote,
      droppedStale,
      usage,
      costUsd: estimateCostUsd(usage),
      provider: provider.name,
    })
  } catch (error) {
    return generationError(error)
  }
}
