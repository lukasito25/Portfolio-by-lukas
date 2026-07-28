'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/gsap'
import {
  isCampaignActive,
  locationCampaigns,
  type LocationCampaign,
} from '@/lib/location-campaigns'

const DISMISS_PREFIX = 'campaign-dismissed:'

function getCookie(name: string): string {
  if (typeof document === 'undefined') return ''
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)')
  )
  return match ? decodeURIComponent(match[1]) : ''
}

function pickCampaign(
  pool: LocationCampaign[],
  country: string,
  city: string
): LocationCampaign | null {
  const c = country.toUpperCase()
  const ci = city.toLowerCase()
  const now = new Date()
  return (
    pool.find(campaign => {
      if (!isCampaignActive(campaign, now)) return false
      const countryOk =
        !campaign.countries?.length ||
        campaign.countries.map(x => x.toUpperCase()).includes(c)
      const cityOk =
        !campaign.cities?.length ||
        (!!ci && campaign.cities.some(x => x.toLowerCase() === ci))
      return countryOk && cityOk
    }) ?? null
  )
}

/**
 * Campaigns are managed at /admin/campaigns and served from /api/campaigns,
 * already filtered to those active right now. The compiled-in list is the
 * fallback if that request fails, so the banner degrades to slightly stale copy
 * rather than disappearing.
 */
async function loadCampaigns(): Promise<LocationCampaign[]> {
  try {
    const res = await fetch('/api/campaigns')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return Array.isArray(data.campaigns) && data.campaigns.length
      ? data.campaigns
      : locationCampaigns
  } catch {
    return locationCampaigns
  }
}

/**
 * Non-invasive, geo-targeted call-to-action. Resolves the visitor's country
 * (and city) from cookies set by middleware.ts, matches it against
 * locationCampaigns, and — once the visitor scrolls past the hero — slides a
 * small dismissible card in from the bottom-right.
 *
 * Local testing (Vercel geo headers are absent off-platform):
 *   /?geo=GB                 → simulate a UK visitor
 *   /?geo=GB&city=London     → simulate London specifically
 *   /?campaign=genius-sports-uk → force a campaign, bypassing geo + dismissal
 */
export function LocationCampaignBanner() {
  const [campaign, setCampaign] = useState<LocationCampaign | null>(null)
  // `revealed` gates whether the banner is mounted at all (scroll threshold
  // crossed and not dismissed); `entered` drives the slide-in transition.
  const [revealed, setRevealed] = useState(false)
  const [entered, setEntered] = useState(false)

  // Resolve which campaign (if any) applies to this visitor.
  useEffect(() => {
    let cancelled = false

    const resolve = async () => {
      const params = new URLSearchParams(window.location.search)
      const forcedId = params.get('campaign')
      const pool = await loadCampaigns()
      if (cancelled) return

      let match: LocationCampaign | null = null
      if (forcedId) {
        // Force-preview looks in the compiled-in list too, so a campaign that
        // is paused or outside its window can still be checked.
        match =
          pool.find(c => c.id === forcedId) ??
          locationCampaigns.find(c => c.id === forcedId) ??
          null
      } else {
        const country = params.get('geo') || getCookie('visitor-country')
        const city = params.get('city') || getCookie('visitor-city')
        match = pickCampaign(pool, country, city)
      }

      if (!match) return
      // Never show the banner on the page it points to.
      if (window.location.pathname.startsWith(match.href)) return
      // Respect a previous dismissal (unless force-testing a campaign).
      if (!forcedId) {
        try {
          if (localStorage.getItem(DISMISS_PREFIX + match.id)) return
        } catch {
          /* localStorage unavailable — show anyway */
        }
      }
      setCampaign(match)
    }

    resolve()
    return () => {
      cancelled = true
    }
  }, [])

  // Reveal only after the visitor scrolls past (most of) the hero.
  useEffect(() => {
    if (!campaign) return
    const threshold = Math.min(600, window.innerHeight * 0.6)
    const onScroll = () => {
      if (window.scrollY > threshold) {
        setRevealed(true)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [campaign])

  const reduced = prefersReducedMotion()

  // Trigger the enter transition on the frame after the banner mounts.
  useEffect(() => {
    if (!revealed) return
    if (reduced) {
      setEntered(true)
      return
    }
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [revealed, reduced])

  // Unmounted until a campaign matches and the visitor has scrolled past the
  // hero — so it's never in the DOM/accessibility tree before it's shown, and
  // fully removed once dismissed.
  if (!campaign || !revealed) return null

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_PREFIX + campaign.id, '1')
    } catch {
      /* ignore */
    }
    setEntered(false)
    setRevealed(false)
  }

  return (
    <div
      role="region"
      aria-label={campaign.eyebrow}
      className={`fixed right-4 bottom-4 z-50 w-[min(22rem,calc(100vw-2rem))] ${
        reduced ? '' : 'transition-all duration-500 ease-out'
      } ${entered ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
    >
      <div className="panel relative bg-background/95 p-4 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-3 right-3 text-tertiary-fg transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-2 flex items-center gap-2 pr-6">
          <span
            className="pulse-dot h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <span className="section-label">{campaign.eyebrow}</span>
        </div>

        <p className="text-sm leading-relaxed text-secondary-fg">
          <strong className="text-foreground">{campaign.title}</strong>{' '}
          {campaign.body}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={campaign.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-(--accent) px-4 py-1.5 text-xs font-semibold text-(--accent-contrast) transition-opacity hover:opacity-90"
          >
            {campaign.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-secondary-fg transition-colors hover:border-(--accent) hover:text-foreground"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
