/**
 * A stable identity for one check.
 *
 * Warnings are not stored — they are recomputed from the validators every time
 * anything is saved, which is what lets an edit that fixes a problem clear its
 * own warning. That also means a warning object has no id to dismiss it by, and
 * no two runs produce the same object.
 *
 * The key is what a dismissal is recorded against, so it must identify "this
 * check, about this field" and nothing more. Deliberately excluding the
 * message: validators get reworded, and a dismissal should survive that. Code
 * plus locale plus path is the finest distinction that stays true across a
 * rephrasing.
 */

import type { BriefWarning } from './schema'

export function warningKey(warning: {
  code: string
  locale?: string
  path?: string
}): string {
  return [warning.code, warning.locale ?? '', warning.path ?? ''].join('|')
}

/**
 * Drop the checks he has already reviewed and accepted.
 *
 * Applied after recomputation, never before: the validators stay honest and
 * keep producing the full list, and this is purely a presentation decision made
 * one layer out. A dismissal that made the validator stop looking would be a
 * way to quietly disable the honesty layer.
 */
export function withoutDismissed(
  warnings: BriefWarning[],
  dismissed: string[]
): BriefWarning[] {
  if (!dismissed.length) return warnings
  const set = new Set(dismissed)
  return warnings.filter(w => !set.has(warningKey(w)))
}
