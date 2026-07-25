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
  isReturning?: number
  createdAt: string
}
interface Summary {
  timeframe: string
  totalViews: number
  newVsReturning: { new: number; returning: number }
  pages: PageRow[]
  countries: CountViews[]
  refs: RefViews[]
  recent: RecentRow[]
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
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async (tf: string) => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/analytics?timeframe=${tf}`)
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
    fetchAnalytics(timeframe)
  }, [timeframe])

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
          <Button onClick={() => fetchAnalytics(timeframe)}>Try Again</Button>
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
          <div className="mt-4 flex space-x-2 sm:mt-0">
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
          </div>
        </div>
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No visits in this window
          </h3>
          <p className="text-gray-600">
            Page views appear here as visitors browse. Share a page with{' '}
            <code className="rounded bg-gray-100 px-1">?ref=name</code> to
            attribute a specific recruiter.
          </p>
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
            Page views by page, country, and recruiter link
          </p>
        </div>
        <div className="mt-4 flex space-x-2 sm:mt-0">
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
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Page Views"
          value={data.totalViews}
          icon={<Eye className="h-8 w-8" />}
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
        <MetricCard
          title="Returning"
          value={`${returningPct}%`}
          sub={`${data.newVsReturning.returning} of ${data.totalViews} views`}
          icon={<Repeat className="h-8 w-8" />}
        />
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
                /genius?ref=jane-smith
              </code>{' '}
              to see it here.
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
              </div>
              <span className="whitespace-nowrap text-xs text-gray-500">
                {a.city ? `${a.city} · ` : ''}
                {new Date(a.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
