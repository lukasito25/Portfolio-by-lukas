'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Eye,
  Globe,
  Link2,
  Repeat,
  MapPin,
  Clock,
  User,
  Bot,
  Monitor,
  Users,
  ExternalLink,
} from 'lucide-react'

interface CountViews {
  country: string
  views: number
}
interface RefViews {
  ref: string
  views: number
}
interface PageRow {
  path: string
  views: number
  avgDuration: number | null
  avgScroll?: number | null
  countries: CountViews[]
  refs: RefViews[]
}
interface RecentRow {
  path: string
  country?: string | null
  city?: string | null
  ref?: string | null
  source?: string | null
  referrer?: string | null
  refHost?: string | null
  browser?: string | null
  os?: string | null
  deviceType?: string | null
  duration?: number | null
  scrollDepth?: number | null
  isReturning?: number
  isOwner?: number
  isBot?: number
  botReason?: string | null
  isHuman?: number
  createdAt: string
}
interface NameViews {
  name: string
  views: number
}
interface Summary {
  timeframe: string
  totalViews: number
  /** Owner visits in this window — always counted, even when excluded above. */
  ownerViews?: number
  /** Automated visits in this window — likewise always counted. */
  botViews?: number
  /** Views confirmed by the client beacon, i.e. JavaScript actually ran. */
  humanViews?: number
  includeOwner?: boolean
  includeBots?: boolean
  visitors?: {
    unique: number
    pagesPerVisit: number
    avgDuration: number | null
    avgScroll: number | null
    entryPages: { path: string; visits: number }[]
  }
  sources?: { source: string; views: number }[]
  campaigns?: { campaign: string; views: number }[]
  devices?: { types: NameViews[]; browsers: NameViews[]; os: NameViews[] }
  bots?: { reason: string; views: number }[]
  newVsReturning: { new: number; returning: number }
  pages: PageRow[]
  countries: CountViews[]
  refs: RefViews[]
  recent: RecentRow[]
}

/** Seconds → compact "3m 12s" / "8s". */
function dwell(seconds?: number | null): string {
  if (seconds == null) return '—'
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

/**
 * Render a visit timestamp in the viewer's local time, with the zone shown so
 * it can't be misread. The API normalizes storage timestamps to ISO-8601 UTC
 * ('…Z') first — without that, SQLite's zone-less 'YYYY-MM-DD HH:MM:SS' parses
 * as local time and every row appears shifted by the UTC offset.
 */
function visitTime(ts: string): string {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ts
  // Explicit components, not dateStyle/timeStyle — V8 throws if those are
  // combined with timeZoneName.
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })
}

/** ISO 3166-1 alpha-2 → flag emoji. */
function flag(cc?: string | null): string {
  if (!cc || cc.length !== 2) return '🏳️'
  return String.fromCodePoint(
    ...[...cc.toUpperCase()].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65)
  )
}

const prettyPath = (p: string) => (p === '/' ? 'Home' : p)

