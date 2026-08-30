/**
 * The cheap score, the one that runs before anything is written.
 *
 * `src/lib/fit-brief/fit-score.ts` answers the same question properly: it reads
 * the finished brief's own requirement rows, counts the direct matches, and
 * costs a model call per application. It cannot run here — there is no brief
 * yet, which is the whole point of this step.
 *
 * So this is a triage, and it is honest about being one. One call scores the
 * whole result set, which keeps a search at three model calls regardless of how
 * many postings come back; the bands and the blocker rules are imported from
 * the real scorer rather than restated, so the two numbers stay on one scale.
 *
 * It is deliberately biased toward "skip". The consequence of a false skip is a
 * posting he does not apply to; the consequence of a false apply is an hour and
 * a model spend on a brief that was never going to land. Those are not the same
 * size of mistake.
 */

import {
  bandFor,
  HARD_BLOCKER_CEILING,
  type FitAssessment,
} from '@/lib/fit-brief/fit-score'
import { addUsage, emptyUsage, type AIProvider, type Usage } from '@/lib/ai'
import { LEAD_SCORE_SYSTEM, leadScorePrompt } from './prompts'
import { LeadScoreListSchema, type LeadScore } from './schema'
import type { VerifiedHit } from './verify'

/** A hit with its score attached. Every hit gets one, scored or not. */
export interface ScoredHit extends VerifiedHit {
  leadScore: number
  band: FitAssessment['band']
  recommendation: LeadScore['recommendation']
  hardBlocker: string
  scoreDetail: { verdict: string; drivers: string[]; risks: string[] }
}

/**
 * The score a hit gets when the model returned nothing for it.
 *
 * Not zero, and not a guess either: an unscored posting is unknown, and the
 * panel says so. Ranking it at the bottom with a "could not score" verdict is
 * the only reading that neither hides it nor recommends it.
 */
function unscored(hit: VerifiedHit): ScoredHit {
  return {
    ...hit,
    leadScore: 0,
    band: 'long-shot',
    recommendation: 'apply-if-time',
    hardBlocker: '',
    scoreDetail: {
      verdict:
        'Not scored — the triage pass returned no entry for this posting. Open it and judge it yourself.',
      drivers: [],
      risks: [],
    },
  }
}

/**
 * Apply the ceiling in code, not only in the prompt.
 *
 * The prompt says a named hard blocker caps the score at 19. Saying it twice is
 * cheaper than a 62 sitting directly above the line "requires professional
 * German", which is the exact shape of the mistake this exists to prevent —
 * and the band is recomputed from the capped number so the label and the
 * number can never tell two different stories.
 */
function clamp(
  raw: LeadScore
): Pick<ScoredHit, 'leadScore' | 'band' | 'recommendation' | 'hardBlocker'> {
  const score = Math.max(0, Math.min(100, Math.round(raw.score)))
  const blocker = raw.hardBlocker.trim()
  const capped = blocker ? Math.min(score, HARD_BLOCKER_CEILING) : score

  return {
    leadScore: capped,
    band: bandFor(capped),
    // A capped score contradicts an "apply" recommendation. The score is the
    // number he will act on, so the recommendation follows it rather than the
    // other way round.
    recommendation:
      blocker && raw.recommendation === 'apply' ? 'skip' : raw.recommendation,
    hardBlocker: blocker,
  }
}

/**
 * Postings per scoring call.
 *
 * The fan-out turned a typical result set from five postings into twenty or
 * forty, and scoring was already the slowest phase of a search at ~40s for
 * five. One call over forty would be slower still and more likely to come back
 * truncated, so the set is split and the batches run at the same time — the
 * same trade the sweeps themselves make.
 *
 * Twenty is chosen because the profile prompt is fixed overhead paid per batch:
 * smaller batches mean more copies of it for no benefit.
 */
const BATCH_SIZE = 20

/** Score one batch. Returns the raw entries, keyed later by url. */
async function scoreBatch(
  batch: VerifiedHit[],
  provider: AIProvider
): Promise<{ scores: LeadScore[]; usage: Usage }> {
  const { value, usage } = await provider.generateStructured({
    schema: LeadScoreListSchema,
    system: LEAD_SCORE_SYSTEM,
    prompt: leadScorePrompt(batch),
    maxTokens: 16000,
  })
  return { scores: value.scores, usage }
}

export async function scoreLeads(
  hits: VerifiedHit[],
  provider: AIProvider
): Promise<{ scored: ScoredHit[]; usage: Usage }> {
  if (hits.length === 0) return { scored: [], usage: emptyUsage() }

  const batches: VerifiedHit[][] = []
  for (let i = 0; i < hits.length; i += BATCH_SIZE) {
    batches.push(hits.slice(i, i + BATCH_SIZE))
  }

  // A failed batch must not lose the postings in the other batches — those
  // hits simply come back unscored, which `unscored()` already renders
  // honestly rather than hiding.
  const results = await Promise.all(
    batches.map(batch =>
      scoreBatch(batch, provider).catch(error => {
        console.error('[job-search] scoring batch failed:', error)
        return { scores: [] as LeadScore[], usage: emptyUsage() }
      })
    )
  )

  let usage = emptyUsage()
  const byUrl = new Map<string, LeadScore>()
  for (const result of results) {
    usage = addUsage(usage, result.usage)
    for (const score of result.scores) byUrl.set(score.url, score)
  }

  const scored = hits.map(hit => {
    const raw = byUrl.get(hit.url)
    if (!raw) return unscored(hit)

    return {
      ...hit,
      ...clamp(raw),
      scoreDetail: {
        verdict: raw.verdict,
        drivers: raw.drivers,
        risks: raw.risks,
      },
    }
  })

  // Best first. A posting that has been taken down sinks below everything that
  // is still open at the same score — it cannot be applied to.
  scored.sort((a, b) => {
    const goneA = a.liveness === 'gone' ? 1 : 0
    const goneB = b.liveness === 'gone' ? 1 : 0
    if (goneA !== goneB) return goneA - goneB
    return b.leadScore - a.leadScore
  })

  return { scored, usage }
}
