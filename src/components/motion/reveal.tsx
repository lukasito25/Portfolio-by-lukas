'use client'

import { useRef, type ReactNode, type ElementType } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Delay in seconds before the animation starts */
  delay?: number
  /** Vertical travel distance in px */
  y?: number
  /** Stagger children marked with [data-reveal-child] instead of the wrapper */
  stagger?: number
  /** ScrollTrigger start position */
  start?: string
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  y = 28,
  stagger,
  start = 'top 85%',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const targets =
        stagger !== undefined
          ? el.querySelectorAll('[data-reveal-child]')
          : [el]

      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        gsap.set(el, { opacity: 1 })
        return
      }

      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          stagger: stagger ?? 0,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      )
      // The wrapper itself carries data-reveal for the no-flash CSS rule;
      // when staggering children, unhide it immediately.
      if (stagger !== undefined) {
        gsap.set(el, { opacity: 1 })
      }
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  )
}
