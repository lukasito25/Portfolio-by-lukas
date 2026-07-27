'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Confirms a page view from the browser, and reports engagement.
 *
 * Page views are recorded server-side in middleware.ts, which is reliable for
 * geo and `?ref=` attribution but also records anything that issues an HTTP
 * request. User-agent classification catches declared bots and CLI tools, but
 * not link scanners that present a real browser UA — those fetch the HTML and
 * never execute JS. This beacon is that missing signal: if it fires, something
 * ran JavaScript.
 *
 * It never creates a row. It updates the most recent matching one, adding the
 * dwell time and scroll depth that can only be measured client-side.
 */
export function PageViewBeacon() {
  const pathname = usePathname()

  useEffect(() => {
    // The admin area is excluded from tracking upstream; don't confirm it.
    if (!pathname || pathname.startsWith('/admin')) return

    const startedAt = Date.now()
    let maxScroll = 0
    let sent = false

    const measureScroll = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      const pct =
        scrollable > 0
          ? Math.round(((window.scrollY || 0) / scrollable) * 100)
          : 100
      maxScroll = Math.min(100, Math.max(maxScroll, pct))
    }

    const send = () => {
      if (sent) return
      sent = true
      measureScroll()
      const body = JSON.stringify({
        type: 'confirm',
        path: pathname,
        duration: Math.round((Date.now() - startedAt) / 1000),
        scrollDepth: maxScroll,
      })
      // sendBeacon survives the page being torn down; fetch+keepalive is the
      // fallback for browsers without it.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics',
          new Blob([body], { type: 'application/json' })
        )
      } else {
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {})
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') send()
    }

    measureScroll()
    window.addEventListener('scroll', measureScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', send)

    return () => {
      window.removeEventListener('scroll', measureScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', send)
      // Client-side navigation away from the page is also the end of the view.
      send()
    }
  }, [pathname])

  return null
}
