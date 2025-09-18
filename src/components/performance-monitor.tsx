'use client'

import { useEffect } from 'react'
import { getAnalytics } from '@/lib/analytics'

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

export function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return
    }

    const analytics = getAnalytics()

    // Track Core Web Vitals
    const trackWebVitals = () => {
      try {
        // Get navigation timing
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming

        if (navigation) {
          const ttfb = navigation.responseStart - navigation.requestStart

          analytics.trackInteraction('performance', 'ttfb', ttfb.toString(), {
            metric: 'time_to_first_byte',
            value: ttfb,
            timestamp: Date.now(),
          })
        }

        // Track paint metrics
        const paintMetrics = performance.getEntriesByType('paint')
        paintMetrics.forEach(metric => {
          if (metric.name === 'first-contentful-paint') {
            analytics.trackInteraction(
              'performance',
              'fcp',
              metric.startTime.toString(),
              {
                metric: 'first_contentful_paint',
                value: metric.startTime,
                timestamp: Date.now(),
              }
            )
          }
        })

        // Track largest contentful paint
        if ('PerformanceObserver' in window) {
          const lcpObserver = new PerformanceObserver(list => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]

            analytics.trackInteraction(
              'performance',
              'lcp',
              lastEntry.startTime.toString(),
              {
                metric: 'largest_contentful_paint',
                value: lastEntry.startTime,
                timestamp: Date.now(),
              }
            )
          })

          try {
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
          } catch (e) {
            // LCP not supported
          }

          // Track First Input Delay
          const fidObserver = new PerformanceObserver(list => {
            const entries = list.getEntries()
            entries.forEach((entry: any) => {
              analytics.trackInteraction(
                'performance',
                'fid',
                entry.processingStart - entry.startTime.toString(),
                {
                  metric: 'first_input_delay',
                  value: entry.processingStart - entry.startTime,
                  timestamp: Date.now(),
                }
              )
            })
          })

          try {
            fidObserver.observe({ entryTypes: ['first-input'] })
          } catch (e) {
            // FID not supported
          }

          // Track Cumulative Layout Shift
          let clsValue = 0
          const clsObserver = new PerformanceObserver(list => {
            const entries = list.getEntries()
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            })
          })

          try {
            clsObserver.observe({ entryTypes: ['layout-shift'] })
          } catch (e) {
            // CLS not supported
          }

          // Send CLS value when page is hidden
          const sendCLS = () => {
            analytics.trackInteraction(
              'performance',
              'cls',
              clsValue.toString(),
              {
                metric: 'cumulative_layout_shift',
                value: clsValue,
                timestamp: Date.now(),
              }
            )
          }

          window.addEventListener('pagehide', sendCLS)
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
              sendCLS()
            }
          })
        }

        // Track resource loading performance
        const trackResourceMetrics = () => {
          const resources = performance.getEntriesByType(
            'resource'
          ) as PerformanceResourceTiming[]

          const slowResources = resources.filter(
            resource => resource.duration > 1000 // Resources taking more than 1 second
          )

          if (slowResources.length > 0) {
            analytics.trackInteraction(
              'performance',
              'slow_resources',
              slowResources.length.toString(),
              {
                metric: 'slow_resource_count',
                value: slowResources.length,
                slowest: Math.max(...slowResources.map(r => r.duration)),
                timestamp: Date.now(),
              }
            )
          }

          // Track total page size
          const totalSize = resources.reduce((acc, resource) => {
            return acc + (resource.transferSize || 0)
          }, 0)

          analytics.trackInteraction(
            'performance',
            'page_size',
            totalSize.toString(),
            {
              metric: 'total_page_size',
              value: totalSize,
              timestamp: Date.now(),
            }
          )
        }

        // Delay resource tracking to ensure all resources are loaded
        setTimeout(trackResourceMetrics, 5000)
      } catch (error) {
        console.error('Performance tracking error:', error)
      }
    }

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackWebVitals()
    } else {
      window.addEventListener('load', trackWebVitals)
    }

    // Track memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory
      analytics.trackInteraction(
        'performance',
        'memory',
        memory.usedJSHeapSize.toString(),
        {
          metric: 'memory_usage',
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          timestamp: Date.now(),
        }
      )
    }

    // Track connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      analytics.trackInteraction(
        'performance',
        'connection',
        connection.effectiveType,
        {
          metric: 'connection_quality',
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          timestamp: Date.now(),
        }
      )
    }
  }, [])

  return null // This component doesn't render anything
}

// Lazy loading utility component
export function LazyImage({
  src,
  alt,
  className,
  placeholder = '/placeholder.jpg',
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { placeholder?: string }) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    const images = document.querySelectorAll('img[data-lazy]')

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.lazy

            if (src) {
              img.src = src
              img.removeAttribute('data-lazy')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    images.forEach(img => imageObserver.observe(img))

    return () => {
      images.forEach(img => imageObserver.unobserve(img))
    }
  }, [])

  return (
    <img
      src={placeholder}
      data-lazy={src}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  )
}

// Preload critical resources
export function ResourcePreloader() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Preload critical fonts
    const fontLinks = ['/fonts/inter-var.woff2', '/fonts/inter-bold.woff2']

    fontLinks.forEach(font => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = font
      link.as = 'font'
      link.type = 'font/woff2'
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Preload critical images
    const criticalImages = ['/hero-image.jpg', '/profile-photo.jpg']

    criticalImages.forEach(image => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = image
      link.as = 'image'
      document.head.appendChild(link)
    })

    // DNS prefetch for external domains
    const externalDomains = [
      'https://api.openai.com',
      'https://fonts.googleapis.com',
      'https://cdn.vercel-analytics.com',
    ]

    externalDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = domain
      document.head.appendChild(link)
    })
  }, [])

  return null
}
