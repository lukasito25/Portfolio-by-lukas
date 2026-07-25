import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Senior Product Manager, Platform Experience — Genius Sports Fit Brief',
  description:
    "A private, role-specific overview prepared for Genius Sports' Senior Product Manager, Platform Experience search in London — mapping Lukáš Hošala's product, platform-consolidation, and live-sports-data experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function GeniusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
