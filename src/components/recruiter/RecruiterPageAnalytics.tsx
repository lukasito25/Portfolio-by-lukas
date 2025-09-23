'use client'

import { useEffect, useRef, useState } from 'react'
import { dataService } from '@/lib/data-service'

interface RecruiterPageAnalyticsProps {
  pageId: string
}

export function RecruiterPageAnalytics({
  pageId,
}: RecruiterPageAnalyticsProps) {
  const startTime = useRef(Date.now())
  const sessionId = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  )
  const [scrollDepth, setScrollDepth] = useState(0)
  const [interactions, setInteractions] = useState(0)

  useEffect(() => {
    let timeSpent = 0
    let maxScrollDepth = 0

    const updateScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const currentScrollDepth = Math.round((scrollTop / docHeight) * 100)

      if (currentScrollDepth > maxScrollDepth) {
        maxScrollDepth = currentScrollDepth
        setScrollDepth(currentScrollDepth)
      }
    }

    const trackInteraction = () => {
      setInteractions(prev => prev + 1)
    }

    // Track scroll depth
    const handleScroll = () => {
      updateScrollDepth()
    }

    // Track basic interactions
    const handleClick = () => {
      trackInteraction()
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)

    // Cleanup and send analytics on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)

      timeSpent = Math.round((Date.now() - startTime.current) / 1000)

      // Send analytics data
      dataService
        .trackRecruiterPageView(pageId, {
          sessionId: sessionId.current,
          timeSpent,
          scrollDepth: maxScrollDepth,
          interactions,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        })
        .catch(error => {
          console.error('Failed to track analytics:', error)
        })
    }
  }, [pageId, interactions])

  // This component doesn't render anything visible
  return null
}
