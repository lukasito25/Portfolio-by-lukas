import { Metadata } from 'next'

/**
 * Generated fit briefs are private, like the hand-built ones: noindex, absent
 * from the nav and from the sitemap, reachable only by the link you send.
 *
 * The title is deliberately generic — per-brief metadata is set by the page's
 * own `generateMetadata`, and this layout only needs to guarantee the robots
 * directive applies to every brief under /brief, including 404s.
 */
export const metadata: Metadata = {
  title: 'Fit brief',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function BriefLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
