import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/ui/navigation'
import { Footer } from '@/components/ui/footer'
import { ScrollProgress } from '@/components/motion/scroll-progress'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Lukáš Hošala — Senior Product Manager',
    default: 'Lukáš Hošala — Senior Product Manager',
  },
  description:
    'Senior product manager with 8+ years at adidas. Led teams of up to 13 people across three countries, managed products used by over 165 million people, and founded PlayerGrade, a football scouting platform. Based in Italy, open to senior PM roles and advisory work.',
  keywords: [
    'Lukáš Hošala',
    'Senior Product Manager',
    'adidas Digital Sports',
    'Product Management',
    'Team Leadership',
    'Digital Transformation',
    'Cross-functional Teams',
    '13+ Members',
    '3 Countries',
    'Product Strategy',
    'Fintech',
    'StagStrat',
    'PlayerGrade',
    'Football Scouting Platform',
    'SaaS Founder',
    'Sports Tech',
    'Agile Methodology',
    'Scrum',
    'Strategic Management',
    'Runtastic',
    'B2B Products',
    'B2C Products',
    '165 Million Users',
    'Enterprise Software',
    'API Integration',
    'Italy EU',
    'Remote Leadership',
    'MBA Graduate',
  ],
  authors: [
    { name: 'Lukáš Hošala', url: 'https://portfolio-by-lukas.vercel.app' },
  ],
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
    url: 'https://portfolio-by-lukas.vercel.app',
    title: 'Lukáš Hošala — Senior Product Manager',
    description:
      'Senior product manager with 8+ years at adidas. Led teams of up to 13 people across three countries, managed products used by over 165 million people, and founded PlayerGrade. Based in Italy, open to senior PM roles and advisory work.',
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
    title: 'Lukáš Hošala — Senior Product Manager',
    description:
      'Senior product manager. 8+ years at adidas, teams of up to 13 across three countries, products used by 165M+ people. Founder of PlayerGrade.',
    images: ['/twitter-image.jpg'],
    creator: '@lukashosala',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://portfolio-by-lukas.vercel.app',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');try{var t=localStorage.getItem('portfolio-theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ScrollProgress />
        <div className="flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
