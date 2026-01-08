import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Lukáš Hošala - Senior Product Manager Story',
  description:
    "Learn about Lukáš Hošala's journey from Slovakia to leading international teams at adidas Digital Sports (165M+ users) and fintech startups. Now based in Volterra, Italy.",
  keywords: [
    'About Lukáš Hošala',
    'Product Manager Career',
    'adidas Digital Sports',
    'International Experience',
    'Team Leadership',
    'Volterra Italy',
    'Professional Journey',
    'Strategic Management',
  ],
  openGraph: {
    title: 'About Lukáš Hošala - Senior Product Manager Story',
    description:
      'Learn about my journey from Slovakia to leading international teams at adidas Digital Sports and fintech startups.',
    url: 'https://lukashosala.com/about',
  },
  alternates: {
    canonical: 'https://lukashosala.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
