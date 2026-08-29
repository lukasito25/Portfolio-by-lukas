/**
 * Did the search report a posting that is actually there?
 *
 * A grounded sweep reports what an index knows, and an index is days behind a
 * careers page. Some of what comes back is filled, some was never quite the URL
 * it looked like. Showing all of it as equally real would make the feature
 * worse than searching by hand: the whole saving comes from not opening twenty
 * tabs, and it evaporates the moment a badge cannot be trusted.
 *
 * So every hit is checked against the actual URL before it is shown, and the
 * result is one of three answers — never two:
 *
 *   live       — an ATS returned the posting, or the URL answered 2xx.
 *   gone       — the URL answered 404 or 410. The posting was taken down.
 *   unverified — anything else. A timeout, a 403, a bot wall, a redirect to a
 *                login. This is its own answer and must not be collapsed into
 *                `gone`: LinkedIn and Indeed refuse server-side requests as a
 *                matter of course, and calling a live posting dead would send
 *                him past the best result on the page.
 *
 * Where the URL is an ATS the codebase already reads (`fetchAtsPosting`), the
 * check is free of ambiguity and returns the authoritative text as a bonus —
 * the same lookup the extract route runs, reused rather than reimplemented.
 */

import { fetchAtsPosting } from '@/lib/fit-brief/ats'
import type { JobHit, Liveness } from './schema'

const TIMEOUT_MS = 8_000
/** Politeness and rate limits both argue against hammering one board. */
const CONCURRENCY = 6

/**
 * Boards answer a bare fetch differently from a browser. This is not evasion —
 * the request is a single HEAD-equivalent to a public posting — it is asking
 * the question in the form the server expects to be asked.
 */
const BROWSER_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

export interface VerifiedHit extends JobHit {
  liveness: Liveness
  /** Set when an ATS returned the posting and its text beat the search's. */
  atsSource?: string
}

/**
 * Grounded search hands back redirect links — Gemini's grounding layer wraps
 * every citation in one — and the redirect target is the URL he actually wants
 * in his browser and the one that must dedupe against a brief's `sourceUrl`.
 * Following it here is the only place that knows the answer, so the resolved
 * URL replaces the reported one whenever the request lands somewhere else.
 */

/**
 * Normalised form of a posting URL, used as the dedupe key.
 *
 * Tracking parameters are what make the same posting look like four postings:
 * one from a LinkedIn feed, one from an email, one from a referral link. The
 * ATS ids that actually identify a posting (`gh_jid`) are kept.
 */
export function normalizeUrl(raw: string): string {
  try {
    const url = new URL(raw.trim())
    url.hash = ''
    url.hostname = url.hostname.replace(/^www\./, '').toLowerCase()
    url.protocol = 'https:'

    for (const key of [...url.searchParams.keys()]) {
      const lower = key.toLowerCase()
      if (
        lower.startsWith('utm_') ||
        [
          'ref',
          'refid',
          'src',
          'source',
          'trk',
          'trackingid',
          'position',
          'pagenum',
          'origin',
          'lipi',
        ].includes(lower)
      ) {
        url.searchParams.delete(key)
      }
    }
    url.searchParams.sort()

    // A trailing slash is not a different posting.
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, '')

    return url.toString()
  } catch {
    return raw.trim()
  }
}

