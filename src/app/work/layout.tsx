import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Professional Work - adidas Digital Sports & Product Management Projects',
  description:
    "Explore Lukáš Hošala's professional portfolio including adidas Runtastic website redesign (55% page load speed improvement), Sprinklr enterprise management (1 Million EUR license), and StagStrat algorithmic trading platform (80% feature lead time reduction).",
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
    title: 'Professional Work - adidas Digital Sports & Enterprise Projects',
    description:
      'Explore real enterprise-scale projects including adidas Runtastic redesign, social commerce engine, and PIM system.',
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
