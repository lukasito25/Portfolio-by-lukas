/**
 * The voice corpus: prose Lukáš has actually published under his own name.
 *
 * An honest note about what this is. These lines come from the live site and
 * from fit briefs he reviewed and shipped — so they are copy he *approved*,
 * which is a strong signal but not identical to prose he wrote unaided. The
 * purer signal comes from `learning.ts`, which records how he rewrites drafts
 * before sending them. This corpus is the starting point; the edit pairs are
 * what refine it.
 *
 * Curated rather than bulk-extracted. Twenty lines that show the register beat
 * two hundred that dilute it, and every line here was chosen because it
 * demonstrates something specific: a rhythm, a way of handling a number, a
 * refusal to oversell.
 *
 * Source of truth for the facts these lines contain is `career-facts.ts`. If a
 * fact changes, fix it there; these are voice samples, not claims to reuse.
 */

export interface VoiceSample {
  text: string
  /** What this line demonstrates, so the model knows why it is here. */
  shows: string
  source: string
}

export const VOICE_SAMPLES: VoiceSample[] = [
  {
    text: 'I use Agile because it works, not because it’s required.',
    shows: 'Flat, unhedged, slightly contrarian. No framework worship.',
    source: 'homepage — competencies',
  },
  {
    text: 'Running a zero-downtime migration for 165M users wasn’t exciting — it was a lot of careful planning, staged rollouts, and clear ownership. The exciting part was that nothing broke.',
    shows: 'Deflates his own achievement, then lands the point. Never sells.',
    source: 'about — philosophy',
  },
  {
    text: 'Most product problems aren’t solved by clever frameworks — they’re solved by making sure everyone understands what we’re doing and why.',
    shows: 'Em-dash pivot from what it isn’t to what it is. A recurring shape.',
    source: 'about — philosophy',
  },
  {
    text: 'This was a less glamorous but important project — the kind of internal tooling that everyone relies on and nobody talks about until it breaks.',
    shows: 'Willing to call his own work unglamorous. Concrete, wry.',
    source: 'work — adidas admin application',
  },
  {
    text: 'We launched on schedule with 100% adoption on day one, which I’m still proud of.',
    shows: 'Understated pride. "Still proud of" rather than any superlative.',
    source: 'work — PIM tool',
  },
  {
    text: 'Most teams were using spreadsheets and gut feel.',
    shows: 'Short. Concrete. Sets up the problem without dramatising it.',
    source: 'work — PlayerGrade',
  },
  {
    text: 'Tax assessment is new to me. Domain-heavy business processes are not.',
    shows: 'The gap-handling move: concede plainly, then draw the real line.',
    source: '/rocken fit brief',
  },
  {
    text: 'The work was listening until it was clear why the existing workaround had grown — because that is when solutions start beating wish lists.',
    shows:
      'Describes method, not virtue. Earns the abstraction with a specific.',
    source: '/rocken fit brief',
  },
  {
    text: 'I don’t have a philosophy I can fit on a slide.',
    shows: 'Opens by refusing the expected move.',
    source: 'about — philosophy',
  },
  {
    text: 'Stakeholder alignment across three countries was more work than the technical side.',
    shows: 'States the unglamorous truth a recruiter will recognise as real.',
    source: 'work — featured case study',
  },
  {
    text: 'Some of it was at scale, some of it was figuring things out from scratch.',
    shows: 'Balanced clause pair; admits the range instead of flattening it.',
    source: 'work — hero',
  },
  {
    text: 'I know what scouts actually need because I’ve done the work.',
    shows: 'Credential asserted through action, not title.',
    source: 'about — PlayerGrade',
  },
]

/** Words and constructions he does not use. Absence is part of the voice. */
export const VOICE_PROHIBITIONS = [
  'passionate about',
  'excited to',
  'proven track record',
  'results-oriented',
  'seasoned professional',
  'thought leader',
  'synergies',
  'world-class',
  'cutting-edge',
  'hit the ground running',
  'wear many hats',
  'dynamic environment',
  'I look forward to hearing from you at your earliest convenience',
]

/**
 * The voice section of the generation prompt.
 *
 * Shows rather than tells: a sample with a note on what it demonstrates
 * teaches more than an adjective like "conversational" ever does.
 */
export function buildVoicePrompt(): string {
  const samples = VOICE_SAMPLES.map(
    sample => `- "${sample.text}"\n  (${sample.shows})`
  ).join('\n')

  return `HIS VOICE

Published lines of his, each annotated with what it demonstrates. Match the
register, sentence length and level of understatement. Do not reuse the
sentences themselves.

${samples}

Patterns worth noticing across those samples:
- He states the unimpressive part out loud. It is what makes the impressive part credible.
- Numbers arrive attached to their constraint, never on their own.
- Em-dashes pivot from what something is not to what it is.
- Sentences are short. Two clauses at most, usually one.
- He never describes himself with an adjective.

Never write: ${VOICE_PROHIBITIONS.join('; ')}.`
}
