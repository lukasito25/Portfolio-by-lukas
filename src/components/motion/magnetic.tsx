'use client'

import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** How far the element travels toward the pointer, 0–1 */
  strength?: number
}

/** Wrapper that makes its child gently follow the pointer (desktop only). */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return
      if (!window.matchMedia('(pointer: fine)').matches) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        xTo((e.clientX - rect.left - rect.width / 2) * strength)
        yTo((e.clientY - rect.top - rect.height / 2) * strength)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={`inline-block ${className ?? ''}`}>
      {children}
    </div>
  )
}
