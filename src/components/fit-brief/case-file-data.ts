/**
 * The brief, flattened into files a recruiter can open one at a time.
 *
 * The linear page reads top to bottom and asks nothing of the reader. The case
 * file hands them the index instead: the posting's requirements, the work
 * itself, the project, and the one section that says where he stops short —
 * each a self-contained file they choose to open. Nothing here is new content,
 * and nothing is authored for it: every file is a view of something the
 * generator already wrote, which is what lets a brief switch format without
 * being regenerated.
 *
 * The cross-links are the part worth understanding. Every text-bearing item in
 * the schema already carries `factIds` into the career-facts corpus, so two
 * files that cite the same fact rest on the same evidence. That makes "see
 * also" computable rather than something the model has to invent — and a
 * computed link cannot hallucinate a relationship that is not there.
 */

import type { FitBriefContent, HeroStat } from '@/lib/fit-brief/schema'

export type CaseFileGroupId = 'asks' | 'work' | 'project' | 'gap'

export interface CaseFile {
  /** Stable, unique within the brief; used for the URL hash and as the key. */
  id: string
  group: CaseFileGroupId
  /** The index entry — short enough for one or two lines in the rail. */
  title: string
  /** Optional badge: the tier label, the role-map tag, the status badge. */
  tag?: string
  /** True for a direct match; drives the badge treatment. Undefined where the
   *  distinction does not apply (the work, the project, the gap). */
  isMatch?: boolean
  /** The evidence itself. */
  body: string
  factIds: string[]
  /** Ids of other files resting on at least one of the same facts. */
  related: string[]
  /**
   * A headline figure this file can carry, when one of the hero stats rests
   * on the same fact. Also computed rather than authored — it is what gives a
   * card something to look at before it is something to read.
   */
  stat?: HeroStat
}

export interface CaseFileGroup {
  id: CaseFileGroupId
  /** Taken from the content the generator already wrote, never hardcoded
   *  English — these pages render in three languages. */
  title: string
  files: CaseFile[]
}

/**
 * A slug safe for an id and a URL hash.
 *
 * Deliberately not `encodeURIComponent` of the title: these titles are German
 * and Italian too, and a hash full of percent-escapes is not something he can
 * paste into a message. Falls back to the index when a title has no ASCII word
 * characters at all, which is possible but has not happened.
 */
function slugify(value: string, fallback: string): string {
  const slug = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return slug || fallback
}

/** Ensures ids stay unique even when two requirements read alike. */
function uniqueId(base: string, taken: Set<string>): string {
  if (!taken.has(base)) {
    taken.add(base)
    return base
  }
  let n = 2
  while (taken.has(`${base}-${n}`)) n++
  taken.add(`${base}-${n}`)
  return `${base}-${n}`
}

export function buildCaseFile(content: FitBriefContent): CaseFileGroup[] {
  const taken = new Set<string>()

  const asks: CaseFile[] = content.profileMatchSection.panels.flatMap(
    (panel, p) =>
      panel.rows.map((row, r) => ({
        id: uniqueId(slugify(row.requirement, `ask-${p}-${r}`), taken),
        group: 'asks' as const,
        title: row.requirement,
        tag: row.tierLabel,
        isMatch: row.isMatch,
        body: row.proof,
        factIds: row.factIds,
        related: [],
      }))
  )

  const work: CaseFile[] = content.roleMapSection.items.map((item, index) => ({
    id: uniqueId(slugify(item.id || item.tag, `work-${index}`), taken),
    group: 'work' as const,
    title: item.title,
    tag: item.tag,
    body: item.body,
    factIds: item.factIds,
    related: [],
  }))

  const project: CaseFile[] = content.spotlight.pillars.map(
    (pillar, index) => ({
      id: uniqueId(slugify(pillar.title, `project-${index}`), taken),
      group: 'project' as const,
      title: pillar.title,
      tag: index === 0 ? content.spotlight.statusBadge : undefined,
      body: pillar.body,
      factIds: pillar.factIds,
      related: [],
    })
  )

  /**
   * The gap is one file and it is always last.
   *
   * It carries no factIds — it is the one section that makes no claim about
   * what he has done — so it never acquires cross-links, which is correct: it
   * is an endpoint, not a route to more evidence.
   */
  const gap: CaseFile[] = [
    {
      id: uniqueId(slugify(content.gap.chip, 'gap'), taken),
      group: 'gap',
      title: content.gap.heading,
      tag: content.gap.chip,
      body: content.gap.body,
      factIds: [],
      related: [],
    },
  ]

  const groups: CaseFileGroup[] = [
    { id: 'asks', title: content.profileMatchSection.heading, files: asks },
    { id: 'work', title: content.roleMapSection.heading, files: work },
    { id: 'project', title: content.spotlight.heading, files: project },
    { id: 'gap', title: content.gap.heading, files: gap },
  ]

  linkByFact(groups)
  attachStats(groups, content.hero.stats)
  return groups
}

/**
 * Give a file the hero stat that rests on the same fact.
 *
 * The four hero stats are the most scannable thing in the whole brief — a
 * number and six words. Sitting in a band at the top they are read once;
 * attached to the file whose evidence they actually come from, they give that
 * file a focal point and the reader something that lands before any prose
 * does. First match wins, and a stat may appear on more than one file because
 * more than one file may genuinely rest on it.
 */
function attachStats(groups: CaseFileGroup[], stats: HeroStat[]): void {
  for (const file of flattenFiles(groups)) {
    if (!file.factIds.length) continue
    file.stat = stats.find(stat =>
      stat.factIds.some(id => file.factIds.includes(id))
    )
  }
}

/**
 * Fill in `related` from shared fact ids.
 *
 * Capped at two per file on purpose. A fact like "165M+ users at Runtastic"
 * is cited by half the brief, and a file offering nine places to go next is a
 * file nobody leaves — the point of the link is one obvious next step, not a
 * sitemap. Preference goes to a file in a *different* group, because that is
 * the jump the reader would not otherwise make.
 */
function linkByFact(groups: CaseFileGroup[]): void {
  const all = groups.flatMap(group => group.files)
  const byFact = new Map<string, CaseFile[]>()

  for (const file of all) {
    for (const fact of file.factIds) {
      const bucket = byFact.get(fact)
      if (bucket) bucket.push(file)
      else byFact.set(fact, [file])
    }
  }

  for (const file of all) {
    const neighbours = new Map<string, CaseFile>()
    for (const fact of file.factIds) {
      for (const other of byFact.get(fact) ?? []) {
        if (other.id !== file.id) neighbours.set(other.id, other)
      }
    }

    file.related = [...neighbours.values()]
      .sort((a, b) => {
        const across =
          Number(b.group !== file.group) - Number(a.group !== file.group)
        return across
      })
      .slice(0, 2)
      .map(other => other.id)
  }
}

/** Every file, in index order — for "open everything" and for counting. */
export function flattenFiles(groups: CaseFileGroup[]): CaseFile[] {
  return groups.flatMap(group => group.files)
}

export function findFile(
  groups: CaseFileGroup[],
  id: string | null
): CaseFile | undefined {
  if (!id) return undefined
  return flattenFiles(groups).find(file => file.id === id)
}
