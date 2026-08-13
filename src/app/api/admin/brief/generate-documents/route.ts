/**
 * Step 4: the CV and cover letter for one locale.
 *
 * Both come from a single call so they tell one story — the letter's honest
 * limit should be the brief's gap, and the CV bullets should be the evidence the
 * letter points at.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvider, estimateCostUsd } from '@/lib/ai'
import { FitBriefContentSchema, JobSpecSchema } from '@/lib/fit-brief/schema'
import { DocumentBundleSchema } from '@/lib/documents/schema'
import { CV_STYLE_GUIDE } from '@/lib/documents/style-guide'
import { documentsSystem, documentsPrompt } from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { validateDocuments, sortWarnings } from '@/lib/fit-brief/validate'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { recentEdits } from '@/lib/style/store'
import { buildEditLearningPrompt } from '@/lib/style/learning'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const id = String(body.id || '')
    const locale = String(body.locale || 'en') as Locale

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    if (!(LOCALES as readonly string[]).includes(locale)) {
      return NextResponse.json(
        { error: `locale must be one of: ${LOCALES.join(', ')}` },
        { status: 400 }
      )
    }

    const brief = await dataService.getBriefById(id)
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const content = brief.content as Record<string, unknown>
    // Prefer the brief in the same language; fall back to whatever exists.
    const sourceContent = content[locale] ?? Object.values(content)[0]
    const briefResult = FitBriefContentSchema.safeParse(sourceContent)
    if (!briefResult.success) {
      return NextResponse.json(
        { error: 'Generate the fit brief before the documents.' },
        { status: 409 }
      )
    }

    const specResult = JobSpecSchema.safeParse(brief.jobSpec)
    if (!specResult.success) {
      return NextResponse.json(
        { error: 'The stored job spec is malformed. Re-run the extract step.' },
        { status: 409 }
      )
    }

    const { value, usage } = await getProvider().generateStructured({
      schema: DocumentBundleSchema,
      system: documentsSystem(
        CV_STYLE_GUIDE,
        buildEditLearningPrompt(await recentEdits())
      ),
      prompt: documentsPrompt(specResult.data, briefResult.data, locale),
      maxTokens: 24000,
    })

    const existingCv = (brief.cvContent as Record<string, unknown>) ?? {}
    const existingLetter = (brief.coverLetter as Record<string, unknown>) ?? {}

    const kept = (
      brief.warnings as Array<{ locale?: string; path?: string }>
    ).filter(
      w =>
        !(
          w.locale === locale &&
          (w.path?.startsWith('cv.') || w.path?.startsWith('coverLetter.'))
        )
    )
    const warnings = sortWarnings([
      ...kept,
      ...validateDocuments(value.cv, value.coverLetter, locale),
    ] as never)

    // The generation is written twice: once as the working copy he edits, and
    // once frozen. The frozen copy is what every later hand edit is diffed
    // against, so the training pair stays "what the model wrote → what he
    // actually sends" however many passes he makes over a sentence.
    const baselineCv =
      (brief.generatedCvContent as Record<string, unknown>) ?? {}
    const baselineLetter =
      (brief.generatedCoverLetter as Record<string, unknown>) ?? {}

    const updated = await dataService.updateBrief(id, {
      cvContent: { ...existingCv, [locale]: value.cv },
      coverLetter: { ...existingLetter, [locale]: value.coverLetter },
      generatedCvContent: { ...baselineCv, [locale]: value.cv },
      generatedCoverLetter: { ...baselineLetter, [locale]: value.coverLetter },
      warnings,
    })

    return NextResponse.json({
      brief: updated,
      locale,
      usage,
      costUsd: estimateCostUsd(usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
