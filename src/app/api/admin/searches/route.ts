/**
 * Saved searches — the ones the overnight scheduler runs.
 *
 * Session-gated like the rest of /api/admin. The scheduler itself comes in
 * through /api/cron/job-search with the shared secret instead; these routes are
 * only ever driven by the panel.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { JobSearchCriteriaSchema } from '@/lib/job-search/schema'
import { FREQUENCIES } from '@/lib/job-search/schedule'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    return NextResponse.json({
      searches: await dataService.listSavedSearches(),
    })
  } catch (error) {
    return generationError(error)
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()

    const name = String(body.name || '').trim()
    if (!name) {
      return NextResponse.json(
        { error: 'Give the search a name so the digest can say what it is.' },
        { status: 400 }
      )
    }

    // Validated on the way in rather than at 3am: criteria the scheduler cannot
    // parse would fail silently every night.
    const criteria = JobSearchCriteriaSchema.safeParse(body.criteria)
    if (!criteria.success) {
      return NextResponse.json(
        { error: 'Give at least one job title to search for.' },
        { status: 400 }
      )
    }

    const frequency = String(body.frequency || 'daily')
    if (!FREQUENCIES.includes(frequency as (typeof FREQUENCIES)[number])) {
      return NextResponse.json(
        { error: `frequency must be one of: ${FREQUENCIES.join(', ')}` },
        { status: 400 }
      )
    }

    const hourUtc = Number(body.hourUtc ?? 3)
    if (!Number.isInteger(hourUtc) || hourUtc < 0 || hourUtc > 23) {
      return NextResponse.json(
        { error: 'hourUtc must be a whole number between 0 and 23.' },
        { status: 400 }
      )
    }

    const search = await dataService.createSavedSearch({
      name,
      criteria: criteria.data,
      frequency,
      hourUtc,
      isActive: body.isActive !== false,
      notifyByEmail: body.notifyByEmail !== false,
      minScore: Math.max(0, Math.min(100, Number(body.minScore ?? 45))),
    })

    return NextResponse.json({ search }, { status: 201 })
  } catch (error) {
    return generationError(error)
  }
}
