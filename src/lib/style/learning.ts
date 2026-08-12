/**
 * The edit-learning loop.
 *
 * Everything the generator knows about Lukáš's voice at the start is
 * second-hand: copy from the site and from briefs he approved, which is a good
 * proxy but not the same as prose he wrote unaided.
 *
 * The diff between what was generated and what he actually sent is better than
 * a proxy. It is the one place where his judgement is recorded in a form a
 * model can imitate: this sentence was not good enough, and this is what it
 * became. Those pairs are fed back into later generations, so the system gets
 * closer to his register with every application instead of restarting from the
 * same baseline each time.
 *
 * Deliberately not automated further than this. The pairs are shown to the
 * model as examples, never used to silently rewrite the guardrails — a bad
 * edit should influence tone, not quietly change what may be claimed.
 */

import type { FitBriefContent } from '@/lib/fit-brief/schema'

export interface EditPair {
  kind: 'brief' | 'cv' | 'letter'
  locale: string
  path: string
  before: string
  after: string
}

/** Fields worth learning from — prose, not labels. */
const LEARNABLE_BRIEF_PATHS = [
  'hero.headlineLead',
  'hero.headlineGradient',
  'hero.description',
  'spotlight.lede',
  'spotlight.closingLine',
  'gap.body',
  'closing.body',
]

/**
 * Walk two content trees and report the string leaves that differ.
 *
 * Only prose is compared. A changed `tierLabel` or a reordered chip says
 * nothing about voice, and including it would dilute the examples that do.
 */
export function diffBriefContent(
  before: FitBriefContent | undefined,
  after: FitBriefContent | undefined,
  locale: string
): EditPair[] {
  if (!before || !after) return []

  const pairs: EditPair[] = []

  const read = (source: unknown, path: string): string | undefined => {
    const value = path
      .split('.')
      .reduce<unknown>(
        (node, key) =>
          node && typeof node === 'object'
            ? (node as Record<string, unknown>)[key]
            : undefined,
        source
      )
    return typeof value === 'string' ? value : undefined
  }

  for (const path of LEARNABLE_BRIEF_PATHS) {
    const a = read(before, path)
    const b = read(after, path)
    if (a && b && a.trim() !== b.trim()) {
      pairs.push({ kind: 'brief', locale, path, before: a, after: b })
    }
  }

  // Role-map bodies and profile proofs carry most of the actual writing.
  before.roleMapSection.items.forEach((item, index) => {
    const match = after.roleMapSection.items[index]
    if (match && item.body.trim() !== match.body.trim()) {
      pairs.push({
        kind: 'brief',
        locale,
        path: `roleMapSection.items[${index}].body`,
        before: item.body,
        after: match.body,
      })
    }
  })

  before.profileMatchSection.panels.forEach((panel, p) => {
    const matchPanel = after.profileMatchSection.panels[p]
    if (!matchPanel) return
    panel.rows.forEach((row, r) => {
      const matchRow = matchPanel.rows[r]
      if (matchRow && row.proof.trim() !== matchRow.proof.trim()) {
        pairs.push({
          kind: 'brief',
          locale,
          path: `profileMatchSection.panels[${p}].rows[${r}].proof`,
          before: row.proof,
          after: matchRow.proof,
        })
      }
    })
  })

  return pairs
}

/**
 * Format recent edits as instruction for the next generation.
 *
 * Capped deliberately. Twelve well-chosen pairs teach a register; fifty crowd
 * out the facts corpus and start to look like a style transfer task.
 */
export function buildEditLearningPrompt(pairs: EditPair[], limit = 12): string {
  if (!pairs.length) return ''

  const recent = pairs.slice(0, limit)

  const examples = recent
    .map(
      (pair, index) =>
        `${index + 1}. You wrote:\n   "${pair.before.trim()}"\n   He rewrote it as:\n   "${pair.after.trim()}"`
    )
    .join('\n\n')

  return `HOW HE REWRITES YOUR DRAFTS

These are real edits he made to generated copy before sending it. They are the
most direct evidence of his voice available — closer than any style rule.

Study what changed and why: what he cuts, what he makes concrete, where he
shortens, which words he refuses. Then write so the next draft needs fewer of
these edits. Do not copy these sentences; copy the instincts behind them.

${examples}`
}

/**
 * Ask the model to turn accumulated edits into durable rules.
 *
 * Runs occasionally, not per generation: once there are enough pairs that
 * passing them all verbatim would crowd the prompt, the recurring patterns are
 * worth more than the individual examples. Output is reviewed by hand before it
 * becomes part of the style guide — this is the one place where the system
 * writes its own instructions, so it does not get to do that unsupervised.
 */
export const DISTILL_SYSTEM = `You analyse how one person edits drafts written for them, and extract the rules behind the edits.

You are given pairs: what was generated, and what he changed it to before putting his name on it.

Identify only patterns that appear more than once. For each, write a rule specific enough to act on:
- "Cuts the second clause when the first already carries the point" — usable.
- "Prefers a more natural tone" — useless, do not write this.

Quote a short before/after fragment as evidence for each rule.

Ignore one-off factual corrections; those are content, not voice. You are looking for register, rhythm, sentence length, word choice, and what he consistently removes.

Return 3-8 rules. Fewer, sharper rules beat a long list.`

export function distillPrompt(pairs: EditPair[]): string {
  const examples = pairs
    .map(
      (pair, index) =>
        `${index + 1}. [${pair.path}]\n   GENERATED: "${pair.before.trim()}"\n   HE SENT:   "${pair.after.trim()}"`
    )
    .join('\n\n')

  return `Extract the editing patterns from these ${pairs.length} pairs.\n\n${examples}`
}
