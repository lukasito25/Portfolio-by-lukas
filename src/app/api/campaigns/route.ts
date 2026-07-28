import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  isCampaignActive,
  locationCampaigns,
  type LocationCampaign,
} from '@/lib/location-campaigns'

/**
 * Public list of campaigns eligible to show right now.
 *
 * The banner is a client component, so it reads this instead of importing the
 * compiled-in array — that's what lets /admin/campaigns change what runs
 * without a deploy. Two filters apply: the admin `isActive` switch, and the
 * existing time window (startsAt plus the 2-month cap, or an earlier endsAt),
 * so a forgotten banner still retires itself.
 *
 * Falls back to the compiled-in list if the store is unreachable — the banner
 * degrading to slightly stale copy is much better than it vanishing.
 */
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'
).replace(/\/$/, '')
const API_SECRET = process.env.API_SECRET || ''
// Keyed on the secret alone, not NODE_ENV — /api/admin-proxy always edits the
// Worker's D1, so reading from anywhere else would make the admin panel and the
// live banner disagree in development.
const useWorker = Boolean(API_SECRET)

interface StoredCampaign extends LocationCampaign {
  isActive?: boolean
}

/** Strip to what the banner needs — no admin-only fields leave the server. */
const publicShape = (c: StoredCampaign): LocationCampaign => ({
  id: c.id,
  countries: c.countries,
  cities: c.cities,
  startsAt: c.startsAt,
  endsAt: c.endsAt,
  eyebrow: c.eyebrow,
  title: c.title,
  body: c.body,
  ctaLabel: c.ctaLabel,
  href: c.href,
})

export async function GET() {
  let source: 'worker' | 'prisma' | 'fallback' = 'fallback'
  let all: StoredCampaign[] = []

  try {
    if (useWorker) {
      const res = await fetch(`${API_URL}/campaigns`, {
        headers: { Authorization: `Bearer ${API_SECRET}` },
        // Always read fresh here; the CDN header below is what limits load.
        // Caching at this layer too meant an admin toggle took five minutes to
        // appear, which reads as "the switch is broken".
        cache: 'no-store',
      })
      if (res.ok) {
        const data = await res.json()
        all = data.campaigns ?? []
        source = 'worker'
      }
    } else {
      const rows = await prisma.locationCampaign.findMany()
      all = rows.map(r => ({
        id: r.id,
        countries: r.countries.split(',').filter(Boolean),
        cities: r.cities ? r.cities.split(',').filter(Boolean) : undefined,
        startsAt: r.startsAt,
        endsAt: r.endsAt ?? undefined,
        isActive: r.isActive,
        eyebrow: r.eyebrow,
        title: r.title,
        body: r.body,
        ctaLabel: r.ctaLabel,
        href: r.href,
      }))
      source = 'prisma'
    }
  } catch (error) {
    console.error('[campaigns] read failed, using compiled-in list:', error)
  }

  // An empty store means "not seeded yet", not "no campaigns" — fall back.
  if (!all.length) {
    all = locationCampaigns
    source = 'fallback'
  }

  const now = new Date()
  const campaigns = all
    .filter(c => c.isActive !== false)
    .filter(c => isCampaignActive(c, now))
    .map(publicShape)

  return NextResponse.json(
    { campaigns, source },
    {
      headers: {
        // 30s edge cache: long enough that the homepage doesn't hit the Worker
        // on every visit, short enough that an admin toggle is visible almost
        // immediately. stale-while-revalidate keeps it warm.
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300',
      },
    }
  )
}
