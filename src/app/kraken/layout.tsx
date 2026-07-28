import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior Product Manager, Consumer — Kraken Fit Brief',
  description:
    "A private, role-specific overview prepared for Kraken's Senior Product Manager, Consumer search — mapping Lukáš Hošala's retail trading, consumer-scale and AI-prototyping experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function KrakenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
