/**
 * The brief as a PDF — public, because the recruiter is the one downloading it.
 *
 * Every other document route in this app is session-gated, since a CV and a
 * cover letter are drafted privately before they are sent. This one is the
 * opposite: it exists so the person the brief was written for can take it
 * away, read it on a train, or attach it to an internal note. Gating it would
 * defeat the only reason it exists.
 *
 * "Public" here means exactly as public as the page itself, no more:
 *
 *   - a published brief renders for anyone holding the link, as the page does;
 *   - a draft 404s without `?preview=<token>`, as the page does;
 *   - the brief is `noindex` and absent from the sitemap, so neither the page
 *     nor this file is discoverable by guessing.
 *
 * The rules are duplicated from `/brief/[slug]/page.tsx` rather than shared,
 * which is deliberate: if that page's privacy logic is ever loosened, this
 * route does not silently loosen with it.
 *
 * Note for the Next config: this route needs `outputFileTracingIncludes` the
 * same way the admin document route does. `pdfkit` loads its built-in fonts
 * through a package `#imports` subpath that the file tracer does not follow,
 * and without it the lambda ships without `pdfkit/js/standard-fonts/` and dies
 * at module load. That shipped once already.
 */

import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/data-service'
import { FitBriefContentSchema, BrandSchema } from '@/lib/fit-brief/schema'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { renderBriefPdf } from '@/lib/documents/pdf/cv'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const ORIGIN = (
  process.env.NEXTAUTH_URL || 'https://portfolio-by-lukas.vercel.app'
).replace(/\/$/, '')

/** A filename a recruiter can find again in a downloads folder. */
function fileName(company: string, role: string, locale: Locale): string {
  const clean = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  return `Lukas-Hosala-${clean(company)}-${clean(role)}-${locale}.pdf`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const url = new URL(request.url)
  const preview = url.searchParams.get('preview') ?? undefined

  const brief = await dataService
    .getBriefBySlug(slug, preview)
    .catch(() => null)
  if (!brief) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const raw = brief.content as Record<string, unknown>
  const requested = url.searchParams.get('locale')
  const locale: Locale =
    (LOCALES as readonly string[]).includes(requested ?? '') && raw[requested!]
      ? (requested as Locale)
      : ((LOCALES.find(code => raw[code]) ?? 'en') as Locale)

  const parsed = FitBriefContentSchema.safeParse(raw[locale])
  if (!parsed.success) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const brand = BrandSchema.safeParse(brief.brand)
  const pageUrl = `${ORIGIN}/brief/${slug}`

  try {
    const pdf = await renderBriefPdf(parsed.data, {
      // The light-mode accent: the paper is white.
      accent: brand.success ? brand.data.accentLight : '#1277d9',
      pageUrl,
    })

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName(brief.companyName, brief.roleTitle, locale)}"`,
        // A draft must not be cached by anything between here and the reader.
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    console.error(`[brief-pdf] render failed for "${slug}":`, error)
    return NextResponse.json({ error: 'Could not render' }, { status: 500 })
  }
}
