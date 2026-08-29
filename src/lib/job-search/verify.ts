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
