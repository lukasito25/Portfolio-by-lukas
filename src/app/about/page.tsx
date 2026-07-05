'use client'

import { useState, useEffect } from 'react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'

const heroBadges = [
  'Product Management',
  'Team Leadership',
  'Agile / Scrum',
  'Stakeholder Management',
  'SEO & Marketing',
  'Tech Migrations',
  'SaaS Founder',
  'UEFA A Licence',
]

const credentials = [
  'MBA Global — University of Derby',
  'CMI Level 7 Strategic Management',
  'Agile Product Owner Certified',
  'UEFA A Licence',
  'BSc Sport Management — University of Derby',
]

const coreSkills = {
  'Product & Strategy': [
    { name: 'Strategic Management & Planning', label: 'Expert' },
    { name: 'Team Leadership (13+ personnel)', label: 'Expert' },
    { name: 'Product Roadmap & Lifecycle', label: 'Expert' },
    { name: 'International Market Expansion', label: 'Advanced' },
  ],
  'Technical & Digital': [
    { name: 'SEO Strategy & Implementation', label: 'Expert' },
    { name: 'Tech Stack Modernization', label: 'Advanced' },
    { name: 'Agile/Scrum Methodology', label: 'Expert' },
    { name: 'Digital Marketing Integration', label: 'Advanced' },
  ],
}

export default function AboutPage() {
  const [content, setContent] = useState(defaultContent.about)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (process.env.NEXT_PUBLIC_USE_API !== 'true') return
        const aboutContent = await dataService.getContentSection('about')
        setContent(aboutContent || defaultContent.about)
      } catch (error) {
        console.error('Failed to fetch about content:', error)
        setContent(defaultContent.about)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      {/* Hero */}
      <section className="mb-24">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start">
          <Reveal className="lg:w-2/3">
            <p className="section-label mb-4">About</p>
            <h1 className="font-display mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {content.hero?.title || ''}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-secondary-fg md:text-xl">
              {content.hero?.description || ''}
            </p>
            <div className="flex flex-wrap gap-2">
              {heroBadges.map(badge => (
                <span key={badge} className="chip text-xs">
                  {badge}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15} className="lg:w-1/3">
            <div className="panel p-7">
              <p className="section-label mb-6 !text-[0.6875rem]">
                Quick stats
              </p>
              <div className="space-y-5">
                {(content.hero?.quickStats || []).map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-baseline justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-secondary-fg">
                      {stat?.label || ''}
                    </span>
                    <span className="font-display text-2xl font-bold text-foreground">
                      <CountUp value={stat?.value || ''} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mb-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-label mb-4">Principles</p>
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {content.philosophy?.title || ''}
          </h2>
          <p className="text-lg leading-relaxed text-secondary-fg">
            {content.philosophy?.description || ''}
          </p>
        </Reveal>
        <Reveal stagger={0.08} className="grid gap-5 md:grid-cols-3">
          {(content.philosophy?.cards || []).map((card, index) => (
            <div
              key={index}
              data-reveal-child
              className="panel panel-hover p-7"
            >
              <div className="font-display mb-6 text-sm font-medium text-tertiary-fg">
                {String(index + 1).padStart(2, '0')}
              </div>
              <h3 className="font-display mb-3 text-xl font-semibold leading-snug">
                {card?.title || ''}
              </h3>
              <p className="text-sm leading-relaxed text-secondary-fg">
                {card?.description || ''}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Journey — timeline */}
      <section className="mb-24">
        <Reveal className="mb-14 max-w-2xl">
          <p className="section-label mb-4">Career</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {content.journey?.title || ''}
          </h2>
        </Reveal>

        <div className="relative">
          {/* Spine */}
          <div className="timeline-spine absolute left-[7px] top-2 bottom-2 hidden w-px md:block" />

          <div className="space-y-6 md:space-y-10">
            {(content.journey?.positions || []).map((position, index) => (
              <Reveal key={index} className="relative md:pl-12">
                {/* Node */}
                <span className="absolute left-0 top-2 hidden h-[15px] w-[15px] rounded-full border-2 border-(--accent) bg-background md:block" />

                <div className="panel panel-hover p-7 md:p-8">
                  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-display text-xl font-semibold">
                        {position?.title || ''}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-(--accent)">
                        {position?.company || ''}
                      </p>
                    </div>
                    <div className="text-right text-sm text-tertiary-fg">
                      <div className="font-mono">{position?.period || ''}</div>
                      <div>{position?.location || ''}</div>
                    </div>
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-secondary-fg md:text-base">
                    {position?.description || ''}
                  </p>
                  {position.metrics && position.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {(position.metrics || []).map((metric, metricIndex) => (
                        <div
                          key={metricIndex}
                          className="rounded-xl border border-line bg-(--surface) p-3 text-center"
                        >
                          <div className="font-display text-lg font-bold text-foreground">
                            {metric?.value || ''}
                          </div>
                          <div className="text-xs text-tertiary-fg">
                            {metric?.label || ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Core skills */}
      <section className="mb-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-label mb-4">Strengths</p>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            What I&apos;m good at
          </h2>
        </Reveal>
        <Reveal stagger={0.1} className="grid gap-6 md:grid-cols-2">
          {Object.entries(coreSkills).map(([category, skills]) => (
            <div key={category} data-reveal-child className="panel p-7">
              <h3 className="font-display mb-6 text-lg font-semibold">
                {category}
              </h3>
              <div className="space-y-4">
                {skills.map(skill => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between gap-4 border-b border-line pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-secondary-fg">
                      {skill.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        skill.label === 'Expert'
                          ? 'bg-accent-soft text-(--accent)'
                          : 'border border-line text-tertiary-fg'
                      }`}
                    >
                      {skill.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Personal side */}
      <Reveal as="section">
        <div className="panel relative overflow-hidden p-8 md:p-12">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-vignette)' }}
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="section-label mb-4">Off the clock</p>
            <h2 className="font-display mb-8 text-3xl font-bold tracking-tight md:text-4xl">
              Beyond the Spreadsheets
            </h2>
            <div className="space-y-5 text-left leading-relaxed text-secondary-fg md:text-center">
              <p>
                When I&apos;m not leading cross-functional teams or architecting
                product roadmaps, you&apos;ll find me exploring the medieval
                streets of Volterra, Italy, where I&apos;m currently based. A
                UEFA A-licensed coach with professional football performance
                analysis experience, I bring genuine domain depth to everything
                sports-tech — including PlayerGrade, my football scouting SaaS
                built for clubs across Central & Eastern Europe.
              </p>
              <p>
                My journey from Slovakia through the Netherlands and Austria to
                Italy has taught me that the best products come from diverse
                perspectives and deep domain knowledge. I speak Slovak natively,
                English at C2 level, and Italian professionally (B2). Whether
                building at enterprise scale at adidas or shipping as a solo
                founder, I believe in creating products that genuinely solve
                real problems.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {credentials.map(credential => (
                <span key={credential} className="chip text-xs">
                  {credential}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
