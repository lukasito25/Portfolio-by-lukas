/**
 * Deterministic job-posting retrieval.
 *
 * Roughly half the postings applied to so far sit on applicant tracking systems
 * that publish the posting as JSON. For those, asking the ATS is strictly better
 * than asking a model to read a web page: it is free, it is instant, it cannot
 * hallucinate a requirement, and it returns the text even when the careers page
 * renders entirely client-side.
 *
 * Verified against the real postings from previous applications:
 *   Greenhouse — Scandit  ✅ returns title, location and 6k of description
 *   Lever      — Qonto    ✅
 *   Ashby      — Kraken   ✅
 *   Personio   — Archlet  ⚠️ written from the documented XML feed but never
 *                            confirmed against a live board: the only Personio
 *                            posting in the history has been taken down and
 *                            archlet.jobs.personio.com/xml now 404s. If it
 *                            proves wrong it costs nothing — an unrecognised
 *                            URL falls through to the research pass.
 *
 * The model still does the judgement work of structuring the text into a
 * JobSpec. This module only replaces the fetch.
 *
 * When a URL is not recognised, or the API has removed the posting, this
 * returns null and the caller falls back to a grounded research pass.
 */

export interface AtsPosting {
  source: 'greenhouse' | 'lever' | 'ashby' | 'personio'
  title: string
  location: string
  company: string
  /** Plain text; HTML is stripped. */
  description: string
  url: string
}

const TIMEOUT_MS = 12_000

async function getJson(url: string): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/** ATS descriptions are HTML fragments; the model wants readable text. */
function htmlToText(html: string): string {
  return html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<\s*li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/* ------------------------------------------------------------------ *
 * Per-platform lookups
 * ------------------------------------------------------------------ */

/** Greenhouse: any careers URL carrying ?gh_jid=, plus boards.greenhouse.io. */
async function greenhouse(url: URL): Promise<AtsPosting | null> {
  const jobId =
    url.searchParams.get('gh_jid') ??
    url.pathname.match(/\/jobs\/(\d+)/)?.[1] ??
    null
  if (!jobId) return null

  // The board token is the company slug on boards.greenhouse.io, and for a
  // company's own careers domain it is usually the bare second-level domain.
  const candidates = new Set<string>()
  if (url.hostname.includes('greenhouse.io')) {
    // Both shapes are in the wild:
    //   boards.greenhouse.io/scandit/jobs/8093936      → first segment
    //   boards.greenhouse.io/embed/job_app?for=scandit → query param
    const firstSegment = url.pathname.split('/').filter(Boolean)[0]
    if (firstSegment && firstSegment !== 'embed') candidates.add(firstSegment)
    const fromPath = url.pathname.match(/boards\/([^/]+)/)?.[1]
    if (fromPath) candidates.add(fromPath)
    const embedded = url.searchParams.get('for')
    if (embedded) candidates.add(embedded)
  }
  const parts = url.hostname.replace(/^www\./, '').split('.')
  if (parts.length >= 2) candidates.add(parts[parts.length - 2])

  for (const board of candidates) {
    const data = (await getJson(
      `https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${jobId}`
    )) as {
      title?: string
      content?: string
      absolute_url?: string
      location?: { name?: string }
    } | null

    if (data?.title && data.content) {
      return {
        source: 'greenhouse',
        title: data.title,
        location: data.location?.name ?? '',
        company: board,
        description: htmlToText(data.content),
        url: data.absolute_url ?? url.toString(),
      }
    }
  }
  return null
}

/** Lever: jobs.lever.co/<company>/<id> */
async function lever(url: URL): Promise<AtsPosting | null> {
  const match = url.pathname.match(/^\/([^/]+)\/([0-9a-f-]{36})/i)
  if (!match) return null
  const [, company, id] = match

  const data = (await getJson(
    `https://api.lever.co/v0/postings/${company}/${id}`
  )) as {
    text?: string
    descriptionPlain?: string
    additionalPlain?: string
    lists?: { text?: string; content?: string }[]
    categories?: { location?: string }
    hostedUrl?: string
  } | null

  if (!data?.text) return null

  const lists = (data.lists ?? [])
    .map(list => `${list.text ?? ''}\n${htmlToText(list.content ?? '')}`)
    .join('\n\n')

  return {
    source: 'lever',
    title: data.text,
    location: data.categories?.location ?? '',
    company,
    description: [data.descriptionPlain, lists, data.additionalPlain]
      .filter(Boolean)
      .join('\n\n')
      .trim(),
    url: data.hostedUrl ?? url.toString(),
  }
}

/** Ashby: jobs.ashbyhq.com/<org>/<uuid> */
async function ashby(url: URL): Promise<AtsPosting | null> {
  const match = url.pathname.match(/^\/([^/]+)\/([0-9a-f-]{36})/i)
  if (!match) return null
  const [, org, id] = match

  const data = (await getJson(
    `https://api.ashbyhq.com/posting-api/job-board/${org}?includeCompensation=true`
  )) as { jobs?: Record<string, unknown>[] } | null

  const job = data?.jobs?.find(j => j.id === id) as
    | {
        title?: string
        location?: string
        descriptionPlain?: string
        descriptionHtml?: string
        jobUrl?: string
      }
    | undefined

  if (!job?.title) return null

  return {
    source: 'ashby',
    title: job.title,
    location: job.location ?? '',
    company: org,
    description: job.descriptionPlain ?? htmlToText(job.descriptionHtml ?? ''),
    url: job.jobUrl ?? url.toString(),
  }
}

/** Personio: <company>.jobs.personio.com/job/<id> */
async function personio(url: URL): Promise<AtsPosting | null> {
  const id = url.pathname.match(/\/job\/(\d+)/)?.[1]
  const company = url.hostname.split('.')[0]
  if (!id || !company) return null

  // Personio publishes the whole board as XML; pull the matching position.
  try {
    const res = await fetch(`https://${company}.jobs.personio.com/xml`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const xml = await res.text()

    const block = xml
      .split('<position>')
      .find(section => section.includes(`<id>${id}</id>`))
    if (!block) return null

    const field = (name: string) =>
      block
        .match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]
        ?.replace(/<!\[CDATA\[|\]\]>/g, '')
        .trim() ?? ''

    const title = field('name')
    if (!title) return null

    return {
      source: 'personio',
      title,
      location: field('office'),
      company,
      description: htmlToText(field('jobDescriptions') || block),
      url: url.toString(),
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */

export async function fetchAtsPosting(
  rawUrl: string
): Promise<AtsPosting | null> {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return null
  }

  const host = url.hostname.toLowerCase()

  if (host.includes('lever.co')) return lever(url)
  if (host.includes('ashbyhq.com')) return ashby(url)
  if (host.includes('jobs.personio.')) return personio(url)
  // Greenhouse last: it also matches company-owned careers domains carrying a
  // ?gh_jid= parameter, which the others never do.
  return greenhouse(url)
}

/** Flatten a posting into the text the structuring step reads. */
export function describeAtsPosting(posting: AtsPosting): string {
  return [
    `Title: ${posting.title}`,
    `Company: ${posting.company}`,
    posting.location ? `Location: ${posting.location}` : '',
    `URL: ${posting.url}`,
    '',
    posting.description,
  ]
    .filter(Boolean)
    .join('\n')
}
