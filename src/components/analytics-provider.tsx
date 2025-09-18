'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { getAnalytics, AnalyticsClient } from '@/lib/analytics'
import {
  PerformanceMonitor,
  ResourcePreloader,
} from '@/components/performance-monitor'

interface AnalyticsContextType {
  analytics: AnalyticsClient
  trackEvent: (event: string, properties?: Record<string, any>) => void
  trackPageView: (path?: string, title?: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

interface AnalyticsProviderProps {
  children: ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const analytics = getAnalytics()

  // Track page views on route changes
  useEffect(() => {
    const title = document.title
    analytics.trackPageView(pathname, title)
  }, [pathname, analytics])

  // Track engagement events
  useEffect(() => {
    if (typeof window === 'undefined') return

    let idleTimer: NodeJS.Timeout
    let isIdle = false
    const IDLE_TIME = 30000 // 30 seconds

    const resetIdleTimer = () => {
      clearTimeout(idleTimer)
      if (isIdle) {
        isIdle = false
        analytics.trackInteraction('engagement', 'active')
      }
      idleTimer = setTimeout(() => {
        isIdle = true
        analytics.trackInteraction('engagement', 'idle')
      }, IDLE_TIME)
    }

    // Track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
    ]
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, true)
    })

    resetIdleTimer()

    // Track copy events (for contact info)
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString()
      if (selection && selection.includes('@')) {
        analytics.trackInteraction('copy', 'email', selection)
      }
    }

    document.addEventListener('copy', handleCopy)

    // Track outbound link clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.href) {
        const url = new URL(link.href)
        const currentHost = window.location.hostname

        // Track external links
        if (url.hostname !== currentHost) {
          analytics.trackInteraction('click', 'external_link', url.hostname, {
            url: url.href,
            text: link.textContent?.trim(),
          })
        }

        // Track specific link types
        if (link.href.includes('mailto:')) {
          analytics.trackInteraction('click', 'email_link', link.href)
        } else if (link.href.includes('tel:')) {
          analytics.trackInteraction('click', 'phone_link', link.href)
        } else if (url.hostname.includes('linkedin')) {
          analytics.trackInteraction('click', 'linkedin')
        } else if (url.hostname.includes('github')) {
          analytics.trackInteraction('click', 'github')
        }
      }
    }

    document.addEventListener('click', handleClick)

    // Track form interactions
    const handleFormFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const form = target.closest('form')
        const formName = form?.getAttribute('name') || form?.id || 'unknown'
        analytics.trackInteraction(
          'form_interaction',
          'focus',
          `${formName}.${target.getAttribute('name') || target.id}`
        )
      }
    }

    document.addEventListener('focusin', handleFormFocus)

    // Track scroll depth milestones
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollDepth = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      )

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth

        // Track milestones
        if ([25, 50, 75, 90].includes(scrollDepth)) {
          analytics.trackInteraction('scroll', 'milestone', `${scrollDepth}%`)
        }
      }
    }

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(trackScrollDepth, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Track time on page when leaving
    const trackTimeOnPage = () => {
      const timeOnPage = Date.now() - performance.timeOrigin
      analytics.trackInteraction(
        'engagement',
        'time_on_page',
        timeOnPage.toString(),
        {
          duration: timeOnPage,
          path: pathname,
        }
      )
    }

    window.addEventListener('beforeunload', trackTimeOnPage)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        trackTimeOnPage()
      }
    })

    return () => {
      clearTimeout(idleTimer)
      clearTimeout(scrollTimeout)
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer, true)
      })
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('focusin', handleFormFocus)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }, [analytics, pathname])

  const trackEvent = (event: string, properties?: Record<string, any>) => {
    analytics.trackInteraction(
      'custom',
      event,
      JSON.stringify(properties || {}),
      properties
    )
  }

  const trackPageView = (path?: string, title?: string) => {
    analytics.trackPageView(path || pathname, title || document.title)
  }

  const contextValue: AnalyticsContextType = {
    analytics,
    trackEvent,
    trackPageView,
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      <PerformanceMonitor />
      <ResourcePreloader />
      {children}
    </AnalyticsContext.Provider>
  )
}

// Higher-order component for tracking page views
export function withAnalytics<T extends object>(
  Component: React.ComponentType<T>,
  pageName?: string
) {
  return function AnalyticsWrappedComponent(props: T) {
    const { trackPageView } = useAnalytics()

    useEffect(() => {
      if (pageName) {
        trackPageView(undefined, pageName)
      }
    }, [trackPageView])

    return <Component {...props} />
  }
}

// Hook for tracking specific events
export function useTrackEvent() {
  const { trackEvent } = useAnalytics()

  return {
    trackCTA: (ctaName: string, location: string) => {
      trackEvent('cta_click', { cta: ctaName, location })
    },
    trackDownload: (fileName: string, fileType: string) => {
      trackEvent('download', { fileName, fileType })
    },
    trackSearch: (query: string, resultsCount: number) => {
      trackEvent('search', { query, resultsCount })
    },
    trackShare: (platform: string, content: string) => {
      trackEvent('share', { platform, content })
    },
    trackVideoPlay: (videoId: string, title: string) => {
      trackEvent('video_play', { videoId, title })
    },
    trackFormSubmit: (formName: string, success: boolean) => {
      trackEvent('form_submit', { formName, success })
    },
    trackCustom: trackEvent,
  }
}
