/**
 * Persistence for the edit-learning loop.
 *
 * Server-only. Storage follows the brief itself — local SQLite in development,
 * D1 everywhere else — because an edit belongs next to the material it
 * describes; splitting them would put the training signal in one database and
 * the brief it came from in another.
 *
 * This was Prisma-only until the generator moved to Cloud Run. Generation then
 * ran on Vercel, where `file:./dev.db` does not exist, and the pipeline died on
 * `prisma.applicationEdit.findMany()` with SQLite error 14. The comment here
 * used to say a D1 path would be needed "if the engine is ever driven from a
 * deployed environment" — it now is, so this goes through `DataService`, which
 * owns that choice for every other table.
 *
 * Reads are deliberately **non-fatal**. Edit learning improves a draft; it is
 * not required to produce one. A generation that runs for minutes must never
 * die because an optional prompt enrichment could not be fetched — that trade
 * is what turned a missing table into a failed application.
 */

import { dataService } from '@/lib/data-service'
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
 *
 * Unlike the reads, this throws. Losing an edit silently would degrade the
 * model's picture of his voice with nothing to show why, and the caller is a
 * save action that can report the failure to someone looking at the screen.
 */
export async function recordEdits(
  briefId: string,
  pairs: EditPair[]
): Promise<number> {
  assertServer()
  if (!pairs.length) return 0

  return dataService.recordApplicationEdits(
    briefId,
    pairs.map(pair => ({
      kind: pair.kind,
      locale: pair.locale,
      path: pair.path,
      before: pair.before,
      after: pair.after,
    }))
  )
}

/**
 * The most recent edits, newest first, for feeding back into generation.
 *
 * Deliberately not filtered to one locale: how he tightens an English sentence
 * tells the model something useful when it writes the German one too.
 *
 * Returns [] rather than throwing if the store is unreachable. The caller
 * builds a prompt fragment out of this, and an empty fragment simply means the
 * draft is written without edit examples — the same as the very first run.
 */
export async function recentEdits(limit = 12): Promise<EditPair[]> {
  assertServer()

  try {
    const rows = await dataService.recentApplicationEdits(limit)
    return rows.map(row => ({
      kind: row.kind as EditPair['kind'],
      locale: row.locale,
      path: row.path,
      before: row.before,
      after: row.after,
    }))
  } catch (error) {
    console.error(
      '[edit-learning] Could not read past edits; generating without them.',
      error
    )
    return []
  }
}

/** Everything not yet folded into the style rules, for a distillation run. */
export async function undistilledEdits(): Promise<
  (EditPair & { id: string })[]
> {
  assertServer()

  const rows = await dataService.undistilledApplicationEdits()
  return rows.map(row => ({
    id: row.id ?? '',
    kind: row.kind as EditPair['kind'],
    locale: row.locale,
    path: row.path,
    before: row.before,
    after: row.after,
  }))
}

export async function markDistilled(ids: string[]): Promise<void> {
  assertServer()
  await dataService.markApplicationEditsDistilled(ids)
}

export async function editCount(): Promise<number> {
  assertServer()
  try {
    return await dataService.applicationEditCount()
  } catch {
    return 0
  }
}
