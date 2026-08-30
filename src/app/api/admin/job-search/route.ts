/**
 * The front half of the application engine: find the postings.
 *
 * `/api/admin/brief/*` turns one posting he has already found into an
 * application. This turns a description of what he is looking for into a list
 * of postings worth considering — the step that was still being done by hand,
 * and the one that costs the most hours for the least judgement.
 *
 * The pipeline itself lives in `src/lib/job-search/run-search.ts`, because the
 * overnight scheduler runs exactly the same thing and two copies that agree
 * today would not agree for long. This route is the session-gated doorway to
 * it: validate the criteria, run it, decorate the result for the panel.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { JobSearchCriteriaSchema } from '@/lib/job-search/schema'
import { runSearch } from '@/lib/job-search/run-search'
import { withAlreadyApplied } from '@/lib/job-search/leads'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()

    const parsed = JobSearchCriteriaSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Give at least one job title to search for.' },
        { status: 400 }
      )
    }

    const result = await runSearch(parsed.data)

    // Decoration only, and wrapped for that reason.
    //
    // The leads are written by this point. A throw here would return 500 over
    // work that is already persisted and send him to re-run a search that in
    // fact succeeded — the same failure the brief PUT route learned to avoid
    // when a stale Worker made every Accept report failure over a save that had
    // worked.
    let leads = result.leads
    try {
      leads = await withAlreadyApplied(leads)
    } catch (error) {
      console.error('[job-search] already-applied decoration failed:', error)
    }

    return NextResponse.json({
      leads,
      coverageNote: result.coverageNote,
      droppedStale: result.droppedStale,
      usage: result.usage,
      costUsd: result.costUsd,
      provider: result.provider,
    })
  } catch (error) {
    return generationError(error)
  }
}
