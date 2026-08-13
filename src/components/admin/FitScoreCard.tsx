'use client'

/**
 * Should he spend the hour on this one?
 *
 * The engine made applying cheap, and cheap applying is how a job hunt becomes
 * unpaid data entry. This is the counterweight — and it only works if it is
 * willing to say no, which is why the design leans away from the things that
 * make a number feel good.
 *
 * Nothing here is a gauge or a progress bar filling toward 100. A score is a
 * probability of reaching a first interview, and 45 is a perfectly good one;
 * a bar three-tenths full reads as failure and would quietly push him toward
 * applying to everything, which is the behaviour this exists to prevent.
 *
 * The arithmetic the score was derived from is shown next to it, because a
 * number he cannot audit is a number he will either over-trust or ignore.
 */

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertTriangle, Check, Minus, RefreshCw, Target, X } from 'lucide-react'

export interface FitAssessmentView {
  score: number
  band: 'strong' | 'credible' | 'stretch' | 'long-shot'
  recommendation: 'apply' | 'apply-if-time' | 'skip'
  verdict: string
  mustHaves: {
    requirement: string
    status: 'met' | 'partial' | 'unmet'
    note: string
  }[]
  drivers: string[]
  risks: string[]
  hardBlocker: string
  coverage?: {
    directMatches: number
    transferable: number
    totalRows: number
    mustHaves: number
    niceToHaves: number
  }
  scoredAt?: string
}

const BAND_STYLE: Record<FitAssessmentView['band'], string> = {
  strong: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  credible: 'text-blue-700 bg-blue-50 border-blue-200',
  stretch: 'text-amber-700 bg-amber-50 border-amber-200',
  'long-shot': 'text-rose-700 bg-rose-50 border-rose-200',
}

const BAND_LABEL: Record<FitAssessmentView['band'], string> = {
  strong: 'Strong fit',
  credible: 'Credible',
  stretch: 'Stretch',
  'long-shot': 'Long shot',
}

const RECOMMENDATION: Record<
  FitAssessmentView['recommendation'],
  { label: string; className: string }
> = {
  apply: { label: 'Apply', className: 'bg-emerald-600 text-white' },
  'apply-if-time': {
    label: 'Apply if you have time',
    className: 'bg-amber-500 text-white',
  },
  skip: { label: 'Skip this one', className: 'bg-rose-600 text-white' },
}

const STATUS_ICON = {
  met: <Check className="h-3.5 w-3.5 text-emerald-600" />,
  partial: <Minus className="h-3.5 w-3.5 text-amber-600" />,
  unmet: <X className="h-3.5 w-3.5 text-rose-600" />,
}

export function FitScoreCard({
  assessment,
  scoring,
  onScore,
}: {
  assessment: FitAssessmentView | null
  scoring: boolean
  onScore: () => void
}) {
  if (!assessment) {
    return (
      <Card className="p-6">
        <h3 className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
          <Target className="h-4 w-4 text-gray-500" />
          Worth applying?
        </h3>
        <p className="mb-4 max-w-xl text-sm text-gray-600">
          Scores this posting against what the fit brief already established,
          and says whether the hour is worth spending. It is calibrated to say
          no — a hard blocker like a language requirement caps it regardless of
          how well the rest fits.
        </p>
        <Button onClick={onScore} disabled={scoring}>
          {scoring ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Assessing…
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Assess this application
            </>
          )}
        </Button>
      </Card>
    )
  }

  const rec = RECOMMENDATION[assessment.recommendation]
  const cover = assessment.coverage

  return (
    <Card className="p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-baseline gap-3">
          {/*
            A number, not a gauge. See the note at the top of this file: a bar
            filling toward 100 makes 45 look like failure when it is in fact a
            perfectly good application.
          */}
          <span className="text-4xl font-semibold text-gray-900 tabular-nums">
            {assessment.score}
            <span className="text-xl text-gray-400">%</span>
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${BAND_STYLE[assessment.band]}`}
          >
            {BAND_LABEL[assessment.band]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${rec.className}`}
          >
            {rec.label}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onScore}
            disabled={scoring}
          >
            <RefreshCw className={`h-4 w-4 ${scoring ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <p className="mb-1 text-xs text-gray-400">
        Estimated chance of reaching a first interview.
      </p>
      <p className="mb-4 text-sm text-gray-800">{assessment.verdict}</p>

      {assessment.hardBlocker?.trim() && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">Hard blocker:</strong>{' '}
            {assessment.hardBlocker}
          </span>
        </div>
      )}

      {assessment.mustHaves?.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
            Every must-have
          </p>
          <ul className="space-y-1.5">
            {assessment.mustHaves.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 shrink-0">
                  {STATUS_ICON[item.status]}
                </span>
                <span>
                  <span className="text-gray-900">{item.requirement}</span>
                  {item.note && (
                    <span className="text-gray-500"> — {item.note}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {assessment.drivers?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
              What helps
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              {assessment.drivers.map((d, i) => (
                <li key={i}>· {d}</li>
              ))}
            </ul>
          </div>
        )}
        {assessment.risks?.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-gray-700 uppercase">
              What filters you out
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              {assessment.risks.map((r, i) => (
                <li key={i}>· {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {cover && (
        <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500">
          Derived from {cover.directMatches} of {cover.totalRows} requirements
          marked a direct match on the brief ({cover.transferable}{' '}
          transferable), against {cover.mustHaves} essential requirements in the
          posting.
          {assessment.scoredAt && (
            <> Scored {new Date(assessment.scoredAt).toLocaleDateString()}.</>
          )}
        </p>
      )}
    </Card>
  )
}

/** Compact badge for the list, so triage does not need opening each one. */
export function FitScoreBadge({
  score,
  band,
}: {
  score: number | null
  band: string | null
}) {
  if (score === null || score === undefined) return null
  const style =
    BAND_STYLE[(band as FitAssessmentView['band']) ?? 'stretch'] ??
    BAND_STYLE.stretch
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${style}`}
      title="Estimated chance of a first interview"
    >
      {score}%
    </span>
  )
}
