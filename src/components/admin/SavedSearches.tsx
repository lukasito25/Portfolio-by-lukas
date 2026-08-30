'use client'

/**
 * Saved searches — the ones that run overnight without anyone pressing
 * anything.
 *
 * The manual search competes with the part of the day he could spend writing
 * applications. A saved search moves it to 3am and puts the result in his inbox,
 * so the morning starts with leads rather than with a two-minute wait.
 *
 * The one thing this screen must not do is hide a search that has stopped
 * working. A scheduler nobody watches fails silently by default: an auto-paused
 * search, a run that errored, a search that has never run at all are all
 * indistinguishable from "the market is quiet" unless the panel says otherwise.
 * So every row states when it last ran, what it found, and when it will go
 * again — and a paused search says why, in amber, with the button to undo it.
 */

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertTriangle,
  CalendarClock,
  Mail,
  MailX,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import type { JobSearchCriteria } from '@/lib/job-search/schema'
import {
  FREQUENCIES,
  FREQUENCY_LABELS,
  nextRunAt,
  type Frequency,
} from '@/lib/job-search/schedule'

export interface SavedSearch {
  id: string
  name: string
  criteria: Partial<JobSearchCriteria>
  frequency: string
  hourUtc: number
  isActive: boolean
  notifyByEmail: boolean
  minScore: number
  lastRunAt: string | null
  emptyRuns: number
  pausedReason: string
}

interface Props {
  /** What is currently typed into the criteria form, for "Save this search". */
  criteria: JobSearchCriteria | null
}

/** "Senior Product Manager · Milan · Remote" */
function describe(criteria: Partial<JobSearchCriteria>): string {
  const parts = [
    ...(criteria.titles ?? []),
    ...(criteria.locations ?? []),
  ].filter(Boolean)
  if (criteria.workModel && criteria.workModel !== 'any') {
    parts.push(criteria.workModel)
  }
  return parts.join(' · ') || 'No criteria'
}

function relative(from: Date, to: Date): string {
  const mins = Math.round((to.getTime() - from.getTime()) / 60000)
  if (mins < 0) return 'due now'
  if (mins < 60) return `in ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `in ${hours}h`
  return `in ${Math.round(hours / 24)}d`
}

function ago(iso: string | null): string {
  if (!iso) return 'never run'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'never run'
  const hours = Math.round((Date.now() - then) / 3_600_000)
  if (hours < 1) return 'ran just now'
  if (hours < 24) return `ran ${hours}h ago`
  return `ran ${Math.round(hours / 24)}d ago`
}

export function SavedSearches({ criteria }: Props) {
  const [searches, setSearches] = useState<SavedSearch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [naming, setNaming] = useState(false)
  const [name, setName] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/searches')
      if (!res.ok) return
      const data = await res.json()
      setSearches(data.searches ?? [])
    } catch {
      // A failed reload is not worth a banner — the next action refreshes it.
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(id)
    setError(null)
    try {
      const res = await fetch(`/api/admin/searches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setSearches(current =>
        current.map(s => (s.id === id ? { ...s, ...data.search } : s))
      )
    } catch (e) {
      setError((e as Error).message)
      void load()
    } finally {
      setBusy(null)
    }
  }

  const create = async () => {
    if (!criteria) {
      setError('Fill in the criteria above first — at least one job title.')
      return
    }
    setError(null)
    setBusy('new')
    try {
      const res = await fetch('/api/admin/searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || describe(criteria),
          criteria,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setSearches(current => [data.search, ...current])
      setNaming(false)
      setName('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const remove = async (search: SavedSearch) => {
    if (!confirm(`Delete "${search.name}"? Its leads are kept.`)) return
    setBusy(search.id)
    try {
      await fetch(`/api/admin/searches/${search.id}`, { method: 'DELETE' })
      setSearches(current => current.filter(s => s.id !== search.id))
    } finally {
      setBusy(null)
    }
  }

  const now = new Date()

  return (
    <div className="mb-6 border-b border-gray-200 pb-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Saved searches ({searches.length})
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Run overnight on their own schedule. You are emailed only when a run
            finds something worth opening.
          </p>
        </div>

        {naming ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={criteria ? describe(criteria) : 'Name this search'}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
            />
            <Button size="sm" onClick={create} disabled={busy === 'new'}>
              {busy === 'new' ? 'Saving…' : 'Save'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setNaming(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setNaming(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Save these criteria
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </div>
      )}

      {searches.length === 0 ? (
        <p className="text-sm text-gray-500">
          None yet. Fill in the criteria below, then save them to have the
          search run itself overnight.
        </p>
      ) : (
        <div className="space-y-2">
          {searches.map(search => {
            const next = nextRunAt(search, now)
            return (
              <Card
                key={search.id}
                className={`p-3 ${search.isActive ? '' : 'bg-gray-50'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {search.name}
                      </span>
                      {search.notifyByEmail ? (
                        <Mail
                          className="h-3.5 w-3.5 text-gray-400"
                          aria-label="Emails a digest"
                        />
                      ) : (
                        <MailX
                          className="h-3.5 w-3.5 text-gray-300"
                          aria-label="No email"
                        />
                      )}
                    </div>

                    <p className="mt-0.5 truncate text-xs text-gray-600">
                      {describe(search.criteria)}
                    </p>

                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                      <CalendarClock className="h-3 w-3" />
                      {FREQUENCY_LABELS[search.frequency as Frequency] ??
                        search.frequency}{' '}
                      at {String(search.hourUtc).padStart(2, '0')}:00 UTC
                      <span aria-hidden>·</span>
                      {ago(search.lastRunAt)}
                      {search.isActive && (
                        <>
                          <span aria-hidden>·</span>
                          next {relative(now, next)}
                        </>
                      )}
                      <span aria-hidden>·</span>
                      email at {search.minScore}+
                    </p>

                    {search.pausedReason && (
                      <p className="mt-2 flex items-start gap-1.5 rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-900">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                        Paused — {search.pausedReason}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <select
                      value={search.frequency}
                      onChange={e =>
                        patch(search.id, { frequency: e.target.value })
                      }
                      disabled={busy === search.id}
                      className="rounded border border-gray-300 px-1.5 py-1 text-xs"
                      aria-label="Frequency"
                    >
                      {FREQUENCIES.map(f => (
                        <option key={f} value={f}>
                          {FREQUENCY_LABELS[f]}
                        </option>
                      ))}
                    </select>

                    <select
                      value={search.hourUtc}
                      onChange={e =>
                        patch(search.id, { hourUtc: Number(e.target.value) })
                      }
                      disabled={busy === search.id}
                      className="rounded border border-gray-300 px-1.5 py-1 text-xs"
                      aria-label="Hour (UTC)"
                    >
                      {Array.from({ length: 24 }, (_, h) => (
                        <option key={h} value={h}>
                          {String(h).padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>

                    <label className="flex items-center gap-1 text-xs text-gray-600">
                      <input
                        type="checkbox"
                        checked={search.notifyByEmail}
                        disabled={busy === search.id}
                        onChange={e =>
                          patch(search.id, { notifyByEmail: e.target.checked })
                        }
                      />
                      Email
                    </label>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy === search.id}
                      onClick={() =>
                        patch(search.id, { isActive: !search.isActive })
                      }
                    >
                      {busy === search.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : search.isActive ? (
                        'Pause'
                      ) : (
                        'Resume'
                      )}
                    </Button>

                    <button
                      type="button"
                      aria-label={`Delete ${search.name}`}
                      onClick={() => remove(search)}
                      className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
