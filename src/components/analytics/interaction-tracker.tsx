'use client'

/**
 * What people do on a page, site-wide.
 *
 * One mounted component, a handful of delegated listeners, and a queue that
 * flushes on a timer or when the tab goes away. Deliberately not a context or
 * a hook every component has to call: an opt-in API means the day someone
 * adds a button, it is untracked, and the gaps are invisible. A delegated
 * `document` listener covers everything that exists and everything added
 * later.
 *
 * There is an earlier attempt at this in `analytics-provider.tsx`. It was
 * never mounted, imports a symbol that does not exist and calls a method that
 * was never written, so none of it has ever run — but its event vocabulary
 * was sound and is reused here rather than reinvented.
 *
 * Three rules it follows, all of them the same ones the page-view beacon
 * follows: respect `hasOptedOut()`, never run on `/admin`, and never let a
 * failure reach the user.
 */

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { hasOptedOut } from '@/lib/consent'

interface QueuedEvent {
  name: string
  category?: string
  label?: string
  value?: string
  props?: Record<string, unknown>
  path: string
}

/** Scroll milestones, as fractions of the scrollable height. */
const MILESTONES = [25, 50, 75, 100] as const

export function InteractionTracker() {
  const pathname = usePathname()
  const queue = useRef<QueuedEvent[]>([])
  const flushTimer = useRef<number | null>(null)
  const reached = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    if (hasOptedOut()) return

    const path = pathname
    reached.current = new Set()

    const send = (useBeacon: boolean) => {
      const events = queue.current
      queue.current = []
      if (!events.length) return

      const body = JSON.stringify({ events })
      try {
        if (useBeacon && navigator.sendBeacon) {
          navigator.sendBeacon(
            '/api/analytics/event',
            new Blob([body], { type: 'application/json' })
          )
          return
        }
        void fetch('/api/analytics/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      } catch {
        /* analytics never breaks the page */
      }
    }

    /**
     * Queued rather than sent one by one.
     *
     * A reader scrolling a long brief produces four milestones in a few
     * seconds; four round trips is three too many, and on a phone it is three
     * too many radio wake-ups. Two seconds is long enough to collect a burst
     * and short enough that a bounce still reports.
     */
    const push = (event: Omit<QueuedEvent, 'path'>) => {
      queue.current.push({ ...event, path })
      if (flushTimer.current) return
      flushTimer.current = window.setTimeout(() => {
        flushTimer.current = null
        send(false)
      }, 2000)
    }

    /* ---------------------------------------------------------------- *
     * Clicks — one delegated listener for the whole document
     * ---------------------------------------------------------------- */
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      // An explicit marker always wins, so a component can name itself.
      const tagged = target.closest<HTMLElement>('[data-track]')
      if (tagged) {
        push({
          name: 'click',
          category: tagged.dataset.trackCategory || 'ui',
          label: tagged.dataset.track,
          value: tagged.dataset.trackValue,
        })
        return
      }

      const link = target.closest<HTMLAnchorElement>('a[href]')
      if (link) {
        const href = link.getAttribute('href') || ''

        if (href.startsWith('mailto:')) {
          return push({ name: 'click', category: 'contact', label: 'email' })
        }
        if (href.startsWith('tel:')) {
          return push({ name: 'click', category: 'contact', label: 'phone' })
        }

        let url: URL | null = null
        try {
          url = new URL(href, window.location.href)
        } catch {
          return
        }

        if (url.host !== window.location.host) {
          // The host is the useful part; the full URL can carry query noise.
          const host = url.host.replace(/^www\./, '')
          const known = /linkedin|github/.exec(host)?.[0]
          return push({
            name: 'click',
            category: 'outbound',
            label: known ?? host,
            value: host,
          })
        }

        if (/\.(pdf|docx?)$/i.test(url.pathname)) {
          return push({
            name: 'download',
            category: 'content',
            label: url.pathname.split('/').pop() || 'file',
          })
        }

        if (link.closest('nav')) {
          return push({
            name: 'click',
            category: 'chrome',
            label: 'nav',
            value: url.pathname,
          })
        }
        return
      }

      // The theme toggle is a button with an aria-label, not a link.
      const button = target.closest<HTMLElement>('button[aria-label]')
      const label = button?.getAttribute('aria-label') || ''
      if (/mode$/i.test(label)) {
        push({
          name: 'click',
          category: 'chrome',
          label: 'theme-toggle',
          value: label,
        })
      }
    }

    /* ---------------------------------------------------------------- *
     * Reading depth
     * ---------------------------------------------------------------- */
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        const doc = document.documentElement
        const scrollable = doc.scrollHeight - window.innerHeight
        if (scrollable <= 0) return
        const pct = Math.round(((window.scrollY || 0) / scrollable) * 100)

        // Crossed, not equalled. The earlier attempt tested `[25,50,75,90]
        // .includes(pct)`, so a fast scroll that jumped 48 → 61 reported
        // nothing at all.
        for (const milestone of MILESTONES) {
          if (pct >= milestone && !reached.current.has(milestone)) {
            reached.current.add(milestone)
            push({
              name: 'scroll',
              category: 'reading',
              label: 'depth',
              value: String(milestone),
            })
          }
        }
      })
    }

    /* ---------------------------------------------------------------- *
     * Forms — that one was started, never what was typed into it
     * ---------------------------------------------------------------- */
    const started = new Set<string>()
    const onFocusIn = (event: FocusEvent) => {
      const field = event.target as HTMLElement | null
      if (!field) return
      if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(field.tagName)) return
      const form = field.closest('form')
      const name = form?.getAttribute('name') || form?.id || 'form'
      if (started.has(name)) return
      started.add(name)
      push({ name: 'form', category: 'contact', label: 'started', value: name })
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('focusin', onFocusIn)
    window.addEventListener('scroll', onScroll, { passive: true })

    const onHide = () => {
      if (document.visibilityState === 'hidden') send(true)
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', () => send(true))

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onHide)
      if (flushTimer.current) window.clearTimeout(flushTimer.current)
      // A client-side route change ends this page's story; flush it.
      send(true)
    }
  }, [pathname])

  return null
}
