/**
 * CV and cover-letter house style.
 *
 * Derived from five real documents, August 2026:
 *
 *   - `LUKAS_HOSALA_RESUME_26` — his ATS-optimised CV, the one in current use
 *     (14 revisions between 27 July and 6 August, one per application)
 *   - `Resume_Hosala_2026_Port` — his graphical CV, pre-ATS
 *   - `cv-lukas_adidas...pub` — his 2015–2018 CV, kept for the early roles
 *   - Two CVs from a friend who landed the job he applied for with them
 *
 * The friend's documents contributed structure only; none of his personal
 * details, employers or metrics are reproduced here or anywhere in this repo.
 *
 * Where the two sources disagreed, his own CV wins on content and the friend's
 * wins on scannability — that is the one thing his was measurably missing.
 */

export const CV_STYLE_GUIDE = `
HOUSE STYLE

Derived from his own CV and from CVs that landed interviews.

## Bullet structure — the highest-impact rule

Every bullet opens with a two-or-three-word bold label naming what it is about,
then the sentence. A recruiter scans the labels down the left edge before
reading a word of prose, and decides from those whether to keep going.

  Pipeline Architecture: Migrated a 165M+ user platform to Next.js in stages,
  finishing with zero downtime.

  Team Leadership: Led 13 people including external freelancers across three
  countries.

Labels name the *kind* of work — Requirements Engineering, Stakeholder
Management, Risk Mitigation, Process Design, Revenue Impact, Scale Management.
They are not restatements of the sentence. Pick labels a recruiter for this
specific posting would look for; the labels are part of the tailoring.

## Bullets

- One line each; two at most. A three-line bullet is two bullets.
- Open with the outcome, then the mechanism: "Cut feature lead time by 80% by
  tightening how work was scoped."
- Attach the constraint that makes a number mean something: "zero downtime
  across a staged migration for 165M+ registered users" beats "led a successful
  migration".
- Three to four bullets per role. The most recent role can take more.
- Past tense for finished roles, present for current ones.
- Never open with "Responsible for" or "Helped to".

## Numbers

- Vary the kind: scale (165M+ users, 1000+ stakeholders, 50+ market teams),
  money (€1M licence), change (+55% page load, 80% lead time, 100% adoption),
  and time (intern to Product Owner in 18 months). A CV of only percentages
  reads thin.
- Use the figure exactly as the facts corpus states it. Do not re-round.
- Two strong numbers per role beat five weak ones.

## Summary

Four to six lines, dense, first thing on the page. Seniority and years, the
single largest scale figure, the leadership figure, then what he is aiming at
with this application. No adjectives about himself.

## Skills

Four to six named groups, each a real category rather than a dumping ground:
Product Management, Technical Skills, Domain Expertise, Leadership. Name actual
tools and standards, not qualities — "JIRA, Confluence, Figma, SQL, Google
Analytics" earns its space; "excellent communication" does not. Order the groups
so the one this posting cares about comes first.

## Certifications and training

Dated, most recent first. A dated list reads as continuous development; an
undated one reads as a static credential dump.

## Languages

Exactly the levels the facts corpus states, and never more.

## What never appears

"Passionate", "driven", "results-oriented", "proven track record", "synergies",
"thought leader", "dynamic environment", "hit the ground running".
No skill percentage bars, no self-rated proficiency, no photo, no date of birth,
no marital status. Referees are supplied on request, never printed.

## Cover letter

- Under one page. Four paragraphs is usually right.
- Contractions are fine; it should read like he wrote it in one sitting.
- Open with something specific and true about the company or the problem. If
  nothing specific is known, be specific about the problem instead — never fill
  the space with flattery.
- One paragraph names the honest limit: state the gap, say what is adjacent,
  stop. No hedging it into meaninglessness.
- Close plainly. Never "at your earliest convenience".
- Never address a guessed personal name.
`.trim()
