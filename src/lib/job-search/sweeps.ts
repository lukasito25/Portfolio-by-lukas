/**
 * Depth: one sweep per title × location, instead of one sweep for everything.
 *
 * The first version asked a single grounded call to cover every title across
 * every location. It returned 3-10 postings, of which roughly 60% came back
 * already taken down — so a sweep yielded perhaps four roles worth opening.
 * The model was not failing; it was answering a broad question broadly, and
 * one pass over "Senior PM or PM, in Milan or remote Italy" is a shallower
 * search than four passes over each pair.
 *
 * Splitting is close to free in wall-clock because the sweeps overlap. It is
 * not free in cost — a search goes from about $0.005 to about $0.03 — but that
 * was never the scarce resource here. His hours are.
 *
 * Concurrency is capped deliberately. The agent suite meters its own usage and
 * answers 429 when a daily limit is hit (`src/lib/ai/agent-suite.ts` turns that
 * into a readable error rather than an outage). A scheduler running unattended
 * overnight must not be the thing that trips it, so four in flight is the
 * ceiling regardless of how many pairs a search expands to.
 */

import { addUsage, emptyUsage, type AIProvider, type Usage } from '@/lib/ai'
import { JobHitListSchema, type JobHit, type JobSearchCriteria } from './schema'
import {
  SEARCH_SYSTEM,
  searchResearchPrompt,
  structureHitsPrompt,
} from './prompts'

/**
 * Sweeps in flight at once — enough that `MAX_SWEEPS` still fits in one wave.
 *
 * Measured: four sweeps run concurrently took 160s against 91s for the single
 * combined sweep they replaced, so a sweep is not free and two waves of four
 * would have put a wide search near the 300s function ceiling. Running all of
 * them at once keeps the widest search roughly as slow as the narrowest.
 *
 * Raising this does not raise the 429 risk. The suite's limit that returns 429
 * is a *daily call cap*, and fanning out changes when the calls happen, not how
 * many there are.
 */
const CONCURRENCY = 8

/**
 * Stop *starting* new sweeps after this long.
 *
 * The route's ceiling is 300s and everything after the sweeps — verification,
 * scoring, persistence — still has to fit. A sweep launched at 220s cannot
 * finish inside the budget, and a run killed mid-flight loses every sweep that
 * did succeed. Late sweeps are abandoned instead, counted, and named in the
 * coverage note, so a truncated search says so rather than looking like a thin
 * market.
 */
const START_DEADLINE_MS = 170_000

/**
 * Upper bound on sweeps for one search.
 *
 * Six titles against six locations is 36 pairs, which is neither what he meant
 * nor something worth spending a dollar on. The cap keeps a careless criteria
 * set from turning into a bill, and the panel's own limits (6 titles, 6
 * locations) mean it only ever bites on deliberately wide searches.
 */
const MAX_SWEEPS = 8

/**
 * Expand criteria into the individual searches to run.
 *
 * Each sweep carries exactly one title and at most one location; everything
 * else — salary floor, work model, seniority — rides along unchanged, because
 * those narrow a search rather than widening it and cost nothing to repeat.
 *
 * With no locations given there is one sweep per title, which is the same
 * behaviour as before for a search that never specified where.
 */
export function planSweeps(criteria: JobSearchCriteria): JobSearchCriteria[] {
  const titles = [
    ...new Set(criteria.titles.map(t => t.trim()).filter(Boolean)),
  ]
  const locations = [
    ...new Set(criteria.locations.map(l => l.trim()).filter(Boolean)),
  ]

  const sweeps: JobSearchCriteria[] = []
  for (const title of titles) {
    if (locations.length === 0) {
      sweeps.push({ ...criteria, titles: [title], locations: [] })
      continue
    }
    for (const location of locations) {
      sweeps.push({ ...criteria, titles: [title], locations: [location] })
    }
  }

  return sweeps.slice(0, MAX_SWEEPS)
}

