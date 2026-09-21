/**
 * A realistic sample application, shared by the preview scripts.
 *
 * Drawn from `src/lib/career-facts.ts` — real roles, real figures — because a
 * design decision made on lorem ipsum is a decision about lorem ipsum. The
 * posting it is aimed at is invented.
 */

import type { CvContent, CoverLetterContent } from '../src/lib/documents/schema'

export const cv: CvContent = {
  fullName: 'Lukáš Hošala',
  headline: 'Senior Product Manager — platform migrations at consumer scale',
  location: 'Volterra, Italy',
  email: 'hosala.lukas@gmail.com',
  links: ['lukashosala.com', 'linkedin.com/in/lukashosala'],
  highlights: [
    { value: '165M+', label: 'registered users', factIds: ['runtastic.users'] },
    { value: '13', label: 'people led', factIds: ['runtastic.team'] },
    { value: '80%', label: 'lead time cut', factIds: ['stagstrat.leadtime'] },
    {
      value: 'Zero',
      label: 'downtime at cutover',
      factIds: ['runtastic.downtime'],
    },
  ],
  summary:
    'Senior product manager with eight years across adidas, Runtastic and two founded products, working end to end from requirements to release. Ran the platform for 165M+ registered users through a staged Next.js migration with zero downtime, and led 13 people across three countries. Looking for a platform role where the product decisions and the technical ones are made in the same room.',
  roles: [
    {
      roleId: 'playergrade',
      title: 'Founder & Head of Product',
      company: 'PlayerGrade — football scouting SaaS',
      location: 'Remote',
      period: '2026 – Present',
      bullets: [
        {
          label: 'Product Architecture',
          text: 'Built a multi-tenant scouting platform from an empty repository to paying clubs, with per-tenant data isolation enforced at the query layer.',
          factIds: ['playergrade.tenants', 'playergrade.isolation'],
        },
        {
          label: 'Scoring Engine',
          text: 'Designed a position-aware grading engine covering every outfield position, validated against a pool of scouted players before release.',
          factIds: ['playergrade.engine', 'playergrade.positions'],
        },
        {
          label: 'Quality Bar',
          text: 'Held the release gate on an automated test suite rather than on judgement, so a solo team could ship weekly without regressions.',
          factIds: ['playergrade.tests'],
        },
      ],
    },
    {
      roleId: 'stagstrat',
      title: 'Senior Product Manager',
      company: 'StagStrat — algorithmic trading platform',
      location: 'Remote (Leeds, UK)',
      period: '2025 – Present',
      bullets: [
        {
          label: 'Delivery Speed',
          text: 'Cut feature lead time by 80% by tightening how work was scoped before it entered the sprint.',
          factIds: ['stagstrat.leadtime'],
        },
        {
          label: 'Organic Growth',
          text: 'Rebuilt the public surface around search intent, lifting qualified sign-ups without paid spend.',
          factIds: ['stagstrat.seo'],
        },
      ],
    },
    {
      roleId: 'runtastic',
      title: 'Senior Product Manager',
      company: 'Runtastic GmbH — adidas Digital Sports',
      location: 'Vienna, Austria',
      period: '2022 – 2025',
      bullets: [
        {
          label: 'Platform Migration',
          text: 'Migrated a 165M+ user platform to Next.js in stages, finishing with zero downtime across the cutover.',
          factIds: [
            'runtastic.users',
            'runtastic.migration',
            'runtastic.downtime',
          ],
        },
        {
          label: 'Performance',
          text: 'Improved page load by 55%, measured on real user traffic rather than on a synthetic run.',
          factIds: ['runtastic.pageload'],
        },
        {
          label: 'Distributed Teams',
          text: 'Led 13 people including external freelancers across three countries.',
          factIds: ['runtastic.team', 'runtastic.countries'],
        },
      ],
    },
    {
      roleId: 'adidas-pm',
      title: 'Product Manager',
      company: 'adidas International Marketing B.V.',
      location: 'Amsterdam, Netherlands',
      period: '2019 – 2022',
      bullets: [
        {
          label: 'Stakeholder Management',
          text: 'Ran requirements for 50+ market teams on a single shared roadmap, arbitrating between them rather than queueing them.',
          factIds: ['adidas.markets'],
        },
        {
          label: 'Adoption',
          text: 'Took a new product information workflow to full adoption across the participating markets.',
          factIds: ['adidas.pim', 'adidas.pimadoption'],
        },
      ],
    },
    {
      roleId: 'adidas-po',
      title: 'Product Owner',
      company: 'adidas International Marketing B.V.',
      location: 'Amsterdam, Netherlands',
      period: '2016 – 2019',
      bullets: [
        {
          label: 'Tool Consolidation',
          text: 'Replaced a fragmented social tooling estate with one platform on a €1M licence, and owned the rollout to the market teams.',
          factIds: ['adidas.sprinklr'],
        },
        {
          label: 'Progression',
          text: 'Moved from intern to Product Owner in 18 months.',
          factIds: ['adidas.interntopo'],
        },
      ],
    },
  ],
  skills: [
    {
      group: 'Product Management',
      items: [
        'Requirements engineering',
        'Roadmapping',
        'Discovery',
        'Stakeholder management',
        'A/B testing',
        'Release planning',
      ],
    },
    {
      group: 'Technical',
      items: [
        'SQL',
        'Next.js',
        'REST APIs',
        'Google Analytics',
        'Vertex AI',
        'Figma',
      ],
    },
    {
      group: 'Ways of Working',
      items: ['Scrum', 'Kanban', 'JIRA', 'Confluence', 'Distributed teams'],
    },
  ],
  education: [
    {
      qualification: 'MBA Global',
      institution: 'University of Derby, UK',
      detail: '2018–2020',
    },
    {
      qualification: 'BSc Sport Management',
      institution: 'University of Derby, UK',
      detail: '2014–2018',
    },
  ],
  certifications: [
    {
      year: '2022',
      entry: 'CMI Level 7 Diploma in Strategic Management and Leadership',
    },
    { year: '', entry: 'Agile Product Owner certification' },
    { year: '', entry: 'UEFA A coaching licence' },
  ],
  languages: [
    'Slovak — native',
    'English — C2, working language since 2016',
    'Italian — B2',
  ],
}

