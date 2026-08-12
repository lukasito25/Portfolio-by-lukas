/**
 * Persistence for the edit-learning loop.
 *
 * Server-only, and local-SQLite-only by design: edits are a private training
 * signal, they accumulate slowly, and there is no reason for them to leave the
 * machine. If the engine is ever driven from a deployed environment this needs
 * a D1 path — the migration already creates the table there.
 */

import { prisma } from '@/lib/prisma'
import type { EditPair } from './learning'

const isBrowser = typeof window !== 'undefined'

function assertServer() {
  if (isBrowser) {
    throw new Error('The edit store is server-only')
  }
}

/**
 * Record the edits made to one brief, replacing any previous record for the
 * same paths.
 *
 * Replacing rather than appending: the interesting comparison is always
 * "generated → what he settled on", so a second pass over the same sentence
 * should overwrite the first, not add a second data point pulling toward an
 * intermediate draft.
 */
export async function recordEdits(
  briefId: string,
  pairs: EditPair[]
): Promise<number> {
  assertServer()
  if (!pairs.length) return 0

  await prisma.$transaction([
    prisma.applicationEdit.deleteMany({
      where: { briefId, path: { in: pairs.map(p => p.path) } },
    }),
    prisma.applicationEdit.createMany({
      data: pairs.map(pair => ({
        briefId,
        kind: pair.kind,
        locale: pair.locale,
        path: pair.path,
        before: pair.before,
        after: pair.after,
      })),
    }),
  ])

  return pairs.length
}

/**
 * The most recent edits, newest first, for feeding back into generation.
 *
 * Deliberately not filtered to one locale: how he tightens an English sentence
 * tells the model something useful when it writes the German one too.
 */
export async function recentEdits(limit = 12): Promise<EditPair[]> {
  assertServer()

  const rows = await prisma.applicationEdit.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return rows.map(row => ({
    kind: row.kind as EditPair['kind'],
    locale: row.locale,
    path: row.path,
    before: row.before,
    after: row.after,
  }))
}

/** Everything not yet folded into the style rules, for a distillation run. */
export async function undistilledEdits(): Promise<
  (EditPair & { id: string })[]
> {
  assertServer()

  const rows = await prisma.applicationEdit.findMany({
    where: { distilled: false },
    orderBy: { createdAt: 'asc' },
  })

  return rows.map(row => ({
    id: row.id,
    kind: row.kind as EditPair['kind'],
    locale: row.locale,
    path: row.path,
    before: row.before,
    after: row.after,
  }))
}

export async function markDistilled(ids: string[]): Promise<void> {
  assertServer()
  if (!ids.length) return
  await prisma.applicationEdit.updateMany({
    where: { id: { in: ids } },
    data: { distilled: true },
  })
}

export async function editCount(): Promise<number> {
  assertServer()
  return prisma.applicationEdit.count()
}
