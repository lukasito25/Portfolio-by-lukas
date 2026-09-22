/**
 * Propose a revision, in every language the document exists in. Save nothing.
 *
 * Two ways in, one mechanism: a typed instruction ("cut the hedging in
 * paragraph two"), or a check the validators raised, handed to the model as
 * something to resolve.
 *
 * The revision is made in the locale he is reading, then *mirrored* into the
 * others: each one is handed its own current text plus the fields that moved
 * in the source, and applies the equivalent change in its own language. Until
 * this existed a refinement landed in one locale only and the other two
 * silently kept the old wording — the worst kind of bug in something sent to a
 * recruiter, because the page reads as finished in whichever language you
 * happen to open. Mirroring rather than re-translating is what keeps hand
 * edits in the other locales intact.
 *
 * A locale that fails to mirror is reported and skipped, not fatal. A German
 * failure must not throw away a good revision and a good Italian mirror; the
 * panel says which locale did not come back.
 *
 * It deliberately does not write. The panel shows the diff and he accepts or
 * rejects it, then the accept goes through the normal PUT — which re-validates,
 * recomputes the checks and records the training pair. Writing here would put a
 * model edit into a document he downloads and sends without anyone having read
 * it, and would also duplicate the validation that PUT already does properly.
 *
 * The accepted revision is worth more to the generator than an ordinary hand
 * edit, because it arrives with his instruction attached: the diff shows what
 * changed, the instruction shows what he wanted. PUT stores both.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getProvider, estimateCostUsd } from '@/lib/ai'
import { FitBriefContentSchema, JobSpecSchema } from '@/lib/fit-brief/schema'
import { CvContentSchema, CoverLetterSchema } from '@/lib/documents/schema'
import {
  refineSystem,
  refinePrompt,
  mirrorSystem,
  mirrorPrompt,
  type RefineTarget,
} from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { recentEdits } from '@/lib/style/store'
import { buildEditLearningPrompt } from '@/lib/style/learning'
import { diffBriefContent } from '@/lib/style/learning'
import { diffCvContent, diffCoverLetter } from '@/lib/documents/diff'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

type RefineChange = ReturnType<typeof diffBriefContent>[number]

/** What happened in one locale, for the review panel. */
interface LocaleProposal {
  locale: string
  changes: RefineChange[]
  /** The locale he asked in — the one whose diff is expanded by default. */
  source: boolean
  failed: boolean
  reason?: string
}

const SCHEMAS = {
  brief: FitBriefContentSchema,
  cv: CvContentSchema,
  letter: CoverLetterSchema,
} as const

const FIELD = {
  brief: 'content',
  cv: 'cvContent',
  letter: 'coverLetter',
} as const