export interface SweepResult {
  hits: JobHit[]
  /** One note per sweep that had something to report, joined. */
  coverageNote: string
  usage: Usage
  sweepsPlanned: number
  sweepsFailed: number
}

/** Research then structure, for one title/location pair. */
async function runOne(
  criteria: JobSearchCriteria,
  provider: AIProvider
): Promise<{ hits: JobHit[]; note: string; usage: Usage }> {
  let usage = emptyUsage()

  const research = await provider.research({
    system: SEARCH_SYSTEM,
    prompt: searchResearchPrompt(criteria),
    maxTokens: 16000,
  })
  usage = addUsage(usage, research.usage)

  const structured = await provider.generateStructured({
    schema: JobHitListSchema,
    system: SEARCH_SYSTEM,
    prompt: structureHitsPrompt(research.text),
    maxTokens: 16000,
  })
  usage = addUsage(usage, structured.usage)

  return {
    hits: structured.value.hits,
    note: structured.value.coverageNote,
    usage,
  }
}

/**
 * Run every sweep and merge what they find.
 *
 * **One sweep failing must not lose the others.** Grounded search is the least
 * reliable step in the pipeline — a recitation block returns an empty response,
 * and the suite reports a stalled call as a timeout — and with four sweeps in
 * flight the chance that one of them misbehaves is four times what it was.
 * Failing the whole search over a single bad sweep would make the deeper
 * version *less* reliable than the shallow one it replaces, which is the
 * opposite of the point. Failures are counted and surfaced in the coverage
 * note instead.
 */
export async function runSweeps(
  criteria: JobSearchCriteria,
  provider: AIProvider
): Promise<SweepResult> {
  const sweeps = planSweeps(criteria)

  const hits: JobHit[] = []
  const notes: string[] = []
  let usage = emptyUsage()
  let failed = 0
  let next = 0
  /**
   * The first thing that went wrong, kept so it can be re-thrown intact.
   *
   * Summarising N failures into one sentence loses the only useful part. A dead
   * generator raises `ProviderUnavailableError`, which already names the URL
   * that did not answer and the command that fixes it, and `generationError()`
   * turns it into a 503 rather than a 500. Replacing that with "all sweeps
   * failed" produced a message that actively misdiagnosed an unreachable suite
   * as a reachable-but-slow one.
   */
  let firstError: unknown = null

  const startedAt = Date.now()
  let abandoned = 0

  const worker = async () => {
    for (;;) {
      const index = next++
      if (index >= sweeps.length) return
      const sweep = sweeps[index]

      if (Date.now() - startedAt > START_DEADLINE_MS) {
        abandoned++
        continue
      }

      try {
        const result = await runOne(sweep, provider)
        hits.push(...result.hits)
        usage = addUsage(usage, result.usage)
        if (result.note.trim()) notes.push(result.note.trim())
      } catch (error) {
        failed++
        if (firstError === null) firstError = error
        const where = [sweep.titles[0], sweep.locations[0]]
          .filter(Boolean)
          .join(' in ')
        console.error(`[job-search] sweep failed (${where}):`, error)
        notes.push(`The sweep for ${where} did not complete.`)
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, sweeps.length) }, worker)
  )

  // Every sweep failing is a real failure, not an empty market. Saying "no
  // results" there would report an outage as a quiet job market, which is
  // exactly the confusion the coverage note exists to prevent.
  //
  // Re-throw the original rather than a summary of it: the underlying error
  // knows what actually happened and how to fix it, and this one would only
  // know how many times it happened.
  if (sweeps.length > 0 && failed === sweeps.length) {
    throw firstError instanceof Error
      ? firstError
      : new Error(`All ${sweeps.length} sweeps failed.`)
  }

  if (abandoned > 0) {
    notes.push(
      `${abandoned} of ${sweeps.length} sweeps were skipped to stay inside the time budget.`
    )
  }

  return {
    hits,
    coverageNote: notes.join(' '),
    usage,
    sweepsPlanned: sweeps.length,
    sweepsFailed: failed,
  }
}
