import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

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

// POST — record a page view (fire-and-forget from middleware). Never throws.
// `sink` reports which storage path ran (no secrets) so misconfiguration is
// diagnosable from the response / Vercel logs instead of failing silently.
export async function POST(request: NextRequest) {
  let sink = useWorker ? 'worker-attempt' : 'dev-prisma'
  try {
    const event = normalize(await request.json())

    if (useWorker) {
      const res = await fetch(`${API_URL}/analytics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify(event),
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

  if (useWorker) {
    try {
      const res = await fetch(
        `${API_URL}/analytics/summary?timeframe=${timeframe}${
          includeOwner ? '&includeOwner=1' : ''
        }`,
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
    }

    const [rows, totalViews, ownerViews] = await Promise.all([
      prisma.analytics.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.analytics.count({ where }),
      prisma.analytics.count({
        where: { createdAt: { gte: start }, isOwner: true },
      }),
    ])

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

    const pathViews = tally(r => r.path)
    const pages = [...pathViews.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([path, views]) => ({
        path,
        views,
        avgDuration: null,
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
      includeOwner,
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
        isReturning: r.isReturning ? 1 : 0,
        isOwner: r.isOwner ? 1 : 0,
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
