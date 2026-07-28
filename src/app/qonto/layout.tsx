import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staff Product Manager, AI Products — Qonto Fit Brief',
  description:
    "A private, role-specific overview prepared for Qonto's Staff AI Product Manager search — mapping Lukáš Hošala's 0-to-1 AI product, fintech and classification experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function QontoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