export async function POST(request: NextRequest, { params }: Params) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params

  try {
    const body = await request.json()
    const target = String(body.target || '') as RefineTarget
    const locale = String(body.locale || 'en') as Locale
    const instruction = String(body.instruction || '').trim()
    const warning =
      typeof body.warning === 'string' ? body.warning.trim() : undefined

    if (!(target in SCHEMAS)) {
      return NextResponse.json(
        { error: 'target must be brief, cv or letter' },
        { status: 400 }
      )
    }
    if (!(LOCALES as readonly string[]).includes(locale)) {
      return NextResponse.json(
        { error: `locale must be one of: ${LOCALES.join(', ')}` },
        { status: 400 }
      )
    }
    if (!instruction) {
      return NextResponse.json(
        { error: 'Say what you would like changed.' },
        { status: 400 }
      )
    }

    const brief = await dataService.getBriefById(id)
    if (!brief) {
      return NextResponse.json({ error: 'Brief not found' }, { status: 404 })
    }

    const store = (brief[FIELD[target]] ?? {}) as Record<string, unknown>
    const current = store[locale]
    if (!current) {
      return NextResponse.json(
        { error: `Nothing generated for ${locale.toUpperCase()} yet.` },
        { status: 409 }
      )
    }

    const schema = SCHEMAS[target]
    const before = schema.safeParse(current)
    if (!before.success) {
      return NextResponse.json(
        { error: 'The stored version is not valid — fix it by hand first.' },
        { status: 409 }
      )
    }

    const spec = JobSpecSchema.safeParse(brief.jobSpec)

    const editLearning = buildEditLearningPrompt(await recentEdits())

    const { value, usage } = await getProvider().generateStructured({
      schema,
      system: refineSystem(target, editLearning),
      prompt: refinePrompt(target, before.data, instruction, {
        spec: spec.success ? spec.data : undefined,
        warning,
      }),
      maxTokens: 24000,
    })

    // Which fields actually moved. The same diff functions the learning loop
    // uses, so what he is shown is exactly what would be recorded on accept —
    // no chance of the review screen and the training data disagreeing.
    const diffFor = (
      a: unknown,
      b: unknown,
      forLocale: string
    ): RefineChange[] =>
      target === 'brief'
        ? diffBriefContent(a as never, b as never, forLocale)
        : target === 'cv'
          ? diffCvContent(a as never, b as never, forLocale)
          : diffCoverLetter(a as never, b as never, forLocale)

    const changes = diffFor(before.data, value, locale)

    const proposed: Record<string, unknown> = { [locale]: value }
    const perLocale: LocaleProposal[] = [
      { locale, changes, source: true, failed: false },
    ]
    let totalUsage = usage

    /**
     * Mirror into the other locales.
     *
     * Skipped entirely when the source came back unchanged: there is nothing
     * to mirror, and three calls to say so would be three calls wasted.
     *
     * Sequential rather than parallel. Two locales at 24k output tokens each
     * is well inside `maxDuration`, and running them one at a time keeps the
     * agent suite to one request at a time — the same discipline the
     * translate step follows for the same reason.
     */
    if (changes.length) {
      for (const other of LOCALES) {
        if (other === locale) continue

        const existing = store[other]
        if (!existing) continue

        const parsedOther = schema.safeParse(existing)
        if (!parsedOther.success) {
          perLocale.push({
            locale: other,
            changes: [],
            source: false,
            failed: true,
            reason: `The stored ${other.toUpperCase()} version is not valid — fix it by hand, then ask again.`,
          })
          continue
        }

        try {
          const mirrored = await getProvider().generateStructured({
            schema,
            system: mirrorSystem(target, other, editLearning),
            prompt: mirrorPrompt(
              target,
              other,
              parsedOther.data,
              locale,
              changes,
              instruction,
              { spec: spec.success ? spec.data : undefined }
            ),
            maxTokens: 24000,
          })

          proposed[other] = mirrored.value
          perLocale.push({
            locale: other,
            changes: diffFor(parsedOther.data, mirrored.value, other),
            source: false,
            failed: false,
          })
          totalUsage = {
            inputTokens: totalUsage.inputTokens + mirrored.usage.inputTokens,
            outputTokens: totalUsage.outputTokens + mirrored.usage.outputTokens,
          }
        } catch (error) {
          // One language failing is not a reason to lose the others. The
          // panel names it and he can accept what did come back.
          console.error(
            `[application-engine] could not mirror the revision into ${other}:`,
            error
          )
          perLocale.push({
            locale: other,
            changes: [],
            source: false,
            failed: true,
            reason: `${other.toUpperCase()} could not be updated — accept this and ask again, or edit it by hand.`,
          })
        }
      }
    }

    return NextResponse.json({
      target,
      locale,
      instruction,
      // Every locale that came back, keyed for the PUT. `proposed` keeps the
      // source locale's object on its own for older clients.
      proposed: value,
      proposedByLocale: proposed,
      locales: perLocale,
      changes,
      unchanged: changes.length === 0,
      usage: totalUsage,
      costUsd: estimateCostUsd(totalUsage),
    })
  } catch (error) {
    return generationError(error)
  }
}
