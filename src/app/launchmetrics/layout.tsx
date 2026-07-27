import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior Product Builder, Data — Launchmetrics Fit Brief',
  description:
    "A private, role-specific overview prepared for Launchmetrics' Senior Product Builder search on Data Collection & Enrichment — mapping Lukáš Hošala's product-data lifecycle, fashion-industry and AI-enrichment experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function LaunchmetricsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
