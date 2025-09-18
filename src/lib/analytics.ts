'use client'

// Simple analytics tracking for portfolio
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: Date
  sessionId: string
  userId?: string
}

class Analytics {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  private isEnabled: boolean

  constructor() {
    this.sessionId = this.generateSessionId()
    this.isEnabled =
      typeof window !== 'undefined' && process.env.NODE_ENV === 'production'

    if (this.isEnabled) {
      this.trackPageView()
      this.setupEventListeners()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private setupEventListeners() {
    if (typeof window === 'undefined') return

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.track('page_hidden')
      } else {
        this.track('page_visible')
      }
    })

    // Track clicks on important elements
    document.addEventListener('click', event => {
      const target = event.target as HTMLElement

      // Track CTA clicks
      if (target.closest('[data-analytics="cta"]')) {
        this.track('cta_click', {
          cta_text: target.textContent,
          cta_href: target.getAttribute('href'),
        })
      }

      // Track navigation clicks
      if (target.closest('nav a')) {
        this.track('navigation_click', {
          nav_text: target.textContent,
          nav_href: target.getAttribute('href'),
        })
      }

      // Track external links
      const link = target.closest('a[href^="http"]')
      if (link) {
        this.track('external_link_click', {
          url: link.getAttribute('href'),
          text: link.textContent,
        })
      }
    })
  }

  track(eventName: string, properties: Record<string, unknown> = {}) {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date(),
      sessionId: this.sessionId,
    }

    this.events.push(event)

    // Send to analytics API
    this.sendEvent(event)
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  trackPageView() {
    if (typeof window === 'undefined') return

    this.track('page_view', {
      title: document.title,
      path: window.location.pathname,
      search: window.location.search,
    })
  }

  trackFormSubmission(formName: string, success: boolean = true) {
    this.track('form_submission', {
      form_name: formName,
      success,
    })
  }

  trackChatbotInteraction(action: string, message?: string) {
    this.track('chatbot_interaction', {
      action,
      message_preview: message?.substring(0, 50),
    })
  }

  trackProjectView(projectName: string) {
    this.track('project_view', {
      project_name: projectName,
    })
  }

  trackDownload(fileName: string, fileType: string) {
    this.track('file_download', {
      file_name: fileName,
      file_type: fileType,
    })
  }

  // Get analytics summary for admin dashboard
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      eventCount: this.events.length,
      events: this.events.slice(-10), // Last 10 events
    }
  }
}

// Singleton instance
let analytics: Analytics

export const getAnalytics = () => {
  if (!analytics) {
    analytics = new Analytics()
  }
  return analytics
}

// Convenience functions
export const trackEvent = (
  name: string,
  properties?: Record<string, unknown>
) => {
  getAnalytics().track(name, properties)
}

export const trackPageView = () => {
  getAnalytics().trackPageView()
}

export const trackFormSubmission = (
  formName: string,
  success: boolean = true
) => {
  getAnalytics().trackFormSubmission(formName, success)
}

export const trackChatbotInteraction = (action: string, message?: string) => {
  getAnalytics().trackChatbotInteraction(action, message)
}

export const trackProjectView = (projectName: string) => {
  getAnalytics().trackProjectView(projectName)
}

export const trackDownload = (fileName: string, fileType: string) => {
  getAnalytics().trackDownload(fileName, fileType)
}
