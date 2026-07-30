'use client'

import { useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { HeroCanvas } from '@/components/motion/hero-canvas'
import { scanditContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
]

/* Locale switcher — uses the site's own surface tokens, so it reads the same
   in light and dark rather than assuming a dark hero behind it. */
function LocaleToggle({
  locale,
  onChange,
}: {
  locale: Locale
  onChange: (locale: Locale) => void
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-line bg-[var(--surface)] p-1">
      {locales.map(l => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
            locale === l.code
              ? 'bg-accent-soft text-(--accent)'
              : 'text-tertiary-fg hover:text-foreground'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Catalog entries bound to shelf positions, with one position drifted out of
   sync — the failure mode the spotlight is about. */
function PlanogramMatch({ className }: { className?: string }) {
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
          stagger: 0.06,
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
      viewBox="0 0 560 400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      {/* Catalog entries */}
      {[60, 132, 204, 276].map((y, i) => (
        <g key={`c-${y}`}>
          <rect
            data-plot
            pathLength={1}
            x="24"
            y={y}
            width="150"
            height="46"
            rx="5"
          />
          <path data-plot pathLength={1} d={`M44 ${y + 18}h${86 - i * 12}`} />
          <path data-plot pathLength={1} d={`M44 ${y + 32}h${58 + i * 8}`} />
        </g>
      ))}

      {/* Shelf model */}
      {[70, 170, 270].map(y => (
        <path key={`r-${y}`} data-plot pathLength={1} d={`M300 ${y}h236`} />
      ))}
      {[
        [312, 70],
        [372, 70],
        [446, 70],
        [312, 170],
        [388, 170],
        [462, 170],
        [312, 270],
        [396, 270],
      ].map(([x, y]) => (
        <rect
          key={`s-${x}-${y}`}
          data-plot
          pathLength={1}
          x={x}
          y={y - 52}
          width="52"
          height="52"
          rx="3"
        />
      ))}

      {/* Bindings */}
      <path data-plot pathLength={1} d="M174 83h64l14 -25h48" />
      <path data-plot pathLength={1} d="M174 155h50l18 28h64" />
      <path data-plot pathLength={1} d="M174 227h74l16 56h36" />

      {/* The position that drifted */}
      <rect
        data-plot
        pathLength={1}
        x="455"
        y="205"
        width="66"
        height="66"
        rx="6"
        strokeDasharray="5 7"
      />
      <path data-plot pathLength={1} d="M488 288v22" />
      <circle cx="488" cy="322" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function ScanditFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = scanditContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.spotlight.credentials]

  return (
    <div>
      {/* ============ HERO — same composition as the homepage ============ */}
      <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'var(--hero-vignette)' }}
        />
        <HeroCanvas />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label">{t.hero.eyebrow}</p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-16">
            <Reveal>
              <h1 className="font-display max-w-4xl text-[2.15rem] font-bold leading-[1.08] tracking-tight sm:text-[2.6rem] md:text-5xl lg:text-[3.5rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-gradient">{t.hero.headlineGradient}</span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-secondary-fg">
                {t.hero.description}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute right-6 bottom-24 hidden md:block lg:right-10">
          <ChevronDown className="scroll-hint h-5 w-5 text-tertiary-fg" />
        </div>
      </section>

      {/* Metrics band overlapping the hero's bottom edge — as on the homepage */}
      <div className="relative z-10 mx-auto -mt-14 w-full max-w-6xl px-4 sm:px-6 lg:px-8">
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

        {/* ============ THE CLOSEST PRECEDENT ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <PlanogramMatch className="pointer-events-none absolute -right-14 -top-4 hidden h-[21rem] w-auto text-(--accent) opacity-10 md:block" />
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

        {/* ============ THE DEEP-TECH HALF ============ */}
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
