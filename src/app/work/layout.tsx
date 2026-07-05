import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Things I built and shipped: the Runtastic website redesign and zero-downtime migration for 165M+ users, social commerce products at adidas, StagStrat, and PlayerGrade — a football scouting platform built solo.',
  keywords: [
    'adidas Runtastic Project',
    'Product Management Portfolio',
    'Enterprise Projects',
    '55% Performance Improvement',
    'Sprinklr 1 Million EUR',
    'StagStrat Algorithmic Trading',
    '80% Lead Time Reduction',
    'Cross-functional Teams 13+ Members',
    'Next.js React Redesign',
    'API Integration',
    'Enterprise Software',
    'B2B B2C Products',
    'Professional Experience',
  ],
  openGraph: {
    title: 'Work — Lukáš Hošala',
    description:
      'Case studies from adidas (Runtastic redesign, 165M+ users, zero downtime), StagStrat, and PlayerGrade.',
    url: 'https://portfolio-by-lukas.vercel.app/work',
  },
  alternates: {
    canonical: 'https://portfolio-by-lukas.vercel.app/work',
  },
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
