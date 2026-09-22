'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { prefersReducedMotion } from '@/lib/gsap'

/**
 * Cinematic looping backdrop for a fit-brief hero, lifted from `/fifa`.
 *
 * The poster is painted first and stays underneath; the video mounts only
 * for visitors who have not asked for reduced motion or data saving, and
 * fades in once it can play so the poster is the frame until then. The two
 * overlays are tinted with the clip's own darkest tone so the fade reads as
 * part of the footage rather than a wash over it.
 */
export function HeroVideo({
  video,
  poster,
  ground,
}: {
  video: string
  poster: string
  ground: string
}) {
  const [showVideo, setShowVideo] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData
    if (!prefersReducedMotion() && !saveData) setShowVideo(true)
  }, [])

  return (
    <div className="absolute inset-0">
      <Image
        src={poster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {/* /fifa uses 40% and a 55/25/100 gradient over footage it was designed
          around. These are a touch heavier because the clip is chosen per
          brief and one of them is a bright winter sky: measured against both
          clips, they are what keeps the eyebrow, headline and description at
          WCAG AA over every frame. */}
      <div
        className="absolute inset-0"
        style={{ background: ground, opacity: 0.5 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${ground} 0%, ${ground}59 50%, ${ground}b3 100%)`,
        }}
      />
    </div>
  )
}
