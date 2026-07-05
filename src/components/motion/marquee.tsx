'use client'

import type { ReactNode } from 'react'

interface MarqueeProps {
  items: ReactNode[]
  className?: string
}

/** Infinite horizontal marquee. Content is duplicated for a seamless loop. */
export function Marquee({ items, className }: MarqueeProps) {
  const row = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center">
          <span className="px-8 md:px-12">{item}</span>
          <span className="text-(--accent) opacity-60">✦</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`marquee-mask overflow-hidden ${className ?? ''}`}>
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
