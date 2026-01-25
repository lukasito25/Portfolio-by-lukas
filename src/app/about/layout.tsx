import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Lukáš Hošala - Senior Product Manager Story',
  description:
    'From Slovakia to the hills of Tuscany: discover how Lukáš turned sport management studies into a career building digital products that millions of people use daily. The unconventional path to product leadership.',
  keywords: [
    'About Lukáš Hošala',
    'Product Manager Career',
    'adidas Digital Sports',
    'Cross-functional Teams',
    '13+ Members',
    '3 Countries',
    '165 Million Users',
    'Team Leadership',
    'Agile Methodology',
    'B2B B2C Products',
    'StagStrat',
    'Italy EU',
    'Professional Journey',
    'Strategic Management',
    'MBA Graduate',
  ],
  openGraph: {
    title: 'About Lukáš Hošala - Senior Product Manager Story',
    description:
      'Learn about my journey from Slovakia to leading international teams at adidas Digital Sports and fintech startups.',
    url: 'https://portfolio-by-lukas.vercel.app/about',
  },
  alternates: {
    canonical: 'https://portfolio-by-lukas.vercel.app/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
