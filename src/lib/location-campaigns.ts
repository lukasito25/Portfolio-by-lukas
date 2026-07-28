/**
 * Location-targeted campaign registry.
 *
 * Each entry drives the bottom-corner banner shown by
 * <LocationCampaignBanner /> when a visitor's geo (resolved from Vercel's
 * edge headers in middleware.ts → cookies) matches its rules AND the campaign
 * is inside its active time window. To add a new per-location campaign for a
 * future job application, append an object here — no component changes needed.
 *
 * Matching:
 *   - `countries` — ISO 3166-1 alpha-2 codes (e.g. 'GB', 'DE', 'CH').
 *   - `cities`    — optional; case-insensitive exact match on the edge city
 *                   name. Vercel city detection is less reliable than country,
 *                   so prefer country-level unless you specifically need it.
 *   - A campaign with neither rule matches everyone (use sparingly).
 *   - The first matching, active, non-dismissed campaign wins, so order
 *     most-specific first.
 *
 * Time-framing (auto-expiry):
 *   - `startsAt` is required (ISO date, YYYY-MM-DD). A campaign never shows
 *     before it, and never shows more than MAX_CAMPAIGN_DURATION_MONTHS after
 *     it — so every banner retires on its own and won't clash with future
 *     campaigns. Expired entries can stay in this file as a record.
 *   - `endsAt` optionally ends a campaign *earlier*; it is clamped to the
 *     start + max-duration cap and can never extend past it.
 *
 * The banner never shows on its own `href` page.
 */

/** Hard cap: a campaign is never shown longer than this after its `startsAt`. */
export const MAX_CAMPAIGN_DURATION_MONTHS = 2

export interface LocationCampaign {
  /** Stable id — also the localStorage dismissal key. Never reuse across campaigns. */
  id: string
  /** ISO 3166-1 alpha-2 country codes this campaign targets. */
  countries?: string[]
  /** Optional city names (case-insensitive) to further narrow the match. */
  cities?: string[]
  /** ISO date (YYYY-MM-DD) the campaign goes live. Required so it auto-expires. */
  startsAt: string
  /** Optional earlier end date (YYYY-MM-DD); clamped to start + max duration. */
  endsAt?: string
  /** Small mono eyebrow label. */
  eyebrow: string
  /** Bold headline line. */
  title: string
  /** Supporting sentence. */
  body: string
  /** Call-to-action button label. */
  ctaLabel: string
  /** Internal path the CTA links to (also excluded from where the banner shows). */
  href: string
}

/**
 * Effective end of a campaign: `startsAt` + MAX_CAMPAIGN_DURATION_MONTHS,
 * or an explicit `endsAt` if it is earlier (never later than the cap).
 */
export function campaignEndDate(c: LocationCampaign): Date {
  const start = new Date(`${c.startsAt}T00:00:00Z`)
  const cap = new Date(start)
  cap.setUTCMonth(cap.getUTCMonth() + MAX_CAMPAIGN_DURATION_MONTHS)
  if (c.endsAt) {
    const explicit = new Date(`${c.endsAt}T23:59:59Z`)
    if (explicit.getTime() < cap.getTime()) return explicit
  }
  return cap
}

/** Whether `now` falls within the campaign's active window. */
export function isCampaignActive(
  c: LocationCampaign,
  now: Date = new Date()
): boolean {
  const start = new Date(`${c.startsAt}T00:00:00Z`)
  return (
    now.getTime() >= start.getTime() &&
    now.getTime() <= campaignEndDate(c).getTime()
  )
}

export const locationCampaigns: LocationCampaign[] = [
  {
    id: 'launchmetrics-fr',
    // Offices are Paris, Milan and Madrid/Girona, but IT and ES are already
    // taken by qualcomm-arduino-it and archlet-es until they auto-expire on
    // 2026-09-27. Paris is the operating HQ, so France alone avoids any clash.
    countries: ['FR'],
    startsAt: '2026-07-27',
    eyebrow: 'Recruiting for Launchmetrics?',
    title: 'I mapped my experience to your role.',
    body: 'A short brief for the Senior Product Builder opening on Data Collection & Enrichment.',
    ctaLabel: 'See the fit brief',
    href: '/launchmetrics',
  },
  {
    id: 'qualcomm-arduino-it',
    countries: ['IT'],
    startsAt: '2026-07-27',
    eyebrow: 'Recruiting for Arduino?',
    title: 'I mapped my experience to your role.',
    body: 'A short brief for the AI Product Manager opening in Turin — from someone already in Italy.',
    ctaLabel: 'See the fit brief',
    href: '/qualcomm',
  },
  {
    id: 'genius-sports-uk',
    countries: ['GB'],
    startsAt: '2026-07-25',
    eyebrow: 'Recruiting for Genius Sports?',
    title: 'I mapped my experience to your role.',
    body: 'A short brief for the Senior PM, Platform Experience opening in London.',
    ctaLabel: 'See the fit brief',
    href: '/genius',
  },
  {
    id: 'fifa-ch',
    countries: ['CH'],
    startsAt: '2026-07-08',
    eyebrow: 'Recruiting for FIFA?',
    title: 'I mapped my experience to your role.',
    body: 'A short brief for the AI & Innovative Tech Governance Manager opening in Zurich.',
    ctaLabel: 'See the fit brief',
    href: '/fifa',
  },
]