/** The board or host a posting sits on, when the model did not name one. */
export function hostOf(raw: string): string {
  try {
    return new URL(raw).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/* ------------------------------------------------------------------ *
 * Is this URL even a posting?
 * ------------------------------------------------------------------ */

/**
 * Hosts that answer 200 for anything and are never a job posting.
 *
 * Parked-domain marketplaces are the dangerous ones. A grounded sweep for
 * "Prima product manager" returned `hugedomains.com/domain_profile.cfm?d=…`,
 * which is a live page selling a domain name — it answers 200, so a liveness
 * check alone stamps it `Verified live` and it reaches him looking like the
 * second-best result on the page. One badge like that and the whole feature is
 * back to opening twenty tabs by hand.
 */
const NEVER_A_POSTING = [
  'hugedomains.com',
  'afternic.com',
  'sedo.com',
  'dan.com',
  'undeveloped.com',
  'domainmarket.com',
]

/**
 * Gemini's grounding layer wraps every citation in a redirect on its own host.
 * These arrive looking like nothing — an opaque token on a Google domain — and
 * they are the majority of what a grounded sweep reports, so they must survive
 * the pre-fetch filter and be judged on where they land instead. Resolving one
 * is `verifyOne`'s job; this only says "do not throw it away yet".
 */
const REDIRECTORS = ['vertexaisearch.cloud.google.com', 'www.google.com/url']

export function isRedirector(raw: string): boolean {
  try {
    const url = new URL(raw)
    return REDIRECTORS.some(host =>
      `${url.hostname}${url.pathname}`.startsWith(host)
    )
  } catch {
    return false
  }
}

/**
 * Words that end a listing URL rather than a posting URL, across the languages
 * the boards he searches actually use.
 */
const LISTING_SEGMENTS = new Set([
  'jobs',
  'job',
  'careers',
  'career',
  'search',
  'browse',
  'listings',
  'positions',
  'openings',
  'opportunities',
  'vacancies',
  'vacatures',
  'stellen',
  'stellenangebote',
  'stellenmarkt',
  'offerte',
  'offres',
  'emplois',
  'empleos',
  'ofertas',
  'lavoro',
  'annunci',
])

/**
 * A cheap structural check, run before anything is fetched.
 *
 * It cannot tell a posting from any other deep page — that is not the point.
 * It rejects the two shapes that are definitely not postings and that a
 * liveness check would otherwise wave through: a bare origin (a company
 * homepage always answers 200) and a domain-parking page.
 *
 * The model is told to omit a posting it cannot link to. When it hands back a
 * homepage instead, that instruction failed, and the honest reading is that it
 * did not find the posting — so the row is dropped rather than shown with a
 * link that goes somewhere useless.
 *
 * Run it twice: leniently before fetching, where a redirector gets a pass
 * because its destination is not knowable yet, and strictly afterwards on the
 * resolved URL. A redirect that never resolved still reads as a redirector at
 * that point and is dropped there.
 */
export function isPostingUrl(raw: string): boolean {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }

  if (!/^https?:$/.test(url.protocol)) return false

  const host = url.hostname.replace(/^www\./, '').toLowerCase()
  if (NEVER_A_POSTING.some(bad => host === bad || host.endsWith(`.${bad}`))) {
    return false
  }

  // A homepage, with or without a query string, is not a posting.
  const path = url.pathname.replace(/\/$/, '')
  if (path === '' || path === '/') return false

  // Neither is a listing index. Checked on the LAST segment rather than the
  // first, because the shape that actually turned up was
  // `jobs.ch/de/stellenangebote?term=` — a search page with an empty query,
  // two segments deep, which answers 200 and would have been badged live. A
  // real posting's last segment is an identifier or a slug, never the bare
  // word for "vacancies" in some language.
  const segments = path.split('/').filter(Boolean)
  const last = segments[segments.length - 1]?.toLowerCase() ?? ''
  if (LISTING_SEGMENTS.has(last)) return false

  return true
}

async function verifyOne(hit: JobHit): Promise<VerifiedHit> {
  // The deterministic path first: if an ATS publishes this posting, its answer
  // is better than anything a request to the HTML can tell us, and it also
  // corrects a title or location the search paraphrased.
  const posting = await fetchAtsPosting(hit.url).catch(() => null)
  if (posting) {
    return {
      ...hit,
      title: posting.title || hit.title,
      location: posting.location || hit.location,
      summary: hit.summary || posting.description.slice(0, 400),
      liveness: 'live',
      atsSource: posting.source,
    }
  }

  try {
    const res = await fetch(hit.url, {
      // GET rather than HEAD: a fair number of boards do not implement HEAD and
      // answer 405, which says nothing about whether the posting is there.
      method: 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'User-Agent': BROWSER_UA, Accept: 'text/html,*/*' },
      cache: 'no-store',
    })

    const resolved =
      res.url && res.url !== hit.url ? normalizeUrl(res.url) : hit.url

    if (res.status === 404 || res.status === 410) {
      return { ...hit, url: resolved, liveness: 'gone' }
    }
    if (res.ok) {
      // A redirect can land on an ATS the deterministic path recognises even
      // when the reported URL did not, so it is worth asking a second time.
      if (resolved !== hit.url) {
        const viaRedirect = await fetchAtsPosting(resolved).catch(() => null)
        if (viaRedirect) {
          return {
            ...hit,
            url: resolved,
            title: viaRedirect.title || hit.title,
            location: viaRedirect.location || hit.location,
            summary: hit.summary || viaRedirect.description.slice(0, 400),
            liveness: 'live',
            atsSource: viaRedirect.source,
          }
        }
      }
      return { ...hit, url: resolved, liveness: 'live' }
    }
    return { ...hit, url: resolved, liveness: 'unverified' }
  } catch {
    return { ...hit, liveness: 'unverified' }
  }
}

