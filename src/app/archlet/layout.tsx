import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior Product Manager — Archlet Fit Brief',
  description:
    "A private, role-specific overview prepared for Archlet's Senior Product Manager search in Zurich — mapping Lukáš Hošala's enterprise product, discovery-to-impact and make-or-buy experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function ArchletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
