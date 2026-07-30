import { Metadata } from 'next'

export const metadata: Metadata = {
  title:
    'Senior Principal PM, Partner Experience & AI Platform — Zalando Fit Brief',
  description:
    "A private, role-specific overview prepared for Zalando Partner Tech's Senior Principal Product Manager search — mapping Lukáš Hošala's internal-platform, adoption and agent-orchestration experience against the role, including where it stops.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function ZalandoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
