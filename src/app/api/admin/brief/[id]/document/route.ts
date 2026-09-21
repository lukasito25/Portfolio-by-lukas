/**
 * Download a generated CV or cover letter as .docx.
 *
 * Rendered from the stored JSON on every request, so an edit made in the review
 * screen is in the next download with nothing to invalidate.
 *
 *   GET /api/admin/brief/<id>/document?kind=cv&locale=en&variant=panel
 *   GET /api/admin/brief/<id>/document?kind=cv&locale=en&format=pdf
 *   GET /api/admin/brief/<id>/document?kind=cv&locale=en&format=pdf&photo=0
 *
 * Two formats, for two different readers. The .docx is what goes into an
 * applicant tracking system; the PDF embeds its fonts and lays out identically
 * everywhere, and is what goes to a person.
 *
 * `variant` selects the document design. Each format has its own default —
 * `classic` for .docx, `column` for PDF — and an unknown value falls back to it
 * rather than failing a download.
 */

import { NextRequest, NextResponse } from 'next/server'
import { CvContentSchema, CoverLetterSchema } from '@/lib/documents/schema'
import {
  renderCv,
  renderCoverLetter,
  documentFilename,
} from '@/lib/documents/render'
import { renderCvPdf, renderCoverLetterPdf } from '@/lib/documents/pdf/cv'
import { defaultVariantFor, isDocVariant } from '@/lib/documents/variants'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { requireAdmin } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  const url = new URL(request.url)
  const kind =
    url.searchParams.get('kind') === 'cover-letter' ? 'cover-letter' : 'cv'
  const locale = (url.searchParams.get('locale') || 'en') as Locale
  const format = url.searchParams.get('format') === 'pdf' ? 'pdf' : 'docx'
  // `photo=0` drops the headshot from the column PDF for this download —
  // for a UK or US recruiter, say. Default on; it only shows when
  // `templates/photo.jpg` exists, so `on` with no file is simply no photo.
  const photo = url.searchParams.get('photo') === '0' ? null : undefined
  const requested = url.searchParams.get('variant')
  const variant = isDocVariant(requested)
    ? requested
    : defaultVariantFor(format)

  if (!(LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: 'Unknown locale' }, { status: 400 })
  }

  const brief = await dataService.getBriefById(id)
  if (!brief) {
    return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
  }

  const cvResult = CvContentSchema.safeParse(
    (brief.cvContent as Record<string, unknown>)?.[locale]
  )

  try {
    let buffer: Buffer

    if (kind === 'cv') {
      if (!cvResult.success) {
        return NextResponse.json(
          { error: `No CV generated for ${locale} yet.` },
          { status: 404 }
        )
      }
      buffer =
        format === 'pdf'
          ? await renderCvPdf(cvResult.data, { variant, photo })
          : renderCv(cvResult.data, variant)
    } else {
      const letterResult = CoverLetterSchema.safeParse(
        (brief.coverLetter as Record<string, unknown>)?.[locale]
      )
      if (!letterResult.success) {
        return NextResponse.json(
          { error: `No cover letter generated for ${locale} yet.` },
          { status: 404 }
        )
      }
      buffer =
        format === 'pdf'
          ? await renderCoverLetterPdf(
              letterResult.data,
              cvResult.success ? cvResult.data : undefined,
              locale,
              { variant, photo }
            )
          : renderCoverLetter(
              letterResult.data,
              cvResult.success ? cvResult.data : undefined,
              locale,
              variant
            )
    }

    const filename = documentFilename(
      kind,
      brief.companyName,
      locale,
      variant,
      format
    )

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type':
          format === 'pdf'
            ? 'application/pdf'
            : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': String(buffer.length),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('[application-engine] docx render failed:', error)
    return NextResponse.json(
      {
        error:
          'Could not render the document. If the template was recently changed, check its placeholders still match the schema.',
      },
      { status: 500 }
    )
  }
}
