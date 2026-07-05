import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Hiring for a senior PM role, looking for product advisory help, or just want to talk shop? Get in touch — I reply within 24 hours. Based in Italy, EU.',
  keywords: [
    'Contact Lukáš Hošala',
    'Product Management Consultant',
    'Strategic Advisory',
    'Team Leadership Consulting',
    'Cross-functional Teams',
    'Agile Methodology',
    'Enterprise Software',
    'B2B B2C Products',
    'International Collaboration',
    'Product Strategy Consulting',
    'Remote Consultation',
    'Italy EU',
    'Business Strategy',
    'Digital Transformation Consultant',
  ],
  openGraph: {
    title: 'Contact Lukáš Hošala — Senior Product Manager',
    description:
      'Hiring for a senior PM role or looking for product advisory help? Get in touch — I reply within 24 hours.',
    url: 'https://portfolio-by-lukas.vercel.app/contact',
  },
  alternates: {
    canonical: 'https://portfolio-by-lukas.vercel.app/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
