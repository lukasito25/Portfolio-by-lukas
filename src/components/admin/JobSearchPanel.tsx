'use client'

/**
 * The Search tab of /admin/applications.
 *
 * The rest of the panel works backwards from a posting he has already found.
 * This works forwards: say what you are looking for, and get back real postings
 * with a triage score attached, so the decision about where the next hour goes
 * is made before the hour is spent rather than after.
 *
 * Two things about the presentation are load-bearing rather than decorative.
 *
 * The score is **not** a gauge or a progress bar. The fit-score work settled
 * this already: a bar three-tenths full reads as failure, and 45 is a perfectly
 * good application. A design that makes a realistic number feel like a bad one
 * pushes toward applying to everything, which is the behaviour the score exists
 * to prevent.
 *
 * And every badge here is checked rather than claimed. `Verified live` means a
 * request to that URL actually answered; `Could not verify` is its own state
 * and never quietly becomes `Posting gone`. The entire saving of this feature
 * is not having to open twenty tabs, and it evaporates the moment a badge
 * cannot be trusted.
 */

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import type { JobLeadView, LeadState } from '@/lib/job-search/schema'

export interface LeadHandoff {
  leadId: string
  url: string
  fallbackText: string
}

interface Props {
  onGenerate: (lead: LeadHandoff) => void
  generating: boolean
  /** Ids of leads whose generation is in flight or finished this session. */
  busyLeadId: string | null
}

const BAND_STYLE: Record<string, string> = {
  strong: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  credible: 'bg-blue-100 text-blue-800 border-blue-200',
  stretch: 'bg-amber-100 text-amber-800 border-amber-200',
  'long-shot': 'bg-gray-100 text-gray-600 border-gray-200',
}

const BAND_LABEL: Record<string, string> = {
  strong: 'Strong fit',
  credible: 'Credible',
  stretch: 'Stretch',
  'long-shot': 'Long shot',
}

const RECOMMENDATION_LABEL: Record<string, string> = {
  apply: 'Apply',
  'apply-if-time': 'Apply if you have time',
  skip: 'Skip this one',
}

/* ------------------------------------------------------------------ *
 * A repeatable free-text field (titles, locations)
 * ------------------------------------------------------------------ */

