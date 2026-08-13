/**
 * Score one application against the time it would cost.
 *
 * Separate from generation, and run on demand, because the answer is only
 * interesting once the brief exists — the brief's own requirement-by-requirement
 * markings are the evidence the score is built on, and they are written under
 * rules that forbid overclaiming.
 *
 * Stored on the record rather than recomputed per view: it costs a model call,
 * it only changes when the posting or the brief does, and keeping it means the
 * decision is reviewable later.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvider, estimateCostUsd } from '@/lib/ai'
import { FitBriefContentSchema, JobSpecSchema } from '@/lib/fit-brief/schema'
import {
  FitAssessmentSchema,
  FIT_SYSTEM,
  fitPrompt,
  coverage,
  bandFor,
} from '@/lib/fit-brief/fit-score'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const body = await request.json().catch(() => ({}))
    const locale = String(body.locale || 'en') as Locale

    const brief = await dataService.getBriefById(id)
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const spec = JobSpecSchema.safeParse(brief.jobSpec)
    if (!spec.success) {
      return NextResponse.json(
        { error: 'This application has no usable job spec to score against.' },
        { status: 409 }
      )
    }

    // Any locale will do — the markings are the same argument in three
    // languages — but prefer the one asked for, then whatever exists.
    const content = brief.content as Record<string, unknown>
    const source =
      content[LOCALES.includes(locale) ? locale : 'en'] ??
      content.en ??
      Object.values(content)[0]

    const parsed = FitBriefContentSchema.safeParse(source)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Generate the fit brief before scoring it.' },
        { status: 409 }
      )
    }

    const cover = coverage(spec.data, parsed.data)

    const { value, usage } = await getProvider().generateStructured({
      schema: FitAssessmentSchema,
      system: FIT_SYSTEM,
      prompt: fitPrompt(spec.data, parsed.data, cover),
      maxTokens: 8192,
    })

    // Clamp and re-derive rather than trust two fields to agree. A model that
    // returns 82 with band "credible" has told two different stories, and the
    // one worth keeping is the number.
    const score = Math.max(0, Math.min(100, Math.round(value.score)))

    // A named hard blocker caps the score — the prompt says so, and saying so
    // twice is cheaper than a 60 sitting above "requires German (C1)".
    const capped = value.hardBlocker.trim() ? Math.min(score, 19) : score

    const assessment = {
      ...value,
      score: capped,
      band: bandFor(capped),
      coverage: cover,
      scoredAt: new Date().toISOString(),
    }

    const updated = await dataService.updateBrief(id, {
      fitAssessment: assessment,
    })

    return NextResponse.json({
      brief: updated,
      assessment,
      usage,
      costUsd: estimateCostUsd(usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
