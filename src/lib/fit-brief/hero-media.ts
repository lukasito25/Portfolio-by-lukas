import type { HeroMotif } from './schema'

/**
 * Footage heroes for generated briefs.
 *
 * A generated brief ships zero binary assets: its hero is drawn in code from
 * `brand.motif`, which is what lets it go live without a deploy. A few roles
 * are worth more than that — a clip that puts the company's world on screen
 * the way `/fifa` does with its stadium. This registry is how a generated
 * brief gets one.
 *
 * The mapping lives in code, not in the brief's `brand` JSON, on purpose: the
 * clip has to be committed under `public/brief/<slug>/` and deployed anyway,
 * so a URL stored in the database would only pretend to be decoupled from the
 * deploy. It also keeps the generator out of it — the model never sees a video
 * field it could invent. Adding an entry here is the one change to a generated
 * brief that needs a PR.
 *
 * The clip is the company's half of the hero; the code-drawn motif is still
 * laid over it in the brand accent, so his side of the story stays on screen.
 * Produce the two files with `scripts/build-hero-video.sh <slug> <clip>` —
 * it trims, loops, encodes to the size cap and cuts the poster from frame 0.
 */
export interface HeroMedia {
  /** Looping clip, `/brief/<slug>/hero.mp4`. Muted, ≤ ~2.5 MB. */
  video: string
  /**
   * `/brief/<slug>/hero-poster.jpg`. Must be the loop's first frame — it is
   * what the video fades in over, and any other frame shows as a jump.
   */
  poster: string
  /**
   * The clip's own darkest tone as #rrggbb. Tints the flat overlay and the
   * bottom gradient, so the fade to black is the footage's black, not ours.
   */
  ground: string
  /** Overlay motif. Defaults to the brief's `brand.motif`. */
  motif?: HeroMotif
  /** Where the footage came from and under which licence. Keep it. */
  credit: string
}

export const HERO_MEDIA: Record<string, HeroMedia> = {
  /**
   * A floodlit stadium at dusk, orbiting slowly. The mesh motif over it is
   * the tracking data the role is about — football on screen, the data layer
   * drawn on top. The loop is a ping-pong rather than a crossfade: dissolving
   * an orbiting camera into itself superimposes two angles of the same stand.
   */
  fifa: {
    video: '/brief/fifa/hero.mp4',
    poster: '/brief/fifa/hero-poster.jpg',
    ground: '#04101F',
    motif: 'mesh',
    credit:
      'Pexels 2657257 (https://www.pexels.com/video/soccer-game-in-a-stadium-2657257/) — free to use, no attribution required',
  },

  /**
   * The Matterhorn under a winter sky. On is a Swiss running brand whose
   * product line is called Cloud; the mountains are its whole visual
   * language, and the topography motif drawn over them is the same ridge as
   * contour lines. The brightest clip of the two, which is what set the
   * overlay strength in `hero-video.tsx`.
   */
  on: {
    video: '/brief/on/hero.mp4',
    poster: '/brief/on/hero-poster.jpg',
    ground: '#06182B',
    motif: 'topography',
    credit:
      'Pexels 3971604 (https://www.pexels.com/video/drone-footage-of-swiss-alps-3971604/) — free to use, no attribution required',
  },
}

export function heroMediaFor(slug: string): HeroMedia | undefined {
  return HERO_MEDIA[slug]
}
