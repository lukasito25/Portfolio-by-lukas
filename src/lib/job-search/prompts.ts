/**
 * Prompts for the automatic job search.
 *
 * Three calls, and they are three because of a provider constraint rather than
 * a design preference: Gemini rejects `response_schema` alongside the
 * `google_search` tool, so a grounded sweep and a structured result cannot be
 * the same request (`src/lib/ai/provider.ts`). The same two-pass shape already
 * runs in `/api/admin/brief/extract` for a URL no ATS recognises.
 *
 *   1. research  — grounded, prose out. Finds the postings.
 *   2. structure — schema-constrained. Turns the prose into JobHit rows.
 *   3. score     — schema-constrained, one call for the whole set.
 *
 * One rule in the research prompt is load-bearing and looks like a style
 * choice: it asks for requirements **condensed rather than quoted**. Asking
 * Gemini to reproduce a posting's requirements verbatim reliably returns an
 * empty response — the recitation guard fires on the copied text, the candidate
 * comes back with no text part, and the agent suite surfaces that as
 * `object of type 'NoneType' has no len()`. Measured, not guessed: the same
 * search succeeds in 15s asking for a summary and fails in 18s asking for
 * quotes.
 *
 * This is the opposite of the extract prompt, which does insist on verbatim
 * `sourceQuotes` — and it is safe here because these lines only feed the triage
 * score. Anything he decides to apply to is re-read from the posting itself by
 * `/api/admin/brief/extract` before a word of the brief is written.
 */

import { serializeFactsForPrompt, roles } from '@/lib/career-facts'
import { HONESTY_RULES } from '@/lib/fit-brief/guardrails'
import { SCORE_BANDS, HARD_BLOCKER_RULES } from '@/lib/fit-brief/fit-score'
import type { JobSearchCriteria, JobHit } from './schema'

/* ------------------------------------------------------------------ *
 * Step 1 — the grounded sweep
 * ------------------------------------------------------------------ */

export const SEARCH_SYSTEM = `
You find real, currently open job postings. You are a search tool, not a
recruiter and not a writer: nothing you report may be something you inferred.

Rules, in the order they matter:

1. EVERY POSTING NEEDS A LINK, AND THE LINK YOU HAVE IS GOOD ENOUGH. Report the
   best URL you have for each posting. The posting's own page is ideal, but a
   board listing for that specific role, or a redirect that lands on it, is
   perfectly fine — every URL is resolved and checked by the caller before
   anything is shown, so you do not need to be certain it is canonical. What is
   NOT a posting: a search-results page listing many roles, a company homepage
   (a URL that is just a domain, like https://example.com/), or a careers
   landing page with no specific role. Those are discarded on arrival, so a
   posting reported with a homepage link is a posting he never sees — if that
   is all you have, say so in prose instead. Only leave a posting out when you
   have no link to it at all.

2. NEVER INVENT A DETAIL TO COMPLETE A ROW. If the posting states no salary,
   there is no salary. If it does not say when it was posted, it does not say.
   An estimated market rate presented as the posting's number is the single
   worst thing you can return here.

3. CONDENSE REQUIREMENTS FAITHFULLY, ONE PER LINE. Keep the posting's meaning,
   its specificity and its language — "5+ years in B2B SaaS product", "German
   C1 required" — but write them in your own words rather than reproducing the
   posting's text verbatim. Do not soften: a requirement stated as mandatory
   stays mandatory, and a language or authorisation requirement is never
   dropped. These lines decide whether he opens the posting at all.

4. BREADTH BEFORE POLISH. Sweep the large boards (LinkedIn, Indeed, Glassdoor,
   StepStone, Welcome to the Jungle, Otta, Wellfound), the applicant tracking
   systems companies host themselves (Greenhouse, Lever, Ashby, Workday,
   Personio, SmartRecruiters) and company careers pages directly. Run several
   searches, not one: each title against each location, plus the obvious
   variants of the title. Aim for fifteen to twenty-five postings. Twenty real
   postings beat five well-described ones, and a short answer here is the most
   likely way this fails — returning nothing is almost always wrong when open
   roles exist.

5. NO AGENCY REPOSTS OF THE SAME ROLE. Where a posting appears both on an
   agency listing and on the employer's own site, report the employer's.

6. RECENT POSTINGS ONLY. A vacancy older than two months is usually filled or
   abandoned, and applying to one wastes the hour it costs. Do not report a
   posting you can see is older than that. Give each one's date as YYYY-MM-DD
   as well as in the posting's own words, working out relative dates ("3 days
   ago") against today. If a posting states no date, say so — an invented date
   is worse than a missing one, because the caller drops anything it can read
   as stale.

7. SAY WHAT YOU COULD NOT SEE. If a board would not load, or a region returned
   nothing, say so plainly at the end. An empty result that means "nothing
   matched" and an empty result that means "the search could not see anything"
   need to be told apart.
`.trim()

/**
 * Today, as the model must be told it.
 *
 * Left to itself it dates "5 days ago" against its training cutoff — a run
 * resolved two postings from this week to May 2024. Every prompt that touches a
 * date carries this line.
 */
function todayLine(): string {
  return `Today's date is ${new Date().toISOString().slice(0, 10)}. Use it for any date arithmetic; do not rely on your own sense of the current date.`
}

