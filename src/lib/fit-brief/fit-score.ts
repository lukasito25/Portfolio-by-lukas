/**
 * Is this application worth the hour?
 *
 * The engine made applying cheap, which creates a new problem: it is now
 * possible to apply to everything, and applying to everything is how a job
 * hunt turns into unpaid data entry. This exists to say "don't" — and a score
 * that never says "don't" is worse than no score, because it costs a model call
 * and returns a feeling.
 *
 * So two things guard against a vanity number.
 *
 * First, part of it is not a judgement at all. `coverage()` counts, from the
 * brief's own requirement rows, how many the page itself marks as direct
 * matches rather than transferable. Those rows were written under the honesty
 * rules and are already the thing a recruiter will scan. The count is stored
 * next to the score so the arithmetic is visible: a 70 sitting on 2-of-9
 * must-haves is self-evidently wrong.
 *
 * Second, the prompt is calibrated against reality rather than against
 * encouragement. Most applications do not get interviews. A genuinely good
 * match is not 90.
 */

import * as z from 'zod/v4'
import type { JobSpec, FitBriefContent } from './schema'

export const FitAssessmentSchema = z.object({
  score: z
    .number()
    .describe(
      'Probability, 0-100, that this application leads to a first interview. Calibrated against the bands in the system prompt, not against optimism.'
    ),
  band: z.enum(['strong', 'credible', 'stretch', 'long-shot']),
  recommendation: z
    .enum(['apply', 'apply-if-time', 'skip'])
    .describe('What he should actually do, given a finite number of hours.'),
  verdict: z
    .string()
    .describe(
      'One sentence, addressed to him, saying why. Plain. No encouragement that the evidence does not support.'
    ),
  mustHaves: z
    .array(
      z.object({
        requirement: z
          .string()
          .describe("The must-have, in the posting's words."),
        status: z.enum(['met', 'partial', 'unmet']),
        note: z.string().describe('One line of evidence, or what is missing.'),
      })
    )
    .describe(
      'Every requirement the posting frames as essential. Do not silently drop the ones he fails — those are the reason the score is what it is.'
    ),
  drivers: z
    .array(z.string())
    .max(4)
    .describe('What genuinely helps here. Specific, not "strong background".'),
  risks: z
    .array(z.string())
    .max(4)
    .describe(
      'What will most likely get this filtered out, in the order a screener would hit them.'
    ),
  hardBlocker: z
    .string()
    .describe(
      'A single condition that makes this near-impossible regardless of fit — no work authorisation, a required language he does not have, a seniority gap of two levels, a licence or degree he lacks. Empty string when there is none.'
    ),
})

export type FitAssessment = z.infer<typeof FitAssessmentSchema>

/* ------------------------------------------------------------------ *
 * The part that is arithmetic, not opinion
 * ------------------------------------------------------------------ */

export interface Coverage {
  /** Requirement rows on the brief that it marks as a direct match. */
  directMatches: number
  /** Rows marked transferable rather than direct. */
  transferable: number
  totalRows: number
  /** Requirements the posting itself frames as essential. */
  mustHaves: number
  niceToHaves: number
}

export function coverage(spec: JobSpec, brief: FitBriefContent): Coverage {
  const rows = brief.profileMatchSection.panels.flatMap(panel => panel.rows)
  return {
    directMatches: rows.filter(r => r.isMatch).length,
    transferable: rows.filter(r => !r.isMatch).length,
    totalRows: rows.length,
    mustHaves: spec.requirements.filter(r => r.kind === 'must').length,
    niceToHaves: spec.requirements.filter(r => r.kind === 'nice').length,
  }
}

/* ------------------------------------------------------------------ *
 * Prompt
 * ------------------------------------------------------------------ */

