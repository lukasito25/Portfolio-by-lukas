'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ArrowLeft,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  Pencil,
  ExternalLink,
} from 'lucide-react'
import {
  MAX_CAMPAIGN_DURATION_MONTHS,
  campaignEndDate,
  isCampaignActive,
  type LocationCampaign,
} from '@/lib/location-campaigns'

interface AdminCampaign extends LocationCampaign {
  isActive: boolean
  updatedAt?: string
}

const BLANK = {
  id: '',
  countries: '',
  cities: '',
  startsAt: new Date().toISOString().slice(0, 10),
  endsAt: '',
  eyebrow: '',
  title: 'I mapped my experience to your role.',
  body: '',
  ctaLabel: 'See the fit brief',
  href: '',
  isActive: true,
}
type FormState = typeof BLANK

const toForm = (c: AdminCampaign): FormState => ({
  id: c.id,
  countries: (c.countries ?? []).join(', '),
  cities: (c.cities ?? []).join(', '),
  startsAt: c.startsAt,
  endsAt: c.endsAt ?? '',
  eyebrow: c.eyebrow,
  title: c.title,
  body: c.body,
  ctaLabel: c.ctaLabel,
  href: c.href,
  isActive: c.isActive,
})

const fmt = (d: Date) => d.toISOString().slice(0, 10)

