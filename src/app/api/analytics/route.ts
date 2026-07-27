import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { classifyUserAgent, refHost } from '@/lib/analytics-classify'

// Persist to the Cloudflare D1 Worker in production; use Prisma locally in dev.
// The URL falls back to the known Worker (matching api-client / admin-proxy) so
// a missing NEXT_PUBLIC_API_URL in Vercel doesn't silently disable analytics,
// and the prod/dev split keys off NODE_ENV + presence of API_SECRET rather than
// the build-inlined NEXT_PUBLIC_USE_API (which isn't set in Vercel).
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'
).replace(/\/$/, '')
const API_SECRET = process.env.API_SECRET || ''
const useWorker = process.env.NODE_ENV === 'production' && Boolean(API_SECRET)

interface PageViewInput {
  path?: string
  title?: string
  sessionId?: string
  userAgent?: string
  country?: string
  city?: string
  referrer?: string
  source?: string
  medium?: string
  campaign?: string
  ref?: string | null
  isReturning?: boolean
  isOwner?: boolean
  duration?: number
}

/** Fields derived server-side from the user agent and referrer. */
interface Enrichment {
  isBot: boolean
  botReason: string | null
  browser: string
  os: string
  deviceType: string
  refHost: string
}

function enrich(event: PageViewInput, selfHost: string | null): Enrichment {
  const ua = classifyUserAgent(event.userAgent)
  return {
    isBot: ua.isBot,
    botReason: ua.botReason,
    browser: ua.browser,
    os: ua.os,
    deviceType: ua.deviceType,
    refHost: refHost(event.referrer, selfHost),
  }
}

/**
 * D1/SQLite writes CURRENT_TIMESTAMP as 'YYYY-MM-DD HH:MM:SS' — UTC, but with
 * no timezone marker. `new Date()` parses that shape as LOCAL time, so the
 * dashboard rendered every visit shifted by the viewer's UTC offset (2 hours
 * behind in CEST). Normalize to explicit ISO-8601 UTC at the API boundary so no
 * consumer can misread it. Values that already carry a zone are left alone.
 */
function toIsoUtc(value: unknown): unknown {
  if (typeof value !== 'string') return value
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(\.\d+)?$/.exec(
    value.trim()
  )
  return m ? `${m[1]}T${m[2]}${m[3] ?? ''}Z` : value
}

// Accept either the middleware's flat page-view shape or a library event
// ({ name, properties }); normalize to one shape.
function normalize(body: any): PageViewInput {
  if (body?.name && body?.properties) {
    const p = body.properties
    return {
      path: p.url ? safePath(p.url) : p.path || '/',
      title: p.title || '',
      sessionId: body.sessionId,
      userAgent: p.userAgent || '',
      country: p.country || '',
      city: p.city || '',
      referrer: p.referrer || '',
      source: p.source || 'direct',
      medium: p.medium || '',
      campaign: p.campaign || '',
      ref: p.ref || null,
      isReturning: Boolean(p.isReturning),
      isOwner: Boolean(p.isOwner),
      duration: numeric(p.duration),
    }
  }
  return {
    path: body?.path || '/',
    title: body?.title || '',
    sessionId: body?.sessionId,
    userAgent: body?.userAgent || '',
    country: body?.country || '',
    city: body?.city || '',
    referrer: body?.referrer || '',
    source: body?.source || 'direct',
    medium: body?.medium || '',
    campaign: body?.campaign || '',
    ref: body?.ref ?? null,
    isReturning: Boolean(body?.isReturning),
    isOwner: Boolean(body?.isOwner),
    duration: numeric(body?.duration),
  }
}

function safePath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return '/'
  }
}
function numeric(v: unknown): number | undefined {
  const n = typeof v === 'string' ? parseInt(v, 10) : (v as number)
  return Number.isFinite(n) ? n : undefined
}

/**
 * Mark the most recent matching view as human-confirmed and attach engagement.
 * Matched on (sessionId, path) within a recent window rather than a view id,
 * because the beacon runs in the browser and never sees the row's id.
 */
async function confirmView(input: {
  sessionId: string
  path: string
  duration?: number
  scrollDepth?: number
}) {
  if (!input.sessionId) {
    return NextResponse.json({ success: true, sink: 'confirm-skipped' })
  }

  if (useWorker) {
    const res = await fetch(`${API_URL}/analytics/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_SECRET}`,
      },
      body: JSON.stringify(input),
    })
    return NextResponse.json({
      success: res.ok,
      sink: res.ok ? 'confirm-ok' : `confirm-${res.status}`,
    })
  }

  // Local dev: same semantics against Prisma.
  const row = await prisma.analytics.findFirst({
    where: {
      sessionId: input.sessionId,
      path: input.path,
      createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
    },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  })
  if (row) {
    await prisma.analytics.update({
      where: { id: row.id },
      data: {
        isHuman: true,
        duration: input.duration ?? undefined,
        scrollDepth: input.scrollDepth ?? undefined,
      },
    })
  }
  return NextResponse.json({ success: true, sink: 'confirm-prisma' })
}