export function searchResearchPrompt(criteria: JobSearchCriteria): string {
  const lines: string[] = []

  lines.push(
    `Find currently open job postings matching the following. Search widely and report everything that genuinely fits.`
  )
  lines.push('')
  lines.push(todayLine())
  lines.push('')
  lines.push(
    `TITLES (any of these, or a close variant)\n${criteria.titles.map(t => `- ${t}`).join('\n')}`
  )

  if (criteria.locations.length) {
    lines.push(
      `\nLOCATIONS (any of these)\n${criteria.locations.map(l => `- ${l}`).join('\n')}`
    )
  } else {
    lines.push('\nLOCATIONS\nNot restricted — prefer Europe and remote roles.')
  }

  if (criteria.workModel !== 'any') {
    lines.push(`\nWORK MODEL\n${criteria.workModel}`)
  }

  if (criteria.seniority) {
    lines.push(`\nSENIORITY\n${criteria.seniority}`)
  }

  if (criteria.salaryMin) {
    lines.push(
      `\nSALARY\nHe is looking for at least ${criteria.salaryMin.toLocaleString('en-US')} ${criteria.salaryCurrency} a year. Most postings state nothing about pay — this is a preference to note where a range IS stated, not a filter. Do not drop a posting for being silent about salary, and do not estimate one.`
    )
  }

  lines.push(`
For each posting you find, report in plain prose:

- the direct URL of the posting
- the role title, exactly as written
- the hiring company
- the location and whether it is onsite, hybrid or remote
- the stated salary, or "not stated"
- when it was posted, both as YYYY-MM-DD and in the posting's own words, or
  "not stated" if it gives no date
- where you found it (the board or host)
- two or three sentences on what the role involves
- the stated requirements, condensed one per line, keeping their language and
  their force (mandatory stays mandatory)

Finish with one or two sentences on what you searched and anything you could
not read.

Report every posting you found. Do not filter for the "best" ones and do not
withhold a posting because you are unsure the link is canonical — the caller
resolves and verifies every URL, and a posting you leave out is one he never
sees.`)

  return lines.join('\n')
}

export function structureHitsPrompt(research: string): string {
  return `${STRUCTURE_HITS_PROMPT}\n\n${todayLine()}\n${research}`
}

const STRUCTURE_HITS_PROMPT = `Turn the postings described below into structured rows.

Copy the URLs exactly as reported — do not tidy, shorten or reconstruct them.
Drop any posting that has no direct URL, and any that is a duplicate of another
row. Where a field was reported as "not stated", the field is an empty string:
do not fill it in from what a role like this usually pays or how recent it
probably is. That applies to postedIso above all — leave it empty rather than
estimating, because a date is acted on.

POSTINGS`

/* ------------------------------------------------------------------ *
 * Step 3 — the lead score
 * ------------------------------------------------------------------ */

/**
 * A condensed profile, not the full corpus.
 *
 * The full `serializeFactsForPrompt()` output rides in every *generation* call
 * because a brief cites individual fact ids and needs all of them available.
 * Scoring cites nothing — it only needs to know what he has done — and it
 * carries up to thirty postings in the same request, so the compact form buys
 * headroom for the part that varies.
 */
export function candidateProfile(): string {
  const roleLines = roles.map(
    r =>
      `- ${r.title}, ${r.company} (${r.location}, ${r.period})\n  ${r.summary}\n  tools: ${r.technologies.join(', ')}`
  )

  return `WHO IS BEING SCORED

Lukáš Hošala, senior product manager, based in Volterra, Tuscany. Slovak
citizen, so no visa or work permit is required anywhere in the EU.

Languages, exactly as his CV states them and no further: Slovak native,
English C2, Italian B2. He has never rated his German despite three years
working in Vienna — treat German as unstated.

ROLES
${roleLines.join('\n')}

FULL FACT CORPUS, for detail
${serializeFactsForPrompt()}`
}

export const LEAD_SCORE_SYSTEM = `You triage job postings for one person, before any application is written.

He has a limited number of hours and every application costs one. Your job is to
protect those hours: say plainly which of these are worth his time and which are
not. A triage that recommends everything is worse than no triage, because it
costs a call and returns a feeling.

${SCORE_BANDS}

${HARD_BLOCKER_RULES}

## You are working from less than the full picture

You are given only what the search could see of each posting — often a partial
requirement list rather than the full text. Score what is in front of you and
let the uncertainty push you DOWN, not up. A deeper assessment runs later,
against the full posting and the fit brief written from it; this number exists
to decide which postings earn that step, so a false "apply" is more expensive
than a false "skip".

Where the visible requirements are too thin to judge, say so in the verdict
rather than inventing confidence.

## Honesty about him

${HONESTY_RULES}

Rules 2, 3 and 5 bind you directly. In particular: a posting that requires
professional German is a hard blocker, because he has never stated a German
level — not a risk, not a stretch. Do not reason around it on the grounds that
he worked in Vienna.

## Register

Write to him directly, plainly, the way a friend who has done hiring would. No
"leverage", no "strong candidate profile". If the answer is don't bother, the
verdict says don't bother and why.`

export function leadScorePrompt(hits: JobHit[]): string {
  return `Score each of these postings. Return one entry per posting, with the url copied exactly so the scores can be matched back.

${candidateProfile()}

THE POSTINGS
${JSON.stringify(
  hits.map(hit => ({
    url: hit.url,
    title: hit.title,
    company: hit.companyName,
    location: hit.location,
    workModel: hit.workModel,
    salary: hit.salaryText || 'not stated',
    summary: hit.summary,
    requirements: hit.requirements,
  })),
  null,
  2
)}`
}
