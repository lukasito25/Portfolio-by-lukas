/**
 * Page backgrounds for the document variants, drawn in code from the site's
 * own tokens rather than shipped as a designer's export.
 *
 * Same reasoning as `src/components/fit-brief/hero-motif.tsx`: the artwork is
 * derived from `globals.css`, so when the site is re-themed the documents move
 * with it, and a new variant costs nothing in binary assets. The noise is
 * seeded, so rebuilding produces the same file and the template diffs stay
 * quiet.
 *
 * Output is palette PNG. A full-page photographic gradient would be a megabyte
 * and this is an email attachment: quantising to 64 colours with dithering
 * costs nothing visible and brings the page to a few tens of kilobytes.
 *
 * The dither is also why `grain` defaults to 0. Explicit per-pixel noise is
 * what the site's `.grain` overlay does, but noise is incompressible: the same
 * page costs 29 KB dithered and 481 KB with grain at amplitude 2. The dither
 * pattern of a smooth gradient quantised to 64 colours already reads as fine
 * grain at print size, so the texture is had for free.
 */

import sharp from 'sharp'
import { INK } from './doc-kit.mjs'

/* 150 dpi A4. Enough that the vignette has no banding at print size, low
 * enough that the file stays small. */
const W = 1240
const H = 1754

const hex = value => [
  parseInt(value.slice(0, 2), 16),
  parseInt(value.slice(2, 4), 16),
  parseInt(value.slice(4, 6), 16),
]

/** Deterministic PRNG — the same one the hero motif uses, same reason. */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const mix = (base, over, alpha) => base + (over - base) * alpha

/**
 * @param {object} [o]
 * @param {string} [o.paper]   base page colour
 * @param {string} [o.accent]  vignette and top-band colour
 * @param {number} [o.vignette] peak alpha of the hero vignette; 0 for a flat page
 * @param {number} [o.grain]   grain amplitude in 0–255 units; 0 for none
 * @param {boolean} [o.band]   draw the gradient-signal rule along the top edge
 */
export async function buildBackgroundPng({
  paper = INK.paper,
  accent = INK.accent,
  vignette = 0.14,
  grain = 0,
  band = false,
} = {}) {
  const base = hex(paper)
  const tint = hex(accent)
  const deep = hex(INK.accentDeep)
  const sky = hex(INK.accentSky)

  const raw = Buffer.allocUnsafe(W * H * 3)
  const rand = mulberry32(0x1277d9)

  /* The site's --hero-vignette: an ellipse 80% wide and 60% tall, centred at
   * 50% / -10%, fading to transparent at 70% of its radius. */
  const cx = W * 0.5
  const cy = H * -0.1
  const rx = W * 0.8
  const ry = H * 0.6

  /* The top rule is --gradient-signal at 100deg: navy, through the accent, to
   * sky. Three stops at 0 / 60 / 100%, left to right. */
  const BAND_H = band ? 9 : 0

  for (let y = 0; y < H; y++) {
    const dy = (y - cy) / ry
    for (let x = 0; x < W; x++) {
      const dx = (x - cx) / rx
      const d = Math.sqrt(dx * dx + dy * dy)
      const fall = vignette ? Math.max(0, 1 - d / 0.7) * vignette : 0

      let r = mix(base[0], tint[0], fall)
      let g = mix(base[1], tint[1], fall)
      let b = mix(base[2], tint[2], fall)

      if (y < BAND_H) {
        const t = x / W
        const stops =
          t < 0.6 ? [deep, tint, t / 0.6] : [tint, sky, (t - 0.6) / 0.4]
        r = mix(stops[0][0], stops[1][0], stops[2])
        g = mix(stops[0][1], stops[1][1], stops[2])
        b = mix(stops[0][2], stops[1][2], stops[2])
      } else if (grain) {
        const n = (rand() - 0.5) * 2 * grain
        r += n
        g += n
        b += n
      }

      const i = (y * W + x) * 3
      raw[i] = Math.max(0, Math.min(255, Math.round(r)))
      raw[i + 1] = Math.max(0, Math.min(255, Math.round(g)))
      raw[i + 2] = Math.max(0, Math.min(255, Math.round(b)))
    }
  }

  return sharp(raw, { raw: { width: W, height: H, channels: 3 } })
    .png({ palette: true, colours: 64, dither: 1, compressionLevel: 9 })
    .toBuffer()
}
