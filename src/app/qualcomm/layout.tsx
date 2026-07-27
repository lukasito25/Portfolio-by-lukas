import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Product Manager, Arduino — Qualcomm Fit Brief',
  description:
    "A private, role-specific overview prepared for Qualcomm's AI Product Manager search for Arduino in Turin — mapping Lukáš Hošala's product, AI-product-building and constrained-systems experience directly against the role.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function QualcommLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
