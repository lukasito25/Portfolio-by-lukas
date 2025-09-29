import { Page } from '@playwright/test'

export interface PerformanceMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  timeToInteractive: number
  loadTime: number
  domContentLoaded: number
  networkRequests: number
  totalSize: number
}

export class PerformanceHelpers {
  static async measurePagePerformance(page: Page): Promise<PerformanceMetrics> {
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle')

    const metrics = await page.evaluate(() => {
      return new Promise<PerformanceMetrics>(resolve => {
        // Use Performance Observer for modern metrics
        const observer = new PerformanceObserver(list => {
          const entries = list.getEntries()
          const paintEntries = entries.filter(
            entry => entry.entryType === 'paint'
          )
          const navigationEntries = entries.filter(
            entry => entry.entryType === 'navigation'
          )

          const performanceEntries = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming

          const metrics: PerformanceMetrics = {
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            timeToInteractive: 0,
            loadTime:
              performanceEntries?.loadEventEnd -
                performanceEntries?.navigationStart || 0,
            domContentLoaded:
              performanceEntries?.domContentLoadedEventEnd -
                performanceEntries?.navigationStart || 0,
            networkRequests: performance.getEntriesByType('resource').length,
            totalSize: 0,
          }

          // Get paint timings
          const fcpEntry = paintEntries.find(
            entry => entry.name === 'first-contentful-paint'
          )
          if (fcpEntry) {
            metrics.firstContentfulPaint = fcpEntry.startTime
          }

          // Calculate total transfer size
          const resourceEntries = performance.getEntriesByType(
            'resource'
          ) as PerformanceResourceTiming[]
          metrics.totalSize = resourceEntries.reduce((total, entry) => {
            return total + (entry.transferSize || 0)
          }, 0)

          resolve(metrics)
        })

        observer.observe({ entryTypes: ['paint', 'navigation', 'resource'] })

        // Fallback timeout
        setTimeout(() => {
          const performanceEntries = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming

          resolve({
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            timeToInteractive: 0,
            loadTime:
              performanceEntries?.loadEventEnd -
                performanceEntries?.navigationStart || 0,
            domContentLoaded:
              performanceEntries?.domContentLoadedEventEnd -
                performanceEntries?.navigationStart || 0,
            networkRequests: performance.getEntriesByType('resource').length,
            totalSize: performance
              .getEntriesByType('resource')
              .reduce((total, entry: any) => {
                return total + (entry.transferSize || 0)
              }, 0),
          })
        }, 2000)
      })
    })

    return metrics
  }

  static async measureCoreWebVitals(page: Page) {
    await page.waitForLoadState('networkidle')

    const vitals = await page.evaluate(() => {
      return new Promise(resolve => {
        const vitals = {
          lcp: 0,
          fid: 0,
          cls: 0,
          fcp: 0,
          ttfb: 0,
        }

        // Largest Contentful Paint
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        new PerformanceObserver(entryList => {
          const firstInput = entryList.getEntries()[0]
          if (firstInput) {
            vitals.fid = firstInput.processingStart - firstInput.startTime
          }
        }).observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        new PerformanceObserver(entryList => {
          let cls = 0
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value
            }
          }
          vitals.cls = cls
        }).observe({ entryTypes: ['layout-shift'] })

        // First Contentful Paint
        new PerformanceObserver(entryList => {
          const entries = entryList.getEntries()
          const fcpEntry = entries.find(
            entry => entry.name === 'first-contentful-paint'
          )
          if (fcpEntry) {
            vitals.fcp = fcpEntry.startTime
          }
        }).observe({ entryTypes: ['paint'] })

        // Time to First Byte
        const navigation = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming
        if (navigation) {
          vitals.ttfb = navigation.responseStart - navigation.requestStart
        }

        setTimeout(() => resolve(vitals), 3000)
      })
    })

    return vitals
  }

  static async auditNetworkRequests(page: Page) {
    const requests: Array<{
      url: string
      method: string
      status: number
      size: number
      duration: number
      resourceType: string
    }> = []

    page.on('response', async response => {
      const request = response.request()
      // Note: Playwright Response doesn't have timing() method
      // This would be handled differently in a real implementation

      requests.push({
        url: response.url(),
        method: request.method(),
        status: response.status(),
        size: (await response.body().catch(() => Buffer.alloc(0))).length,
        duration: 0, // Placeholder
        resourceType: request.resourceType(),
      })
    })

    return requests
  }

  static async checkImageOptimization(page: Page) {
    const images = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('img')
      return Array.from(imgElements).map(img => ({
        src: img.src,
        alt: img.alt,
        loading: img.loading,
        width: img.naturalWidth,
        height: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight,
        hasLazyLoading: img.loading === 'lazy',
        hasProperAlt: !!img.alt && img.alt.length > 0,
      }))
    })

    const issues: string[] = []

    images.forEach((img, index) => {
      // Check for missing alt text
      if (!img.hasProperAlt) {
        issues.push(`Image ${index + 1}: Missing or empty alt text`)
      }

      // Check for oversized images
      if (
        img.width > img.displayWidth * 2 ||
        img.height > img.displayHeight * 2
      ) {
        issues.push(
          `Image ${index + 1}: Image size (${img.width}x${img.height}) much larger than display size (${img.displayWidth}x${img.displayHeight})`
        )
      }

      // Check for lazy loading on below-fold images
      if (!img.hasLazyLoading && index > 2) {
        issues.push(
          `Image ${index + 1}: Consider adding lazy loading for below-fold images`
        )
      }
    })

    return {
      images,
      issues,
      totalImages: images.length,
      lazyLoadedImages: images.filter(img => img.hasLazyLoading).length,
    }
  }

  static compareMetrics(
    metrics1: PerformanceMetrics,
    metrics2: PerformanceMetrics
  ) {
    const differences = {
      loadTime: {
        diff: metrics2.loadTime - metrics1.loadTime,
        percentChange:
          ((metrics2.loadTime - metrics1.loadTime) / metrics1.loadTime) * 100,
        better: metrics2.loadTime < metrics1.loadTime,
      },
      firstContentfulPaint: {
        diff: metrics2.firstContentfulPaint - metrics1.firstContentfulPaint,
        percentChange:
          ((metrics2.firstContentfulPaint - metrics1.firstContentfulPaint) /
            metrics1.firstContentfulPaint) *
          100,
        better: metrics2.firstContentfulPaint < metrics1.firstContentfulPaint,
      },
      networkRequests: {
        diff: metrics2.networkRequests - metrics1.networkRequests,
        percentChange:
          ((metrics2.networkRequests - metrics1.networkRequests) /
            metrics1.networkRequests) *
          100,
        better: metrics2.networkRequests <= metrics1.networkRequests,
      },
      totalSize: {
        diff: metrics2.totalSize - metrics1.totalSize,
        percentChange:
          ((metrics2.totalSize - metrics1.totalSize) / metrics1.totalSize) *
          100,
        better: metrics2.totalSize <= metrics1.totalSize,
      },
    }

    return differences
  }

  static formatMetrics(metrics: PerformanceMetrics) {
    return {
      'Load Time': `${metrics.loadTime.toFixed(2)}ms`,
      'DOM Content Loaded': `${metrics.domContentLoaded.toFixed(2)}ms`,
      'First Contentful Paint': `${metrics.firstContentfulPaint.toFixed(2)}ms`,
      'Network Requests': metrics.networkRequests.toString(),
      'Total Size': `${(metrics.totalSize / 1024).toFixed(2)}KB`,
    }
  }
}
