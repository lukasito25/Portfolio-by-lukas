/**
 * Per-step prompts for the application engine.
 *
 * Kept apart from the route handlers so the wording can be tuned without
 * touching request plumbing — the prompts are the part that actually decides
 * whether the output is usable.
 */

import {
  buildSystemPrompt,
  BRIEF_SHAPE_RULES,
  LOCALE_LABELS,
} from './guardrails'
import type { Locale } from './guardrails'
import type { JobSpec, FitBriefContent } from './schema'

/* ------------------------------------------------------------------ *
 * Step 1 — read the posting
 * ------------------------------------------------------------------ */

export const EXTRACT_SYSTEM = `
You read job postings and turn them into a structured brief for a downstream
writer. You are describing the POSTING and the COMPANY only — not the candidate.

Rules:
- Quote requirements in the posting's own language and vocabulary. Do not
  translate them into English if the posting is not in English; a later step
  handles translation.
- Separate hard requirements from nice-to-haves the way the posting does. If it
  does not distinguish, judge by whether it says "must"/"required" versus
  "ideally"/"a plus".
- sourceQuotes must be verbatim fragments from the posting, so a later step can
  be checked against what was actually written.
- Do not soften or dramatise. If the posting is vague, say so in the field
  rather than inventing detail.
- brandColorGuess: only fill this in if you actually know the company's brand
  colour. A guess that is wrong is worse than an empty string.
- companyName: the brand's own casing, not whatever the source hands you. An
  ATS API returns the URL slug ("qonto", "kraken"), and that name ends up in
  the filename of a document sent to that company — so write "Qonto", "Kraken",
  "adidas" (genuinely lowercase), "eBay". Match how the company writes itself.
`.trim()

export function extractResearchPrompt(url: string): string {
  return `Fetch this job posting and read it in full: ${url}

If the page renders empty or the posting has been taken down, say so explicitly
and then search for the same role on the company's careers site or an aggregator
to recover the text.

Then briefly research the company: what it does, its size and market, and any
recent context relevant to this role.

Report back in plain prose:
1. The posting verbatim where it matters — title, location, responsibilities,
   requirements — preserving the original language.
2. Whether the posting was live, taken down, or unreachable.
3. What you found about the company.`
}

export const EXTRACT_FROM_RESEARCH_PROMPT = `Structure the posting described below.

If the research says the posting was taken down or could not be read, still fill
in whatever is known and leave the rest empty — do not invent responsibilities or
requirements to fill the shape.`

/* ------------------------------------------------------------------ *
 * Step 2 — write the brief
 * ------------------------------------------------------------------ */

export function briefSystem(editLearning?: string): string {
  return buildSystemPrompt(
    `${BRIEF_SHAPE_RULES}

YOUR TASK

Write a private fit brief: a single scrollable page mapping his experience
against one specific posting. A recruiter reads it in about two minutes and
should come away knowing exactly where he fits and where he does not.

Open it the way you would open a first meeting — a friendly, professional
welcome to someone who has taken the time to look. Not a pitch, not a slogan,
and not a headline about founding a company. The page earns attention through
what it shows, so the opening only needs to be warm and clear about what
follows.

What makes these pages work:
- The role map walks the posting's actual responsibilities and says, for each,
  where he has done that work. Concrete: the product, the constraint, the result.
- The profile match is split honestly between direct matches and transferable
  experience. Mark a row transferable when it is transferable. A page where
  every row is a direct match is a sales sheet and gets skimmed.
- The spotlight is the closest precedent for THIS role — most often the
  165M-user migration, the requirements work across 50+ market teams, or the
  platform ownership at StagStrat. Choose for relevance, not for impressiveness.
  PlayerGrade is available as supporting proof that he can build end to end,
  but it is never the spotlight and never the opening: a founder narrative
  reads as divided attention in a hiring process, which costs more than the
  credential gains.
- The gap section names what he has not done. Write it plainly. Do not
  reframe it as a strength.

Write in the language you are told to write in, not necessarily English.`,
    editLearning
  )
}

