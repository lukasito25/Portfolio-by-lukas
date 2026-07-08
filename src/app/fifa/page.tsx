'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronDown, Linkedin } from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { Magnetic } from '@/components/motion/magnetic'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { fifaContent, type Locale } from './content'

const locales: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'it', label: 'IT' },
  { code: 'de', label: 'DE' },
]

/* Locale switcher — styled for the always-dark video hero */
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
              ? 'bg-white text-[#051d39]'
              : 'text-white/60 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}

/* Cinematic looping backdrop; falls back to the poster frame when the
   visitor prefers reduced motion or while the video is still buffering. */
function HeroVideo() {
  const [showVideo, setShowVideo] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!prefersReducedMotion()) setShowVideo(true)
  }, [])

  return (
    <div className="absolute inset-0">
      <Image
        src="/fifa/hero-poster.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setLoaded(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="/fifa/hero.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-[#040911]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040911] via-[#040911]/25 to-[#040911]/55" />
    </div>
  )
}

/* Half-pitch line drawing that draws itself in as it scrolls into view */
function PitchLines({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const shapes = el.querySelectorAll('[data-pitch]')
      if (prefersReducedMotion()) return
      gsap.fromTo(
        shapes,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: 'power2.inOut',
          stagger: 0.1,
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
      <rect
        data-pitch
        pathLength={1}
        x="1"
        y="1"
        width="638"
        height="418"
        rx="6"
      />
      <line data-pitch pathLength={1} x1="320" y1="1" x2="320" y2="419" />
      <circle data-pitch pathLength={1} cx="320" cy="210" r="68" />
      <circle cx="320" cy="210" r="3" fill="currentColor" stroke="none" />
      <rect data-pitch pathLength={1} x="1" y="103" width="108" height="214" />
      <rect data-pitch pathLength={1} x="1" y="158" width="42" height="104" />
      <circle cx="73" cy="210" r="2.5" fill="currentColor" stroke="none" />
      <path data-pitch pathLength={1} d="M109 178 A40 40 0 0 1 109 242" />
      <rect
        data-pitch
        pathLength={1}
        x="531"
        y="103"
        width="108"
        height="214"
      />
      <rect data-pitch pathLength={1} x="597" y="158" width="42" height="104" />
      <circle cx="567" cy="210" r="2.5" fill="currentColor" stroke="none" />
      <path data-pitch pathLength={1} d="M531 242 A40 40 0 0 1 531 178" />
    </svg>
  )
}

type MatchFilter = 'match' | 'transferable' | null

export default function FifaFitPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [filter, setFilter] = useState<MatchFilter>(null)
  const t = fifaContent[locale]

  const allRows = t.profileMatchSection.panels.flatMap(p => p.rows)
  const matchCount = allRows.filter(r => r.isMatch).length
  const transferCount = allRows.length - matchCount
  const matchLabel = allRows.find(r => r.isMatch)?.tierLabel ?? ''
  const transferLabel = allRows.find(r => !r.isMatch)?.tierLabel ?? ''

  const toggleFilter = (next: Exclude<MatchFilter, null>) =>
    setFilter(current => (current === next ? null : next))

  const marqueeItems = [...t.hero.chips, ...t.football.credentials]

  return (
    <div>
      {/* ============ CINEMATIC HERO ============ */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <HeroVideo />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-28 sm:px-6 md:pb-32 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="section-label" style={{ color: '#7cc0ff' }}>
              {t.hero.eyebrow}
            </p>
            <LocaleToggle locale={locale} onChange={setLocale} />
          </div>

          <div className="mt-auto pt-20">
            <Reveal>
              <h1 className="font-display max-w-5xl text-[2.6rem] font-bold leading-[1.03] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]">
                {t.hero.headlineLead}{' '}
                <span className="text-[#4da6ff]">
                  {t.hero.headlineGradient}
                </span>
              </h1>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
                <p className="max-w-xl text-base leading-relaxed text-white/80 md:col-span-7 md:text-lg">
                  {t.hero.description}
                </p>
                <div className="space-y-1 text-xs text-white/40 md:col-span-5 md:justify-self-end md:text-right">
                  <p>{t.hero.note}</p>
                  <p>{t.hero.paletteNote}</p>
                </div>
              </div>
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

        {/* ============ FOOTBALL ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="panel relative overflow-hidden p-8 md:p-14">
            <PitchLines className="pointer-events-none absolute -right-28 -top-12 hidden h-[26rem] w-auto text-(--accent) opacity-10 md:block" />
            <div className="relative">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="chip text-xs">{t.football.chip}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {t.football.statusBadge}
                </span>
              </div>
              <h2 className="font-display mb-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                {t.football.heading}
              </h2>
              <p className="mb-8 max-w-3xl leading-relaxed text-secondary-fg">
                {t.football.body}
              </p>
              <div className="mb-8 flex flex-wrap gap-2">
                {t.football.credentials.map(credential => (
                  <span key={credential} className="chip text-xs">
                    {credential}
                  </span>
                ))}
              </div>
              <p className="max-w-3xl text-sm font-medium text-(--accent)">
                {t.football.closingLine}
              </p>
            </div>
          </div>
        </Reveal>

        {/* ============ BLOCKCHAIN, HONESTLY ============ */}
        <Reveal as="section" className="mb-24 md:mb-32">
          <div className="grid gap-6 border-t border-line pt-10 md:pt-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <span className="chip mb-4 inline-flex text-xs">
                {t.blockchain.chip}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                {t.blockchain.heading}
              </h2>
            </div>
            <p className="leading-relaxed text-secondary-fg lg:col-span-7 lg:pt-1">
              {t.blockchain.body}
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
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Magnetic>
                  <Link href="/contact" className="btn-accent">
                    {t.closing.ctaContact}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <a
                    href="https://linkedin.com/in/hosala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                  >
                    <Linkedin className="h-4 w-4" />
                    {t.closing.ctaLinkedIn}
                  </a>
                </Magnetic>
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
