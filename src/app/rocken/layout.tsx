import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senior Product Owner, Kriens — Fit Brief (Rocken)',
  description:
    'Eine private, rollenspezifische Übersicht zur Ausschreibung Senior Product Owner (m/w/d) in Kriens — Abgleich von Requirements Engineering, Backlog-Verantwortung und Erfahrung mit komplexen Geschäftsprozessen, inklusive der Lücken.',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function RockenLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
