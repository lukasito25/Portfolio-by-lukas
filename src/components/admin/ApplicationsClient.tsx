'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  Trash2,
  Upload,
} from 'lucide-react'
import { LOCALES, type Locale } from '@/lib/fit-brief/guardrails'
import type { BriefWarning, FitBriefContent } from '@/lib/fit-brief/schema'

/**
 * The application engine's control panel.
 *
 * One flow: give it a job posting, it produces a fit brief in three locales
 * plus a tailored CV and cover letter, all as a draft you review and then
 * publish. Nothing goes live until you press Publish, and blocking warnings
 * stop that until they are resolved.
 */

type ApplicationStatus =
  | 'not_sent'
  | 'sent'
  | 'acknowledged'
  | 'interview'
  | 'rejected'
  | 'offer'
  | 'withdrawn'

const APPLICATION_STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'not_sent', label: 'Not sent' },
  { value: 'sent', label: 'Sent' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
]

const STATUS_STYLE: Record<ApplicationStatus, string> = {
  not_sent: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  acknowledged: 'bg-indigo-100 text-indigo-700',
  interview: 'bg-emerald-100 text-emerald-700',
  offer: 'bg-emerald-200 text-emerald-900',
  rejected: 'bg-rose-100 text-rose-700',
  withdrawn: 'bg-gray-100 text-gray-500',
}

interface BriefSummary {
  id: string
  slug: string
  companyName: string
  roleTitle: string
  status: 'draft' | 'published' | 'archived'
  applicationStatus: ApplicationStatus
  sentAt: string | null
  previewToken: string
  locales: string[]
  warningCount: number
  sourceUrl: string | null
  updatedAt: string
  publishedAt: string | null
}

interface FullBrief extends BriefSummary {
  jobSpec: {
    countryCode?: string
    location?: string
    postingLanguage?: string
    companyContext?: string[]
  }
  content: Partial<Record<Locale, FitBriefContent>>
  cvContent: Record<string, unknown>
  coverLetter: Record<string, unknown>
  brand: { accentLight: string; accentDark: string; motif: string }
  warnings: BriefWarning[]
  sentVia: string | null
  sentSnapshot: Record<string, unknown>
  outcomeNotes: string | null
}

type InputMode = 'url' | 'file' | 'text'

interface Step {
  key: string
  label: string
  state: 'pending' | 'running' | 'done' | 'failed'
}

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
  de: 'Deutsch',
}

/** Strip the data: prefix — the API wants raw base64. */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result)
      resolve(result.slice(result.indexOf(',') + 1))
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

