/** One saved search: edit it, pause it, resume it, delete it. */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { JobSearchCriteriaSchema } from '@/lib/job-search/schema'
import { FREQUENCIES } from '@/lib/job-search/schedule'
import type { SavedSearchInput } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const body = await request.json()
    const patch: SavedSearchInput = {}

    if (body.name !== undefined) {
      const name = String(body.name).trim()
      if (!name) {
        return NextResponse.json(
          { error: 'name cannot be empty.' },
          { status: 400 }
        )
      }
      patch.name = name
    }

    if (body.criteria !== undefined) {
      const criteria = JobSearchCriteriaSchema.safeParse(body.criteria)
      if (!criteria.success) {
        return NextResponse.json(
          { error: 'Give at least one job title to search for.' },
          { status: 400 }
        )
      }
      patch.criteria = criteria.data
    }

    if (body.frequency !== undefined) {
      if (
        !FREQUENCIES.includes(
          String(body.frequency) as (typeof FREQUENCIES)[number]
        )
      ) {
        return NextResponse.json(
          { error: `frequency must be one of: ${FREQUENCIES.join(', ')}` },
          { status: 400 }
        )
      }
      patch.frequency = String(body.frequency)
    }

    if (body.hourUtc !== undefined) {
      const hourUtc = Number(body.hourUtc)
      if (!Number.isInteger(hourUtc) || hourUtc < 0 || hourUtc > 23) {
        return NextResponse.json(
          { error: 'hourUtc must be a whole number between 0 and 23.' },
          { status: 400 }
        )
      }
      patch.hourUtc = hourUtc
    }

    if (body.notifyByEmail !== undefined) {
      patch.notifyByEmail = Boolean(body.notifyByEmail)
    }
    if (body.minScore !== undefined) {
      patch.minScore = Math.max(0, Math.min(100, Number(body.minScore)))
    }

    if (body.isActive !== undefined) {
      patch.isActive = Boolean(body.isActive)
      // Resuming clears the auto-pause bookkeeping. Leaving `emptyRuns` at its
      // ceiling would switch the search off again after a single quiet night.
      if (body.isActive) {
        patch.emptyRuns = 0
        patch.pausedReason = ''
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    const search = await dataService.updateSavedSearch(id, patch)
    if (!search) {
      return NextResponse.json({ error: 'Search not found.' }, { status: 404 })
    }
    return NextResponse.json({ search })
  } catch (error) {
    return generationError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    await dataService.deleteSavedSearch(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return generationError(error)
  }
}
