import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills & Expertise - Product Management, Team Leadership & Strategy',
  description:
    '8+ years of product management expertise including team leadership (13 personnel), digital transformation, agile methodology, and strategic management. Proven experience at adidas Digital Sports and fintech.',
  keywords: [
    'Product Management Skills',
    'Team Leadership',
    'Digital Strategy',
    'Agile Methodology',
    'Strategic Management',
    'Cross-functional Teams',
    'Product Strategy',
    'International Teams',
    'Fintech Experience',
    'E-commerce',
    'Product Analytics',
    'Stakeholder Management',
  ],
  openGraph: {
    title: 'Skills & Expertise - Product Management & Team Leadership',
    description:
      '8+ years of product management expertise including team leadership, digital transformation, and strategic management.',
    url: 'https://lukashosala.com/skills',
  },
  alternates: {
    canonical: 'https://lukashosala.com/skills',
  },
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
