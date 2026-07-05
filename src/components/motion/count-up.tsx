'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface CountUpProps {
  /** Display value, e.g. "165M+", "8+", "+55%", "€1M/yr", "Zero" */
  value: string
  className?: string
  duration?: number
}

/**
 * Animates the numeric portion of a metric string from 0 to its final value
 * when scrolled into view. Non-numeric values render as-is.
 */
export function CountUp({ value, className, duration = 0.8 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = value.match(/^([^0-9]*)([\d.,]+)(.*)$/)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !match) return
      if (prefersReducedMotion()) return

      const target = parseFloat(match[2].replace(/,/g, ''))
      if (isNaN(target)) return

      const decimals = match[2].includes('.')
        ? (match[2].split('.')[1] || '').length
        : 0
      const counter = { n: 0 }

      gsap.to(counter, {
        n: target,
        duration,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${match[1]}${counter.n.toFixed(decimals)}${match[3]}`
        },
        onComplete: () => {
          el.textContent = value
        },
      })
    },
    { scope: ref }
  )

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  )
}