/** Verify every hit, a few at a time, preserving order. */
export async function verifyHits(hits: JobHit[]): Promise<VerifiedHit[]> {
  const out: VerifiedHit[] = new Array(hits.length)
  let next = 0

  const worker = async () => {
    for (;;) {
      const index = next++
      if (index >= hits.length) return
      out[index] = await verifyOne(hits[index])
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, hits.length) }, worker)
  )
  return out
}

/**
 * A company name that is really an apology.
 *
 * One run returned `[Company Not Stated]` for two postings it had named
 * correctly on a previous sweep. A placeholder in that field is worse than a
 * rough answer: it is the first thing read on the card, it sorts and dedupes
 * against nothing, and it makes a real posting look like a broken row. The
 * careers domain is always known — `cembra.ch` says more than "not stated".
 */
export function cleanCompanyName(name: string, url: string): string {
  const trimmed = (name ?? '')
    .trim()
    .replace(/^\[|\]$/g, '')
    .trim()

  const isPlaceholder =
    !trimmed ||
    /^(company\s+)?(not\s+stated|unknown|n\/?a|unspecified|none|undisclosed|confidential)$/i.test(
      trimmed
    )

  if (!isPlaceholder) return trimmed

  const host = hostOf(url)
  if (!host) return 'Unnamed company'

  // A board host says nothing about the employer, so do not dress it up as one.
  return host
}

/* ------------------------------------------------------------------ *
 * Recency
 * ------------------------------------------------------------------ */

/** A vacancy older than this is usually filled or abandoned. */
export const MAX_POSTING_AGE_DAYS = 62

/**
 * How long ago the posting says it was published, in days, or null.
 *
 * Read from the posting's own words rather than from a resolved date, and that
 * ordering is the whole point. Asked to turn "5 days ago" into YYYY-MM-DD, the
 * model returned **2024-05-20** — it resolved the relative date against its own
 * training cutoff rather than against today. Trusting that would have thrown
 * away the freshest postings in the sweep as two years stale, which is a worse
 * failure than the one the filter exists to fix.
 *
 * "5 days ago" is the model quoting the page. That is reliable. The arithmetic
 * on top of it is not, so it is done here.
 */
function relativeAgeDays(postedText: string): number | null {
  const text = postedText.trim().toLowerCase()
  if (!text) return null

  if (/\b(today|just posted|just now|new)\b/.test(text)) return 0
  if (/\byesterday\b/.test(text)) return 1

  const match = text.match(
    /(\d+)\+?\s*(hour|hr|day|week|month|year)s?\s*(ago|old)?/
  )
  if (!match) return null

  const amount = Number(match[1])
  if (!Number.isFinite(amount)) return null

  switch (match[2]) {
    case 'hour':
    case 'hr':
      return 0
    case 'day':
      return amount
    case 'week':
      return amount * 7
    case 'month':
      return amount * 30
    case 'year':
      return amount * 365
    default:
      return null
  }
}

/** Days since an absolute YYYY-MM-DD date, or null when it is not one. */
function absoluteAgeDays(postedIso: string, now: Date): number | null {
  const trimmed = postedIso?.trim()
  if (!trimmed || !/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null

  const posted = new Date(`${trimmed}T00:00:00Z`)
  if (Number.isNaN(posted.getTime())) return null

  return (now.getTime() - posted.getTime()) / 86_400_000
}

/**
 * Is this posting old enough to be worth dropping?
 *
 * Answers only when it can. Most postings state no date at all — a sweep that
 * discarded those would throw away the majority of real openings to enforce a
 * rule it has no evidence for. So the test is deliberately one-sided: drop a
 * posting only when it carries a date that reads as genuinely old. Silence, an
 * unparseable date, and a date in the future all mean "keep".
 *
 * The rule exists because a sweep for Zurich returned two postings from August
 * 2024 sitting near the top of the results, still indexed and still scoring.
 *
 * The posting's own words win over the resolved date — see `relativeAgeDays`
 * for the run where believing the resolved date would have deleted everything
 * fresh.
 */
export function isStale(
  postedIso: string,
  postedText = '',
  now: Date = new Date()
): boolean {
  const relative = relativeAgeDays(postedText)
  const ageDays = relative ?? absoluteAgeDays(postedIso, now)

  if (ageDays === null) return false
  // A future date is a model error, not a fresh posting — but it is not
  // evidence of staleness either, so it survives to be judged by liveness.
  if (ageDays < 0) return false

  return ageDays > MAX_POSTING_AGE_DAYS
}
