/**
 * Step 2: write the fit brief in its primary locale and create the draft row.
 *
 * The primary locale is the posting's own language when that is one of the
 * three the site carries — the /rocken precedent, where a German posting got a
 * German-first page and English as the translation rather than the other way
 * round. Anything else leads in English.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createId } from '@/lib/fit-brief/id'
import { getProvider, estimateCostUsd } from '@/lib/ai'
import {
  FitBriefContentSchema,
  BrandSchema,
  JobSpecSchema,
  type JobSpec,
} from '@/lib/fit-brief/schema'
import { briefSystem, briefPrompt } from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import {
  validateBriefContent,
  checkBrand,
  sortWarnings,
} from '@/lib/fit-brief/validate'
import {
  requireAdmin,
  generationError,
  slugify,
  previewToken,
} from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { recentEdits } from '@/lib/style/store'
import { buildEditLearningPrompt } from '@/lib/style/learning'
import * as z from 'zod/v4'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

/** Content plus brand in one call — the brand choice depends on the company. */
const BriefWithBrandSchema = z.object({
  content: FitBriefContentSchema,
  brand: BrandSchema,
})

/**
 * The locale the brief is written in first.
 *
 * Not exported: Next.js only permits a fixed set of exports from a route
 * module, and anything else fails the build with "not a valid Route export
 * field".
 */
function primaryLocale(spec: JobSpec): Locale {
  return (LOCALES as readonly string[]).includes(spec.postingLanguage)
    ? (spec.postingLanguage as Locale)
    : 'en'
}

/** Append -2, -3 … when a company already has a brief. Re-applying happens. */
async function uniqueSlug(base: string): Promise<string> {
  const existing: Array<{ slug: string }> = await dataService.listBriefs()
  const taken = new Set(existing.map(b => b.slug))
  if (!taken.has(base)) return base
  for (let n = 2; n < 50; n++) {
    const candidate = `${base}-${n}`
    if (!taken.has(candidate)) return candidate
  }
  return `${base}-${Date.now()}`
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()

    const specResult = JobSpecSchema.safeParse(body.jobSpec)
    if (!specResult.success) {
      return NextResponse.json(
        { error: 'jobSpec is missing or malformed. Re-run the extract step.' },
        { status: 400 }
      )
    }
    const jobSpec = specResult.data
    const locale = primaryLocale(jobSpec)

    // Everything he has rewritten by hand so far, so this draft starts closer
    // to his voice than the last one did.
    const editLearning = buildEditLearningPrompt(await recentEdits())

    const { value, usage } = await getProvider().generateStructured({
      schema: BriefWithBrandSchema,
      system: briefSystem(editLearning),
      prompt: briefPrompt(jobSpec, locale),
      maxTokens: 32000,
    })

    const warnings = sortWarnings([
      ...validateBriefContent(value.content, locale),
      ...checkBrand(value.brand),
    ])

    const slug = await uniqueSlug(slugify(jobSpec.companyName))

    const brief = await dataService.createBrief({
      id: createId(),
      slug,
      companyName: jobSpec.companyName,
      roleTitle: jobSpec.roleTitle,
      sourceUrl: body.sourceUrl ?? null,
      sourceKind: body.sourceKind ?? 'text',
      status: 'draft',
      previewToken: previewToken(),
      jobSpec,
      content: { [locale]: value.content },
      // Frozen baseline for the edit-learning diff.
      generatedContent: { [locale]: value.content },
      cvContent: {},
      coverLetter: {},
      brand: value.brand,
      warnings,
    })

    return NextResponse.json({
      brief,
      primaryLocale: locale,
      remainingLocales: LOCALES.filter(l => l !== locale),
      usage,
      costUsd: estimateCostUsd(usage),
    })
  } catch (error) {
    return generationError(error)
  }
}
