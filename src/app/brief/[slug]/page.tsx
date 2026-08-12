import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { dataService } from '@/lib/data-service'
import { FitBriefPage } from '@/components/fit-brief/fit-brief-page'
import { FitBriefContentSchema, BrandSchema } from '@/lib/fit-brief/schema'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import type { FitBriefContent } from '@/lib/fit-brief/schema'

/**
 * Generated fit briefs.
 *
 * Reads the Worker directly with API_SECRET rather than going through
 * /api/admin-proxy. The proxy is session-gated, so routing a public page read
 * through it 401s every anonymous visitor — the bug that silently broke
 * homepage content until it was fixed in July 2026. This is a server component,
 * so the secret never leaves the server.
 *
 * Drafts resolve only with a matching ?preview=<token>. Without it they 404,
 * which is what makes "draft until you publish" mean something.
 */

export const dynamic = 'force-dynamic'

interface BriefPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

async function loadBrief(slug: string, token?: string) {
  try {
    return await dataService.getBriefBySlug(slug, token)
  } catch (error) {
    console.error(`[brief] failed to load "${slug}":`, error)
    return null
  }
}

/** The default locale's content, for metadata and language selection. */
function firstContent(
  content: Record<string, unknown>
): { locale: Locale; value: FitBriefContent } | null {
  for (const locale of LOCALES) {
    const parsed = FitBriefContentSchema.safeParse(content[locale])
    if (parsed.success) return { locale, value: parsed.data }
  }
  return null
}

export async function generateMetadata({
  params,
  searchParams,
}: BriefPageProps): Promise<Metadata> {
  const { slug } = await params
  const { preview } = await searchParams
  const brief = await loadBrief(slug, preview)

  if (!brief) return { title: 'Not found' }

  const primary = firstContent(brief.content as Record<string, unknown>)

  return {
    title: `${brief.roleTitle} — Fit Brief (${brief.companyName})`,
    description:
      primary?.value.hero.description.slice(0, 200) ??
      `A private, role-specific brief for the ${brief.roleTitle} opening at ${brief.companyName}.`,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  }
}

export default async function BriefPage({
  params,
  searchParams,
}: BriefPageProps) {
  const { slug } = await params
  const { preview } = await searchParams

  const brief = await loadBrief(slug, preview)
  if (!brief) notFound()

  const rawContent = brief.content as Record<string, unknown>
  const content: Partial<Record<Locale, FitBriefContent>> = {}

  for (const locale of LOCALES) {
    const parsed = FitBriefContentSchema.safeParse(rawContent[locale])
    if (parsed.success) content[locale] = parsed.data
  }

  // A brief with no valid content in any locale has nothing to show. Treating
  // it as missing beats rendering a broken shell at a URL sent to a recruiter.
  if (!Object.keys(content).length) notFound()

  const brandResult = BrandSchema.safeParse(brief.brand)
  const brand = brandResult.success
    ? brandResult.data
    : // Fall back to the site's own accent rather than failing the page.
      { accentLight: '#1277d9', accentDark: '#4da6ff', motif: 'mesh' as const }

  // Open in the posting's own language where we carry it.
  const postingLanguage = (brief.jobSpec as { postingLanguage?: string })
    ?.postingLanguage
  const defaultLocale = LOCALES.find(
    locale => locale === postingLanguage && content[locale]
  )

  return (
    <FitBriefPage
      content={content}
      brand={brand}
      slug={brief.slug}
      defaultLocale={defaultLocale}
      isDraft={brief.status !== 'published'}
    />
  )
}
