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
  title: 'Lukas Hosala - Product Manager & Technical Leader',
  description:
    'Senior Product Manager specializing in AI/ML integration, data-driven decision making, and cross-functional team leadership. 10+ years experience launching products that drive business growth.',
  keywords: [
    'product management',
    'AI/ML',
    'data analytics',
    'technical leadership',
    'product strategy',
    'growth optimization',
  ],
  authors: [{ name: 'Lukas Hosala' }],
  openGraph: {
    title: 'Lukas Hosala - Product Manager & Technical Leader',
    description:
      'Senior Product Manager specializing in AI/ML integration, data-driven decision making, and cross-functional team leadership.',
    type: 'website',
  },
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
