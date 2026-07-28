'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { krakenContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
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
              ? 'bg-white text-[#101114]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Hero: assets on a ring, every one convertible into every other — the shape
   of "instantly convert any combination of stocks, crypto and cash", and a
   deliberately different form from the flow motifs on the other briefs. */
const CX = 800
const CY = 500
const R = 330
const NODES = 9

const point = (i: number) => {
  const angle = (i / NODES) * Math.PI * 2 - Math.PI / 2
  return [CX + R * Math.cos(angle), CY + R * Math.sin(angle)] as const
}

/** Chords between non-adjacent nodes, curving through the centre. */
const CHORDS: string[] = []
for (let i = 0; i < NODES; i++) {
  for (let j = i + 2; j < NODES; j++) {
    if (i === 0 && j === NODES - 1) continue
    const [x1, y1] = point(i)
    const [x2, y2] = point(j)
    CHORDS.push(
      `M${x1.toFixed(1)} ${y1.toFixed(1)} Q${CX} ${CY} ${x2.toFixed(1)} ${y2.toFixed(1)}`
    )
  }
}
/* A handful carry a live conversion. */
const ACTIVE = CHORDS.filter((_, i) => i % 4 === 0)

function HeroConvertMesh() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const trades = el.querySelectorAll<SVGPathElement>('[data-trade]')
      trades.forEach((trade, index) => {
        gsap.fromTo(
          trade,
          { strokeDashoffset: 0.12, opacity: 0 },
          {
            strokeDashoffset: -1,
            opacity: 1,
            duration: 2.2 + (index % 5) * 0.5,
            delay: index * 0.36,
            ease: 'none',
            repeat: -1,
            repeatDelay: 1.4,
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <div className="absolute inset-0 bg-[#101114]">
      <svg
        ref={ref}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {CHORDS.map(d => (
          <path
            key={d}
            d={d}
            stroke="rgba(169, 139, 255, 0.10)"
            strokeWidth="1.25"
          />
        ))}

        {/* Conversions in flight */}
        {ACTIVE.map(d => (
          <path
            key={`t-${d}`}
            data-trade
            d={d}
            pathLength={1}
            stroke="#a98bff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="0.12 2"
            strokeDashoffset={0.12}
            opacity={0}
          />
        ))}

        {/* Assets */}
        {Array.from({ length: NODES }, (_, i) => {
          const [x, y] = point(i)
          return (
            <g key={`n-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="26"
                stroke="rgba(169, 139, 255, 0.30)"
                strokeWidth="1.5"
              />
              <circle cx={x} cy={y} r="5" fill="rgba(169, 139, 255, 0.34)" />
            </g>
          )
        })}
      </svg>

      {/* Glow + legibility overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 66% 55% at 74% 18%, rgba(169, 139, 255, 0.18), transparent 66%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-[#101114]/58 to-[#101114]/84" />
    </div>
  )
}

/* Rough frame becoming a real interface — drawn in on scroll */
function PrototypeFrames({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const shapes = el.querySelectorAll('[data-frame]')
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
      {/* Prompt */}
      <rect
        data-frame
        pathLength={1}
        x="24"
        y="60"
        width="150"
        height="96"
        rx="6"
      />
      <path data-frame pathLength={1} d="M44 88h96M44 108h96M44 128h58" />

      {/* Rough frame */}
      <rect
        data-frame
        pathLength={1}
        x="240"
        y="40"
        width="150"
        height="136"
        rx="6"
      />
      <path
        data-frame
        pathLength={1}
        d="M262 70h64M262 96h106M262 118h106M262 140h74"
      />

      {/* Shipped interface */}
      <rect
        data-frame
        pathLength={1}
        x="452"
        y="24"
        width="164"
        height="170"
        rx="8"
      />
      <rect
        data-frame
        pathLength={1}
        x="472"
        y="48"
        width="124"
        height="34"
        rx="4"
      />
      <path data-frame pathLength={1} d="M472 104h124M472 126h124M472 148h80" />
      <rect
        data-frame
        pathLength={1}
        x="472"
        y="162"
        width="70"
        height="18"
        rx="9"
      />

      {/* Progression */}
      <path data-frame pathLength={1} d="M174 108h58M390 108h54" />

      {/* The loop back — learning, then changing your mind */}
      <path
        data-frame
        pathLength={1}
        d="M534 210v104c0 22-18 40-40 40H140c-22 0-40-18-40-40v-146"
      />
      <path data-frame pathLength={1} d="M92 176l8 -10 8 10" />

      <circle cx="232" cy="108" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="444" cy="108" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function KrakenFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = krakenContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.spotlight.credentials]

  return (
    <div data-brand="kraken">
      {/* ============ CONVERSION MESH HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroConvertMesh />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label" style={{ color: '#c9b5ff' }}>
              {t.hero.eyebrow}
            </p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-20">
            <Reveal>
              <h1 className="font-display max-w-5xl text-[2.5rem] font-bold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-[#a98bff]">
                  {t.hero.headlineGradient}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
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

        {/* ============ THE PROTOTYPE ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <PrototypeFrames className="pointer-events-none absolute -right-20 -top-6 hidden h-[23rem] w-auto text-(--accent) opacity-10 md:block" />
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

        {/* ============ CRYPTO, HONESTLY ============ */}
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