export function briefPrompt(spec: JobSpec, locale: Locale): string {
  return `Write the fit brief for this posting, in ${LOCALE_LABELS[locale]}.

Also choose the page's brand treatment:
- accentLight / accentDark: the company's brand colour, adjusted per mode so
  both clear WCAG AA (4.5:1) against a near-white and a near-black background.
  If the company has no usable brand colour, pick something that suits its
  sector rather than defaulting to blue.
- motif: the hero background pattern that best fits the company's domain.

THE POSTING
${JSON.stringify(spec, null, 2)}`
}

/* ------------------------------------------------------------------ *
 * Step 3 — translate
 * ------------------------------------------------------------------ */

export function translateSystem(editLearning?: string): string {
  return buildSystemPrompt(
    `${BRIEF_SHAPE_RULES}

YOUR TASK

Translate a fit brief that has already been written and approved for content.

- Translate, do not rewrite. Same claims, same structure, same order, same
  factIds on every element — copy the factIds across unchanged.
- Idiomatic in the target language, not literal. A German recruiter should read
  German that was written for them, not English with German words.
- Keep proper nouns, product names, company names and metrics exactly as they
  are. "165M+" stays "165M+".
- Respect the same length limits.
- The language you are translating into says nothing about his proficiency in
  it. Do not add any remark about language skills.`,
    editLearning
  )
}

export function translatePrompt(
  content: FitBriefContent,
  target: Locale,
  spec: JobSpec
): string {
  return `Translate this fit brief into ${LOCALE_LABELS[target]}.

The role is ${spec.roleTitle} at ${spec.companyName}, ${spec.location}.

SOURCE BRIEF
${JSON.stringify(content, null, 2)}`
}

/* ------------------------------------------------------------------ *
 * Step 4 — CV and cover letter
 * ------------------------------------------------------------------ */

export function documentsSystem(
  styleGuide: string,
  editLearning?: string
): string {
  return buildSystemPrompt(
    `YOUR TASK

Write a tailored CV and a cover letter for one specific posting.

THE CV
- Roles marked "lead" or "supporting" in the corpus all stay; tailor which
  bullets appear and how they are phrased, never the history itself.
- A role marked "optional" (PlayerGrade) is left out unless the posting
  specifically asks for zero-to-one product building. When it is included it
  goes in its normal chronological place with one or two bullets, and the
  summary is still about his product career — not about founding something.
  His own CV omits it entirely; that is the safe default.
- Bullets lead with what changed and then how: "Cut feature lead time by 80% by
  tightening how work was scoped" rather than "Responsible for scoping".
- Pick bullets that answer this posting. A requirements-heavy posting wants the
  adidas market-team work near the top; an AI posting wants PlayerGrade and the
  Vertex AI work.
- The headline and summary are the only genuinely bespoke parts. Make them
  specific to the role, and keep them free of self-description ("driven",
  "passionate", "results-oriented").
- languages: statements only, never levels.

THE COVER LETTER
- Under one page. Four paragraphs is usually right.
- Open with why this role specifically — something true about the company or
  the problem, not flattery.
- The middle carries the evidence, chosen for this posting.
- One paragraph acknowledges the honest limit. This is not optional and it is
  not a weakness dressed as a strength.
- Close plainly. No "I look forward to hearing from you at your earliest
  convenience".
- Never address a named individual — the name is usually a guess and a wrong
  guess is worse than "Dear Hiring Team".

${styleGuide}`,
    editLearning
  )
}

export function documentsPrompt(
  spec: JobSpec,
  brief: FitBriefContent,
  locale: Locale
): string {
  return `Write the CV and cover letter for this posting, in ${LOCALE_LABELS[locale]}.

The fit brief for this role has already been written — reuse its judgement about
what matters and where the gap is, so the three documents tell one story.

THE POSTING
${JSON.stringify(spec, null, 2)}

THE FIT BRIEF
${JSON.stringify(
  {
    hero: brief.hero,
    profileMatch: brief.profileMatchSection,
    spotlight: brief.spotlight,
    gap: brief.gap,
  },
  null,
  2
)}`
}
