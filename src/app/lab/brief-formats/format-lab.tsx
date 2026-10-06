'use client'

import type { Brand, FitBriefContent } from '@/lib/fit-brief/schema'
import { StageBackdrop } from '@/components/fit-brief/lab/stage-backdrop'
import { JourneyProto } from '@/components/fit-brief/lab/journey-proto'
import type { HeroMedia } from '@/lib/fit-brief/hero-media'

export function FormatLab({
  content,
  brand,
  slug,
  locale,
  company,
  media,
}: {
  content: FitBriefContent
  brand: Brand
  slug: string
  locale: string
  company: string
  media?: HeroMedia
}) {
  return (
    <div
      className="relative min-h-screen"
      style={
        {
          '--accent': brand.accentDark,
          '--accent-soft': `color-mix(in srgb, ${brand.accentDark} 15%, transparent)`,
        } as React.CSSProperties
      }
    >
      <StageBackdrop
        video={media?.video}
        poster={media?.poster}
        ground={media?.ground ?? '#07070d'}
        motif={brand.motif}
        seed={slug}
      />

      <div className="relative">
        <JourneyProto
          content={content}
          slug={slug}
          ground={media?.ground ?? '#07070d'}
        />
      </div>
    </div>
  )
}
