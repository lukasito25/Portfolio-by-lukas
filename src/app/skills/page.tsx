'use client'

import {
  Target,
  Users,
  Settings,
  TrendingUp,
  Briefcase,
  RefreshCw,
} from 'lucide-react'
import { Reveal } from '@/components/motion/reveal'
import { CountUp } from '@/components/motion/count-up'

type SkillTier = 'Expert' | 'Advanced'

const skillCategories: {
  title: string
  icon: typeof Target
  skills: { name: string; tier: SkillTier }[]
}[] = [
  {
    title: 'Product Management',
    icon: Target,
    skills: [
      { name: 'Product Strategy', tier: 'Expert' },
      { name: 'Feature Prioritization', tier: 'Expert' },
      { name: 'Roadmap Planning', tier: 'Expert' },
      { name: 'Market Analysis', tier: 'Expert' },
    ],
  },
  {
    title: 'Leadership & Management',
    icon: Users,
    skills: [
      { name: 'Leading diverse international teams', tier: 'Expert' },
      { name: 'Cross-functional Collaboration', tier: 'Expert' },
      { name: 'Stakeholder Management', tier: 'Expert' },
      {
        name: 'Coordinating across time zones & cultures',
        tier: 'Advanced',
      },
    ],
  },
  {
    title: 'Technical & Development',
    icon: Settings,
    skills: [
      { name: 'Making systems talk to each other', tier: 'Advanced' },
      { name: 'Upgrading legacy systems gracefully', tier: 'Advanced' },
      { name: 'Quality Assurance Oversight', tier: 'Advanced' },
    ],
  },
  {
    title: 'Digital Marketing & SEO',
    icon: TrendingUp,
    skills: [
      { name: 'SEO Strategy & Implementation', tier: 'Expert' },
      { name: 'Analytics & Reporting', tier: 'Expert' },
      { name: 'Digital Campaign Management', tier: 'Advanced' },
    ],
  },
  {
    title: 'Business & Strategy',
    icon: Briefcase,
    skills: [
      { name: 'Strategic Planning', tier: 'Expert' },
      { name: 'Competitive Analysis', tier: 'Expert' },
      { name: 'Scaling products across cultures', tier: 'Expert' },
    ],
  },
  {
    title: 'Frameworks & Methodologies',
    icon: RefreshCw,
    skills: [
      { name: 'Agile/Scrum', tier: 'Expert' },
      { name: 'Strategic Management', tier: 'Expert' },
      { name: 'OKRs & KPI Management', tier: 'Expert' },
      { name: 'Design Thinking', tier: 'Advanced' },
    ],
  },
]

const highlights = [
  { value: '8+', label: 'Years Experience' },
  { value: '165M+', label: 'Users Served' },
  { value: '13', label: 'Max Team Size' },
]

function TierTag({ tier }: { tier: SkillTier }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
        tier === 'Expert'
          ? 'bg-accent-soft text-(--accent)'
          : 'border border-line text-tertiary-fg'
      }`}
    >
      {tier}
    </span>
  )
}

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 md:py-28">
      {/* Hero */}
      <Reveal as="section" className="mb-20 max-w-3xl">
        <p className="section-label mb-4">Skills</p>
        <h1 className="font-display mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          What I bring to the table
        </h1>
        <p className="text-lg leading-relaxed text-secondary-fg md:text-xl">
          Eight years of learning what actually works when building products
          that millions of people use every day. Here&apos;s what I&apos;ve
          picked up along the way—from managing global teams to shipping code
          that traders bet their careers on.
        </p>
      </Reveal>

      {/* Skills grid */}
      <section className="mb-24">
        <Reveal
          stagger={0.06}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {skillCategories.map(category => (
            <div
              key={category.title}
              data-reveal-child
              className="panel panel-hover p-7"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft">
                  <category.icon className="h-5 w-5 text-(--accent)" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-3">
                {category.skills.map(skill => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-secondary-fg">
                      {skill.name}
                    </span>
                    <TierTag tier={skill.tier} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Experience highlights */}
      <Reveal as="section">
        <div className="panel relative overflow-hidden p-8 md:p-12">
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-vignette)' }}
          />
          <div className="relative">
            <div className="mb-10 text-center">
              <p className="section-label mb-4">The short version</p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Experience Highlights
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-3">
              {highlights.map(item => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-line bg-(--surface) p-6 text-center"
                >
                  <div className="font-display mb-1 text-4xl font-bold text-(--accent)">
                    <CountUp value={item.value} />
                  </div>
                  <div className="text-sm text-secondary-fg">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
