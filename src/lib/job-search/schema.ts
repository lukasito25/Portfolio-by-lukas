/**
 * Schemas for the automatic job search.
 *
 * The engine's other half (`src/lib/fit-brief/schema.ts`) turns one known
 * posting into an application. This turns a description of what he is looking
 * for into a list of postings worth considering — the step that was still being
 * done by hand.
 *
 * Same double duty as its sibling: these are the structured-output contract
 * handed to the model AND the contract the panel renders. Written against
 * `zod/v4` because that is what the providers' schema helpers expect.
 */

import * as z from 'zod/v4'

/* ------------------------------------------------------------------ *
 * What he is looking for
 * ------------------------------------------------------------------ */

export const WORK_MODELS = ['onsite', 'hybrid', 'remote', 'any'] as const
export type WorkModelFilter = (typeof WORK_MODELS)[number]

export const JobSearchCriteriaSchema = z.object({
  /** At least one. Everything else is optional — this is the only real input. */
  titles: z.array(z.string().min(2)).min(1).max(6),
  /** Free text, as he would say it: "Milan", "Remote (Italy)", "Switzerland". */
  locations: z.array(z.string().min(2)).max(6).default([]),
  /**
   * A floor, not a filter.
   *
   * Most postings state no salary at all, so treating this as a hard filter
   * would discard the majority of real openings. It is passed to the search as
   * a preference and surfaced in the score's risk list when a stated range
   * falls below it.
   */
  salaryMin: z.number().int().positive().optional(),
  salaryCurrency: z.string().max(4).default('EUR'),
  workModel: z.enum(WORK_MODELS).default('any'),
  /** e.g. "Senior", "Lead", "Head of". Empty means no constraint. */
  seniority: z.string().max(40).default(''),
})

export type JobSearchCriteria = z.infer<typeof JobSearchCriteriaSchema>

/* ------------------------------------------------------------------ *
 * One posting the search found
 * ------------------------------------------------------------------ */

export const JobHitSchema = z.object({
  url: z
    .string()
    .describe(
      'The direct URL of the posting itself, not a search-results page and not the company homepage. If you cannot give a direct link, omit the posting entirely.'
    ),
  title: z.string().describe('The role title as the posting writes it.'),
  companyName: z
    .string()
    .describe(
      'The hiring company\'s own casing — "Qonto", "adidas", "eBay". Not an agency, unless the agency is the employer. Always name it: if the posting does not, use the company whose careers domain the URL belongs to. Never a placeholder such as "not stated" - it is the first thing read on the card.'
    ),
  location: z
    .string()
    .describe('City and country as written in the posting, or "Remote".'),
  workModel: z.enum(['onsite', 'hybrid', 'remote', 'unspecified']),
  salaryText: z
    .string()
    .describe(
      'Compensation exactly as the posting words it, e.g. "€75,000 – €95,000". Empty string when the posting states none — never estimate, never fill in a market rate.'
    ),
  postedText: z
    .string()
    .describe(
      'How the posting dates itself, e.g. "3 days ago", "Posted 12 August". Empty string when it does not say.'
    ),
  postedIso: z
    .string()
    .describe(
      'The posting date as YYYY-MM-DD, resolved from postedText against today where it is relative ("3 days ago"). Empty string when the posting gives no date at all — do NOT guess one, an invented date silently discards the posting or keeps a stale one.'
    ),
  source: z
    .string()
    .describe(
      'Where it was found: the board name or careers-site host, e.g. "LinkedIn", "StepStone", "jobs.lever.co".'
    ),
  summary: z
    .string()
    .describe('Two or three sentences on what the role actually involves.'),
  requirements: z
    .array(z.string())
    .max(12)
    .describe(
      'The requirements the posting states, in its own words. These are what the score is computed from, so do not paraphrase them into something softer.'
    ),
})

export type JobHit = z.infer<typeof JobHitSchema>

export const JobHitListSchema = z.object({
  hits: z.array(JobHitSchema).max(40),
  /**
   * Kept because an empty result set has two very different causes, and the
   * panel should be able to say which: nothing matched, or the search could not
   * see anything. Silently showing "0 results" for the second is how someone
   * concludes there are no jobs.
   */
  coverageNote: z
    .string()
    .describe(
      'One or two sentences on what was searched and anything that could not be read. Empty string when the sweep was unremarkable.'
    ),
})

/* ------------------------------------------------------------------ *
 * The cheap pre-generation score
 * ------------------------------------------------------------------ */

export const LeadScoreSchema = z.object({
  url: z
    .string()
    .describe('The url of the posting this score belongs to, copied exactly.'),
  score: z
    .number()
    .describe(
      'Probability, 0-100, of reaching a first interview. Calibrated against the bands in the system prompt, not against optimism.'
    ),
  band: z.enum(['strong', 'credible', 'stretch', 'long-shot']),
  recommendation: z.enum(['apply', 'apply-if-time', 'skip']),
  verdict: z
    .string()
    .describe('One sentence, addressed to him, saying why. Plain.'),
  drivers: z
    .array(z.string())
    .max(3)
    .describe('What genuinely helps here. Specific, not "strong background".'),
  risks: z
    .array(z.string())
    .max(3)
    .describe('What would most likely get this filtered out.'),
  hardBlocker: z
    .string()
    .describe(
      'A single condition making this near-impossible regardless of fit. Empty string when there is none.'
    ),
})

export type LeadScore = z.infer<typeof LeadScoreSchema>

export const LeadScoreListSchema = z.object({
  scores: z.array(LeadScoreSchema).max(30),
})

/* ------------------------------------------------------------------ *
 * The stored lead, as the panel reads it
 * ------------------------------------------------------------------ */

export type Liveness = 'live' | 'gone' | 'unverified'

export type LeadState = 'new' | 'saved' | 'dismissed' | 'applied'

export interface JobLeadView {
  id: string
  url: string
  title: string
  companyName: string
  location: string
  workModel: string
  salaryText: string
  postedText: string
  postedIso: string
  source: string
  summary: string
  requirements: string[]
  liveness: Liveness
  leadScore: number
  band: LeadScore['band']
  recommendation: LeadScore['recommendation']
  hardBlocker: string
  scoreDetail: { verdict?: string; drivers?: string[]; risks?: string[] }
  state: LeadState
  briefId: string | null
  criteria: Partial<JobSearchCriteria>
  foundAt: string
  updatedAt: string
  /**
   * Decoration, not storage: whether a `GeneratedBrief` already exists for this
   * company. Computed per request against the current briefs, because a brief
   * written after the lead was stored still needs to show up here.
   */
  alreadyApplied?: boolean
}
