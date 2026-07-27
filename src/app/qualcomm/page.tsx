'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { qualcommContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
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
              ? 'bg-white text-[#04100f]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Board traces for the hero backdrop. Right-angle routing like a PCB;
   the ones flagged `pulse` carry a travelling signal. */
const HERO_TRACES = [
  { d: 'M-20 140H300l60 60h260l60 60h300', pulse: true },
  { d: 'M1460 120H1180l-60 60H860', pulse: false },
  {
    d: 'M-20 300h200l60 60h280l60 60h180l60 60h300l60 60h280',
    pulse: true,
  },
  { d: 'M200-20v140l60 60v240l60 60v440', pulse: false },
  { d: 'M1240-20v220l-60 60v220l-60 60v380', pulse: true },
  { d: 'M-20 620h400l60 60h260', pulse: false },
  { d: 'M1460 700h-400l-60 60H700', pulse: true },
  { d: 'M620 920V700l60-60V400', pulse: false },
  { d: 'M860-20v200l60 60v220', pulse: true },
  { d: 'M-20 800h260l60-60h240', pulse: false },
  { d: 'M1460 380h-160l-60-60h-240', pulse: false },
  { d: 'M420 920V780l60-60V560', pulse: true },
]

const HERO_PADS = [
  [300, 140],
  [620, 200],
  [980, 260],
  [860, 180],
  [520, 360],
  [760, 420],
  [1120, 480],
  [260, 180],
  [1180, 260],
  [700, 680],
  [700, 760],
  [680, 400],
  [920, 460],
  [560, 740],
  [1000, 320],
  [480, 560],
]

/* Animated circuit backdrop — replaces a video hero so the page carries no
   binary asset. Signals travel along the traces; with reduced motion the
   board renders static. */
function HeroCircuitry() {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || prefersReducedMotion()) return
      const pulses = el.querySelectorAll<SVGPathElement>('[data-pulse]')
      pulses.forEach((pulse, index) => {
        gsap.fromTo(
          pulse,
          { strokeDashoffset: 0.12, opacity: 0 },
          {
            strokeDashoffset: -1,
            opacity: 1,
            duration: 3.4 + (index % 4) * 0.9,
            delay: index * 0.65,
            ease: 'none',
            repeat: -1,
            repeatDelay: 1.6,
          }
        )
      })
    },
    { scope: ref }
  )

  return (
    <div className="absolute inset-0 bg-[#04100f]">
      <svg
        ref={ref}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {HERO_TRACES.map(trace => (
          <path
            key={trace.d}
            d={trace.d}
            stroke="rgba(53, 200, 200, 0.16)"
            strokeWidth="1.5"
          />
        ))}
        {HERO_PADS.map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r="3.5"
            fill="rgba(53, 200, 200, 0.28)"
          />
        ))}
        {HERO_TRACES.filter(trace => trace.pulse).map(trace => (
          <path
            key={`pulse-${trace.d}`}
            data-pulse
            d={trace.d}
            pathLength={1}
            stroke="#35c8c8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="0.12 2"
            strokeDashoffset={0.12}
            opacity={0}
          />
        ))}
      </svg>

      {/* Glow + legibility overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 78% 18%, rgba(53, 200, 200, 0.18), transparent 65%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04100f] via-[#04100f]/55 to-[#04100f]/80" />
    </div>
  )
}

/* Chip-and-traces line drawing that draws itself in as it scrolls into view */
function CircuitLines({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const shapes = el.querySelectorAll('[data-circuit]')
      if (prefersReducedMotion()) return
      gsap.fromTo(
        shapes,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
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
      {/* Die + package */}
      <rect
        data-circuit
        pathLength={1}
        x="230"
        y="120"
        width="180"
        height="180"
        rx="8"
      />
      <rect
        data-circuit
        pathLength={1}
        x="268"
        y="158"
        width="104"
        height="104"
        rx="4"
      />
      <circle cx="252" cy="142" r="4" fill="currentColor" stroke="none" />

      {/* Pins, four sides */}
      <path
        data-circuit
        pathLength={1}
        d="M230 156h-40M230 192h-40M230 228h-40M230 264h-40"
      />
      <path
        data-circuit
        pathLength={1}
        d="M410 156h40M410 192h40M410 228h40M410 264h40"
      />
      <path
        data-circuit
        pathLength={1}
        d="M266 120V80M302 120V80M338 120V80M374 120V80"
      />
      <path
        data-circuit
        pathLength={1}
        d="M266 300v40M302 300v40M338 300v40M374 300v40"
      />

      {/* Routed traces out to the board edge */}
      <path data-circuit pathLength={1} d="M190 156H120L80 116V20" />
      <path data-circuit pathLength={1} d="M190 264H140l-60 60v76" />
      <path data-circuit pathLength={1} d="M450 192h90l60-60V20" />
      <path data-circuit pathLength={1} d="M450 264h70l70 70v66" />
      <path data-circuit pathLength={1} d="M302 340v40l60 40h218" />
      <path data-circuit pathLength={1} d="M338 80V44l80-44" />

      {/* Pads */}
      <circle cx="80" cy="20" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="601" cy="20" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="80" cy="396" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="590" cy="400" r="3.5" fill="currentColor" stroke="none" />
      <circle cx="580" cy="420" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function QualcommFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = qualcommContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.spotlight.credentials]

  return (
    <div data-brand="qualcomm">
      {/* ============ CIRCUIT HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroCircuitry />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label" style={{ color: '#7fe3e0' }}>
              {t.hero.eyebrow}
            </p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-20">
            <Reveal>
              <h1 className="font-display max-w-5xl text-[2.6rem] font-bold leading-[1.03] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-[#4fd8d4]">
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

        {/* ============ BUILDING AI HANDS-ON ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <CircuitLines className="pointer-events-none absolute -right-28 -top-12 hidden h-[26rem] w-auto text-(--accent) opacity-10 md:block" />
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

        {/* ============ SILICON, HONESTLY ============ */}
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
