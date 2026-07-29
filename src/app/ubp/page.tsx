'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { ubpContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'fr', label: 'FR' },
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
              ? 'bg-white text-[#0b1512]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Hero: an enabling platform drawn as concentric access rings. Divisions sit on
   the outer edge; each spoke runs inward only as far as its data classification
   allows, and the innermost ring — the confidential core — is reached by few.
   The shape of "differentiated access by domain", rather than a network graph. */
const CX = 800
const CY = 500
const RINGS = [150, 250, 350, 450] as const
const DIVISIONS = 12

/** Each division's inward reach: index into RINGS (0 = confidential core). */
const REACH = [0, 2, 1, 3, 0, 2, 2, 1, 3, 1, 2, 0]

/* Rounded on the way out: Math.cos/sin can differ in the last bits between the
   server and the browser, and React treats that as a hydration mismatch. */
const round = (n: number) => Math.round(n * 100) / 100

const spoke = (i: number) => {
  const angle = (i / DIVISIONS) * Math.PI * 2 - Math.PI / 2
  const outer = RINGS[RINGS.length - 1]
  const inner = RINGS[REACH[i]]
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x1: round(CX + outer * cos),
    y1: round(CY + outer * sin),
    x2: round(CX + inner * cos),
    y2: round(CY + inner * sin),
  }
}

const SPOKES = Array.from({ length: DIVISIONS }, (_, i) => spoke(i))

function HeroAccessRings() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const requests = el.querySelectorAll<SVGPathElement>('[data-request]')
      requests.forEach((request, index) => {
        gsap.fromTo(
          request,
          { strokeDashoffset: 0.14, opacity: 0 },
          {
            strokeDashoffset: -1,
            opacity: 1,
            duration: 2.6 + (index % 4) * 0.45,
            delay: index * 0.42,
            ease: 'none',
            repeat: -1,
            repeatDelay: 1.8,
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <div className="absolute inset-0 bg-[#0b1512]">
      <svg
        ref={ref}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {/* Classification rings — the innermost is the confidential core */}
        {RINGS.map((r, i) => (
          <circle
            key={`ring-${r}`}
            cx={CX}
            cy={CY}
            r={r}
            stroke={
              i === 0 ? 'rgba(179, 163, 105, 0.42)' : 'rgba(95, 191, 168, 0.16)'
            }
            strokeWidth={i === 0 ? 1.75 : 1.25}
            strokeDasharray={i === 0 ? undefined : '3 9'}
          />
        ))}

        {/* Spokes — each division reaches only as far as it is permitted */}
        {SPOKES.map(s => (
          <path
            key={`s-${s.x1.toFixed(0)}-${s.y1.toFixed(0)}`}
            d={`M${s.x1.toFixed(1)} ${s.y1.toFixed(1)} L${s.x2.toFixed(1)} ${s.y2.toFixed(1)}`}
            stroke="rgba(95, 191, 168, 0.20)"
            strokeWidth="1.25"
          />
        ))}

        {/* Sanctioned requests travelling inward */}
        {SPOKES.filter((_, i) => i % 3 === 0).map(s => (
          <path
            key={`r-${s.x1.toFixed(0)}-${s.y1.toFixed(0)}`}
            data-request
            d={`M${s.x1.toFixed(1)} ${s.y1.toFixed(1)} L${s.x2.toFixed(1)} ${s.y2.toFixed(1)}`}
            pathLength={1}
            stroke="#5fbfa8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="0.14 2"
            strokeDashoffset={0.14}
            opacity={0}
          />
        ))}

        {/* Divisions on the outer edge */}
        {SPOKES.map(s => (
          <g key={`n-${s.x1.toFixed(0)}-${s.y1.toFixed(0)}`}>
            <circle
              cx={s.x1}
              cy={s.y1}
              r="20"
              stroke="rgba(95, 191, 168, 0.32)"
              strokeWidth="1.5"
            />
            <circle
              cx={s.x1}
              cy={s.y1}
              r="4.5"
              fill="rgba(95, 191, 168, 0.4)"
            />
          </g>
        ))}

        {/* The platform itself */}
        <circle cx={CX} cy={CY} r="54" stroke="rgba(179, 163, 105, 0.5)" />
        <circle cx={CX} cy={CY} r="9" fill="rgba(179, 163, 105, 0.55)" />
      </svg>

      {/* Glow + legibility overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 64% 54% at 72% 20%, rgba(95, 191, 168, 0.16), transparent 68%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1512] via-[#0b1512]/60 to-[#0b1512]/86" />
    </div>
  )
}

/* Intake scored on impact, effort and risk — funded items filled, the rest
   visible rather than hidden, which is the whole point of a transparent intake. */
function IntakeMatrix({ className }: { className?: string }) {
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
          duration: 1.4,
          ease: 'power2.inOut',
          stagger: 0.07,
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
      viewBox="0 0 520 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Axes: effort across, impact up */}
      <path data-plot pathLength={1} d="M64 356h404" />
      <path data-plot pathLength={1} d="M64 356V32" />
      <path data-plot pathLength={1} d="M64 44l-7 12h14z" />
      <path data-plot pathLength={1} d="M456 349l12 7-12 7z" />

      {/* The funding line */}
      <path
        data-plot
        pathLength={1}
        d="M84 132C168 96 268 214 448 168"
        strokeDasharray="6 8"
      />

      {/* Funded: high impact, contained effort */}
      {[
        [118, 96],
        [176, 138],
        [232, 118],
        [286, 168],
      ].map(([x, y]) => (
        <g key={`f-${x}`}>
          <circle data-plot pathLength={1} cx={x} cy={y} r="11" />
          <circle cx={x} cy={y} r="4" fill="currentColor" stroke="none" />
        </g>
      ))}

      {/* Considered, not funded — still on the board */}
      {[
        [150, 268],
        [214, 306],
        [312, 262],
        [368, 312],
        [402, 226],
      ].map(([x, y]) => (
        <circle
          key={`u-${x}`}
          data-plot
          pathLength={1}
          cx={x}
          cy={y}
          r="8"
          opacity="0.5"
        />
      ))}

      {/* Risk-flagged: scored, ringed, sent back rather than dropped */}
      <g>
        <circle data-plot pathLength={1} cx="352" cy="120" r="11" />
        <circle
          data-plot
          pathLength={1}
          cx="352"
          cy="120"
          r="20"
          strokeDasharray="3 6"
        />
      </g>
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function UbpFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = ubpContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.spotlight.credentials]

  return (
    <div data-brand="ubp">
      {/* ============ ACCESS RINGS HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroAccessRings />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label" style={{ color: '#9fd8c8' }}>
              {t.hero.eyebrow}
            </p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-16">
            <Reveal>
              <h1 className="font-display max-w-4xl text-[2.15rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[2.6rem] md:text-5xl lg:text-[3.5rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-[#7fd0bb]">
                  {t.hero.headlineGradient}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/80">
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

        {/* ============ THE PLATFORM PRECEDENT ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <IntakeMatrix className="pointer-events-none absolute -right-16 -top-4 hidden h-[22rem] w-auto text-(--accent) opacity-10 md:block" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="chip text-xs">{t.spotlight.chip}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold text-secondary-fg">
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

        {/* ============ WHERE THE MATCH STOPS ============ */}
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
