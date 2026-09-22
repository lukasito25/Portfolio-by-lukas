/**
 * Carry a change that was made in one language into the others.
 *
 * The three locales of an application are counterparts, not three independent
 * documents: one is written in the posting's language and the others are
 * translated from it. A change made in one of them is therefore not finished
 * until the other two say the same thing — and before this existed they
 * silently did not, whether the change came from the refine box or from typing
 * into the JSON editor. That is the worst kind of error in something sent to a
 * recruiter, because each page reads as complete in whatever language you
 * happen to open.
 *
 * Mirroring, not re-translating. Each locale is handed its own current text
 * plus the fields that moved in the source, and returns everything else
 * byte-identical. Re-translating the revised document wholesale would be one
 * call cheaper and would overwrite whatever has already been edited by hand in
 * Italian or German — the work the edit-learning loop most wants to keep.
 */

import type * as z from 'zod/v4'
import { getProvider } from '@/lib/ai'
import { mirrorSystem, mirrorPrompt, type RefineTarget } from './prompts'
import { LOCALES, type Locale } from './guardrails'
import type { JobSpec } from './schema'
import type { StringChange } from './mirror-diff'

/** What happened in one locale, for the review panel. */
export interface LocaleProposal {
  locale: string
  changes: Array<{ path: string; before: string; after: string }>
  /** The locale the change was made in — the one whose diff is expanded. */
  source: boolean
  failed: boolean
  reason?: string
}

/**
 * What the mirror is told when there is no instruction — a hand edit in the
 * JSON editor rather than a typed request. Saying so is better than saying
 * nothing: the model is told to read the intent out of the diff rather than
 * looking for an instruction that is not there.
 */
const HAND_EDIT =
  'No instruction was given — this was edited by hand. Read what was intended from the change itself and make the same change here.'

export interface MirrorResult {
  /** Every locale that came back, keyed for the PUT. */
  proposed: Record<string, unknown>
  perLocale: LocaleProposal[]
  usage: { inputTokens: number; outputTokens: number }
}

/**
 * A mirror may not change a citation.
 *
 * Which fact a sentence rests on is not a language matter — the three locales
 * cite the same corpus, and the source locale is the authority on what this
 * sentence claims. Left to itself a model will happily re-pick one: asked to
 * carry a changed stat label into German it also swapped `runtastic.users` for
 * another id, because the label it was given no longer matched the number
 * beside it. `validate.ts` catches an id that does not exist; it cannot catch a
 * real id attached to the wrong claim, and a brief that cites a different fact
 * in German than in English is exactly the drift this whole feature exists to
 * remove.
 *
 * So the source's `factIds` are copied back over the mirror's wherever the two
 * line up structurally. Everything else the model wrote is left alone and
 * shown for review — a neighbouring word often does have to move for the
 * grammar of another language, and reverting that would produce broken German.
 */
function alignFactIds(source: unknown, mirrored: unknown): void {
  if (!source || !mirrored) return
  if (typeof source !== 'object' || typeof mirrored !== 'object') return

  if (Array.isArray(source) || Array.isArray(mirrored)) {
    if (!Array.isArray(source) || !Array.isArray(mirrored)) return
    for (let i = 0; i < Math.min(source.length, mirrored.length); i++) {
      alignFactIds(source[i], mirrored[i])
    }
    return
  }

  const a = source as Record<string, unknown>
  const b = mirrored as Record<string, unknown>
  for (const key of Object.keys(b)) {
    if (key === 'factIds') {
      if (Array.isArray(a.factIds)) b.factIds = [...a.factIds]
      continue
    }
    alignFactIds(a[key], b[key])
  }
}

export async function mirrorIntoOtherLocales<S extends z.ZodType>({
  target,
  schema,
  sourceLocale,
  sourceValue,
  changes,
  instruction,
  store,
  spec,
  editLearning,
  diff,
}: {
  target: RefineTarget
  schema: S
  sourceLocale: Locale
  sourceValue: unknown
  changes: StringChange[]
  /** What he asked for, when the change came from the refine box. */
  instruction?: string
  /** The stored locale map this document lives in. */
  store: Record<string, unknown>
  /** The posting, as context for how a phrase should land. */
  spec?: JobSpec
  editLearning?: string
  /** How to describe what moved in a mirrored locale, for the review screen. */
  diff: (before: unknown, after: unknown) => StringChange[]
}): Promise<MirrorResult> {
  const proposed: Record<string, unknown> = { [sourceLocale]: sourceValue }
  const perLocale: LocaleProposal[] = [
    { locale: sourceLocale, changes, source: true, failed: false },
  ]
  const usage = { inputTokens: 0, outputTokens: 0 }

  if (!changes.length) return { proposed, perLocale, usage }

  /**
   * Sequential rather than parallel. Two locales at 24k output tokens each is
   * well inside `maxDuration`, and one request at a time is the same
   * discipline the translate step follows, for the same reason.
   */
  for (const other of LOCALES) {
    if (other === sourceLocale) continue

    // A language this document does not exist in yet is not a failure. It also
    // means a single-language document costs exactly what it did before.
    const existing = store[other]
    if (!existing) continue

    const parsed = schema.safeParse(existing)
    if (!parsed.success) {
      perLocale.push({
        locale: other,
        changes: [],
        source: false,
        failed: true,
        reason: `The stored ${other.toUpperCase()} version is not valid — fix it by hand, then try again.`,
      })
      continue
    }

    try {
      const result = await getProvider().generateStructured({
        schema,
        system: mirrorSystem(target, other, editLearning),
        prompt: mirrorPrompt(
          target,
          other,
          parsed.data,
          sourceLocale,
          changes,
          instruction ?? HAND_EDIT,
          { spec }
        ),
        maxTokens: 24000,
      })

      // Before it is diffed, so a citation the model moved never even shows
      // up as a change he could accept.
      alignFactIds(sourceValue, result.value)

      proposed[other] = result.value
      perLocale.push({
        locale: other,
        changes: diff(parsed.data, result.value),
        source: false,
        failed: false,
      })
      usage.inputTokens += result.usage.inputTokens
      usage.outputTokens += result.usage.outputTokens
    } catch (error) {
      // One language failing is not a reason to lose the others. The panel
      // names it and he can accept what did come back.
      console.error(
        `[application-engine] could not mirror the change into ${other}:`,
        error
      )
      perLocale.push({
        locale: other,
        changes: [],
        source: false,
        failed: true,
        reason: `${other.toUpperCase()} could not be updated — accept this and try again, or edit it by hand.`,
      })
    }
  }

  return { proposed, perLocale, usage }
}
