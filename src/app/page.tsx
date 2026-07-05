'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
  Linkedin,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap'
import { HeroCanvas } from '@/components/motion/hero-canvas'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Marquee } from '@/components/motion/marquee'
import { Magnetic } from '@/components/motion/magnetic'

const marqueeItems = [
  'adidas',
  'Runtastic',
  'StagStrat',
  'PlayerGrade',
  '165M+ users',
  'Teams across 3 countries',
  'MBA · University of Derby',
  'UEFA A Licence',
]

export default function Home() {
  const [content, setContent] = useState(defaultContent.homepage)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (process.env.NEXT_PUBLIC_USE_API === 'true') {
          const homepageContent =
            await dataService.getContentSection('homepage')
          if (
            homepageContent &&
            Object.keys(homepageContent).length > 0 &&
            homepageContent.competencies &&
            homepageContent.competencies.length > 0
          ) {
            setContent(homepageContent)
          }
        }
      } catch (error) {
        console.error(
          'Failed to load homepage content, using default content:',
          error
        )
      }
    }

    loadContent()
  }, [])

  // Hero entrance timeline
  useGSAP(
    () => {
      const el = heroRef.current
      if (!el) return
      const targets = el.querySelectorAll('[data-hero]')
      if (prefersReducedMotion()) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        targets,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.15,
        }
      )
    },
    { scope: heroRef }
  )

  const featured = defaultContent.work.featured
  const playergrade = defaultContent.work.playergrade

  return (
    <div className="min-h-screen">
      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        className="grain relative flex min-h-[92svh] flex-col justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{ background: 'var(--hero-vignette)' }}
        />
        <HeroCanvas />

        <div className="relative mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          {/* Availability badge */}
          <div data-hero className="mb-8 flex justify-center">
            <span className="chip">
              <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
              {content.hero?.badge || ''}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display mb-8 text-center text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            {(content.hero.headline || []).map((line, index) => (
              <span key={index} data-hero className="block">
                <span
                  className={
                    index === (content.hero.headline || []).length - 1
                      ? 'text-gradient'
                      : 'text-foreground'
                  }
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            data-hero
            className="mx-auto mb-12 max-w-2xl text-center text-lg leading-relaxed text-secondary-fg md:text-xl"
          >
            {content.hero?.subheadline || ''}
          </p>

          {/* CTAs */}
          <div
            data-hero
            className="mb-20 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Magnetic>
              <Link href="/work" className="btn-accent">
                View my work
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/contact" className="btn-ghost">
                Get in touch
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
                LinkedIn
              </a>
            </Magnetic>
          </div>

          {/* Metrics */}
          <div
            data-hero
            className="mx-auto grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4"
          >
            {(content.hero.metrics || []).map((metric, index) => (
              <div
                key={index}
                className="bg-background/80 px-4 py-6 text-center backdrop-blur-sm"
              >
                <div className="font-display mb-1 text-3xl font-bold text-foreground md:text-4xl">
                  <CountUp value={metric?.value || ''} />
                </div>
                <div className="text-xs text-tertiary-fg md:text-sm">
                  {metric?.label || ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
          <ChevronDown className="scroll-hint h-5 w-5 text-tertiary-fg" />
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <section className="border-y border-line py-6">
        <Marquee
          items={marqueeItems.map(item => (
            <span
              key={item}
              className="font-display text-lg font-medium text-tertiary-fg md:text-xl"
            >
              {item}
            </span>
          ))}
        />
      </section>

      {/* ============ COMPETENCIES ============ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16 max-w-2xl">
            <p className="section-label mb-4">What I do</p>
            <h2 className="font-display mb-5 text-4xl font-bold tracking-tight md:text-5xl">
              Core competencies
            </h2>
            <p className="text-lg leading-relaxed text-secondary-fg">
              Eight years across digital sports, e-commerce, fintech, and SaaS —
              including building PlayerGrade from scratch as sole founder.
              Here&apos;s what I&apos;ve picked up.
            </p>
          </Reveal>

          <Reveal
            stagger={0.08}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {(
              content.competencies ||
              defaultContent.homepage.competencies ||
              []
            ).map((competency, index) => (
              <div
                key={index}
                data-reveal-child
                className="panel panel-hover group p-7"
              >
                <div className="font-display mb-6 text-sm font-medium text-tertiary-fg transition-colors group-hover:text-(--accent)">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="font-display mb-3 text-xl font-semibold leading-snug text-foreground">
                  {competency?.title || ''}
                </h3>
                <p className="text-sm leading-relaxed text-secondary-fg">
                  {competency?.description || ''}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ SELECTED WORK ============ */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mb-16 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="section-label mb-4">Selected work</p>
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Two things worth showing first
              </h2>
            </div>
            <Link
              href="/work"
              className="link-sweep inline-flex items-center gap-1.5 text-sm font-medium text-secondary-fg hover:text-foreground"
            >
              All work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Runtastic case study */}
            <Reveal>
              <Link
                href="/work"
                className="panel panel-hover group block h-full p-8 md:p-10"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="chip text-xs">
                    adidas · Runtastic — Featured case study
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-tertiary-fg transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-(--accent)" />
                </div>
                <h3 className="font-display mb-4 text-2xl font-semibold leading-snug md:text-3xl">
                  {featured.title}
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-secondary-fg md:text-base">
                  {featured.impact}
                </p>
                <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      <CountUp value="165M+" />
                    </div>
                    <div className="text-xs text-tertiary-fg">Global users</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      <CountUp value="+55%" />
                    </div>
                    <div className="text-xs text-tertiary-fg">
                      Page load improvement
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      Zero
                    </div>
                    <div className="text-xs text-tertiary-fg">Downtime</div>
                  </div>
                </div>
              </Link>
            </Reveal>

            {/* PlayerGrade */}
            <Reveal delay={0.1}>
              <a
                href={playergrade.url}
                target="_blank"
                rel="noopener noreferrer"
                className="panel panel-hover group block h-full p-8 md:p-10"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="chip text-xs">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Founder project — {playergrade.status}
                  </span>
                  <ExternalLink className="h-5 w-5 text-tertiary-fg transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-(--accent)" />
                </div>
                <h3 className="font-display mb-4 text-2xl font-semibold leading-snug md:text-3xl">
                  {playergrade.title} — {playergrade.tagline}
                </h3>
                <p className="mb-8 text-sm leading-relaxed text-secondary-fg md:text-base">
                  Built solo, end to end: a position-calibrated scoring engine
                  that gives club scouts a consistent way to grade, compare, and
                  shortlist players.
                </p>
                <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      <CountUp value="4" />
                    </div>
                    <div className="text-xs text-tertiary-fg">
                      Live club tenants
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      <CountUp value="395" />
                    </div>
                    <div className="text-xs text-tertiary-fg">
                      Players profiled
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-foreground">
                      v6
                    </div>
                    <div className="text-xs text-tertiary-fg">
                      Scoring engine
                    </div>
                  </div>
                </div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="relative overflow-hidden border-t border-line py-28 md:py-40">
        <div
          className="absolute inset-0"
          style={{ background: 'var(--hero-vignette)' }}
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="section-label mb-6">Next step</p>
            <h2 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              {content.cta?.title || ''}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-secondary-fg">
              {content.cta?.description || ''}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <Link href="/contact" className="btn-accent">
                  Start a conversation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/about" className="btn-ghost">
                  More about me
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