export default function ApplicationsClient() {
  const { data: session, status } = useSession()

  const [briefs, setBriefs] = useState<BriefSummary[]>([])
  const [selected, setSelected] = useState<FullBrief | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // Generation
  const [mode, setMode] = useState<InputMode>('url')
  const [url, setUrl] = useState('')
  const [pasted, setPasted] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [allLocaleDocs, setAllLocaleDocs] = useState(true)
  const [steps, setSteps] = useState<Step[]>([])
  const [generating, setGenerating] = useState(false)
  const [spend, setSpend] = useState(0)
  const fileInput = useRef<HTMLInputElement>(null)

  // Review
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [tab, setTab] = useState<'brief' | 'cv' | 'letter'>('brief')
  const [draftJson, setDraftJson] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [refTag, setRefTag] = useState('recruiter')
  const [campaignNote, setCampaignNote] = useState<string | null>(null)
  const [sentVia, setSentVia] = useState('email')

  /**
   * Whether THIS environment can generate.
   *
   * Generation needs the agent suite on localhost. Deployed on Vercel that is
   * unreachable, so the Generate button used to POST and come back 503 — which
   * reads as a broken feature rather than a environment limitation. Ask the
   * server first and show the terminal command instead.
   */
  const [canGenerate, setCanGenerate] = useState<boolean | null>(null)
  const [genDetail, setGenDetail] = useState('')
  /** Where the generator lives — decides which recovery advice is honest. */
  const [genRemote, setGenRemote] = useState(true)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/brief')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setBriefs(data.briefs ?? [])
    } catch (e) {
      console.error(e)
      setError(
        'Could not load applications. If this is the first run, the GeneratedBrief table may not exist yet — apply cloudflare-api/migrations/add_generated_briefs.sql.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    fetch('/api/admin/brief/health')
      .then(r => r.json())
      .then(d => {
        setCanGenerate(Boolean(d.canGenerate))
        setGenDetail(d.detail ?? '')
        setGenRemote(d.remote !== false)
      })
      .catch(() => setCanGenerate(false))
  }, [])

  /**
   * Every hook must run before the auth guards below.
   *
   * These two sat after the `status === 'loading'` early return, so the first
   * render ran 20 hooks and the authenticated render ran 22. React counts
   * hooks per render and refuses to reconcile a change, which crashed the whole
   * page with error #310 the moment the session resolved — invisible to a curl
   * check, because the failure is client-side after hydration.
   */
  const blockers = useMemo(
    () => (selected?.warnings ?? []).filter(w => w.severity === 'blocker'),
    [selected]
  )
  const reviews = useMemo(
    () => (selected?.warnings ?? []).filter(w => w.severity !== 'blocker'),
    [selected]
  )

  const openBrief = useCallback(async (id: string) => {
    setError(null)
    setCampaignNote(null)
    try {
      const res = await fetch(`/api/admin/brief/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const { brief } = await res.json()
      setSelected(brief)
      const first = LOCALES.find(l => brief.content?.[l]) ?? 'en'
      setActiveLocale(first)
      setTab('brief')
      setDraftJson(JSON.stringify(brief.content?.[first] ?? {}, null, 2))
    } catch (e) {
      setError((e as Error).message)
    }
  }, [])

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

  /* ---------------------------------------------------------------- *
   * Generation
   * ---------------------------------------------------------------- */

  const setStep = (key: string, state: Step['state']) =>
    setSteps(current =>
      current.map(step => (step.key === key ? { ...step, state } : step))
    )

  const call = async (path: string, body: unknown) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    if (typeof data.costUsd === 'number') {
      setSpend(current => current + data.costUsd)
    }
    return data
  }

  const generate = async () => {
    setError(null)
    setNotice(null)
    setSpend(0)
    setGenerating(true)

    const plan: Step[] = [
      { key: 'extract', label: 'Reading the posting', state: 'pending' },
      { key: 'brief', label: 'Writing the fit brief', state: 'pending' },
      ...LOCALES.map(locale => ({
        key: `translate-${locale}`,
        label: `Translating to ${LOCALE_LABEL[locale]}`,
        state: 'pending' as const,
      })),
      {
        key: 'docs',
        label: 'Writing the CV and cover letter',
        state: 'pending',
      },
    ]
    setSteps(plan)

    try {
      // 1. Read the posting.
      setStep('extract', 'running')
      let payload: Record<string, unknown>

      if (mode === 'url') {
        if (!url.trim()) throw new Error('Paste the job posting URL first.')
        payload = { kind: 'url', url: url.trim() }
      } else if (mode === 'file') {
        if (!file) throw new Error('Choose a PDF or an image of the posting.')
        if (file.size > MAX_UPLOAD_BYTES) {
          throw new Error(
            'That file is over 4 MB. Export a smaller PDF, or paste the text.'
          )
        }
        payload = {
          kind: file.type === 'application/pdf' ? 'pdf' : 'image',
          mediaType: file.type,
          data: await readFileAsBase64(file),
        }
      } else {
        if (pasted.trim().length < 80) {
          throw new Error(
            'Paste the full posting text — that is too short to work from.'
          )
        }
        payload = { kind: 'text', text: pasted }
      }

      const extracted = await call('/api/admin/brief/extract', payload)
      setStep('extract', 'done')

      // 2. Write the brief in the posting's own language.
      setStep('brief', 'running')
      const created = await call('/api/admin/brief/generate-brief', {
        jobSpec: extracted.jobSpec,
        sourceUrl: extracted.sourceUrl,
        sourceKind: extracted.sourceKind,
      })
      setStep('brief', 'done')
      setStep(`translate-${created.primaryLocale}`, 'done')

      const id: string = created.brief.id
      const primary: Locale = created.primaryLocale

      // 3. Translate into the remaining locales.
      for (const locale of created.remainingLocales as Locale[]) {
        setStep(`translate-${locale}`, 'running')
        await call('/api/admin/brief/translate', { id, locale })
        setStep(`translate-${locale}`, 'done')
      }

      // 4. Documents. The primary locale always; the rest on request, because
      //    each one is a further generation you may never send.
      setStep('docs', 'running')
      const docLocales = allLocaleDocs
        ? [primary, ...LOCALES.filter(l => l !== primary)]
        : [primary]
      for (const locale of docLocales) {
        await call('/api/admin/brief/generate-documents', { id, locale })
      }
      setStep('docs', 'done')

      await load()
      await openBrief(id)
      setNotice(
        'Draft ready. Review it, then publish when you are happy — the URL 404s until you do.'
      )
    } catch (e) {
      setSteps(current =>
        current.map(step =>
          step.state === 'running' ? { ...step, state: 'failed' } : step
        )
      )
      setError((e as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  /* ---------------------------------------------------------------- *
   * Review actions
   * ---------------------------------------------------------------- */

  const saveContent = async () => {
    if (!selected) return
    setSavingEdit(true)
    setError(null)
    try {
      const parsed = JSON.parse(draftJson)
      const res = await fetch(`/api/admin/brief/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: { ...selected.content, [activeLocale]: parsed },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setSelected(data.brief)
      setNotice(`Saved the ${LOCALE_LABEL[activeLocale]} copy.`)
      await load()
    } catch (e) {
      setError(
        e instanceof SyntaxError
          ? 'That is not valid JSON — check for a missing comma or quote.'
          : (e as Error).message
      )
    } finally {
      setSavingEdit(false)
    }
  }

  const setStatus = async (next: 'draft' | 'published', force = false) => {
    if (!selected) return
    setError(null)
    try {
      const res = await fetch(`/api/admin/brief/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next, force }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.code === 'blocked') {
          setError(
            `${data.error} Resolve them in the warnings panel, or publish anyway if you have checked each one.`
          )
          return
        }
        throw new Error(data.error || `HTTP ${res.status}`)
      }
      setSelected(data.brief)
      setNotice(
        next === 'published'
          ? 'Published. The link below is live.'
          : 'Back to draft — the public URL now 404s.'
      )
      await load()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  const remove = async (brief: BriefSummary) => {
    if (
      !confirm(
        `Delete the ${brief.companyName} application permanently? The brief, CV and cover letter all go.`
      )
    ) {
      return
    }
    await fetch(`/api/admin/brief/${brief.id}`, { method: 'DELETE' })
    if (selected?.id === brief.id) setSelected(null)
    await load()
  }

  const setApplicationStatus = async (
    status: ApplicationStatus,
    extra: Record<string, unknown> = {}
  ) => {
    if (!selected) return
    setError(null)
    try {
      const res = await fetch(`/api/admin/brief/${selected.id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sentVia, ...extra }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
      setSelected(data.brief)
      setNotice(
        data.snapshotFrozen
          ? 'Marked as sent. A frozen copy of exactly what went out has been stored — later edits will not change it.'
          : `Status updated to ${status.replace('_', ' ')}.`
      )
      await load()
    } catch (e) {
      setError((e as Error).message)
    }
  }

  /**
   * One country carries one banner, so check the live list before suggesting a
   * campaign — assuming a country is free is how the Swiss clash happened.
   */
  const checkCampaignSlot = async () => {
    if (!selected) return
    const country = selected.jobSpec?.countryCode?.toUpperCase()
    if (!country) {
      setCampaignNote(
        'This posting has no country, so a geo banner would not target anyone.'
      )
      return
    }
    try {
      const res = await fetch('/api/campaigns')
      const { campaigns } = await res.json()
      const clash = (campaigns ?? []).find(
        (c: { countries: string[]; id: string; href: string }) =>
          c.countries.includes(country)
      )
      setCampaignNote(
        clash
          ? `${country} is already taken by "${clash.id}" → ${clash.href}. Pause that campaign first, or skip the banner and send the link directly.`
          : `${country} is free. Create a banner pointing at /brief/${selected.slug}.`
      )
    } catch {
      setCampaignNote('Could not read the live campaign list.')
    }
  }

  const publicUrl = selected
    ? `/brief/${selected.slug}${refTag ? `?ref=${encodeURIComponent(refTag)}` : ''}`
    : ''
  const previewUrl = selected
    ? `/brief/${selected.slug}?preview=${selected.previewToken}`
    : ''

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
            <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
            <p className="mt-1 text-sm text-gray-600">
              Give it a job posting; get a fit brief in three languages, a
              tailored CV and a cover letter. Everything starts as a draft.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notice}
          </div>
        )}

        {/* ============ GENERATE ============ */}
        {canGenerate === false ? (
          <Card className="mb-8 border-amber-200 bg-amber-50/40 p-6">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Terminal className="h-4 w-4" />
              {genRemote
                ? 'The generator is not answering'
                : 'Generation runs on your Mac'}
            </h2>
            <p className="mb-4 max-w-2xl text-sm text-gray-700">
              {genRemote
                ? 'Writing a brief needs the agent suite on Cloud Run, and it did not respond to this page. Check the service, or fall back to the terminal — a draft made there appears here within seconds and you review and publish it as usual.'
                : 'Writing a brief needs the agent suite, which is configured to run on this machine and is not currently up. Start it, or generate from a terminal — the draft appears here within seconds and you review and publish it on this page as usual.'}
            </p>

            <div className="space-y-3">
              {(genRemote
                ? [
                    {
                      label: '1. Check the service',
                      cmd: 'gcloud run services describe agent-suite --region us-central1 --project ai-agent-suite --format="value(status.url,status.conditions[0].message)"',
                    },
                    {
                      label: '2. Read the last errors',
                      cmd: 'gcloud run services logs read agent-suite --region us-central1 --project ai-agent-suite --limit 30',
                    },
                  ]
                : [
                    {
                      label: '1. Start the agent suite (leave it running)',
                      cmd: 'cd "/Users/lukashosala/Documents/Antigravity AI apps/agent-suite" && ./start-local.sh',
                    },
                    {
                      label: '2. Generate, in a second terminal',
                      cmd: 'cd "/Users/lukashosala/Documents/Claude AI apps/Portfolio by Lukas" && npm run apply -- "<posting-url>" --production',
                    },
                  ]
              ).map(({ label, cmd }) => (
                <div key={label}>
                  <p className="mb-1 text-xs font-semibold text-gray-600">
                    {label}
                  </p>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 overflow-x-auto rounded bg-gray-900 px-3 py-2 text-xs text-gray-100">
                      {cmd}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(cmd)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {genDetail && (
              <p className="mt-4 text-xs text-gray-500">
                Provider check: {genDetail}
              </p>
            )}
          </Card>
        ) : (
          <Card className="mb-8 p-6">
            <h2 className="mb-1 text-lg font-semibold text-gray-900">
              New application
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              A link, a PDF or a screenshot of the posting — whichever you have.
            </p>

            <div className="mb-4 inline-flex rounded-lg border border-gray-200 bg-white p-1">
              {(
                [
                  ['url', 'Link', Link2],
                  ['file', 'PDF or image', Upload],
                  ['text', 'Paste text', FileText],
                ] as const
              ).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    mode === value
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {mode === 'url' && (
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://careers.example.com/job/12345"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            )}

            {mode === 'file' && (
              <div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg,image/webp,image/gif"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                  className="w-full text-sm"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Up to 4 MB. A screenshot of the posting works as well as a
                  PDF.
                </p>
              </div>
            )}

            {mode === 'text' && (
              <textarea
                value={pasted}
                onChange={e => setPasted(e.target.value)}
                rows={8}
                placeholder="Paste the full job posting…"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs"
              />
            )}

            <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={allLocaleDocs}
                onChange={e => setAllLocaleDocs(e.target.checked)}
              />
              Also write the CV and cover letter in all three languages
              <span className="text-xs text-gray-500">
                (off = the posting&apos;s language only, and roughly half the
                cost)
              </span>
            </label>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={generate} disabled={generating}>
                <Sparkles className="mr-2 h-4 w-4" />
                {generating ? 'Generating…' : 'Generate'}
              </Button>
              {spend > 0 && (
                <span className="text-xs text-gray-500">
                  ≈ ${spend.toFixed(2)} so far
                </span>
              )}
            </div>

            {steps.length > 0 && (
              <ol className="mt-5 space-y-1.5 border-t border-gray-100 pt-4">
                {steps.map(step => (
                  <li
                    key={step.key}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        step.state === 'done'
                          ? 'bg-emerald-100 text-emerald-700'
                          : step.state === 'running'
                            ? 'bg-blue-100 text-blue-700'
                            : step.state === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.state === 'done' ? (
                        <Check className="h-3 w-3" />
                      ) : step.state === 'running' ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : step.state === 'failed' ? (
                        '!'
                      ) : (
                        '·'
                      )}
                    </span>
                    <span
                      className={
                        step.state === 'pending'
                          ? 'text-gray-400'
                          : 'text-gray-800'
                      }
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          {/* ============ LIST ============ */}
          <div className="space-y-3">
            {loading && briefs.length === 0 && (
              <p className="text-sm text-gray-500">Loading…</p>
            )}
            {!loading && briefs.length === 0 && (
              <p className="text-sm text-gray-500">
                No applications yet. Generate one above.
              </p>
            )}
            {briefs.map(brief => (
              <Card
                key={brief.id}
                className={`cursor-pointer p-4 transition-colors ${
                  selected?.id === brief.id
                    ? 'border-gray-900'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => openBrief(brief.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {brief.companyName}
                    </p>
                    <p className="truncate text-sm text-gray-600">
                      {brief.roleTitle}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      brief.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {brief.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span
                    className={`rounded-full px-2 py-0.5 font-medium ${STATUS_STYLE[brief.applicationStatus ?? 'not_sent']}`}
                  >
                    {APPLICATION_STATUSES.find(
                      s => s.value === (brief.applicationStatus ?? 'not_sent')
                    )?.label ?? 'Not sent'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {brief.locales.map(l => l.toUpperCase()).join(' · ') || '—'}
                  </span>
                  {brief.warningCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-amber-700">
                      <AlertTriangle className="h-3 w-3" />
                      {brief.warningCount}
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* ============ DETAIL ============ */}
          <div>
            {!selected && (
              <Card className="p-8 text-center text-sm text-gray-500">
                Select an application to review it.
              </Card>
            )}

            {selected && (
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selected.companyName}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selected.roleTitle}
                        {selected.jobSpec?.location
                          ? ` · ${selected.jobSpec.location}`
                          : ''}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => remove(selected)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={previewUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Preview
                      </a>
                    </Button>
                    {selected.status === 'published' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatus('draft')}
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setStatus('published')}>
                        Publish
                      </Button>
                    )}
                    {blockers.length > 0 && selected.status !== 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatus('published', true)}
                      >
                        Publish anyway
                      </Button>
                    )}
                  </div>

                  {/* Share link */}
                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-700">
                      Link to share
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        value={refTag}
                        onChange={e => setRefTag(e.target.value)}
                        className="w-40 rounded border border-gray-300 px-2 py-1 text-sm"
                        placeholder="ref tag"
                      />
                      <code className="flex-1 truncate rounded bg-white px-2 py-1 text-xs text-gray-700">
                        {publicUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${window.location.origin}${publicUrl}`
                          )
                        }
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Use a channel, not a person — ref tags are page and
                      channel labels, and /privacy says they do not identify
                      individuals.
                    </p>
                    {selected.status !== 'published' && (
                      <p className="mt-1 text-xs text-amber-700">
                        This link 404s until you publish.
                      </p>
                    )}
                  </div>

                  {/* Campaign slot */}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={checkCampaignSlot}
                    >
                      Check geo banner slot
                    </Button>
                    {campaignNote && (
                      <p className="mt-2 text-xs text-gray-600">
                        {campaignNote}{' '}
                        <Link href="/admin/campaigns" className="underline">
                          Campaign banners
                        </Link>
                      </p>
                    )}
                  </div>
                </Card>

                {/* Application tracking */}
                <Card className="p-6">
                  <h3 className="mb-1 flex items-center gap-2 font-semibold text-gray-900">
                    <Send className="h-4 w-4" />
                    Application
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Marking this as sent freezes a copy of exactly what went
                    out. Later edits to the brief will not change that record.
                  </p>

                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {APPLICATION_STATUSES.map(status => {
                      const active =
                        (selected.applicationStatus ?? 'not_sent') ===
                        status.value
                      return (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() => setApplicationStatus(status.value)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                            active
                              ? STATUS_STYLE[status.value]
                              : 'bg-white text-gray-500 ring-1 ring-gray-200 hover:text-gray-900'
                          }`}
                        >
                          {status.label}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <label className="text-gray-600">Sent via</label>
                    <select
                      value={sentVia}
                      onChange={e => setSentVia(e.target.value)}
                      className="rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      {['email', 'portal', 'linkedin', 'referral', 'other'].map(
                        channel => (
                          <option key={channel} value={channel}>
                            {channel}
                          </option>
                        )
                      )}
                    </select>
                    {selected.sentAt && (
                      <span className="text-xs text-gray-500">
                        Sent {new Date(selected.sentAt).toLocaleDateString()}
                        {selected.sentVia ? ` via ${selected.sentVia}` : ''} ·
                        snapshot frozen
                      </span>
                    )}
                  </div>

                  <textarea
                    value={selected.outcomeNotes ?? ''}
                    onChange={e =>
                      setSelected({ ...selected, outcomeNotes: e.target.value })
                    }
                    onBlur={() =>
                      setApplicationStatus(
                        selected.applicationStatus ?? 'not_sent',
                        { outcomeNotes: selected.outcomeNotes ?? '' }
                      )
                    }
                    rows={2}
                    placeholder="Notes — who replied, what they asked, what happened…"
                    className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </Card>

                {/* Warnings */}
                {(blockers.length > 0 || reviews.length > 0) && (
                  <Card className="p-6">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Checks
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {[...blockers, ...reviews].map((w, i) => (
                        <li
                          key={`${w.path}-${i}`}
                          className={`rounded border px-3 py-2 ${
                            w.severity === 'blocker'
                              ? 'border-red-200 bg-red-50 text-red-800'
                              : 'border-amber-200 bg-amber-50 text-amber-800'
                          }`}
                        >
                          <span className="font-mono text-xs opacity-70">
                            {w.locale ? `${w.locale} · ` : ''}
                            {w.path}
                          </span>
                          <p>{w.message}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Content */}
                <Card className="p-6">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-lg border border-gray-200 p-1">
                      {(['brief', 'cv', 'letter'] as const).map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setTab(value)}
                          className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                            tab === value
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-600'
                          }`}
                        >
                          {value === 'brief'
                            ? 'Fit brief'
                            : value === 'cv'
                              ? 'CV'
                              : 'Cover letter'}
                        </button>
                      ))}
                    </div>

                    <div className="inline-flex rounded-lg border border-gray-200 p-1">
                      {LOCALES.map(locale => (
                        <button
                          key={locale}
                          type="button"
                          disabled={!selected.content?.[locale]}
                          onClick={() => {
                            setActiveLocale(locale)
                            setDraftJson(
                              JSON.stringify(
                                selected.content?.[locale] ?? {},
                                null,
                                2
                              )
                            )
                          }}
                          className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-30 ${
                            activeLocale === locale
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-600'
                          }`}
                        >
                          {locale.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {tab === 'brief' && (
                    <div>
                      <p className="mb-2 text-xs text-gray-500">
                        Edit any wording below and save. It is re-validated on
                        save, so a change that breaks a claim shows up in
                        Checks.
                      </p>
                      <textarea
                        value={draftJson}
                        onChange={e => setDraftJson(e.target.value)}
                        rows={22}
                        spellCheck={false}
                        className="w-full rounded-lg border border-gray-300 p-3 font-mono text-xs"
                      />
                      <div className="mt-3 flex gap-2">
                        <Button onClick={saveContent} disabled={savingEdit}>
                          {savingEdit ? 'Saving…' : 'Save changes'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setDraftJson(
                              JSON.stringify(
                                selected.content?.[activeLocale] ?? {},
                                null,
                                2
                              )
                            )
                          }
                        >
                          Revert
                        </Button>
                      </div>
                    </div>
                  )}

                  {tab !== 'brief' && (
                    <div>
                      {(
                        tab === 'cv'
                          ? selected.cvContent?.[activeLocale]
                          : selected.coverLetter?.[activeLocale]
                      ) ? (
                        <>
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={`/api/admin/brief/${selected.id}/document?kind=${
                                tab === 'cv' ? 'cv' : 'cover-letter'
                              }&locale=${activeLocale}`}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download .docx ({activeLocale.toUpperCase()})
                            </a>
                          </Button>
                          <pre className="mt-4 max-h-[28rem] overflow-auto rounded-lg bg-gray-50 p-3 text-xs">
                            {JSON.stringify(
                              tab === 'cv'
                                ? selected.cvContent?.[activeLocale]
                                : selected.coverLetter?.[activeLocale],
                              null,
                              2
                            )}
                          </pre>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Nothing generated for {LOCALE_LABEL[activeLocale]}{' '}
                          yet.
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
