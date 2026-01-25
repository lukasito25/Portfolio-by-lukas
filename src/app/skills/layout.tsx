import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Skills & Expertise - Product Management, Team Leadership & Strategy',
  description:
    'Eight years of product management across international teams, agile methodologies that actually work, and enterprise-scale platforms. From million-euro software licenses at adidas to building fintech platforms from scratch.',
  keywords: [
    'Product Management Skills',
    'Cross-functional Team Leadership',
    '13+ Members 3 Countries',
    'Agile Scrum Methodology',
    'Sprint Planning',
    'Product Lifecycle Management',
    'Enterprise Software',
    'API Integration',
    'B2B B2C Products',
    'JIRA Confluence Figma',
    'Strategic Management MBA',
    'StagStrat Fintech',
    'adidas Digital Sports',
    'Stakeholder Management',
  ],
  openGraph: {
    title: 'Skills & Expertise - Product Management & Team Leadership',
    description:
      '8+ years of product management expertise including team leadership, digital transformation, and strategic management.',
    url: 'https://portfolio-by-lukas.vercel.app/skills',
  },
  alternates: {
    canonical: 'https://portfolio-by-lukas.vercel.app/skills',
  },
}

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
