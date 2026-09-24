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
  type RefineTarget,
} from '@/lib/fit-brief/prompts'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import { mirrorIntoOtherLocales } from '@/lib/fit-brief/mirror'
import { diffStringLeaves } from '@/lib/fit-brief/mirror-diff'
import { requireAdmin, generationError } from '@/lib/fit-brief/server'
import { dataService } from '@/lib/data-service'
import { recentEdits } from '@/lib/style/store'
import { buildEditLearningPrompt } from '@/lib/style/learning'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

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

    /**
     * What actually moved.
     *
     * Every string leaf, not the prose-only paths the learning loop compares:
     * a revised stat label or a row added to the role map has to be mirrored
     * and has to be visible on the review screen, even though neither teaches
     * the generator anything about his voice. The training pairs recorded on
     * accept stay prose-only, and are a subset of what is shown here.
     */
    const changes = diffStringLeaves(before.data, value)

    const mirrored = await mirrorIntoOtherLocales({
      target,
      schema,
      sourceLocale: locale,
      sourceValue: value,
      changes,
      instruction,
      store,
      spec: spec.success ? spec.data : undefined,
      editLearning,
      diff: diffStringLeaves,
    })

    return NextResponse.json({
      target,
      locale,
      instruction,
      // `proposed` keeps the source locale's object on its own for clients
      // that predate mirroring.
      proposed: value,
      proposedByLocale: mirrored.proposed,
      locales: mirrored.perLocale,
      changes,
      unchanged: changes.length === 0,
      usage: {
        inputTokens: usage.inputTokens + mirrored.usage.inputTokens,
        outputTokens: usage.outputTokens + mirrored.usage.outputTokens,
      },
      costUsd: estimateCostUsd({
        inputTokens: usage.inputTokens + mirrored.usage.inputTokens,
        outputTokens: usage.outputTokens + mirrored.usage.outputTokens,
      }),
    })
  } catch (error) {
    return generationError(error)
  }
}
