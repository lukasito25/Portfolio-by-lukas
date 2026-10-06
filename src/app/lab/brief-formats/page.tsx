import { notFound } from 'next/navigation'
import { dataService } from '@/lib/data-service'
import { FitBriefContentSchema, BrandSchema } from '@/lib/fit-brief/schema'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { heroMediaFor } from '@/lib/fit-brief/hero-media'
import { FormatLab } from './format-lab'

/**
 * Three candidate formats for a generated brief, side by side, on real
 * content. Development only — `notFound()` in production, absent from the nav
 * and the sitemap, and deleted once a format is chosen.
 *
 * Reads a real brief rather than a fixture because the question these
 * prototypes answer is about *this* copy: how a 14-word requirement and a
 * three-sentence proof behave in each layout, in three languages.
 *
 *   /lab/brief-formats?slug=fifa&locale=en
 */

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Format lab',
  robots: { index: false, follow: false },
}

export default async function FormatLabPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string; locale?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()

  const { slug = 'fifa', locale } = await searchParams

  const brief = await dataService.getBriefBySlug(slug).catch(() => null)
  if (!brief) notFound()

  const raw = brief.content as Record<string, unknown>
  const picked = (LOCALES as readonly string[]).includes(locale ?? '')
    ? (locale as Locale)
    : LOCALES.find(code => raw[code])

  const parsed = FitBriefContentSchema.safeParse(raw[picked ?? 'en'])
  if (!parsed.success) notFound()

  const brand = BrandSchema.safeParse(brief.brand)

  return (
    <FormatLab
      content={parsed.data}
      brand={
        brand.success
          ? brand.data
          : { accentLight: '#1277d9', accentDark: '#4da6ff', motif: 'mesh' }
      }
      slug={slug}
      locale={picked ?? 'en'}
      company={brief.companyName}
      media={heroMediaFor(slug)}
    />
  )
}
