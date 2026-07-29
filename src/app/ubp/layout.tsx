import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Head of AI Platform — UBP Fit Brief',
  description:
    "A private, role-specific overview prepared for Union Bancaire Privée's Head of AI Platform search — mapping Lukáš Hošala's internal-platform, adoption and AI tooling experience against the role, including where it stops.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function UbpLayout({ children }: { children: React.ReactNode }) {
  return children
}
