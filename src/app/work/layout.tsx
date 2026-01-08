import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Professional Work - adidas Digital Sports & Product Management Projects',
  description:
    "Explore Lukáš Hošala's professional portfolio including adidas Runtastic website redesign (165M+ users), social commerce engine, and PIM system. Real enterprise-scale projects with measurable business impact.",
  keywords: [
    'adidas Runtastic Project',
    'Product Management Portfolio',
    'Enterprise Projects',
    'Digital Transformation',
    'Website Redesign',
    'Social Commerce',
    'Product Information Management',
    'Team Leadership Projects',
    'Business Impact',
    'Professional Experience',
  ],
  openGraph: {
    title: 'Professional Work - adidas Digital Sports & Enterprise Projects',
    description:
      'Explore real enterprise-scale projects including adidas Runtastic redesign, social commerce engine, and PIM system.',
    url: 'https://lukashosala.com/work',
  },
  alternates: {
    canonical: 'https://lukashosala.com/work',
  },
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
