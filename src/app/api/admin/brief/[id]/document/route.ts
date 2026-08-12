/**
 * Download a generated CV or cover letter as .docx.
 *
 * Rendered from the stored JSON on every request, so an edit made in the review
 * screen is in the next download with nothing to invalidate.
 *
 *   GET /api/admin/brief/<id>/document?kind=cv&locale=en
 */

import { NextRequest, NextResponse } from 'next/server'
import { CvContentSchema, CoverLetterSchema } from '@/lib/documents/schema'
import {
  renderCv,
  renderCoverLetter,
  documentFilename,
} from '@/lib/documents/render'
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
      buffer = renderCv(cvResult.data)
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
      buffer = renderCoverLetter(
        letterResult.data,
        cvResult.success ? cvResult.data : undefined,
        locale
      )
    }

    const filename = documentFilename(kind, brief.companyName, locale)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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
