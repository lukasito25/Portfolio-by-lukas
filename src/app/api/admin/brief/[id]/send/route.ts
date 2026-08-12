/**
 * Application tracking: record that something was actually sent, and what
 * happened afterwards.
 *
 * The important property here is that `sentSnapshot` is written once and never
 * rewritten. A brief stays editable after it goes out — you might fix a typo,
 * or retarget the page for a second company — but what a recruiter received is
 * a historical fact. If a conversation goes badly a month later, the question
 * "what exactly did they read?" needs a truthful answer, and a live document
 * that has been edited since cannot give one.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

const STATUSES = [
  'not_sent',
  'sent',
  'acknowledged',
  'interview',
  'rejected',
  'offer',
  'withdrawn',
] as const

type ApplicationStatus = (typeof STATUSES)[number]

const CHANNELS = ['email', 'portal', 'linkedin', 'referral', 'other'] as const

export async function POST(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const body = await request.json()
    const status = String(body.status || '') as ApplicationStatus

    if (!STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${STATUSES.join(', ')}` },
        { status: 400 }
      )
    }

    const brief = await dataService.getBriefById(id)
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const patch: Record<string, unknown> = { applicationStatus: status }

    if (body.outcomeNotes !== undefined) {
      patch.outcomeNotes = String(body.outcomeNotes)
    }

    if (status === 'sent') {
      const via = String(body.sentVia || 'other')
      if (!CHANNELS.includes(via as (typeof CHANNELS)[number])) {
        return NextResponse.json(
          { error: `sentVia must be one of: ${CHANNELS.join(', ')}` },
          { status: 400 }
        )
      }
      patch.sentVia = via

      const alreadySent = Boolean(brief.sentAt)

      // Freeze on the first send only. Re-marking an application as sent (say,
      // after a follow-up) must not overwrite the record of the original.
      if (!alreadySent) {
        patch.sentAt = new Date().toISOString()
        patch.sentSnapshot = {
          capturedAt: new Date().toISOString(),
          locale: body.locale ?? null,
          briefUrl: body.briefUrl ?? null,
          content: brief.content,
          cvContent: brief.cvContent,
          coverLetter: brief.coverLetter,
        }
      }
    }

    const updated = await dataService.updateBrief(id, patch)

    return NextResponse.json({
      brief: updated,
      snapshotFrozen: status === 'sent' && !brief.sentAt,
    })
  } catch (error) {
    console.error('[application-engine] tracking update failed:', error)
    return NextResponse.json(
      { error: 'Could not update the application status.' },
      { status: 500 }
    )
  }
}