function ChipInput({
  label,
  hint,
  values,
  onChange,
  placeholder,
}: {
  label: string
  hint?: string
  values: string[]
  onChange: (next: string[]) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState('')

  const commit = () => {
    const value = draft.trim().replace(/,$/, '')
    if (!value || values.includes(value) || values.length >= 6) {
      setDraft('')
      return
    }
    onChange([...values, value])
    setDraft('')
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-800">
        {label}
      </label>
      {hint && <p className="mb-2 text-xs text-gray-500">{hint}</p>}

      {values.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {values.map(value => (
            <span
              key={value}
              className="inline-flex items-center gap-1 rounded-full bg-gray-900 py-1 pl-3 pr-1.5 text-xs font-medium text-white"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter(v => v !== value))}
                className="rounded-full p-0.5 hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
          }
        }}
        onBlur={commit}
        placeholder={values.length >= 6 ? 'Six is plenty' : placeholder}
        disabled={values.length >= 6}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-50"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Badges
 * ------------------------------------------------------------------ */

function LivenessBadge({ liveness }: { liveness: string }) {
  if (liveness === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
        <Check className="h-3 w-3" />
        Verified live
      </span>
    )
  }
  if (liveness === 'gone') {
    return (
      <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
        <X className="h-3 w-3" />
        Posting gone
      </span>
    )
  }
  return (
    <span
      title="The board would not answer a server-side request. That is not the same as the posting being down — open it to find out."
      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[11px] font-medium text-gray-600"
    >
      <HelpCircle className="h-3 w-3" />
      Could not verify
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * One result
 * ------------------------------------------------------------------ */

function LeadCard({
  lead,
  onGenerate,
  onState,
  generating,
  busy,
}: {
  lead: JobLeadView
  onGenerate: (lead: LeadHandoff) => void
  onState: (id: string, state: LeadState) => void
  generating: boolean
  busy: boolean
}) {
  const [open, setOpen] = useState(false)
  const detail = lead.scoreDetail ?? {}

  return (
    <Card className={`p-4 ${lead.liveness === 'gone' ? 'opacity-60' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">
              {lead.title}
            </h4>
            <LivenessBadge liveness={lead.liveness} />
            {lead.alreadyApplied && (
              <span className="inline-flex items-center gap-1 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-700">
                Already applied here
              </span>
            )}
            {lead.state === 'applied' && (
              <span className="inline-flex items-center gap-1 rounded border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[11px] font-medium text-violet-700">
                Application written
              </span>
            )}
          </div>

          <p className="text-sm text-gray-700">
            <span className="font-medium">{lead.companyName}</span>
            {lead.location && <> · {lead.location}</>}
            {lead.workModel && lead.workModel !== 'unspecified' && (
              <> · {lead.workModel}</>
            )}
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            {lead.salaryText ? lead.salaryText : 'Salary not stated'}
            {lead.postedText && <> · {lead.postedText}</>}
            {lead.source && <> · {lead.source}</>}
          </p>
        </div>

        {/* Deliberately a number and a word, not a gauge. */}
        <div
          className={`shrink-0 rounded-lg border px-3 py-2 text-center ${
            BAND_STYLE[lead.band] ?? BAND_STYLE['long-shot']
          }`}
        >
          <div className="text-xl font-bold leading-none">{lead.leadScore}</div>
          <div className="mt-1 text-[11px] font-medium">
            {BAND_LABEL[lead.band] ?? lead.band}
          </div>
        </div>
      </div>

      {lead.hardBlocker && (
        <div className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <span className="font-medium">Hard blocker:</span>{' '}
            {lead.hardBlocker}
          </span>
        </div>
      )}

      {detail.verdict && (
        <p className="mt-3 text-sm text-gray-700">{detail.verdict}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          disabled={generating || lead.liveness === 'gone'}
          onClick={() =>
            onGenerate({
              leadId: lead.id,
              url: lead.url,
              fallbackText: [
                `Title: ${lead.title}`,
                `Company: ${lead.companyName}`,
                lead.location ? `Location: ${lead.location}` : '',
                lead.salaryText ? `Salary: ${lead.salaryText}` : '',
                '',
                lead.summary,
                '',
                'Requirements:',
                ...(lead.requirements ?? []).map(r => `- ${r}`),
              ]
                .filter(Boolean)
                .join('\n'),
            })
          }
        >
          {busy ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {busy ? 'Generating…' : 'Generate application'}
        </Button>

        <a
          href={lead.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open posting
        </a>

        {lead.state !== 'saved' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onState(lead.id, 'saved')}
          >
            Save
          </Button>
        )}
        {lead.state !== 'dismissed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onState(lead.id, 'dismissed')}
          >
            Dismiss
          </Button>
        )}

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="ml-auto inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
        >
          {open ? 'Less' : 'Why this score'}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3 border-t border-gray-100 pt-3 text-sm">
          <p className="text-xs text-gray-500">
            {RECOMMENDATION_LABEL[lead.recommendation] ?? lead.recommendation} ·
            triage score, from what the search could see. The full fit score
            runs after the brief is written.
          </p>

          {lead.summary && <p className="text-gray-700">{lead.summary}</p>}

          {(detail.drivers?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                What helps
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-gray-700">
                {detail.drivers?.map(driver => (
                  <li key={driver}>{driver}</li>
                ))}
              </ul>
            </div>
          )}

          {(detail.risks?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                What gets it filtered out
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-gray-700">
                {detail.risks?.map(risk => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          {(lead.requirements?.length ?? 0) > 0 && (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Requirements the search could see
              </p>
              <ul className="list-disc space-y-0.5 pl-5 text-gray-700">
                {lead.requirements.map(requirement => (
                  <li key={requirement}>{requirement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

/* ------------------------------------------------------------------ *
 * The panel
 * ------------------------------------------------------------------ */

export function JobSearchPanel({ onGenerate, generating, busyLeadId }: Props) {
  const [titles, setTitles] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [salaryMin, setSalaryMin] = useState('')
  const [currency, setCurrency] = useState('EUR')
  const [workModel, setWorkModel] = useState('any')
  const [seniority, setSeniority] = useState('')

  const [leads, setLeads] = useState<JobLeadView[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coverageNote, setCoverageNote] = useState('')
  const [spend, setSpend] = useState(0)
  const [showDismissed, setShowDismissed] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads')
      if (!res.ok) return
      const data = await res.json()
      setLeads(data.leads ?? [])
    } catch {
      // A failed reload is not worth an error banner — the panel is still
      // usable and the next search repopulates it.
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const search = async () => {
    if (titles.length === 0) {
      setError('Give at least one job title to search for.')
      return
    }
    setError(null)
    setCoverageNote('')
    setSearching(true)
    setSpend(0)

    try {
      const res = await fetch('/api/admin/job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titles,
          locations,
          salaryMin: salaryMin ? Number(salaryMin) : undefined,
          salaryCurrency: currency,
          workModel,
          seniority,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)

      if (typeof data.costUsd === 'number') setSpend(data.costUsd)
      setCoverageNote(data.coverageNote ?? '')

      // Re-read rather than trusting the response alone: the search returns
      // what it just found, the list is everything, and a lead saved from an
      // earlier search should not disappear because this one missed it.
      await load()

      if ((data.leads ?? []).length === 0) {
        setError(
          data.coverageNote
            ? 'Nothing matched. See the note below for what was searched.'
            : 'Nothing matched those criteria. Try a broader title or drop the location.'
        )
      }
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSearching(false)
    }
  }

  const setState = async (id: string, state: LeadState) => {
    // Optimistic: the round trip is short and a card that does not move when
    // you dismiss it reads as broken.
    setLeads(current =>
      current.map(lead => (lead.id === id ? { ...lead, state } : lead))
    )
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state }),
      })
    } catch {
      void load()
    }
  }

  const active = leads.filter(lead => lead.state !== 'dismissed')
  const dismissed = leads.filter(lead => lead.state === 'dismissed')

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <ChipInput
          label="Job titles"
          hint="Press Enter after each. Variants help — a role you would take is often not called what you call it."
          values={titles}
          onChange={setTitles}
          placeholder="Senior Product Manager"
        />
        <ChipInput
          label="Locations"
          hint="Cities, countries, or Remote. Leave empty to search Europe and remote roles."
          values={locations}
          onChange={setLocations}
          placeholder="Milan"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Salary floor{' '}
            <span className="font-normal text-gray-500">— optional</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={salaryMin}
              onChange={e => setSalaryMin(e.target.value)}
              placeholder="75000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
            >
              {['EUR', 'CHF', 'GBP', 'USD'].map(code => (
                <option key={code}>{code}</option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            A preference, not a filter — most postings state no salary, and
            filtering on it would discard most of the real openings.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Work model
          </label>
          <select
            value={workModel}
            onChange={e => setWorkModel(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="any">Any</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-800">
            Seniority{' '}
            <span className="font-normal text-gray-500">— optional</span>
          </label>
          <input
            type="text"
            value={seniority}
            onChange={e => setSeniority(e.target.value)}
            placeholder="Senior"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button onClick={search} disabled={searching || generating}>
          {searching ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {searching ? 'Searching…' : 'Search'}
        </Button>
        <span className="text-xs text-gray-500">
          Sweeps the boards and company careers pages, checks every link, and
          scores what it finds. About a minute.
        </span>
        {spend > 0 && (
          <span className="text-xs text-gray-500">
            ≈ ${spend.toFixed(3)} this search
          </span>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      )}

      {coverageNote && (
        <p className="mt-3 text-xs text-gray-500">
          <span className="font-medium">What was searched:</span> {coverageNote}
        </p>
      )}

      {active.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {active.length} {active.length === 1 ? 'lead' : 'leads'}
            </h3>
            <p className="text-xs text-gray-500">
              Triage scores, best first. The real fit score runs after
              generation.
            </p>
          </div>
          <div className="space-y-3">
            {active.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onGenerate={onGenerate}
                onState={setState}
                generating={generating}
                busy={busyLeadId === lead.id}
              />
            ))}
          </div>
        </div>
      )}

      {dismissed.length > 0 && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowDismissed(o => !o)}
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            Dismissed ({dismissed.length})
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${showDismissed ? 'rotate-180' : ''}`}
            />
          </button>
          <p className="mt-1 text-xs text-gray-500">
            Kept so a repeat search does not put them back in front of you.
          </p>

          {showDismissed && (
            <div className="mt-3 space-y-3">
              {dismissed.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onGenerate={onGenerate}
                  onState={setState}
                  generating={generating}
                  busy={busyLeadId === lead.id}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