export const letter: CoverLetterContent = {
  recipient: 'Northbound Systems — Platform Product Team',
  subject: 'Application — Senior Product Manager, Platform',
  greeting: 'Dear Hiring Team,',
  paragraphs: [
    {
      text: 'Your posting says the platform team owns the migration off the legacy rendering stack while the product keeps shipping. That is the job I did at Runtastic for three years: a 165M+ user platform moved to Next.js in stages, with zero downtime across the cutover and the roadmap still running alongside it.',
      factIds: ['runtastic.users', 'runtastic.migration', 'runtastic.downtime'],
    },
    {
      text: 'What made it work was not the technology choice. It was refusing to let the migration become its own workstream — every stage shipped behind a flag with a measurable user outcome attached, which is why page load ended up 55% better rather than merely unchanged. I led 13 people across three countries through it, most of whom had never worked on a migration before.',
      factIds: ['runtastic.pageload', 'runtastic.team', 'runtastic.countries'],
    },
    {
      text: 'The honest limit: I have not worked in your regulated segment, and I would be learning its constraints from the inside. What is adjacent is adidas, where 50+ market teams each had a veto and the compliance review was a hard gate rather than a step.',
      factIds: ['adidas.markets'],
    },
    {
      text: 'I am based in Tuscany, a Slovak citizen, so there is no permit question anywhere in the EU. Happy to walk through the migration in detail whenever it suits you.',
      factIds: ['logistics.base', 'logistics.eu'],
    },
  ],
  closing: 'Best regards,',
  signature: 'Lukáš Hošala',
}
