import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - Lukas Hosala | Senior Product Manager',
  description:
    'Senior Product Manager with 8+ years of international experience at adidas Digital Sports and fintech startups. MBA graduate specializing in digital product development and team leadership.',
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}