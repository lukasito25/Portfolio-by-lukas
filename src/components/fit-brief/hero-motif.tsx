'use client'

import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import type { HeroMotif as HeroMotifName } from '@/lib/fit-brief/schema'

/**
 * The hero backdrop for a generated brief.
 *
 * Drawn in code rather than shipped as a video or image, so a new brief costs
 * nothing in binary assets and can be themed to any company. Five motifs, one
 * per broad domain, chosen by the generator.
 *
 * Two rules this file exists to enforce:
 *
 * 1. Every coordinate is rounded before it reaches the DOM. Node and the
 *    browser can disagree on the last bits of a `Math.cos` result, and React
 *    reports that as a hydration mismatch — `/ubp` shipped with exactly that
 *    bug and it was caught in a browser check rather than by any test.
 * 2. Randomness is seeded, never `Math.random()`, so the server and the client
 *    draw the same picture.
 */

const r = (n: number): number => Math.round(n * 100) / 100

/** Deterministic PRNG — same seed, same layout, on both server and client. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable seed from the brief slug, so a company's page never redraws itself. */
function seedFrom(input: string): number {
  let hash = 2166136261
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const W = 1200
const H = 800

type Shape = { key: string; el: React.ReactElement }

function circuit(rand: () => number): Shape[] {
  const shapes: Shape[] = []
  const lanes = 9

  for (let i = 0; i < lanes; i++) {
    const y = r(70 + i * 78 + rand() * 22)
    const breakAt = r(220 + rand() * 620)
    const drop = r(y + (rand() > 0.5 ? 68 : -68))

    shapes.push({
      key: `trace-${i}`,
      el: (
        <path
          data-plot
          pathLength={1}
          d={`M-20 ${y}H${breakAt}Q${r(breakAt + 26)} ${y} ${r(breakAt + 26)} ${r(y + (drop > y ? 26 : -26))}V${r(drop - (drop > y ? 26 : -26))}Q${r(breakAt + 26)} ${drop} ${r(breakAt + 52)} ${drop}H${W + 20}`}
        />
      ),
    })

    shapes.push({
      key: `pad-${i}`,
      el: <circle data-plot pathLength={1} cx={breakAt} cy={y} r={4.5} />,
    })
  }

  // A chip outline with routed pins, the anchor the traces run toward.
  const cx = r(W * 0.62)
  const cy = r(H * 0.5)
  shapes.push({
    key: 'chip',
    el: (
      <rect
        data-plot
        pathLength={1}
        x={r(cx - 90)}
        y={r(cy - 70)}
        width={180}
        height={140}
        rx={10}
      />
    ),
  })
  for (let i = 0; i < 6; i++) {
    const py = r(cy - 48 + i * 19)
    shapes.push({
      key: `pin-l-${i}`,
      el: <path data-plot pathLength={1} d={`M${r(cx - 122)} ${py}h32`} />,
    })
    shapes.push({
      key: `pin-r-${i}`,
      el: <path data-plot pathLength={1} d={`M${r(cx + 90)} ${py}h32`} />,
    })
  }

  return shapes
}

function mesh(rand: () => number): Shape[] {
  const cols = 8
  const rows = 5
  const nodes: { x: number; y: number }[] = []

  for (let c = 0; c < cols; c++) {
    for (let row = 0; row < rows; row++) {
      nodes.push({
        x: r(80 + (c * (W - 160)) / (cols - 1) + (rand() - 0.5) * 54),
        y: r(80 + (row * (H - 160)) / (rows - 1) + (rand() - 0.5) * 54),
      })
    }
  }

  const shapes: Shape[] = []
  nodes.forEach((node, i) => {
    // Connect right and down only, so each edge is drawn once.
    const right = nodes[i + rows]
    const down = (i + 1) % rows !== 0 ? nodes[i + 1] : undefined
    if (right) {
      shapes.push({
        key: `e-r-${i}`,
        el: (
          <path
            data-plot
            pathLength={1}
            d={`M${node.x} ${node.y}L${right.x} ${right.y}`}
          />
        ),
      })
    }
    if (down && rand() > 0.25) {
      shapes.push({
        key: `e-d-${i}`,
        el: (
          <path
            data-plot
            pathLength={1}
            d={`M${node.x} ${node.y}L${down.x} ${down.y}`}
          />
        ),
      })
    }
    shapes.push({
      key: `n-${i}`,
      el: (
        <circle
          data-plot
          pathLength={1}
          cx={node.x}
          cy={node.y}
          r={r(2 + rand() * 3.5)}
        />
      ),
    })
  })

  return shapes
}

function waveform(rand: () => number): Shape[] {
  const shapes: Shape[] = []
  const layers = 6

  for (let layer = 0; layer < layers; layer++) {
    const amp = r(40 + rand() * 90)
    const freq = r(0.006 + rand() * 0.005)
    const phase = r(rand() * Math.PI * 2)
    const baseline = r(140 + layer * 105)

    const points: string[] = []
    for (let x = -20; x <= W + 20; x += 20) {
      const y = r(baseline + Math.sin(x * freq + phase) * amp)
      points.push(`${x} ${y}`)
    }

    shapes.push({
      key: `wave-${layer}`,
      el: <path data-plot pathLength={1} d={`M${points.join('L')}`} />,
    })
  }

  // Vertical sampling grid, so it reads as measurement rather than decoration.
  for (let i = 0; i < 14; i++) {
    const x = r(60 + i * 82)
    shapes.push({
      key: `tick-${i}`,
      el: (
        <path
          data-plot
          pathLength={1}
          d={`M${x} 60V${H - 60}`}
          strokeDasharray="3 12"
        />
      ),
    })
  }

  return shapes
}

function topography(rand: () => number): Shape[] {
  const shapes: Shape[] = []
  const centres = [
    { x: r(W * 0.3), y: r(H * 0.42) },
    { x: r(W * 0.74), y: r(H * 0.62) },
  ]

  centres.forEach((centre, c) => {
    const rings = 11
    for (let i = 0; i < rings; i++) {
      const scale = 1 + i * 0.42
      const rx = r((70 + rand() * 26) * scale)
      const ry = r((48 + rand() * 20) * scale)
      const rotation = r(-18 + c * 30 + rand() * 12)
      shapes.push({
        key: `ring-${c}-${i}`,
        el: (
          <ellipse
            data-plot
            pathLength={1}
            cx={centre.x}
            cy={centre.y}
            rx={rx}
            ry={ry}
            transform={`rotate(${rotation} ${centre.x} ${centre.y})`}
          />
        ),
      })
    }
  })

  return shapes
}

function orbit(rand: () => number): Shape[] {
  const shapes: Shape[] = []
  const cx = r(W * 0.55)
  const cy = r(H * 0.5)

  for (let i = 0; i < 7; i++) {
    const rx = r(120 + i * 78)
    const ry = r(46 + i * 30)
    const rotation = r(i * 26 + rand() * 14)

    shapes.push({
      key: `orbit-${i}`,
      el: (
        <ellipse
          data-plot
          pathLength={1}
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          transform={`rotate(${rotation} ${cx} ${cy})`}
        />
      ),
    })

    // A body on the ring, placed by angle so it always sits on the path.
    const angle = rand() * Math.PI * 2
    const rad = (rotation * Math.PI) / 180
    const ox = rx * Math.cos(angle)
    const oy = ry * Math.sin(angle)
    shapes.push({
      key: `body-${i}`,
      el: (
        <circle
          data-plot
          pathLength={1}
          cx={r(cx + ox * Math.cos(rad) - oy * Math.sin(rad))}
          cy={r(cy + ox * Math.sin(rad) + oy * Math.cos(rad))}
          r={r(3 + rand() * 4)}
        />
      ),
    })
  }

  shapes.push({
    key: 'core',
    el: <circle data-plot pathLength={1} cx={cx} cy={cy} r={16} />,
  })

  return shapes
}

const BUILDERS: Record<HeroMotifName, (rand: () => number) => Shape[]> = {
  circuit,
  mesh,
  waveform,
  topography,
  orbit,
}

export function HeroMotif({
  motif,
  seed,
  className,
}: {
  motif: HeroMotifName
  /** Usually the brief slug. Same seed, same drawing. */
  seed: string
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      gsap.fromTo(
        el.querySelectorAll('[data-plot]'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power2.inOut',
          stagger: 0.012,
          scrollTrigger: { trigger: el, start: 'top 95%', once: true },
        }
      )
    },
    { scope: ref }
  )

  const build = BUILDERS[motif] ?? BUILDERS.mesh
  const shapes = build(mulberry32(seedFrom(`${motif}:${seed}`)))

  return (
    <svg
      ref={ref}
      aria-hidden
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      {shapes.map(shape => (
        <g key={shape.key}>{shape.el}</g>
      ))}
    </svg>
  )
}
