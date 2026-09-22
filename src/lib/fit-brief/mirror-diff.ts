/**
 * Every string that differs between two versions of the same document.
 *
 * Deliberately not `diffBriefContent` from the learning loop, which compares a
 * fixed list of prose paths because a changed tier label says nothing about
 * his voice. Mirroring has the opposite requirement: a label, a stat, a chip
 * or a row added to the role map all have to reach the other languages, and a
 * diff that quietly ignored them would leave exactly the drift this is meant
 * to remove. Training data stays prose-only; what is mirrored, and what the
 * review screen shows, is everything.
 *
 * Arrays are compared by index, which is right for these documents: the rows
 * of a role map are a sequence, not a set, and the locales hold the same
 * sequence in the same order. An entry with no counterpart is reported with an
 * empty side, so an addition or a removal travels too.
 */

export interface StringChange {
  path: string
  before: string
  after: string
}

const MAX_CHANGES = 200

function walk(
  before: unknown,
  after: unknown,
  path: string,
  out: StringChange[]
): void {
  if (out.length >= MAX_CHANGES) return

  if (typeof before === 'string' || typeof after === 'string') {
    const a = typeof before === 'string' ? before : ''
    const b = typeof after === 'string' ? after : ''
    if (a.trim() !== b.trim()) out.push({ path, before: a, after: b })
    return
  }

  if (Array.isArray(before) || Array.isArray(after)) {
    const a = Array.isArray(before) ? before : []
    const b = Array.isArray(after) ? after : []
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      walk(a[i], b[i], `${path}[${i}]`, out)
    }
    return
  }

  if (
    (before && typeof before === 'object') ||
    (after && typeof after === 'object')
  ) {
    const a = (before ?? {}) as Record<string, unknown>
    const b = (after ?? {}) as Record<string, unknown>
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
      walk(a[key], b[key], path ? `${path}.${key}` : key, out)
    }
  }
}

export function diffStringLeaves(
  before: unknown,
  after: unknown
): StringChange[] {
  const out: StringChange[] = []
  walk(before, after, '', out)
  return out
}