export default function CampaignsClient() {
  const { data: session, status } = useSession()
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [editing, setEditing] = useState<FormState | null>(null)
  const [isNew, setIsNew] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin-proxy/campaigns')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCampaigns(data.campaigns ?? [])
    } catch (e) {
      console.error(e)
      setError(
        'Could not load campaigns. If this is the first run, the database table may not exist yet.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
    return null
  }

  const save = async () => {
    if (!editing) return
    setBusy(editing.id || 'new')
    try {
      const payload = {
        ...editing,
        countries: editing.countries
          .split(',')
          .map(s => s.trim().toUpperCase())
          .filter(Boolean),
        cities: editing.cities
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        endsAt: editing.endsAt || null,
      }
      const res = await fetch(
        isNew
          ? '/api/admin-proxy/campaigns'
          : `/api/admin-proxy/campaigns/${editing.id}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || `HTTP ${res.status}`)
      }
      setEditing(null)
      setIsNew(false)
      await load()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(null)
    }
  }

  const toggle = async (c: AdminCampaign) => {
    setBusy(c.id)
    try {
      await fetch(`/api/admin-proxy/campaigns/${c.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !c.isActive }),
      })
      await load()
    } finally {
      setBusy(null)
    }
  }

  const remove = async (c: AdminCampaign) => {
    if (!confirm(`Delete "${c.id}" permanently? This cannot be undone.`)) return
    setBusy(c.id)
    try {
      await fetch(`/api/admin-proxy/campaigns/${c.id}`, { method: 'DELETE' })
      await load()
    } finally {
      setBusy(null)
    }
  }

  /** What a visitor would actually experience, given switch + time window. */
  const liveState = (c: AdminCampaign) => {
    if (!c.isActive)
      return { label: 'Paused', cls: 'bg-gray-100 text-gray-600' }
    if (!isCampaignActive(c, new Date()))
      return { label: 'Expired', cls: 'bg-amber-100 text-amber-700' }
    return { label: 'Live', cls: 'bg-emerald-100 text-emerald-700' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              Campaign banners
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Geo-targeted banners shown on the homepage. The first matching
              live campaign wins, so order matters — one country, one banner.
            </p>
          </div>
          <Button
            onClick={() => {
              setEditing({ ...BLANK })
              setIsNew(true)
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            New campaign
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </Card>
        )}

        {loading ? (
          <Card className="p-8 text-center text-gray-500">
            <RefreshCw className="mx-auto mb-2 h-5 w-5 animate-spin" />
            Loading…
          </Card>
        ) : campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">
              No campaigns yet. Create one to start routing geo-matched visitors
              to a fit brief.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {campaigns.map(c => {
              const state = liveState(c)
              const ends = campaignEndDate(c)
              return (
                <Card key={c.id} className="p-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${state.cls}`}
                        >
                          {state.label}
                        </span>
                        <code className="text-sm font-medium text-gray-900">
                          {c.id}
                        </code>
                        <span className="text-xs text-gray-500">
                          {(c.countries ?? []).join(', ') || 'everyone'}
                          {c.cities?.length ? ` · ${c.cities.join(', ')}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        <strong>{c.eyebrow}</strong> {c.body}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {c.startsAt} → {fmt(ends)} · →{' '}
                        <Link
                          href={c.href}
                          className="underline hover:text-gray-900"
                        >
                          {c.href}
                        </Link>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        title="Preview on the homepage"
                      >
                        <Link
                          href={`/?campaign=${c.id}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy === c.id}
                        onClick={() => {
                          setEditing(toForm(c))
                          setIsNew(false)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={c.isActive ? 'outline' : 'default'}
                        size="sm"
                        disabled={busy === c.id}
                        onClick={() => toggle(c)}
                      >
                        {c.isActive ? (
                          <>
                            <Pause className="mr-1 h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="mr-1 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy === c.id}
                        onClick={() => remove(c)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {editing && (
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 py-10">
            <Card className="w-full max-w-2xl p-6">
              <h2 className="mb-1 text-xl font-semibold text-gray-900">
                {isNew ? 'New campaign' : `Edit ${editing.id}`}
              </h2>
              <p className="mb-5 text-sm text-gray-500">
                Every campaign auto-expires {MAX_CAMPAIGN_DURATION_MONTHS}{' '}
                months after its start date, so a forgotten banner retires
                itself. An end date can only bring that forward.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="ID (slug)"
                  hint="Stable and unique — also the dismissal key"
                  disabled={!isNew}
                  value={editing.id}
                  onChange={v => setEditing({ ...editing, id: v })}
                  placeholder="acme-de"
                />
                <Field
                  label="Links to"
                  hint="Internal path of the fit brief"
                  value={editing.href}
                  onChange={v => setEditing({ ...editing, href: v })}
                  placeholder="/acme"
                />
                <Field
                  label="Countries"
                  hint="ISO codes, comma-separated. Blank = everyone"
                  value={editing.countries}
                  onChange={v => setEditing({ ...editing, countries: v })}
                  placeholder="DE, AT"
                />
                <Field
                  label="Cities (optional)"
                  hint="Narrows further; city detection is less reliable"
                  value={editing.cities}
                  onChange={v => setEditing({ ...editing, cities: v })}
                  placeholder="Berlin"
                />
                <Field
                  label="Starts"
                  type="date"
                  value={editing.startsAt}
                  onChange={v => setEditing({ ...editing, startsAt: v })}
                />
                <Field
                  label="Ends early (optional)"
                  type="date"
                  hint={`Capped at start + ${MAX_CAMPAIGN_DURATION_MONTHS} months`}
                  value={editing.endsAt}
                  onChange={v => setEditing({ ...editing, endsAt: v })}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Eyebrow"
                    value={editing.eyebrow}
                    onChange={v => setEditing({ ...editing, eyebrow: v })}
                    placeholder="Recruiting for Acme?"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Title"
                    value={editing.title}
                    onChange={v => setEditing({ ...editing, title: v })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Body"
                    value={editing.body}
                    onChange={v => setEditing({ ...editing, body: v })}
                    placeholder="A short brief for the … opening in …"
                  />
                </div>
                <Field
                  label="Button label"
                  value={editing.ctaLabel}
                  onChange={v => setEditing({ ...editing, ctaLabel: v })}
                />
                <label className="flex items-end gap-2 pb-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editing.isActive}
                    onChange={e =>
                      setEditing({ ...editing, isActive: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  Active
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(null)
                    setIsNew(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={save} disabled={busy !== null}>
                  {busy ? 'Saving…' : isNew ? 'Create' : 'Save changes'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </span>
      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-500"
      />
      {hint && <span className="mt-1 block text-xs text-gray-500">{hint}</span>}
    </label>
  )
}
