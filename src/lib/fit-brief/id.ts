/**
 * Ids for generated briefs.
 *
 * Prisma's `cuid()` default only applies to rows created through Prisma, and in
 * production the row is created through the Worker, so the id is generated here
 * and used on both paths. `nanoid` is already a dependency.
 */

import { nanoid } from 'nanoid'

export function createId(): string {
  return `brf_${nanoid(16)}`
}