interface MetricCardProps {
  title: string
  value: string | number
  sub?: string
  icon: React.ReactNode
}
function MetricCard({ title, value, sub, icon }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </Card>
  )
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30d')
  const [includeOwner, setIncludeOwner] = useState(false)
  const [includeBots, setIncludeBots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (
    tf: string,
    withOwner: boolean,
    withBots: boolean
  ) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(
        `/api/analytics?timeframe=${tf}${withOwner ? '&includeOwner=1' : ''}${
          withBots ? '&includeBots=1' : ''
        }`
      )
      if (!res.ok) throw new Error('Failed to fetch analytics data')
      setData(await res.json())
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(timeframe, includeOwner, includeBots)
  }, [timeframe, includeOwner, includeBots])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 rounded bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-96 rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Analytics Error
          </h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <Button
            onClick={() => fetchAnalytics(timeframe, includeOwner, includeBots)}
          >
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  if (!data || data.totalViews === 0) {
    return (
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            {['1d', '7d', '30d', '90d'].map(p => (
              <Button
                key={p}
                variant={timeframe === p ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant={includeOwner ? 'default' : 'outline'}
              size="sm"
              aria-pressed={includeOwner}
              onClick={() => setIncludeOwner(v => !v)}
            >
              <User className="mr-1 h-3.5 w-3.5" />
              {includeOwner ? 'My visits shown' : 'My visits hidden'}
            </Button>
            <Button
              variant={includeBots ? 'default' : 'outline'}
              size="sm"
              aria-pressed={includeBots}
              onClick={() => setIncludeBots(v => !v)}
            >
              <Bot className="mr-1 h-3.5 w-3.5" />
              {includeBots ? 'Bots shown' : 'Bots hidden'}
            </Button>
          </div>
        </div>
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No visits in this window
          </h3>
          <p className="text-gray-600">
            Page views appear here as visitors browse. Share a page with{' '}
            <code className="rounded bg-gray-100 px-1">?ref=recruiter</code> to
            attribute the channel it came from.
          </p>
          {!includeOwner &&
            typeof data?.ownerViews === 'number' &&
            data.ownerViews > 0 && (
              <p className="mt-3 text-sm text-gray-500">
                {data.ownerViews} of your own visit
                {data.ownerViews === 1 ? ' is' : 's are'} hidden — use “My
                visits hidden” above to include them.
              </p>
            )}
        </Card>
      </div>
    )
  }

  const returningPct = data.totalViews
    ? Math.round((data.newVsReturning.returning / data.totalViews) * 100)
    : 0
  const refViews = data.refs.reduce((a, r) => a + r.views, 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Page views by page, country, source and recruiter link
            {typeof data.ownerViews === 'number' && data.ownerViews > 0 && (
              <>
                {' · '}
                <span className="text-gray-600">
                  {includeOwner
                    ? `incl. ${data.ownerViews} of yours`
                    : `${data.ownerViews} of yours hidden`}
                </span>
              </>
            )}
            {typeof data.botViews === 'number' && data.botViews > 0 && (
              <>
                {' · '}
                <span className="text-gray-600">
                  {includeBots
                    ? `incl. ${data.botViews} automated`
                    : `${data.botViews} automated hidden`}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
          {['1d', '7d', '30d', '90d'].map(p => (
            <Button
              key={p}
              variant={timeframe === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeframe(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            variant={includeOwner ? 'default' : 'outline'}
            size="sm"
            aria-pressed={includeOwner}
            title="Your own visits are excluded by default. Visit /?owner=1 once on each of your devices to tag them."
            onClick={() => setIncludeOwner(v => !v)}
          >
            <User className="mr-1 h-3.5 w-3.5" />
            {includeOwner ? 'My visits shown' : 'My visits hidden'}
          </Button>
          <Button
            variant={includeBots ? 'default' : 'outline'}
            size="sm"
            aria-pressed={includeBots}
            title="Automated traffic — CLI tools, crawlers, AI bots and email link scanners — is excluded by default."
            onClick={() => setIncludeBots(v => !v)}
          >
            <Bot className="mr-1 h-3.5 w-3.5" />
            {includeBots ? 'Bots shown' : 'Bots hidden'}
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Visitors"
          value={data.visitors?.unique ?? '—'}
          sub={
            data.visitors
              ? `${data.totalViews} views · ${data.visitors.pagesPerVisit} pages/visit`
              : `${data.totalViews} views`
          }
          icon={<Users className="h-8 w-8" />}
        />
        <MetricCard
          title="Avg. time on page"
          value={dwell(data.visitors?.avgDuration)}
          sub={
            data.visitors?.avgScroll != null
              ? `${data.visitors.avgScroll}% avg scroll`
              : 'needs a confirmed visit'
          }
          icon={<Clock className="h-8 w-8" />}
        />
        <MetricCard
          title="Countries"
          value={data.countries.length}
          sub={
            data.countries[0]
              ? `Top: ${flag(data.countries[0].country)} ${data.countries[0].country}`
              : undefined
          }
          icon={<Globe className="h-8 w-8" />}
        />
        <MetricCard
          title="Ref-tagged Views"
          value={refViews}
          sub={`${data.refs.length} unique ref${data.refs.length === 1 ? '' : 's'}`}
          icon={<Link2 className="h-8 w-8" />}
        />
      </div>

      {/* Traffic quality — what was filtered, and how confident we are */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          title="Returning"
          value={`${returningPct}%`}
          sub={`${data.newVsReturning.returning} of ${data.totalViews} views`}
          icon={<Repeat className="h-8 w-8" />}
        />
        <MetricCard
          title="Browser-confirmed"
          value={
            data.totalViews && typeof data.humanViews === 'number'
              ? `${Math.round((data.humanViews / data.totalViews) * 100)}%`
              : '—'
          }
          sub={
            typeof data.humanViews === 'number'
              ? `${data.humanViews} of ${data.totalViews} ran JavaScript`
              : undefined
          }
          icon={<Eye className="h-8 w-8" />}
        />
        <MetricCard
          title="Automated filtered"
          value={data.botViews ?? 0}
          sub={
            data.bots?.length
              ? data.bots.map(b => `${b.reason} ${b.views}`).join(' · ')
              : 'none detected'
          }
          icon={<Bot className="h-8 w-8" />}
        />
      </div>

      {/* Acquisition + devices */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <ExternalLink className="mr-2 h-5 w-5" />
            Sources
          </h3>
          {data.sources?.length ? (
            <div className="space-y-2">
              {data.sources.slice(0, 8).map(s => (
                <div
                  key={s.source}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="truncate text-gray-700">{s.source}</span>
                  <span className="ml-3 font-medium text-gray-900">
                    {s.views}
                  </span>
                </div>
              ))}
              {data.campaigns?.length ? (
                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                    UTM campaigns
                  </p>
                  {data.campaigns.slice(0, 5).map(cmp => (
                    <div
                      key={cmp.campaign}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate text-gray-700">
                        {cmp.campaign}
                      </span>
                      <span className="ml-3 font-medium text-gray-900">
                        {cmp.views}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No referrer data yet. Tag links with{' '}
              <code className="rounded bg-gray-100 px-1">?utm_source=</code> to
              break them out.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Monitor className="mr-2 h-5 w-5" />
            Devices
          </h3>
          {data.devices &&
          (data.devices.types.length || data.devices.browsers.length) ? (
            <div className="space-y-4 text-sm">
              {(
                [
                  ['Type', data.devices.types],
                  ['Browser', data.devices.browsers],
                  ['OS', data.devices.os],
                ] as [string, NameViews[]][]
              ).map(([label, list]) =>
                list.length ? (
                  <div key={label}>
                    <p className="mb-1 text-xs uppercase tracking-wide text-gray-500">
                      {label}
                    </p>
                    {list.slice(0, 4).map(d => (
                      <div
                        key={d.name}
                        className="flex items-center justify-between"
                      >
                        <span className="truncate text-gray-700">{d.name}</span>
                        <span className="ml-3 font-medium text-gray-900">
                          {d.views}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No device data yet.</p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <MapPin className="mr-2 h-5 w-5" />
            Entry pages
          </h3>
          {data.visitors?.entryPages?.length ? (
            <div className="space-y-2 text-sm">
              {data.visitors.entryPages.map(e => (
                <div key={e.path} className="flex items-center justify-between">
                  <span className="truncate text-gray-700">
                    {prettyPath(e.path)}
                  </span>
                  <span className="ml-3 font-medium text-gray-900">
                    {e.visits}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              The first page of each visit appears here.
            </p>
          )}
        </Card>
      </div>

      {/* Pages × country × ref — the main table */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <MapPin className="mr-2 h-5 w-5" />
          Pages — who looked, and from where
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-4 font-medium">Page</th>
                <th className="py-2 pr-4 font-medium">Views</th>
                <th className="py-2 pr-4 font-medium">Avg. time</th>
                <th className="py-2 pr-4 font-medium">Scroll</th>
                <th className="py-2 pr-4 font-medium">Top countries</th>
                <th className="py-2 font-medium">Ref links used</th>
              </tr>
            </thead>
            <tbody>
              {data.pages.map(page => (
                <tr
                  key={page.path}
                  className="border-b border-gray-100 align-top last:border-b-0"
                >
                  <td className="py-3 pr-4">
                    <span className="font-medium text-gray-900">
                      {prettyPath(page.path)}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-gray-900">
                    {page.views}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-700">
                    {dwell(page.avgDuration)}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-gray-700">
                    {page.avgScroll != null ? `${page.avgScroll}%` : '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1.5">
                      {page.countries.length ? (
                        page.countries.slice(0, 6).map(c => (
                          <span
                            key={c.country}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                            title={`${c.country}: ${c.views}`}
                          >
                            {flag(c.country)} {c.country} {c.views}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {page.refs.length ? (
                        page.refs.map(r => (
                          <span
                            key={r.ref}
                            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            <Link2 className="h-3 w-3" />
                            {r.ref} {r.views}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Countries overview */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Globe className="mr-2 h-5 w-5" />
            Countries (all pages)
          </h3>
          <div className="space-y-3">
            {data.countries.slice(0, 8).map(c => {
              const pct = Math.round((c.views / data.totalViews) * 100)
              return (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-700">
                    {flag(c.country)} {c.country}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-sm text-gray-600">
                    {c.views} · {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Ref links overview */}
        <Card className="p-6">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <Link2 className="mr-2 h-5 w-5" />
            Recruiter links (?ref=)
          </h3>
          {data.refs.length ? (
            <div className="space-y-3">
              {data.refs.slice(0, 10).map(r => (
                <div
                  key={r.ref}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <span className="font-medium text-gray-900">{r.ref}</span>
                  <span className="text-sm text-gray-600">{r.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No tagged links used yet. Share a page as{' '}
              <code className="rounded bg-gray-100 px-1">
                /genius?ref=recruiter
              </code>{' '}
              to see it here. Use channel or page labels, never personal names —
              see <span className="whitespace-nowrap">/privacy</span>.
            </p>
          )}
        </Card>
      </div>

      {/* Recent activity */}
      <Card className="p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <Clock className="mr-2 h-5 w-5" />
          Recent visits
        </h3>
        <div className="space-y-2">
          {data.recent.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-gray-100 py-2 text-sm last:border-b-0"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span title={a.country || ''}>{flag(a.country)}</span>
                <span className="font-medium text-gray-900">
                  {prettyPath(a.path)}
                </span>
                {a.ref && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                    <Link2 className="h-3 w-3" />
                    {a.ref}
                  </span>
                )}
                {a.isReturning ? (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                    returning
                  </span>
                ) : null}
                {a.isOwner ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    <User className="h-3 w-3" />
                    you
                  </span>
                ) : null}
                {a.isBot ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700"
                    title="Filtered as automated traffic"
                  >
                    <Bot className="h-3 w-3" />
                    {a.botReason || 'bot'}
                  </span>
                ) : a.isHuman ? (
                  <span
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700"
                    title="A browser ran JavaScript on this view"
                  >
                    confirmed
                  </span>
                ) : (
                  <span
                    className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-400"
                    title="No browser confirmation — could be a scanner presenting a browser user agent, or JavaScript was blocked"
                  >
                    unconfirmed
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap text-xs text-gray-500">
                {a.refHost && a.refHost !== 'direct' ? `${a.refHost} · ` : ''}
                {a.deviceType ? `${a.deviceType} · ` : ''}
                {a.duration != null ? `${dwell(a.duration)} · ` : ''}
                {a.scrollDepth != null ? `${a.scrollDepth}% · ` : ''}
                {a.city ? `${a.city} · ` : ''}
                {visitTime(a.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
