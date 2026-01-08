import { Metadata } from 'next'

// SEO constants
export const SEO_CONFIG = {
  siteName: 'Lukáš Hošala - Product Manager',
  siteUrl: process.env.NEXTAUTH_URL || 'https://portfolio.lukashosala.com',
  defaultTitle: 'Lukáš Hošala - Product Manager & Technology Leader',
  defaultDescription:
    'Experienced Product Manager specializing in user-centered design, strategic planning, and cross-functional team leadership. Helping companies build products that users love.',
  defaultKeywords: [
    'Product Manager',
    'Product Management',
    'User Research',
    'Agile Development',
    'Strategic Planning',
    'Cross-functional Leadership',
    'Technology',
    'Product Strategy',
    'User Experience',
    'Data-driven Decisions',
  ],
  twitterHandle: '@lukashosala',
  linkedinProfile: 'https://linkedin.com/in/lukashosala',
  githubProfile: 'https://github.com/lukashosala',
}

// Generate metadata for pages
interface PageSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
  structuredData?: object
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  noIndex = false,
}: PageSEOProps): Metadata {
  const pageTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle
  const pageDescription = description || SEO_CONFIG.defaultDescription
  const pageKeywords = [...SEO_CONFIG.defaultKeywords, ...keywords]
  const pageUrl = canonicalUrl || SEO_CONFIG.siteUrl
  const pageImage = ogImage || `${SEO_CONFIG.siteUrl}/og-image.jpg`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords.join(', '),
    authors: [{ name: 'Lukáš Hošala' }],
    creator: 'Lukáš Hošala',
    publisher: 'Lukáš Hošala',

    // Robots
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: SEO_CONFIG.siteName,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: SEO_CONFIG.twitterHandle,
    },

    // Canonical URL
    alternates: {
      canonical: pageUrl,
    },

    // Additional meta tags
    other: {
      'theme-color': '#1f2937',
      'msapplication-TileColor': '#1f2937',
    },
  }
}

// Generate structured data (JSON-LD)
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lukáš Hošala',
    jobTitle: 'Product Manager',
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    image: `${SEO_CONFIG.siteUrl}/profile-photo.jpg`,
    sameAs: [SEO_CONFIG.linkedinProfile, SEO_CONFIG.githubProfile],
    knowsAbout: [
      'Product Management',
      'User Research',
      'Agile Development',
      'Strategic Planning',
      'Cross-functional Leadership',
      'Technology',
      'Product Strategy',
      'User Experience',
      'Data Analysis',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'University Name', // Replace with actual university
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance / Consulting', // Replace with current company
    },
  }
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Website',
    name: SEO_CONFIG.siteName,
    description: SEO_CONFIG.defaultDescription,
    url: SEO_CONFIG.siteUrl,
    author: {
      '@type': 'Person',
      name: 'Lukáš Hošala',
    },
    publisher: {
      '@type': 'Person',
      name: 'Lukáš Hošala',
    },
    inLanguage: 'en-US',
  }
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateArticleStructuredData(article: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: 'Lukáš Hošala',
      url: SEO_CONFIG.siteUrl,
    },
    publisher: {
      '@type': 'Person',
      name: 'Lukáš Hošala',
      url: SEO_CONFIG.siteUrl,
    },
    image: article.image || `${SEO_CONFIG.siteUrl}/og-image.jpg`,
    keywords: article.tags?.join(', '),
    inLanguage: 'en-US',
  }
}

// SEO utility functions
export function generateSitemap() {
  const baseUrl = SEO_CONFIG.siteUrl
  const currentDate = new Date().toISOString()

  const staticPages = [
    { url: '/', priority: 1.0, changefreq: 'weekly' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/work', priority: 0.9, changefreq: 'monthly' },
    { url: '/blog', priority: 0.7, changefreq: 'weekly' },
    { url: '/contact', priority: 0.6, changefreq: 'monthly' },
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`
}

export function generateRobotsTxt() {
  const baseUrl = SEO_CONFIG.siteUrl

  return `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`
}

// Analytics and performance tracking for SEO
export function trackSEOMetrics() {
  if (typeof window === 'undefined') return

  // Track page load time for SEO
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming

    if (navigation) {
      const loadTime = navigation.loadEventEnd - navigation.loadEventStart
      const domContentLoaded =
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart

      // Track these metrics for SEO optimization
      console.log('SEO Metrics:', {
        loadTime,
        domContentLoaded,
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize,
      })
    }
  })

  // Track Core Web Vitals for SEO
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        console.log('Core Web Vital:', entry.name, entry.startTime)
      })
    })

    try {
      observer.observe({
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'],
      })
    } catch (e) {
      // Some metrics may not be supported
    }
  }
}

// Dynamic meta tag updates
export function updateMetaTags(tags: Record<string, string>) {
  if (typeof window === 'undefined') return

  Object.entries(tags).forEach(([name, content]) => {
    let metaTag = document.querySelector(
      `meta[name="${name}"]`
    ) as HTMLMetaElement

    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = name
      document.head.appendChild(metaTag)
    }

    metaTag.content = content
  })
}

// Generate page-specific keywords based on content
export function generatePageKeywords(
  content: string,
  baseKeywords: string[] = []
): string[] {
  const commonWords = new Set([
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'as',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'should',
    'could',
    'can',
    'may',
    'might',
    'must',
    'shall',
    'this',
    'that',
    'these',
    'those',
    'a',
    'an',
    'i',
    'you',
    'he',
    'she',
    'it',
    'we',
    'they',
  ])

  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))

  const wordFreq = words.reduce(
    (acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const keywordCandidates = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)

  return [...baseKeywords, ...keywordCandidates]
}
