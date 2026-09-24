/**
 * Carry a hand edit into the other languages. Propose only; save nothing.
 *
 * The refine box was not the only way text changes — the JSON editor below it
 * is, and for a long time it was the one that changed the most. Both had the
 * same hole: the edit landed in the locale on screen and the other two kept
 * the old wording. A brief whose German half is a version behind is not a
 * translated brief, it is a mistake waiting to be read by the one recruiter
 * who opens that tab.
 *
 * Called after the ordinary PUT has already stored his edit, with the copy
 * that was there before it. The saved version is read back from the record
 * rather than taken from the request, so the mirror is computed against what
 * was actually written — if the save was rejected or altered by validation,
 * this reflects that rather than the client's hopes.
 *
 * Like the refine route it deliberately does not write. The mirrors are model
 * output, and model output he has not read must never reach a document he
 * downloads and sends.
 */

import { NextRequest, NextResponse } from 'next/server'
import { estimateCostUsd } from '@/lib/ai'
import { FitBriefContentSchema, JobSpecSchema } from '@/lib/fit-brief/schema'
import { CvContentSchema, CoverLetterSchema } from '@/lib/documents/schema'
import type { RefineTarget } from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { mirrorIntoOtherLocales } from '@/lib/fit-brief/mirror'
import { diffStringLeaves } from '@/lib/fit-brief/mirror-diff'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { recentEdits } from '@/lib/style/store'
import { buildEditLearningPrompt } from '@/lib/style/learning'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

const SCHEMAS = {
  brief: FitBriefContentSchema,
  cv: CvContentSchema,
  letter: CoverLetterSchema,
} as const

const FIELD = {
  brief: 'content',
  cv: 'cvContent',
  letter: 'coverLetter',
} as const

export async function POST(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const body = await request.json()
    const target = String(body.target || '') as RefineTarget
    const locale = String(body.locale || 'en') as Locale

    if (!(target in SCHEMAS)) {
      return NextResponse.json(
        { error: 'target must be brief, cv or letter' },
        { status: 400 }
      )
    }
    if (!(LOCALES as readonly string[]).includes(locale)) {
      return NextResponse.json(
        { error: `locale must be one of: ${LOCALES.join(', ')}` },
        { status: 400 }
      )
    }
    if (!body.before || typeof body.before !== 'object') {
      return NextResponse.json(
        { error: 'before is required — the copy as it was before the edit.' },
        { status: 400 }
      )
    }

    const brief = await dataService.getBriefById(id)
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const schema = SCHEMAS[target]
    const store = (brief[FIELD[target]] ?? {}) as Record<string, unknown>

    const saved = schema.safeParse(store[locale])
    if (!saved.success) {
      return NextResponse.json(
        { error: `The stored ${locale.toUpperCase()} version is not valid.` },
        { status: 409 }
      )
    }

    const changes = diffStringLeaves(body.before, saved.data)

    // Nothing to mirror. A save that only reformatted the JSON, or that
    // touched nothing at all, must not cost two model calls to say so.
    if (!changes.length) {
      return NextResponse.json({
        target,
        locale,
        proposed: saved.data,
        proposedByLocale: { [locale]: saved.data },
        locales: [],
        changes: [],
        unchanged: true,
        usage: { inputTokens: 0, outputTokens: 0 },
        costUsd: 0,
      })
    }

    const spec = JobSpecSchema.safeParse(brief.jobSpec)

    const mirrored = await mirrorIntoOtherLocales({
      target,
      schema,
      sourceLocale: locale,
      sourceValue: saved.data,
      changes,
      store,
      spec: spec.success ? spec.data : undefined,
      editLearning: buildEditLearningPrompt(await recentEdits()),
      diff: diffStringLeaves,
    })

    // Only the other languages are on offer here: his own edit is already
    // saved, and re-writing it with an identical object on accept would
    // record an empty training pair.
    const others = mirrored.perLocale.filter(entry => !entry.source)

    return NextResponse.json({
      target,
      locale,
      handEdit: true,
      proposed: saved.data,
      proposedByLocale: mirrored.proposed,
      locales: [
        { locale, changes, source: true, failed: false, saved: true },
        ...others,
      ],
      changes,
      unchanged: others.every(entry => entry.failed || !entry.changes.length),
      usage: mirrored.usage,
      costUsd: estimateCostUsd(mirrored.usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
