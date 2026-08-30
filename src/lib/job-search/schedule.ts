/**
 * When a saved search is due, and what counts as new when it has run.
 *
 * Kept pure and separate from the route because these two decisions are the
 * ones that fail silently. A due-calculation that is subtly wrong runs a search
 * twice a night or never; a new-lead filter that is wrong emails him postings
 * he dismissed last week. Neither announces itself — the scheduler just becomes
 * something he stops trusting — so both are unit-tested rather than reasoned
 * about.
 */

import type { JobLeadView } from './schema'

export const FREQUENCIES = ['daily', 'every-2-days', 'weekly'] as const
export type Frequency = (typeof FREQUENCIES)[number]

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: 'Every day',
  'every-2-days': 'Every two days',
  weekly: 'Every week',
}

const FREQUENCY_DAYS: Record<Frequency, number> = {
  daily: 1,
  'every-2-days': 2,
  weekly: 7,
}

export interface DueCandidate {
  isActive: boolean
  frequency: string
  hourUtc: number
  lastRunAt: string | null
}

/**
 * Should this search run on this tick?
 *
 * The Worker ticks hourly and this decides, which is what makes a per-search
 * frequency real on a Vercel plan whose own cron only fires once a day.
 *
 * Two conditions, and the slack in the second one is deliberate:
 *
 * - The hour must match `hourUtc`, so an overnight search lands overnight.
 * - Enough days must have passed since the last run. The comparison allows an
 *   hour of slack (`- 1h`), because a run that started at 03:00:04 yesterday
 *   would otherwise not be "24 hours old" at 03:00:01 today and the search
 *   would silently skip to the next day, drifting later every time until it
 *   ran weekly by accident.
 */
export function isDue(search: DueCandidate, now: Date = new Date()): boolean {
  if (!search.isActive) return false
  if (now.getUTCHours() !== search.hourUtc) return false

  // Never run: due as soon as the hour comes round.
  if (!search.lastRunAt) return true

  const last = new Date(search.lastRunAt)
  if (Number.isNaN(last.getTime())) return true

  const days = FREQUENCY_DAYS[search.frequency as Frequency] ?? 1
  const elapsed = now.getTime() - last.getTime()

  return elapsed >= days * 86_400_000 - 3_600_000
}

/** When this search will next be considered, for display in the panel. */
export function nextRunAt(search: DueCandidate, now: Date = new Date()): Date {
  const days = FREQUENCY_DAYS[search.frequency as Frequency] ?? 1

  const at = (base: Date) => {
    const d = new Date(base)
    d.setUTCHours(search.hourUtc, 0, 0, 0)
    return d
  }

  if (!search.lastRunAt) {
    const today = at(now)
    return today > now ? today : new Date(today.getTime() + 86_400_000)
  }

  const last = new Date(search.lastRunAt)
  const earliest = at(new Date(last.getTime() + days * 86_400_000))
  return earliest > now ? earliest : at(new Date(now.getTime() + 86_400_000))
}

/**
 * Which of the stored leads this run should tell him about.
 *
 * Four conditions, each of which exists because its absence would send a mail
 * he should not get:
 *
 * - **Genuinely new.** `foundAt` is set on first discovery and left alone by
 *   the upsert, so a posting re-found tonight keeps its original timestamp and
 *   correctly does not qualify. Without this every run emails everything.
 * - **Still `new`.** A lead he already saved, dismissed or applied to is a
 *   decision he has made; re-raising it overrides him.
 * - **Not gone.** A posting that 404s cannot be applied to. `unverified` is
 *   kept — a board blocking a server request is not a closed role.
 * - **Above the bar.** Below `minScore` it is stored for the panel but not
 *   worth an interruption.
 */
export function digestLeads<
  T extends Pick<JobLeadView, 'foundAt' | 'state' | 'liveness' | 'leadScore'>,
>(leads: T[], since: string | null, minScore: number): T[] {
  const cutoff = since ? new Date(since).getTime() : 0

  return leads
    .filter(lead => {
      if (lead.state !== 'new') return false
      if (lead.liveness === 'gone') return false
      if (lead.leadScore < minScore) return false
      const found = new Date(lead.foundAt).getTime()
      if (Number.isNaN(found)) return false
      return found > cutoff
    })
    .sort((a, b) => b.leadScore - a.leadScore)
}

/**
 * Consecutive empty runs before a search is switched off.
 *
 * Five is roughly a working week of daily runs — long enough that a genuinely
 * quiet patch does not kill a good search, short enough that a badly worded one
 * is not still burning quota a month later.
 */
export const EMPTY_RUNS_BEFORE_PAUSE = 5
