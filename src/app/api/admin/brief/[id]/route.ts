/**
 * Read, edit, publish and delete a single generated brief.
 *
 * Edits from the review screen come through PUT. Content is re-validated on the
 * way in, so hand-editing a claim re-runs the same traceability checks the
 * generator's output went through — an edit cannot quietly bypass them.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  FitBriefContentSchema,
  type BriefWarning,
} from '@/lib/fit-brief/schema'
import { CvContentSchema, CoverLetterSchema } from '@/lib/documents/schema'
import { BrandSchema } from '@/lib/fit-brief/schema'
import {
  validateBriefContent,
  validateDocuments,
  checkBrand,
  sortWarnings,
} from '@/lib/fit-brief/validate'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { requireAdmin } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { diffBriefContent } from '@/lib/style/learning'
import { recordEdits } from '@/lib/style/store'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  const brief = await dataService.getBriefById(id)
  if (!brief) {
    return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
  }
  return NextResponse.json({ brief })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const body = await request.json()
    const existing = await dataService.getBriefById(id)
    if (!existing) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const patch: Record<string, unknown> = {}

    if (body.status !== undefined) {
      if (!['draft', 'published', 'archived'].includes(body.status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      patch.status = body.status
    }

    if (body.content !== undefined) {
      const content = body.content as Record<string, unknown>
      for (const [locale, value] of Object.entries(content)) {
        if (!(LOCALES as readonly string[]).includes(locale)) {
          return NextResponse.json(
            { error: `Unknown locale "${locale}"` },
            { status: 400 }
          )
        }
        const parsed = FitBriefContentSchema.safeParse(value)
        if (!parsed.success) {
          return NextResponse.json(
            {
              error: `The ${locale} content is not valid: ${parsed.error.issues
                .slice(0, 3)
                .map(i => `${i.path.join('.')} ${i.message}`)
                .join('; ')}`,
            },
            { status: 400 }
          )
        }
      }
      patch.content = content
    }

    if (body.brand !== undefined) {
      const parsed = BrandSchema.safeParse(body.brand)
      if (!parsed.success) {
        return NextResponse.json({ error: 'Invalid brand' }, { status: 400 })
      }
      patch.brand = parsed.data
    }

    if (body.cvContent !== undefined) patch.cvContent = body.cvContent
    if (body.coverLetter !== undefined) patch.coverLetter = body.coverLetter

    // Recompute warnings against whatever the record will look like after this
    // patch, so an edit that fixes a problem clears its warning and an edit that
    // introduces one raises it.
    const nextContent = (patch.content ?? existing.content) as Record<
      string,
      unknown
    >
    const nextCv = (patch.cvContent ?? existing.cvContent) as Record<
      string,
      unknown
    >
    const nextLetter = (patch.coverLetter ?? existing.coverLetter) as Record<
      string,
      unknown
    >
    const nextBrand = (patch.brand ?? existing.brand) as unknown

    const warnings: BriefWarning[] = []

    for (const [locale, value] of Object.entries(nextContent)) {
      const parsed = FitBriefContentSchema.safeParse(value)
      if (parsed.success) {
        warnings.push(...validateBriefContent(parsed.data, locale))
      }
    }

    for (const locale of Object.keys(nextCv)) {
      const cv = CvContentSchema.safeParse(nextCv[locale])
      const letter = CoverLetterSchema.safeParse(nextLetter[locale])
      if (cv.success && letter.success) {
        warnings.push(
          ...validateDocuments(cv.data, letter.data, locale as Locale)
        )
      }
    }

    const brand = BrandSchema.safeParse(nextBrand)
    if (brand.success) warnings.push(...checkBrand(brand.data))

    patch.warnings = sortWarnings(warnings)

    // Publishing with an unresolved blocker is the one thing the panel will not
    // do silently. Blockers are things like an invented language level or a
    // citation that does not exist — exactly what must not reach a recruiter.
    if (patch.status === 'published') {
      const blockers = patch.warnings as BriefWarning[]
      const unresolved = blockers.filter(w => w.severity === 'blocker')
      if (unresolved.length && !body.force) {
        return NextResponse.json(
          {
            error: `${unresolved.length} blocking warning${unresolved.length === 1 ? '' : 's'} must be resolved before publishing.`,
            code: 'blocked',
            warnings: unresolved,
          },
          { status: 409 }
        )
      }
    }

    const brief = await dataService.updateBrief(id, patch)

    // Every hand edit is training data. Diff what he saved against the frozen
    // first generation and keep the pairs — this is the signal that moves the
    // generator toward his voice instead of a generic one.
    let editsRecorded = 0
    if (patch.content) {
      const baseline = (existing.generatedContent ?? {}) as Record<
        string,
        unknown
      >
      const saved = patch.content as Record<string, unknown>

      for (const locale of Object.keys(saved)) {
        const before = FitBriefContentSchema.safeParse(baseline[locale])
        const after = FitBriefContentSchema.safeParse(saved[locale])
        if (before.success && after.success) {
          const pairs = diffBriefContent(before.data, after.data, locale)
          editsRecorded += await recordEdits(id, pairs)
        }
      }
    }

    return NextResponse.json({ brief, editsRecorded })
  } catch (error) {
    console.error('[application-engine] update failed:', error)
    return NextResponse.json(
      { error: 'Could not save changes.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  try {
    await dataService.deleteBrief(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[application-engine] delete failed:', error)
    return NextResponse.json(
      { error: 'Could not delete brief.' },
      { status: 500 }
    )
  }
}
