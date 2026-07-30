import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior Product Manager, ShelfView Capture — Scandit Fit Brief',
  description:
    "A private, role-specific overview prepared for Scandit's Senior Product Manager (ShelfView Capture) search in Zurich — mapping Lukáš Hošala's retail product-data, telemetry and adoption experience against the role, including where it stops.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function ScanditLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
