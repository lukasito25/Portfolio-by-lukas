'use client'

import { useCallback, useRef, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { HeroCanvas } from '@/components/motion/hero-canvas'
import { zalandoContent, type Locale, type RoleMapItem } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
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

/* The seven asks as a swipeable deck rather than seven paragraphs. Native
   scroll-snap does the work, so touch, trackpad and the arrow buttons all
   behave the same and nothing breaks without JS. */
function RoleCardSlider({ items }: { items: RoleMapItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  const goTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[index] as HTMLElement | undefined
    if (!card) return
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }, [])

  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    let nearest = 0
    let smallest = Number.POSITIVE_INFINITY
    Array.from(track.children).forEach((child, index) => {
      const distance = Math.abs(
        (child as HTMLElement).offsetLeft - track.offsetLeft - track.scrollLeft
      )
      if (distance < smallest) {
        smallest = distance
        nearest = index
      }
    })
    setActive(nearest)
  }, [])

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <article
            key={item.id}
            className="panel panel-hover w-[84%] shrink-0 snap-start p-6 sm:w-[54%] lg:w-[38%]"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="chip text-xs">{item.tag}</span>
              <span className="font-display text-sm font-medium text-tertiary-fg">
                {String(index + 1).padStart(2, '0')} / {items.length}
              </span>
            </div>
            <h3 className="font-display mb-3 text-lg font-semibold leading-snug">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-secondary-fg">
              {item.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => goTo(Math.max(0, active - 1))}
          disabled={active === 0}
          aria-label="Previous card"
          className="rounded-full border border-line p-2 text-secondary-fg transition-colors hover:border-(--accent) hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => goTo(Math.min(items.length - 1, active + 1))}
          disabled={active === items.length - 1}
          aria-label="Next card"
          className="rounded-full border border-line p-2 text-secondary-fg transition-colors hover:border-(--accent) hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to ${item.tag}`}
              aria-current={index === active}
              className={`h-1.5 rounded-full transition-all ${
                index === active
                  ? 'w-6 bg-(--accent)'
                  : 'w-1.5 bg-line-strong hover:bg-(--accent)'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* A request routed to role-specific agents, returning through a verification
   pass and stopping at a human gate — the shape of the orchestration layer the
   spotlight describes. */
function OrchestrationGraph({ className }: { className?: string }) {
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

  const agents = [40, 124, 208, 292]

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
      {/* Incoming task */}
      <rect
        data-plot
        pathLength={1}
        x="18"
        y="158"
        width="96"
        height="44"
        rx="6"
      />
      <path data-plot pathLength={1} d="M36 180h60" />

      {/* Router */}
      <path data-plot pathLength={1} d="M114 180h46" />
      <circle data-plot pathLength={1} cx="180" cy="180" r="20" />
      <path data-plot pathLength={1} d="M172 180h16M180 172v16" />

      {/* Fan-out to role-specific agents */}
      {agents.map(y => (
        <g key={`a-${y}`}>
          <path
            data-plot
            pathLength={1}
            d={`M200 180C232 180 236 ${y + 22} 268 ${y + 22}`}
          />
          <rect
            data-plot
            pathLength={1}
            x="268"
            y={y}
            width="112"
            height="44"
            rx="6"
          />
          <path
            data-plot
            pathLength={1}
            d={`M286 ${y + 22}h${52 - (y % 24)}`}
          />
        </g>
      ))}

      {/* Verification pass — everything funnels back through it */}
      {agents.map(y => (
        <path
          key={`v-${y}`}
          data-plot
          pathLength={1}
          d={`M380 ${y + 22}C412 ${y + 22} 416 180 448 180`}
        />
      ))}
      <rect
        data-plot
        pathLength={1}
        x="448"
        y="150"
        width="60"
        height="60"
        rx="8"
      />
      <path data-plot pathLength={1} d="M464 180l10 12 20 -24" />

      {/* The human gate */}
      <path data-plot pathLength={1} d="M478 210v44" />
      <rect
        data-plot
        pathLength={1}
        x="430"
        y="254"
        width="96"
        height="40"
        rx="20"
        strokeDasharray="5 7"
      />
      <circle cx="478" cy="274" r="4" fill="currentColor" stroke="none" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function ZalandoFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const [panelIndex, setPanelIndex] = useState(0)
  const t = zalandoContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''
  const activePanel = t.profileMatchSection.panels[panelIndex]

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
        {/* ============ THE MANDATE, MAPPED — card deck ============ */}
        <section className="mb-24 md:mb-32">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="section-label mb-4">{t.roleMapSection.eyebrow}</p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {t.roleMapSection.heading}
              </h2>
            </div>
            <p className="text-xs text-tertiary-fg">{t.roleMapSection.hint}</p>
          </Reveal>
          <Reveal>
            <RoleCardSlider items={t.roleMapSection.items} />
          </Reveal>
        </section>

        {/* ============ THE ORCHESTRATION LAYER ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <OrchestrationGraph className="pointer-events-none absolute right-8 bottom-10 hidden h-[15rem] w-auto text-(--accent) opacity-[0.14] lg:block" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="chip text-xs">{t.spotlight.chip}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-semibold text-secondary-fg">
                  {t.spotlight.statusBadge}
                </span>
              </div>
              <h2 className="font-display mb-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {t.spotlight.heading}
              </h2>
              <p className="mb-8 max-w-2xl leading-relaxed text-secondary-fg">
                {t.spotlight.lede}
              </p>

              <div className="mb-8 grid gap-4 sm:grid-cols-2">
                {t.spotlight.pillars.map((pillar, index) => (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-line bg-background/60 p-5"
                  >
                    <div className="font-display mb-2 flex items-baseline gap-2 text-sm font-semibold">
                      <span className="text-(--accent)">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {pillar.title}
                    </div>
                    <p className="text-sm leading-relaxed text-secondary-fg">
                      {pillar.body}
                    </p>
                  </div>
                ))}
              </div>

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

        {/* ============ PROFILE MATCH — tabbed, one panel at a time ============ */}
        <section className="mb-24 md:mb-32">
          <Reveal className="mb-8 max-w-2xl">
            <p className="section-label mb-4">
              {t.profileMatchSection.eyebrow}
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {t.profileMatchSection.heading}
            </h2>
          </Reveal>

          <Reveal className="mb-6 flex flex-wrap items-center gap-6">
            {/* Panel tabs */}
            <div
              role="tablist"
              aria-label={t.profileMatchSection.heading}
              className="inline-flex items-center gap-1 rounded-full border border-line bg-[var(--surface)] p-1"
            >
              {t.profileMatchSection.panels.map((panel, index) => (
                <button
                  key={panel.title}
                  type="button"
                  role="tab"
                  aria-selected={panelIndex === index}
                  onClick={() => setPanelIndex(index)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    panelIndex === index
                      ? 'bg-accent-soft text-(--accent)'
                      : 'text-tertiary-fg hover:text-foreground'
                  }`}
                >
                  {panel.title}
                </button>
              ))}
            </div>

            {/* Tally — click to spotlight a tier */}
            <div className="flex flex-wrap gap-2">
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
            </div>
          </Reveal>

          <Reveal>
            <div role="tabpanel" className="panel overflow-hidden">
              {activePanel.rows.map(row => {
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
          </Reveal>
        </section>

        {/* ============ WHAT I WOULD BE LEARNING ============ */}
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
