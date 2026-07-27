/**
 * Visitor opt-out for first-party analytics.
 *
 * The site sets no advertising or cross-site cookies, so its analytics fall
 * under the audience-measurement exemption that the Italian Garante and the
 * French CNIL recognise — first-party only, aggregate, not shared, short-lived.
 * That exemption carries a condition: visitors must be able to opt out. This
 * module is that mechanism, surfaced on /privacy.
 *
 * Scope: opting out stops page-view recording and the engagement beacon, and
 * clears the session and returning-visitor cookies. The 1-hour geo cookies are
 * deliberately NOT included — they are personalisation rather than measurement,
 * and the campaign banner they drive is shown to every visitor either way.
 */

/** Cookie read server-side by middleware.ts to skip analytics entirely. */
export const OPTOUT_COOKIE = 'pv_optout'

/** Analytics cookies cleared when opting out. */
const ANALYTICS_COOKIES = ['pv_sid', 'pv_seen']

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const hit = document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null
}

export function hasOptedOut(): boolean {
  return readCookie(OPTOUT_COOKIE) === '1'
}

/** Opt out: set the flag for one year and clear what has already been stored. */
export function optOut(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${OPTOUT_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  for (const name of ANALYTICS_COOKIES) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`
  }
}

/** Undo an opt-out — the choice has to be reversible to be a real one. */
export function optIn(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${OPTOUT_COOKIE}=; path=/; max-age=0; samesite=lax`
}
