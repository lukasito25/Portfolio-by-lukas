'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Zap,
  Brain,
  Globe,
  Building2,
  ExternalLink,
  Cpu,
  Shield,
  Database,
  FlaskConical,
} from 'lucide-react'
import { dataService } from '@/lib/data-service'
import { defaultContent } from '@/lib/content-config'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'
import { Magnetic } from '@/components/motion/magnetic'

const professionalProjectIcons = [TrendingUp, Building2, Brain, Globe]

const processSteps = [
  {
    icon: Users,
    title: 'Understand first',
    description:
      'Talk to users, read the data, understand the constraint. I try not to start building until the problem is clear.',
  },
  {
    icon: Target,
    title: 'Be clear on the goal',
    description:
      'Write down what success looks like before starting. Saves a lot of arguments about scope later.',
  },
  {
    icon: Zap,
    title: 'Ship incrementally',
    description:
      'Small, frequent releases over big-bang launches. Easier to catch problems, easier to course-correct.',
  },
  {
    icon: BarChart3,
    title: 'Learn from what shipped',
    description:
      'Look at the numbers, talk to users again, adjust. The first version is rarely the right one.',
  },
]

export default function WorkPage() {
  const [content, setContent] = useState(defaultContent.work)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (process.env.NEXT_PUBLIC_USE_API !== 'true') return
        const workContent = await dataService.getContentSection('work')
        if (workContent) {
          setContent(workContent)
        }
      } catch (fetchError) {
        console.error(
          'Failed to fetch work content, using fallback:',
          fetchError
        )
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      {/* Hero */}
      <Reveal as="section" className="mb-20 max-w-3xl">
        <p className="section-label mb-4">Work</p>
        <h1 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          {content.hero?.title || ''}
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-secondary-fg md:text-xl">
          {content.hero?.description || ''}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'Digital Sports',
            'FinTech',
            'Website Redesigns',
            'Team Leadership',
            'International Teams',
          ].map(tag => (
            <span key={tag} className="chip text-xs">
              {tag}
            </span>
          ))}
        </div>
      </Reveal>

      {/* Featured Case Study */}
      <Reveal as="section" className="mb-16">
        <div className="panel relative overflow-hidden p-8 md:p-12">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-vignette)' }}
          />
          <div className="relative">
            <span className="chip mb-6 text-xs">Featured case study</span>
            <h2 className="font-display mb-8 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {content.featured?.title || ''}
            </h2>

            <div className="mb-10 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-line bg-(--surface) p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-rose-400" />
                  <span className="section-label !text-[0.6875rem] !text-tertiary-fg">
                    Challenge
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary-fg">
                  {content.featured?.challenge || ''}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-(--surface) p-6">
                <div className="mb-3 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-sky-400" />
                  <span className="section-label !text-[0.6875rem] !text-tertiary-fg">
                    Solution
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary-fg">
                  {content.featured?.solution || ''}
                </p>
              </div>
              <div className="rounded-2xl border border-line bg-(--surface) p-6">
                <div className="mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="section-label !text-[0.6875rem] !text-tertiary-fg">
                    Impact
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary-fg">
                  {content.featured?.impact || ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-secondary-fg">
                <Users className="h-4 w-4 text-(--accent)" />
                <span className="font-medium">165M+ Global Users</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-fg">
                <Target className="h-4 w-4 text-(--accent)" />
                <span className="font-medium">10+ Person Team</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary-fg">
                <Globe className="h-4 w-4 text-(--accent)" />
                <span className="font-medium">Multiple Locations</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* PlayerGrade — Founder Project */}
      <Reveal as="section" className="mb-24">
        <div className="panel relative overflow-hidden p-8 md:p-12">
          {/* dot grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle, var(--accent) 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
          <div className="relative">
            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="chip text-xs">Founder project</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Active Beta
                  </span>
                </div>
                <h2 className="font-display mb-2 text-3xl font-bold tracking-tight md:text-4xl">
                  {content.playergrade?.title || 'PlayerGrade'}
                </h2>
                <p className="text-lg font-medium text-(--accent)">
                  {content.playergrade?.tagline || ''}
                </p>
              </div>
              <Magnetic>
                <a
                  href={content.playergrade?.url || 'https://playergrade.app/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent !px-5 !py-2.5 text-sm"
                >
                  View live app
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Magnetic>
            </div>

            <p className="mb-10 max-w-3xl leading-relaxed text-secondary-fg">
              {content.playergrade?.description || ''}
            </p>

            {/* Challenge / Solution / Impact */}
            <div className="mb-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: Target,
                  color: 'text-rose-400',
                  label: 'Challenge',
                  text: content.playergrade?.challenge,
                },
                {
                  icon: Cpu,
                  color: 'text-sky-400',
                  label: 'Solution',
                  text: content.playergrade?.solution,
                },
                {
                  icon: TrendingUp,
                  color: 'text-emerald-400',
                  label: 'Impact',
                  text: content.playergrade?.impact,
                },
              ].map(({ icon: Icon, color, label, text }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-line bg-(--surface) p-6"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${color}`} />
                    <span className="section-label !text-[0.6875rem] !text-tertiary-fg">
                      {label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-secondary-fg">
                    {text || ''}
                  </p>
                </div>
              ))}
            </div>

            {/* Metrics */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {(content.playergrade?.metrics || []).map((metric, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-line bg-(--surface) px-2 py-4 text-center"
                >
                  <div className="font-display mb-1 text-xl font-bold text-(--accent)">
                    <CountUp value={metric.value} />
                  </div>
                  <div className="text-xs leading-tight text-tertiary-fg">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tech + trust signals */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {(content.playergrade?.technologies || []).map((tech, i) => (
                  <span key={i} className="chip text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-tertiary-fg">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  Tenant isolation verified
                </span>
                <span className="flex items-center gap-1.5">
                  <FlaskConical className="h-3.5 w-3.5 text-sky-400" />
                  168/168 tests passing
                </span>
                <span className="flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-(--accent)" />
                  CEE player pool
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Professional Projects */}
      <section className="mb-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-label mb-4">Track record</p>
          <h2 className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            {content.professionalProjects?.title || 'Professional work'}
          </h2>
          <p className="text-lg text-secondary-fg">
            {content.professionalProjects?.subtitle || ''}
          </p>
        </Reveal>

        <Reveal stagger={0.08} className="grid gap-6 lg:grid-cols-2">
          {(content.professionalProjects?.projects || []).map(
            (project, index) => {
              const Icon =
                professionalProjectIcons[
                  index % professionalProjectIcons.length
                ]
              return (
                <div
                  key={index}
                  data-reveal-child
                  className="panel panel-hover group flex h-full flex-col p-8"
                >
                  <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft">
                    <Icon className="h-5 w-5 text-(--accent)" />
                  </div>
                  <h3 className="font-display mb-3 text-xl font-semibold leading-snug">
                    {project?.title || ''}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-secondary-fg">
                    {project?.description || ''}
                  </p>
                  <div className="mt-auto">
                    <div className="mb-5 grid grid-cols-2 gap-3">
                      {(project.metrics || []).map((metric, metricIndex) => (
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
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).map((tech, techIndex) => (
                        <span key={techIndex} className="chip !py-1 text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }
          )}
        </Reveal>
      </section>

      {/* Process */}
      <Reveal as="section" className="mb-24">
        <div className="panel p-8 md:p-12">
          <div className="mb-12 max-w-2xl">
            <p className="section-label mb-4">Process</p>
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              How I work
            </h2>
            <p className="text-lg text-secondary-fg">
              Not a methodology — just the pattern I&apos;ve noticed in the work
              that actually went well.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <div key={step.title}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-sm font-medium text-tertiary-fg">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-(--border)" />
                  <step.icon className="h-4 w-4 text-(--accent)" />
                </div>
                <h3 className="font-display mb-2 text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-secondary-fg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal as="section" className="text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display mb-6 text-3xl font-bold tracking-tight md:text-4xl">
            Got something interesting to work on?
          </h2>
          <p className="mb-10 text-lg leading-relaxed text-secondary-fg">
            I&apos;m open to senior PM roles, consulting work, and advisory
            conversations. If you&apos;re building something and think my
            background might be useful, I&apos;d like to hear about it.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link href="/contact" className="btn-accent">
                Get in touch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/about" className="btn-ghost">
                More about me
              </Link>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
