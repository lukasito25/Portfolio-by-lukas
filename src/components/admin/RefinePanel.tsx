'use client'

/**
 * Say what you want changed; read the diff; accept or reject.
 *
 * The value here is not that a model can rewrite a paragraph — he can do that
 * himself, and faster. It is that the instruction is captured. A before/after
 * pair shows a sentence changing; "cut the hedging" says why, and the why is
 * what transfers to the next application. Every accepted refinement is stored
 * with its instruction and shown to the generator next time.
 *
 * Nothing is applied until he presses Accept. That is the same rule as
 * publishing, and for the same reason: these documents go out under his name,
 * so a model edit he has not read must never reach the file he downloads.
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, RefreshCw, Sparkles, X } from 'lucide-react'

export interface RefineChange {
  kind: string
  locale: string
  path: string
  before: string
  after: string
}

export interface RefineProposal {
  target: 'brief' | 'cv' | 'letter'
  locale: string
  instruction: string
  proposed: unknown
  changes: RefineChange[]
  unchanged: boolean
  costUsd?: number
}

const SUGGESTIONS: Record<'brief' | 'cv' | 'letter', string[]> = {
  brief: [
    'Make the opening warmer and less like a pitch',
    'Shorten the gap section — say it once, plainly',
  ],
  cv: [
    'Tighten the summary to two sentences',
    'Lead the adidas bullets with the requirements work',
  ],
  letter: [
    'Cut the hedging in the opening paragraph',
    'Make the close plainer — no formal sign-off language',
  ],
}

export function RefinePanel({
  target,
  locale,
  busy,
  proposal,
  error,
  onRefine,
  onAccept,
  onReject,
}: {
  target: 'brief' | 'cv' | 'letter'
  locale: string
  busy: boolean
  proposal: RefineProposal | null
  error: string | null
  onRefine: (instruction: string) => void
  onAccept: () => void
  onReject: () => void
}) {
  const [instruction, setInstruction] = useState('')

  const submit = () => {
    const trimmed = instruction.trim()
    if (trimmed) onRefine(trimmed)
  }

  /* -------------------------------------------------------------- *
   * Reviewing a proposal
   * -------------------------------------------------------------- */
  if (proposal) {
    return (
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4">
        <p className="mb-1 text-xs font-semibold tracking-wide text-indigo-900 uppercase">
          Proposed change
        </p>
        <p className="mb-3 text-sm text-gray-700 italic">
          “{proposal.instruction}”
        </p>

        {proposal.unchanged ? (
          <p className="mb-3 rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
            It came back identical — it judged the text already met the
            instruction. Try being more specific about which sentence, or edit
            the field directly.
          </p>
        ) : (
          <div className="mb-3 space-y-3">
            {proposal.changes.map((change, index) => (
              <div
                key={index}
                className="overflow-hidden rounded border border-gray-200 bg-white"
              >
                <p className="border-b border-gray-100 bg-gray-50 px-3 py-1 font-mono text-[11px] text-gray-500">
                  {change.path}
                </p>
                <div className="space-y-2 p-3 text-sm">
                  <p className="text-gray-500 line-through decoration-red-300">
                    {change.before}
                  </p>
                  <p className="text-gray-900">{change.after}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {!proposal.unchanged && (
            <Button size="sm" onClick={onAccept}>
              <Check className="mr-1 h-4 w-4" />
              Accept {proposal.changes.length} change
              {proposal.changes.length === 1 ? '' : 's'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onReject}>
            <X className="mr-1 h-4 w-4" />
            {proposal.unchanged ? 'Close' : 'Reject'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => onRefine(proposal.instruction)}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${busy ? 'animate-spin' : ''}`}
            />
            Try again
          </Button>
          {typeof proposal.costUsd === 'number' && (
            <span className="ml-auto text-xs text-gray-400">
              ${proposal.costUsd.toFixed(4)}
            </span>
          )}
        </div>

        {!proposal.unchanged && (
          <p className="mt-3 text-xs text-gray-500">
            Accepting saves the change and records your instruction alongside
            it, so the next application starts closer to this.
          </p>
        )}
      </div>
    )
  }

  /* -------------------------------------------------------------- *
   * Asking for one
   * -------------------------------------------------------------- */
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
        <Sparkles className="h-3.5 w-3.5" />
        Ask for a change
      </p>

      <textarea
        value={instruction}
        rows={2}
        placeholder={`What should change about this ${
          target === 'cv' ? 'CV' : target === 'letter' ? 'cover letter' : 'page'
        }? Name the part you mean.`}
        onChange={e => setInstruction(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
        }}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={busy || !instruction.trim()}
          onClick={submit}
        >
          {busy ? (
            <>
              <RefreshCw className="mr-1 h-4 w-4 animate-spin" />
              Thinking…
            </>
          ) : (
            <>
              <Sparkles className="mr-1 h-4 w-4" />
              Propose a change
            </>
          )}
        </Button>
        <span className="text-xs text-gray-400">
          {locale.toUpperCase()} · ⌘↵ · you review before anything is saved
        </span>
      </div>

      {!instruction && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS[target].map(text => (
            <button
              key={text}
              type="button"
              onClick={() => setInstruction(text)}
              className="rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-900 hover:text-gray-900"
            >
              {text}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  )
}