// POST — record a page view (fire-and-forget from middleware). Never throws.
// `sink` reports which storage path ran (no secrets) so misconfiguration is
// diagnosable from the response / Vercel logs instead of failing silently.
export async function POST(request: NextRequest) {
  let sink = useWorker ? 'worker-attempt' : 'dev-prisma'
  try {
    const body = await request.json()

    // The client beacon confirms an existing view rather than creating one:
    // only a real browser runs JS, so this is what separates a genuine visitor
    // from a link scanner presenting a browser user agent. It also carries the
    // engagement numbers, which can only be known client-side.
    if (body?.type === 'confirm') {
      // Read the session from the first-party cookie the middleware set rather
      // than trusting the body — the beacon is same-origin so the cookie rides
      // along, and a client can't then confirm someone else's view.
      return await confirmView({
        sessionId: request.cookies.get('pv_sid')?.value || '',
        path: String(body.path || '/'),
        duration: numeric(body.duration),
        scrollDepth: numeric(body.scrollDepth),
      })
    }

    const event = normalize(body)
    const selfHost = request.nextUrl.hostname
    const extra = enrich(event, selfHost)

    if (useWorker) {
      const res = await fetch(`${API_URL}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({ ...event, ...extra }),
      })
      sink = res.ok ? 'worker-ok' : `worker-${res.status}`
      if (!res.ok) {
        console.error(`[analytics] worker rejected write: HTTP ${res.status}`)
      }
      // Do NOT fall back to Prisma in production — the bundled SQLite is
      // read-only/ephemeral on Vercel. Report the outcome instead.
      return NextResponse.json({ success: res.ok, sink })
    }

    // Local dev only: persist via Prisma.
    await prisma.analytics.create({
      data: {
        path: event.path || '/',
        title: event.title || '',
        sessionId: event.sessionId || `session_${Date.now()}`,
        userAgent: event.userAgent || '',
        country: event.country || '',
        city: event.city || '',
        referrer: event.referrer || '',
        source: event.source || 'direct',
        medium: event.medium || '',
        campaign: event.campaign || '',
        ref: event.ref || null,
        isReturning: Boolean(event.isReturning),
        isOwner: Boolean(event.isOwner),
        duration: event.duration ?? null,
        isBot: extra.isBot,
        botReason: extra.botReason,
        browser: extra.browser,
        os: extra.os,
        deviceType: extra.deviceType,
        refHost: extra.refHost,
      },
    })
    return NextResponse.json({ success: true, sink: 'prisma-ok' })
  } catch (e) {
    console.error('[analytics] POST failed:', (e as Error)?.message)
    // Analytics is non-critical — never fail the caller.
    return NextResponse.json({ success: true, sink: `error:${sink}` })
  }
}

// GET — admin-only aggregated summary for the dashboard.
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const timeframe = url.searchParams.get('timeframe') || '30d'
  // Own visits are excluded by default so self-traffic doesn't inflate the
  // recruiter numbers; the dashboard toggle flips this on.
  const includeOwner = url.searchParams.get('includeOwner') === '1'
  // Automated traffic is excluded the same way. Left at 34% of stored rows it
  // badly distorted the figures, so it is hidden unless explicitly requested.
  const includeBots = url.searchParams.get('includeBots') === '1'

  if (useWorker) {
    try {
      const res = await fetch(
        `${API_URL}/analytics/summary?timeframe=${timeframe}${
          includeOwner ? '&includeOwner=1' : ''
        }${includeBots ? '&includeBots=1' : ''}`,
        { headers: { Authorization: `Bearer ${API_SECRET}` } }
      )
      const data = await res.json()
      // The Worker returns SQLite-style timestamps; make them unambiguous UTC.
      if (data && Array.isArray(data.recent)) {
        data.recent = data.recent.map((r: Record<string, unknown>) => ({
          ...r,
          createdAt: toIsoUtc(r.createdAt),
        }))
      }
      return NextResponse.json(data, { status: res.status })
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch analytics summary' },
        { status: 502 }
      )
    }
  }

  // Dev fallback: build the same summary shape from Prisma.
  try {
    const days =
      timeframe === '1d'
        ? 1
        : timeframe === '7d'
          ? 7
          : timeframe === '90d'
            ? 90
            : 30
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    const where = {
      createdAt: { gte: start },
      ...(includeOwner ? {} : { isOwner: false }),
      ...(includeBots ? {} : { isBot: false }),
    }

    const [rows, totalViews, ownerViews, botRows] = await Promise.all([
      prisma.analytics.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.analytics.count({ where }),
      prisma.analytics.count({
        where: { createdAt: { gte: start }, isOwner: true },
      }),
      // Queried separately: `rows` excludes bots by default, so the breakdown
      // could never be derived from it.
      prisma.analytics.findMany({
        where: { createdAt: { gte: start }, isBot: true },
        select: { botReason: true },
      }),
    ])
    const botViews = botRows.length

    const tally = <T extends string>(
      key: (r: (typeof rows)[number]) => T | null | undefined
    ) => {
      const m = new Map<T, number>()
      for (const r of rows) {
        const k = key(r)
        if (k) m.set(k, (m.get(k) || 0) + 1)
      }
      return m
    }

    /** Mean of a numeric column over a subset, ignoring nulls. */
    const avg = (
      subset: typeof rows,
      pick: (r: (typeof rows)[number]) => number | null | undefined
    ) => {
      const vals = subset.map(pick).filter((n): n is number => n != null)
      if (!vals.length) return null
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    }

    // Sessions group views into visits, which is what "visitors" means here.
    const sessions = new Map<string, typeof rows>()
    for (const r of rows) {
      const list = sessions.get(r.sessionId) || []
      list.push(r)
      sessions.set(r.sessionId, list)
    }
    // rows are newest-first, so the last element of a session is its entry page.
    const entryTally = new Map<string, number>()
    for (const list of sessions.values()) {
      const entry = list[list.length - 1]?.path
      if (entry) entryTally.set(entry, (entryTally.get(entry) || 0) + 1)
    }

    const pathViews = tally(r => r.path)
    const pages = [...pathViews.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([path, views]) => ({
        path,
        views,
        avgDuration: avg(
          rows.filter(r => r.path === path),
          r => r.duration
        ),
        avgScroll: avg(
          rows.filter(r => r.path === path),
          r => r.scrollDepth
        ),
        countries: [
          ...tally(r => (r.path === path ? r.country || '' : '')).entries(),
        ]
          .filter(([c]) => c)
          .sort((a, b) => b[1] - a[1])
          .map(([country, v]) => ({ country, views: v })),
        refs: [...tally(r => (r.path === path ? r.ref || '' : '')).entries()]
          .filter(([c]) => c)
          .sort((a, b) => b[1] - a[1])
          .map(([ref, v]) => ({ ref, views: v })),
      }))

    return NextResponse.json({
      timeframe,
      totalViews,
      ownerViews,
      botViews,
      humanViews: rows.filter(r => r.isHuman).length,
      includeOwner,
      includeBots,
      visitors: {
        unique: sessions.size,
        pagesPerVisit: sessions.size
          ? Math.round((rows.length / sessions.size) * 10) / 10
          : 0,
        avgDuration: avg(rows, r => r.duration),
        avgScroll: avg(rows, r => r.scrollDepth),
        entryPages: [...entryTally.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([path, visits]) => ({ path, visits })),
      },
      sources: [...tally(r => r.refHost || '').entries()]
        .filter(([s]) => s)
        .sort((a, b) => b[1] - a[1])
        .map(([source, views]) => ({ source, views })),
      campaigns: [
        ...tally(r =>
          r.campaign || r.medium
            ? `${r.source || 'direct'} / ${r.medium || '—'}${r.campaign ? ` / ${r.campaign}` : ''}`
            : ''
        ).entries(),
      ]
        .filter(([c]) => c)
        .sort((a, b) => b[1] - a[1])
        .map(([campaign, views]) => ({ campaign, views })),
      devices: {
        types: [...tally(r => r.deviceType || '').entries()]
          .filter(([d]) => d)
          .sort((a, b) => b[1] - a[1])
          .map(([name, views]) => ({ name, views })),
        browsers: [...tally(r => r.browser || '').entries()]
          .filter(([d]) => d)
          .sort((a, b) => b[1] - a[1])
          .map(([name, views]) => ({ name, views })),
        os: [...tally(r => r.os || '').entries()]
          .filter(([d]) => d)
          .sort((a, b) => b[1] - a[1])
          .map(([name, views]) => ({ name, views })),
      },
      bots: [
        ...botRows
          .reduce((m, r) => {
            const k = r.botReason || 'unknown'
            return m.set(k, (m.get(k) || 0) + 1)
          }, new Map<string, number>())
          .entries(),
      ]
        .sort((a, b) => b[1] - a[1])
        .map(([reason, views]) => ({ reason, views })),
      newVsReturning: {
        new: rows.filter(r => !r.isReturning).length,
        returning: rows.filter(r => r.isReturning).length,
      },
      pages,
      countries: [...tally(r => r.country || '').entries()]
        .filter(([c]) => c)
        .sort((a, b) => b[1] - a[1])
        .map(([country, views]) => ({ country, views })),
      refs: [...tally(r => r.ref || '').entries()]
        .filter(([c]) => c)
        .sort((a, b) => b[1] - a[1])
        .map(([ref, views]) => ({ ref, views })),
      recent: rows.slice(0, 25).map(r => ({
        path: r.path,
        country: r.country,
        city: r.city,
        ref: r.ref,
        source: r.source,
        referrer: r.referrer,
        refHost: r.refHost,
        browser: r.browser,
        os: r.os,
        deviceType: r.deviceType,
        duration: r.duration,
        scrollDepth: r.scrollDepth,
        isReturning: r.isReturning ? 1 : 0,
        isOwner: r.isOwner ? 1 : 0,
        isBot: r.isBot ? 1 : 0,
        botReason: r.botReason,
        isHuman: r.isHuman ? 1 : 0,
        createdAt: r.createdAt,
      })),
    })
  } catch (error) {
    console.error('Analytics summary (dev) error:', error)
    return NextResponse.json(
      { error: 'Failed to build analytics summary' },
      { status: 500 }
    )
  }
}
