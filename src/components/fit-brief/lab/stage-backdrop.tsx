'use client'

/* PROTOTYPE — throwaway. Shared by the three format prototypes. */

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '@/lib/gsap'
import { HeroMotif } from '../hero-motif'
import type { HeroMotif as HeroMotifName } from '@/lib/fit-brief/schema'

/**
 * A stage that is alive without asking to be looked at.
 *
 * Three layers, in this order, because each one fails safely into the next:
 * the ground colour (always correct, zero bytes), the drawn motif (code only,
 * works offline, slowly drifting), and the clip when the brief has one. Over
 * all of it a heavy scrim, because this is a backdrop for reading — the test
 * is whether you stop noticing it after four seconds.
 *
 * The drift is a 40-second loop at 1.08 scale: slow enough that no single
 * moment reads as motion, fast enough that the page is never quite still.
 */
export function StageBackdrop({
  video,
  poster,
  ground,
  motif,
  seed,
}: {
  video?: string
  poster?: string
  ground: string
  motif: HeroMotifName
  seed: string
}) {
  const [playing, setPlaying] = useState(false)
  const [still, setStill] = useState(false)
  const driftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStill(prefersReducedMotion())
  }, [])

  // Fixed, not absolute: the reel scrolls for pages, and a backdrop that
  // scrolls away with it leaves the reader on flat black halfway down.
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: ground }} />

      <div
        ref={driftRef}
        className="absolute inset-0"
        style={{
          animation: still ? undefined : 'stage-drift 40s ease-in-out infinite',
        }}
      >
        {poster && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {video && !still && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setPlaying(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              playing ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
        {!video && (
          <HeroMotif
            motif={motif}
            seed={seed}
            className="absolute inset-0 h-full w-full text-(--accent) opacity-[0.3]"
          />
        )}
      </div>

      {/* The scrim. Measured, not guessed: heavy enough that white body text
          clears AA over the brightest frame of either clip. */}
      <div
        className="absolute inset-0"
        style={{ background: ground, opacity: 0.62 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 45%, transparent, ${ground} 85%)`,
        }}
      />

      <style>{`
        @keyframes stage-drift {
          0%, 100% { transform: scale(1.04) translate3d(0, 0, 0) }
          50%      { transform: scale(1.1) translate3d(-1.5%, -1%, 0) }
        }
      `}</style>
    </div>
  )
}
