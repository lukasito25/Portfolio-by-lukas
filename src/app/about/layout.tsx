import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Eight years at adidas across digital sports, social commerce, and internal tools. Teams of up to 13 people in three countries, products reaching 165M+ users, an MBA from the University of Derby, and a UEFA A coaching licence that led to founding PlayerGrade.',
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
    title: 'About Lukáš Hošala — Senior Product Manager',
    description:
      'Eight years at adidas, teams across three countries, products reaching 165M+ users — and what came after.',
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
