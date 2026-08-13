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
import { diffCvContent, diffCoverLetter } from '@/lib/documents/diff'
import { recordEdits } from '@/lib/style/store'
import { warningKey } from '@/lib/fit-brief/warning-key'
import type * as z from 'zod/v4'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

/**
 * Check every locale in a `{ en, it, de }` map against a schema.
 *
 * Returns a human-readable complaint, or null when everything parses. The
 * message names the failing field because the person reading it is the one who
 * just typed into that field.
 */
function validateLocaleMap(
  map: Record<string, unknown>,
  schema: z.ZodType,
  label: string
): string | null {
  for (const [locale, value] of Object.entries(map)) {
    if (!(LOCALES as readonly string[]).includes(locale)) {
      return `Unknown locale "${locale}"`
    }
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return `The ${locale.toUpperCase()} ${label} is not valid: ${parsed.error.issues
        .slice(0, 3)
        .map(i => `${i.path.join('.')} ${i.message}`)
        .join('; ')}`
    }
  }
  return null
}

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

    // Documents are validated on the way in for the same reason the brief is:
    // a save that quietly stores a malformed CV would fail later at render
    // time, with the docx template as the error message.
    if (body.cvContent !== undefined) {
      const invalid = validateLocaleMap(
        body.cvContent as Record<string, unknown>,
        CvContentSchema,
        'CV'
      )
      if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })
      patch.cvContent = body.cvContent
    }

    if (body.coverLetter !== undefined) {
      const invalid = validateLocaleMap(
        body.coverLetter as Record<string, unknown>,
        CoverLetterSchema,
        'cover letter'
      )
      if (invalid) return NextResponse.json({ error: invalid }, { status: 400 })
      patch.coverLetter = body.coverLetter
    }

    // Checks he has reviewed and accepted. Kept separately from `warnings`
    // because those are recomputed from the validators below on every save —
    // a dismissal stored there would survive exactly until the next edit.
    if (body.dismissedWarnings !== undefined) {
      patch.dismissedWarnings = (body.dismissedWarnings as unknown[])
        .filter((k): k is string => typeof k === 'string')
        .slice(0, 200)
    }

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
    //
    // Deliberately computed from the full list, ignoring dismissals. Dismissing
    // is for review-severity checks; letting it clear a blocker too would turn
    // a quiet UI action into a silent bypass of the honesty layer. The escape
    // hatch for a blocker stays what it was — `force`, a conscious per-publish
    // decision made with the warning still on screen.
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
    //
    // All three documents, not just the brief. Until the panel could edit a CV
    // this only covered `content`, which meant the two documents he rewrites
    // hardest — and actually sends — taught the generator nothing.
    //
    // `body.instruction` is set when the change came from the refine box rather
    // than from typing into a field. It is stored alongside the diff because it
    // records intent: "cut the hedging" and "make this shorter" produce similar
    // diffs and mean different things, and the intent is what generalises.
    let editsRecorded = 0
    const instruction =
      typeof body.instruction === 'string' && body.instruction.trim()
        ? body.instruction.trim().slice(0, 500)
        : undefined

    const learn = async (pairs: ReturnType<typeof diffBriefContent>) => {
      if (!pairs.length) return
      editsRecorded += await recordEdits(
        id,
        instruction ? pairs.map(p => ({ ...p, instruction })) : pairs
      )
    }

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
          await learn(diffBriefContent(before.data, after.data, locale))
        }
      }
    }

    /**
     * The baseline to diff a document against.
     *
     * Normally the frozen first generation. Briefs made before that column
     * existed have none — and for those the currently stored copy *is* the
     * generation, because the documents were read-only until this feature
     * shipped and nothing could have altered them. Adopting it as the baseline
     * on first edit is therefore accurate rather than approximate, and without
     * it every older application would silently teach the generator nothing.
     *
     * Recorded back to the record so the adoption happens once.
     */
    const backfill: Record<string, Record<string, unknown>> = {}

    const baselineFor = (
      frozenField: 'generatedCvContent' | 'generatedCoverLetter',
      liveField: 'cvContent' | 'coverLetter',
      locale: string
    ): unknown => {
      const frozen = (existing[frozenField] ?? {}) as Record<string, unknown>
      if (frozen[locale]) return frozen[locale]

      const live = (existing[liveField] ?? {}) as Record<string, unknown>
      if (!live[locale]) return undefined

      backfill[frozenField] = {
        ...(backfill[frozenField] ?? frozen),
        [locale]: live[locale],
      }
      return live[locale]
    }

    if (patch.cvContent) {
      const saved = patch.cvContent as Record<string, unknown>
      for (const locale of Object.keys(saved)) {
        const before = CvContentSchema.safeParse(
          baselineFor('generatedCvContent', 'cvContent', locale)
        )
        const after = CvContentSchema.safeParse(saved[locale])
        if (before.success && after.success) {
          await learn(diffCvContent(before.data, after.data, locale))
        }
      }
    }

    if (patch.coverLetter) {
      const saved = patch.coverLetter as Record<string, unknown>
      for (const locale of Object.keys(saved)) {
        const before = CoverLetterSchema.safeParse(
          baselineFor('generatedCoverLetter', 'coverLetter', locale)
        )
        const after = CoverLetterSchema.safeParse(saved[locale])
        if (before.success && after.success) {
          await learn(diffCoverLetter(before.data, after.data, locale))
        }
      }
    }

    if (Object.keys(backfill).length) {
      await dataService.updateBrief(id, backfill)
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