export const FIT_SYSTEM = `You estimate whether a specific job application is worth a specific person's time.

You are not writing to encourage him. He has a limited number of hours and every application costs one; your job is to protect those hours from applications that were never going to land. A score that says "apply" to everything is useless to him, and telling him something is promising when it is not costs him a week he could have spent on a role he would have got.

## The scale

The number is the probability of reaching a **first interview** — not of getting the job. Anchor it here:

- **75-100 · strong** — He meets every must-have with direct, demonstrable experience, and has something the posting specifically wants that most applicants will not. A recruiter reading his CV against this posting has no reason to pass.
- **45-74 · credible** — He meets most must-haves directly. One or two are transferable rather than direct, and each is explainable in a sentence. This is what a genuinely good, realistic application looks like. Most roles he should apply for live here.
- **20-44 · stretch** — Several must-haves are transferable at best, or the seniority is a step beyond what he has held. Worth doing only if the role is unusually attractive or he has a referral.
- **0-19 · long-shot** — A hard blocker, or the profile is simply not what they asked for. Say so plainly.

Be strict at the top. **75+ should be rare.** If you find yourself scoring most postings above 60, you are describing his CV rather than his odds against the other applicants for this specific role.

## Hard blockers cap the score

If any of these hold, the score cannot exceed 19 no matter how good the rest of the fit is, and \`hardBlocker\` must name it:

- The role requires work authorisation he does not have.
- The posting requires professional fluency in a language he has not stated.
- The role is two or more seniority levels above anything he has held.
- A specific degree, licence or certification is mandatory and he lacks it.

A relocation requirement is **not** a hard blocker on its own — say where he is based and let the risk list carry it.

## What the evidence is

You are given the posting, and the fit brief already written for it. That brief marks each requirement as a direct match or as transferable, honestly, under rules that forbid overclaiming. **Treat those markings as the ground truth.** If the brief says something is transferable, it is not a direct match, however good the proof reads.

You are also given the count of those markings. If most requirements are transferable, the score cannot be in the top band — the arithmetic is visible next to your answer and the two must agree.

## Every must-have, including the failures

List each requirement the posting frames as essential, with an honest status. Dropping the ones he fails would make the list an argument for applying rather than a description of his position, which is the opposite of useful.

## Register

Write to him directly, plainly, the way a friend who has done hiring would. No "leverage", no "strong candidate profile", no hedging into meaninglessness. If the answer is don't bother, the verdict says don't bother and why.`

export function fitPrompt(
  spec: JobSpec,
  brief: FitBriefContent,
  cover: Coverage
): string {
  return `Assess this application honestly.

THE POSTING
${JSON.stringify(
  {
    company: spec.companyName,
    role: spec.roleTitle,
    seniority: spec.seniority,
    location: spec.location,
    workModel: spec.workModel,
    postingLanguage: spec.postingLanguage,
    requirements: spec.requirements,
    responsibilities: spec.responsibilities,
    companyContext: spec.companyContext,
  },
  null,
  2
)}

HOW THE FIT BRIEF ALREADY MARKED HIM, requirement by requirement
${JSON.stringify(
  brief.profileMatchSection.panels.flatMap(panel =>
    panel.rows.map(row => ({
      requirement: row.requirement,
      directMatch: row.isMatch,
      evidence: row.proof,
    }))
  ),
  null,
  2
)}

THE GAP THE BRIEF ADMITS TO
${brief.gap.heading} — ${brief.gap.body}

THE ARITHMETIC, which your score must be consistent with
${cover.directMatches} of ${cover.totalRows} requirement rows are direct matches; ${cover.transferable} are transferable only.
The posting lists ${cover.mustHaves} essential requirements and ${cover.niceToHaves} desirable ones.`
}

/* ------------------------------------------------------------------ *
 * Presentation
 * ------------------------------------------------------------------ */

export const BAND_LABEL: Record<FitAssessment['band'], string> = {
  strong: 'Strong fit',
  credible: 'Credible',
  stretch: 'Stretch',
  'long-shot': 'Long shot',
}

export const RECOMMENDATION_LABEL: Record<
  FitAssessment['recommendation'],
  string
> = {
  apply: 'Apply',
  'apply-if-time': 'Apply if you have time',
  skip: 'Skip this one',
}

/** Band from the score, so a mismatched pair cannot show two different stories. */
export function bandFor(score: number): FitAssessment['band'] {
  if (score >= 75) return 'strong'
  if (score >= 45) return 'credible'
  if (score >= 20) return 'stretch'
  return 'long-shot'
}
