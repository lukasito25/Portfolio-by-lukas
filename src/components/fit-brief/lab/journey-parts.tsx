'use client'

/* PROTOTYPE — the composed concept. Parts shared by the movements. */

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/gsap'

/**
 * Chapter numbers, not roman numerals.
 *
 * "I" set at 7rem is a vertical bar, and read as a rule rather than a number
 * — which defeats a divider whose whole job is to say which movement you are
 * entering. Two digits are unambiguous at any size and match the numbering
 * already used on the tiles and the reel.
 */
export const NUMERALS = ['01', '02', '03', '04', '05'] as const

/**
 * Green for a file that has been read.
 *
 * Not the brand accent: the accent already means "this is a direct match",
 * and one colour cannot carry both "he is strong here" and "you have seen
 * this" without meaning neither. A desaturated green sits far enough from
 * every brand accent in the registry to stay distinct, and it is never the
 * only signal — a check mark carries the same information for anyone who
 * cannot separate the two hues.
 */
export const SEEN = {
  border: 'rgb(52 211 153 / 0.45)',
  text: 'rgb(110 231 183)',
  glow: 'rgb(52 211 153 / 0.08)',
} as const

/**
 * The break between movements.
 *
 * The first version of this was a transparent screen over the same footage as
 * everything else, and it read as a gap in the page rather than a division of
 * it. This one takes the stage away: a near-opaque band, edge to edge, with
 * rules top and bottom. The footage returning afterwards is what announces the
 * new movement — the contrast does the work, not the typography.
 */
export function ChapterCard({
  numeral,
  eyebrow,
  heading,
  meta,
  ground,
}: {
  numeral: string
  eyebrow: string
  heading: string
  meta: string
  ground: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    setStill(prefersReducedMotion())
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setShown(true),
      { threshold: 0.35 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const on = shown || still

  return (
    <div
      ref={ref}
      className="relative flex min-h-[78svh] items-center border-y border-white/12 px-4 py-24 sm:px-6 lg:px-8"
      style={{ background: `color-mix(in srgb, ${ground} 94%, black)` }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex items-start gap-6 sm:gap-10">
          <p
            className={`font-display shrink-0 text-[4rem] leading-[0.8] font-bold text-(--accent) transition-all duration-700 sm:text-[7rem] ${
              on ? 'opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            {numeral}
          </p>

          <div
            className={`min-w-0 transition-all delay-150 duration-700 ${
              on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="mb-4 font-mono text-[11px] tracking-[0.24em] text-white/55 uppercase">
              {eyebrow}
            </p>
            <h2 className="font-display max-w-2xl text-[1.9rem] leading-[1.08] font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {heading}
            </h2>
            <p className="mt-7 text-sm text-white/50">{meta}</p>
          </div>
        </div>

        {/* The rule draws itself across the full measure — the one piece of
            motion a divider gets, because it reads as a page being turned. */}
        <div className="mt-14 h-px w-full overflow-hidden bg-white/10">
          <div
            className="h-full bg-(--accent) transition-[width] duration-[1200ms] ease-out"
            style={{ width: on ? '100%' : '0%' }}
          />
        </div>

        <ChevronDown className="mt-8 h-5 w-5 text-white/30" aria-hidden />
      </div>
    </div>
  )
}

/**
 * Where you are, once you are inside a movement.
 *
 * Only ever one line. It replaces the chapter card's job after you have
 * scrolled past it, which is the whole reason the card can afford to be a
 * full screen — nothing permanent has to be sacrificed to it.
 */
export function ChapterBar({
  numeral,
  label,
  detail,
  progress,
  complete,
}: {
  numeral: string
  label: string
  detail?: string
  progress?: number
  complete?: boolean
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-white/10 bg-black/45 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="font-mono text-[11px] tracking-[0.18em] text-white/70 uppercase">
          {numeral} · {label}
        </span>
        {detail && (
          <span
            className="ml-auto font-mono text-[11px]"
            style={{ color: complete ? SEEN.text : 'rgb(255 255 255 / 0.4)' }}
          >
            {detail}
          </span>
        )}
        {typeof progress === 'number' && (
          <span className="hidden h-0.5 w-24 overflow-hidden rounded-full bg-white/15 sm:block">
            <span
              className="block h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: complete ? SEEN.text : 'var(--accent)',
              }}
            />
          </span>
        )}
      </div>
    </div>
  )
}

/** Tiles and chips hold labels, never sentences. */
export function firstWords(value: string, count: number): string {
  const words = value.split(/\s+/)
  return words.length <= count ? value : `${words.slice(0, count).join(' ')}…`
}
