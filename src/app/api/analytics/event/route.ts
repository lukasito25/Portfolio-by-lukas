/**
 * Interaction events — what someone did once they were on the page.
 *
 * A separate route from `/api/analytics` on purpose. That one writes a page
 * view, and its `normalize()` keeps only page-view fields: the client library
 * has been POSTing `{ name, properties }` events there for months, where the
 * name was read as a discriminator and then dropped, so every
 * `trackFormSubmission('contact_form')` quietly wrote a second, phantom view
 * of /contact and lost the event. Events now have their own endpoint, their
 * own table, and no way to inflate the view count.
 *
 * The session id comes from the `pv_sid` cookie rather than the body, exactly
 * as the view-confirm path does. That is what makes an event joinable to the
 * view it happened inside — and it means a caller cannot invent a session.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { classifyUserAgent } from '@/lib/analytics-classify'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'
).replace(/\/$/, '')
const API_SECRET = process.env.API_SECRET || ''
const useWorker = process.env.NODE_ENV === 'production' && Boolean(API_SECRET)

/** One interaction, as the browser reports it. */
interface IncomingEvent {
  name?: string
  category?: string
  label?: string
  value?: string
  props?: Record<string, unknown>
  path?: string
}

const text = (value: unknown, max: number): string | null =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null

export async function POST(request: NextRequest) {
  try {
    // The same opt-out that stops page views stops events. Checked here as
    // well as in the browser, because a stale tab could still be posting.
    if (request.cookies.get('pv_optout')?.value === '1') {
      return NextResponse.json({ success: true, sink: 'opted-out' })
    }

    const sessionId = request.cookies.get('pv_sid')?.value || ''
    if (!sessionId) {
      // No session cookie means no page view to attach to — middleware did
      // not count this as a visit either, so neither do we.
      return NextResponse.json({ success: true, sink: 'no-session' })
    }

    const body = (await request.json()) as { events?: IncomingEvent[] }
    const incoming = Array.isArray(body?.events) ? body.events.slice(0, 50) : []
    if (!incoming.length) {
      return NextResponse.json({ success: true, sink: 'empty' })
    }

    const userAgent = request.headers.get('user-agent') || ''
    const { isBot, deviceType } = classifyUserAgent(userAgent)
    const country = request.headers.get('x-vercel-ip-country') || ''
    const isOwner = request.cookies.get('pv_owner')?.value === '1'

    const events = incoming.map(event => ({
      sessionId,
      path: text(event.path, 512) ?? '/',
      name: text(event.name, 64) ?? 'event',
      category: text(event.category, 64),
      label: text(event.label, 120),
      value: text(event.value, 200),
      props: event.props ? JSON.stringify(event.props).slice(0, 500) : null,
      country: country.slice(0, 2),
      deviceType,
      isOwner,
      isBot,
    }))

    if (useWorker) {
      const res = await fetch(`${API_URL}/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_SECRET}`,
        },
        body: JSON.stringify({ events }),
      })
      return NextResponse.json({
        success: true,
        sink: res.ok ? 'worker-ok' : `worker-${res.status}`,
      })
    }

    await prisma.analyticsEvent.createMany({ data: events })
    return NextResponse.json({ success: true, sink: 'prisma-ok' })
  } catch (error) {
    // Analytics is never the reason a request fails. Swallowed, but said out
    // loud in the server log so a broken sink does not go unnoticed for weeks.
    console.error('[analytics] event write failed:', error)
    return NextResponse.json({ success: true, sink: 'error' })
  }
}
