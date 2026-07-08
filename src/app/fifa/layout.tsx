import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI & Innovative Tech Governance Manager — FIFA Fit Brief',
  description:
    "A private, role-specific overview prepared for FIFA's AI & Innovative Tech Governance Manager search in Zurich — mapping Lukáš Hošala's product, AI, and data-governance experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function FifaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
