import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/ui/navigation'
import { Footer } from '@/components/ui/footer'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Lukáš Hošala - Senior Product Manager',
    default:
      'Lukáš Hošala - Senior Product Manager | adidas Digital Sports & Fintech Expert',
  },
  description:
    'Senior Product Manager with 8+ years of international experience leading teams at adidas Digital Sports (165M+ users) and fintech startups. Expert in digital transformation, team leadership, and product strategy from Volterra, Italy.',
  keywords: [
    'Senior Product Manager',
    'adidas Digital Sports',
    'Product Management',
    'Team Leadership',
    'Digital Transformation',
    'International Teams',
    'Product Strategy',
    'Fintech',
    'StagStrat',
    'Agile Methodology',
    'Strategic Management',
    'Runtastic',
    'E-commerce',
    'Global Scale',
    'Volterra Italy',
    'Remote Leadership',
    'Cross-functional Teams',
  ],
  authors: [{ name: 'Lukáš Hošala', url: 'https://lukashosala.com' }],
  creator: 'Lukáš Hošala',
  publisher: 'Lukáš Hošala',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lukashosala.com',
    title:
      'Lukáš Hošala - Senior Product Manager | adidas Digital Sports & Fintech Expert',
    description:
      'Senior Product Manager with 8+ years leading international teams at adidas Digital Sports (165M+ users) and fintech startups. Based in Volterra, Italy.',
    siteName: 'Lukáš Hošala Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lukáš Hošala - Senior Product Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Lukáš Hošala - Senior Product Manager | adidas Digital Sports Expert',
    description:
      'Senior Product Manager with 8+ years leading international teams. Expert in digital transformation and product strategy.',
    images: ['/twitter-image.jpg'],
    creator: '@lukashosala',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://lukashosala.com',
    languages: {
      'en-US': 'https://lukashosala.com',
    },
  },
  category: 'Portfolio',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
