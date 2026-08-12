/**
 * Step 3: translate an existing brief into one more locale.
 *
 * One locale per request. The admin client calls this once per remaining
 * language so each call stays small, the progress bar moves, and a failure on
 * German does not throw away a good Italian translation.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvider, estimateCostUsd } from '@/lib/ai'
import { FitBriefContentSchema, JobSpecSchema } from '@/lib/fit-brief/schema'
import { translateSystem, translatePrompt } from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { validateBriefContent, sortWarnings } from '@/lib/fit-brief/validate'
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
    const target = String(body.locale || '') as Locale

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }
    if (!(LOCALES as readonly string[]).includes(target)) {
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
    const sourceLocale = Object.keys(content)[0]
    if (!sourceLocale) {
      return NextResponse.json(
        { error: 'This brief has no content to translate yet.' },
        { status: 409 }
      )
    }

    const sourceResult = FitBriefContentSchema.safeParse(content[sourceLocale])
    if (!sourceResult.success) {
      return NextResponse.json(
        {
          error: `The ${sourceLocale} content is malformed; regenerate it before translating.`,
        },
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

    const { value: translated, usage } = await getProvider().generateStructured(
      {
        schema: FitBriefContentSchema,
        system: translateSystem(buildEditLearningPrompt(await recentEdits())),
        prompt: translatePrompt(sourceResult.data, target, specResult.data),
        maxTokens: 32000,
      }
    )

    // Warnings are per locale, so replace this locale's and keep the others.
    const kept = (brief.warnings as Array<{ locale?: string }>).filter(
      w => w.locale !== target
    )
    const warnings = sortWarnings([
      ...kept,
      ...validateBriefContent(translated, target),
    ] as never)

    const updated = await dataService.updateBrief(id, {
      content: { ...content, [target]: translated },
      generatedContent: {
        ...((brief.generatedContent as Record<string, unknown>) ?? {}),
        [target]: translated,
      },
      warnings,
    })

    return NextResponse.json({
      brief: updated,
      locale: target,
      usage,
      costUsd: estimateCostUsd(usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
