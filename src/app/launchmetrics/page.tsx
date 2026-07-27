'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { launchmetricsContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
]

/* Locale switcher — styled for the always-dark hero */
function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale
  onChange: (locale: Locale) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur-sm">
      {locales.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            locale === l.code
              ? 'bg-white text-[#141218]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Hero backdrop: the domain's own shape — many sources flowing through an
   enrichment stage into a single delivery point. Packets travel the routes. */
const SRC_X = 150
const STAGE_X = 800
const OUT_X = 1450
const OUT_Y = 500
const SOURCES = [120, 260, 400, 540, 680, 820, 940]
const STAGES = [330, 500, 670]

/** Smooth S-curve between two points — data flowing, not a circuit trace. */
const flow = (x1: number, y1: number, x2: number, y2: number) => {
  const mid = (x1 + x2) / 2
  return `M${x1} ${y1} C${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}

const INTAKE = SOURCES.map((y, i) =>
  flow(SRC_X, y, STAGE_X, STAGES[i % STAGES.length])
)
const DELIVERY = STAGES.map(y => flow(STAGE_X, y, OUT_X, OUT_Y))
const ALL_ROUTES = [...INTAKE, ...DELIVERY]

function HeroDataFlow() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const packets = el.querySelectorAll<SVGPathElement>('[data-packet]')
      packets.forEach((packet, index) => {
        gsap.fromTo(
          packet,
          { strokeDashoffset: 0.14, opacity: 0 },
          {
            strokeDashoffset: -1,
            opacity: 1,
            duration: 2.8 + (index % 5) * 0.6,
            delay: index * 0.42,
            ease: 'none',
            repeat: -1,
            repeatDelay: 1.1,
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <div className="absolute inset-0 bg-[#141218]">
      <svg
        ref={ref}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* The routes themselves */}
        {ALL_ROUTES.map(d => (
          <path
            key={d}
            d={d}
            stroke="rgba(77, 247, 185, 0.13)"
            strokeWidth="1.5"
          />
        ))}

        {/* Packets in transit — stagger is applied by GSAP, not CSS */}
        {ALL_ROUTES.map(d => (
          <path
            key={`p-${d}`}
            data-packet
            d={d}
            pathLength={1}
            stroke="#4df7b9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="0.14 2"
            strokeDashoffset={0.14}
            opacity={0}
          />
        ))}

        {/* Sources */}
        {SOURCES.map(y => (
          <g key={`s-${y}`}>
            <rect
              x={SRC_X - 26}
              y={y - 11}
              width="52"
              height="22"
              rx="4"
              stroke="rgba(77, 247, 185, 0.28)"
              strokeWidth="1.25"
            />
          </g>
        ))}

        {/* Enrichment stage */}
        {STAGES.map(y => (
          <circle
            key={`e-${y}`}
            cx={STAGE_X}
            cy={y}
            r="16"
            stroke="rgba(77, 247, 185, 0.34)"
            strokeWidth="1.5"
          />
        ))}

        {/* Delivery */}
        <rect
          x={OUT_X - 44}
          y={OUT_Y - 40}
          width="88"
          height="80"
          rx="8"
          stroke="rgba(77, 247, 185, 0.4)"
          strokeWidth="1.75"
        />
      </svg>

      {/* Glow + legibility overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 74% 18%, rgba(77, 247, 185, 0.16), transparent 66%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141218] via-[#141218]/58 to-[#141218]/82" />
    </div>
  )
}

/* Acquisition → enrichment → delivery, drawn in on scroll */
function PipelineGraph({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const shapes = el.querySelectorAll('[data-pipe]')
      if (prefersReducedMotion()) return
      gsap.fromTo(
        shapes,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }
      )
    },
    { scope: ref }
  )

  return (
    <svg
      ref={ref}
      aria-hidden
      className={className}
      viewBox="0 0 640 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Sources */}
      {[70, 150, 230, 310].map(y => (
        <rect
          key={y}
          data-pipe
          pathLength={1}
          x="30"
          y={y}
          width="96"
          height="34"
          rx="5"
        />
      ))}

      {/* Enrichment */}
      <rect
        data-pipe
        pathLength={1}
        x="270"
        y="140"
        width="110"
        height="130"
        rx="10"
      />
      <path data-pipe pathLength={1} d="M296 176h58M296 205h58M296 234h34" />

      {/* Delivery */}
      <rect
        data-pipe
        pathLength={1}
        x="500"
        y="165"
        width="110"
        height="80"
        rx="8"
      />

      {/* Flows in */}
      <path data-pipe pathLength={1} d="M126 87C200 87 210 175 270 175" />
      <path data-pipe pathLength={1} d="M126 167C190 167 210 195 270 195" />
      <path data-pipe pathLength={1} d="M126 247C190 247 210 220 270 220" />
      <path data-pipe pathLength={1} d="M126 327C200 327 210 245 270 245" />

      {/* Flow out */}
      <path data-pipe pathLength={1} d="M380 205h120" />

      <circle cx="500" cy="205" r="4" fill="currentColor" stroke="none" />
      <circle cx="270" cy="205" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function LaunchmetricsFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = launchmetricsContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.spotlight.credentials]

  return (
    <div data-brand="launchmetrics">
      {/* ============ DATA FLOW HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroDataFlow />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label" style={{ color: '#8ff8d0' }}>
              {t.hero.eyebrow}
            </p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-20">
            <Reveal>
              <h1 className="font-display max-w-5xl text-[2.6rem] font-bold leading-[1.03] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-[#4df7b9]">
                  {t.hero.headlineGradient}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-10 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                {t.hero.description}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 bottom-24 hidden md:block lg:right-10">
          <ChevronDown className="scroll-hint h-5 w-5 text-white/50" />
        </div>
      </section>

      {/* Stat band overlapping the hero's bottom edge */}
      <div className="relative z-10 mx-auto -mt-16 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-2xl md:grid-cols-4">
            {t.hero.stats.map(stat => (
              <div key={stat.label} className="bg-background px-5 py-6">
                <div className="font-display mb-1 text-3xl font-bold text-foreground md:text-4xl">
                  <CountUp value={stat.value} />
                </div>
                <div className="text-xs text-tertiary-fg md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ============ MARQUEE ============ */}
      <section className="mt-16 border-y border-line py-5 md:mt-20">
        <Marquee
          items={marqueeItems.map(item => (
            <span
              key={item}
              className="font-display text-base font-medium text-tertiary-fg md:text-lg"
            >
              {item}
            </span>
          ))}
        />
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-20 sm:px-6 md:pt-28 md:pb-28 lg:px-8">
        {/* ============ THE ROLE, MAPPED ============ */}
        <section className="mb-24 md:mb-32">
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="section-label mb-4">{t.roleMapSection.eyebrow}</p>
                <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {t.roleMapSection.heading}
                </h2>
              </div>
            </Reveal>
            <Reveal stagger={0.06} className="lg:col-span-8">
              {t.roleMapSection.items.map((item, index) => (
                <article
                  key={item.id}
                  data-reveal-child
                  className="group grid gap-2 border-t border-line py-7 first:border-t-0 first:pt-0 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
                >
                  <span className="font-display pt-0.5 text-sm font-medium text-tertiary-fg transition-colors duration-300 group-hover:text-(--accent)">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="transition-transform duration-300 group-hover:translate-x-1">
                    <h3 className="font-display mb-2 text-lg font-semibold leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-secondary-fg">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ============ PROFILE MATCH ============ */}
        <section className="mb-24 md:mb-32">
          <Reveal className="mb-8 max-w-2xl">
            <p className="section-label mb-4">
              {t.profileMatchSection.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t.profileMatchSection.heading}
            </h2>
          </Reveal>

          {/* Interactive tally — click to spotlight a tier */}
          <Reveal className="mb-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleFilter('match')}
              aria-pressed={filter === 'match'}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === 'match'
                  ? 'border-(--accent) bg-accent-soft text-(--accent)'
                  : 'border-line text-secondary-fg hover:border-(--accent) hover:text-foreground'
              }`}
            >
              <span className="font-display text-sm">{matchCount}</span>
              {matchLabel}
            </button>
            <button
              type="button"
              onClick={() => toggleFilter('transferable')}
              aria-pressed={filter === 'transferable'}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === 'transferable'
                  ? 'border-(--accent) bg-accent-soft text-(--accent)'
                  : 'border-line text-secondary-fg hover:border-(--accent) hover:text-foreground'
              }`}
            >
              <span className="font-display text-sm">{transferCount}</span>
              {transferLabel}
            </button>
          </Reveal>

          <Reveal stagger={0.1} className="space-y-8">
            {t.profileMatchSection.panels.map(panel => (
              <div
                key={panel.title}
                data-reveal-child
                className="panel overflow-hidden"
              >
                <h3 className="font-display border-b border-line px-6 py-5 text-lg font-semibold md:px-8">
                  {panel.title}
                </h3>
                {panel.rows.map(row => {
                  const dimmed =
                    filter !== null && (filter === 'match') !== row.isMatch
                  return (
                    <div
                      key={row.requirement}
                      className={`border-b border-line px-6 py-5 transition-opacity duration-300 last:border-b-0 md:px-8 ${
                        dimmed ? 'opacity-25' : 'opacity-100'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <p className="min-w-0 flex-1 basis-64 text-sm font-medium text-foreground">
                          {row.requirement}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            row.isMatch
                              ? 'bg-accent-soft text-(--accent)'
                              : 'border border-line text-tertiary-fg'
                          }`}
                        >
                          {row.tierLabel}
                        </span>
                      </div>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-secondary-fg">
                        {row.proof}
                      </p>
                    </div>
                  )
                })}
              </div>
            ))}
          </Reveal>
        </section>

        {/* ============ THE DATA HALF ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <PipelineGraph className="pointer-events-none absolute -right-24 -top-8 hidden h-[24rem] w-auto text-(--accent) opacity-10 md:block" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="chip text-xs">{t.spotlight.chip}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {t.spotlight.statusBadge}
                </span>
              </div>
              <h2 className="font-display mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {t.spotlight.heading}
              </h2>
              <p className="mb-8 max-w-3xl leading-relaxed text-secondary-fg">
                {t.spotlight.body}
              </p>
              <div className="mb-8 flex flex-wrap gap-2">
                {t.spotlight.credentials.map(credential => (
                  <span key={credential} className="chip text-xs">
                    {credential}
                  </span>
                ))}
              </div>
              <p className="max-w-3xl text-sm font-medium text-(--accent)">
                {t.spotlight.closingLine}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ============ DATA DEPTH, HONESTLY ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="grid gap-6 border-t border-line pt-10 md:pt-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <span className="chip mb-4 inline-flex text-xs">
                {t.gap.chip}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {t.gap.heading}
              </h2>
            </div>
            <p className="leading-relaxed text-secondary-fg lg:col-span-7 lg:pt-1">
              {t.gap.body}
            </p>
          </div>
        </Reveal>

        {/* ============ CLOSING ============ */}
        <Reveal as="section">
          <div className="panel relative overflow-hidden px-6 py-14 text-center md:px-12 md:py-20">
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: 'var(--hero-vignette)' }}
            />
            <div className="relative mx-auto max-w-3xl">
              <p className="section-label mb-4">{t.closing.eyebrow}</p>
              <h2 className="font-display mb-8 text-3xl font-bold tracking-tight md:text-4xl">
                {t.closing.heading}
              </h2>
              <p className="text-left leading-relaxed text-secondary-fg md:text-center">
                {t.closing.body}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-2">
                {t.closing.credentials.map(credential => (
                  <span key={credential} className="chip text-xs">
                    {credential}
                  </span>
                ))}
              </div>
              <p className="mt-10 text-sm text-tertiary-fg">
                {t.closing.signature}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
