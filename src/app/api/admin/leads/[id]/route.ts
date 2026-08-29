/**
 * One stored lead: mark it saved, dismiss it, link it to the brief it became,
 * or remove it entirely.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

const STATES = new Set(['new', 'saved', 'dismissed', 'applied'])

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const body = await request.json()

    const patch: { state?: string; briefId?: string | null } = {}

    if (body.state !== undefined) {
      if (!STATES.has(String(body.state))) {
        return NextResponse.json(
          { error: `state must be one of: ${[...STATES].join(', ')}` },
          { status: 400 }
        )
      }
      patch.state = String(body.state)
    }
    if (body.briefId !== undefined) {
      patch.briefId = body.briefId ? String(body.briefId) : null
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
    }

    const lead = await dataService.updateJobLead(id, patch)
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })
    }
    return NextResponse.json({ lead })
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
    await dataService.deleteJobLead(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    return generationError(error)
  }
}
