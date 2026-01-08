import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Lukáš Hošala - Senior Product Manager & Strategic Consultant',
  description:
    'Get in touch with Lukáš Hošala for product management consulting, strategic advisory, team leadership, or collaboration opportunities. Based in Volterra, Italy, available for international projects.',
  keywords: [
    'Contact Lukáš Hošala',
    'Product Management Consultant',
    'Strategic Advisory',
    'Team Leadership Consulting',
    'International Collaboration',
    'Product Strategy Consulting',
    'Remote Consultation',
    'Volterra Italy',
    'Business Strategy',
    'Digital Transformation Consultant',
  ],
  openGraph: {
    title: 'Contact Lukáš Hošala - Product Management & Strategic Consulting',
    description:
      'Get in touch for product management consulting, strategic advisory, and collaboration opportunities.',
    url: 'https://lukashosala.com/contact',
  },
  alternates: {
    canonical: 'https://lukashosala.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
