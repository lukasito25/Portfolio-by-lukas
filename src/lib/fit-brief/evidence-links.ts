/**
 * What else rests on the same evidence.
 *
 * Every text-bearing item the generator writes carries `factIds` into the
 * career-facts corpus. That makes two things computable that would otherwise
 * have to be authored — and an authored one could be wrong:
 *
 *   - the headline figure a requirement is actually backed by, so "165M+
 *     users" sits beside the claim it supports instead of only in the band at
 *     the top of the page, where it is read once;
 *   - which other part of the page rests on the same fact, so a reader who
 *     doubts a one-line proof can see the longer version of the same story.
 *
 * Both are derived, never written, which is the point: a computed link cannot
 * invent a relationship, and nothing in the prompt or the schema has to change
 * for an existing brief to gain them. Measured across the three published
 * briefs, 79–89% of requirements acquire a link and almost all of those point
 * into a different section.
 *
 * Extracted from an exploratory layout that was not worth shipping. These two
 * functions were the part of it that was.
 */

import type { FitBriefContent, HeroStat } from './schema'

/** Somewhere else on the page that shares a fact with a requirement. */
export interface EvidenceLink {
  /** DOM id of the thing to scroll to. */
  targetId: string
  /** What it is called, for the link text. */
  title: string
}

export interface RowEvidence {
  stat?: HeroStat
  related: EvidenceLink[]
}

/** DOM ids, defined once so the renderer and the links cannot disagree. */
export const roleMapDomId = (itemId: string) => `rm-${itemId}`
export const pillarDomId = (index: number) => `pl-${index}`

/**
 * Index a brief's requirements by what backs them.
 *
 * Keyed by the requirement text because that is what the renderer has in hand
 * and it is unique within a brief — the generator writes one row per posting
 * requirement.
 */
export function buildEvidenceIndex(
  content: FitBriefContent
): Map<string, RowEvidence> {
  const index = new Map<string, RowEvidence>()

  /** Everything a requirement could point at, with where it lives. */
  const targets: (EvidenceLink & { factIds: string[] })[] = [
    ...content.roleMapSection.items.map(item => ({
      targetId: roleMapDomId(item.id),
      title: item.title,
      factIds: item.factIds,
    })),
    ...content.spotlight.pillars.map((pillar, i) => ({
      targetId: pillarDomId(i),
      title: pillar.title,
      factIds: pillar.factIds,
    })),
  ]

  for (const panel of content.profileMatchSection.panels) {
    for (const row of panel.rows) {
      if (!row.factIds.length) {
        index.set(row.requirement, { related: [] })
        continue
      }

      index.set(row.requirement, {
        // First match wins. A stat may legitimately back more than one
        // requirement — "165M+ users" supports both the scale claim and the
        // migration one — and showing it twice is honest, not a duplicate.
        stat: content.hero.stats.find(stat =>
          stat.factIds.some(id => row.factIds.includes(id))
        ),
        /**
         * Capped at one. A fact like the Runtastic migration is cited by half
         * the brief, and a requirement offering five places to go next is one
         * nobody leaves. The point is a single obvious next step, not a
         * sitemap — and on a dense table, one quiet line per row is as much
         * as the layout can carry without becoming noise.
         */
        related: targets
          .filter(target => target.factIds.some(id => row.factIds.includes(id)))
          .slice(0, 1)
          .map(({ targetId, title }) => ({ targetId, title })),
      })
    }
  }

  return index
}
