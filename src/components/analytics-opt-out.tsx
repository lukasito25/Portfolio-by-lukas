'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { hasOptedOut, optIn, optOut } from '@/lib/consent'

/**
 * The opt-out control on the privacy page.
 *
 * The audience-measurement exemption from prior consent depends on visitors
 * being able to refuse, so this has to actually work and be reversible — not
 * merely describe a preference. Reads the live cookie on mount so it always
 * reflects the visitor's real state.
 */
export function AnalyticsOptOut() {
  // null until read on the client, so the two states never flash on hydration.
  const [optedOut, setOptedOut] = useState<boolean | null>(null)

  useEffect(() => {
    setOptedOut(hasOptedOut())
  }, [])

  if (optedOut === null) return null

  if (optedOut) {
    return (
      <div className="panel flex flex-wrap items-center gap-3 p-4">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
          <Check className="h-4 w-4 text-(--accent)" />
          You are opted out on this browser.
        </span>
        <button
          type="button"
          onClick={() => {
            optIn()
            setOptedOut(false)
          }}
          className="ml-auto rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-secondary-fg transition-colors hover:border-(--accent) hover:text-foreground"
        >
          Turn analytics back on
        </button>
      </div>
    )
  }

  return (
    <div className="panel flex flex-wrap items-center gap-3 p-4">
      <span className="text-sm text-secondary-fg">
        Analytics are currently on for this browser.
      </span>
      <button
        type="button"
        onClick={() => {
          optOut()
          setOptedOut(true)
        }}
        className="ml-auto rounded-full bg-(--accent) px-4 py-1.5 text-xs font-semibold text-(--accent-contrast) transition-opacity hover:opacity-90"
      >
        Opt out
      </button>
    </div>
  )
}
