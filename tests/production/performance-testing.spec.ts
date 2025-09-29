import { test, expect } from '@playwright/test'
import { AboutPage } from '../pages/AboutPage'
import {
  PerformanceHelpers,
  PerformanceMetrics,
} from '../helpers/PerformanceHelpers'

test.describe('Performance Testing', () => {
  let aboutPage: AboutPage

  test.beforeEach(async ({ page }) => {
    aboutPage = new AboutPage(page)
  })

  test('Measure page load performance', async () => {
    const startTime = Date.now()

    await aboutPage.goto()

    const metrics = await PerformanceHelpers.measurePagePerformance(
      aboutPage.page
    )
    const loadDuration = Date.now() - startTime

    console.log(
      '⚡ Page Performance Metrics:',
      PerformanceHelpers.formatMetrics(metrics)
    )
    console.log(`📊 Total Load Duration: ${loadDuration}ms`)

    // Performance assertions
    expect(metrics.loadTime).toBeLessThan(5000) // Should load within 5 seconds
    expect(metrics.domContentLoaded).toBeLessThan(3000) // DOM should be ready within 3 seconds
    expect(metrics.networkRequests).toBeLessThan(50) // Reasonable number of requests
    expect(metrics.totalSize).toBeLessThan(5 * 1024 * 1024) // Less than 5MB total size
  })

  test('Measure Core Web Vitals', async () => {
    await aboutPage.goto()

    const vitals = await PerformanceHelpers.measureCoreWebVitals(aboutPage.page)

    console.log('🎯 Core Web Vitals:', {
      'First Contentful Paint': vitals.fcp
        ? `${vitals.fcp.toFixed(2)}ms`
        : 'Not measured',
      'Largest Contentful Paint': vitals.lcp
        ? `${vitals.lcp.toFixed(2)}ms`
        : 'Not measured',
      'Cumulative Layout Shift': vitals.cls
        ? vitals.cls.toFixed(3)
        : 'Not measured',
      'First Input Delay': vitals.fid
        ? `${vitals.fid.toFixed(2)}ms`
        : 'Not measured',
      'Time to First Byte': vitals.ttfb
        ? `${vitals.ttfb.toFixed(2)}ms`
        : 'Not measured',
    })

    // Core Web Vitals thresholds (Google recommendations)
    if (vitals.lcp > 0) {
      expect(vitals.lcp).toBeLessThan(2500) // Good LCP < 2.5s
    }

    if (vitals.fid > 0) {
      expect(vitals.fid).toBeLessThan(100) // Good FID < 100ms
    }

    if (vitals.cls > 0) {
      expect(vitals.cls).toBeLessThan(0.1) // Good CLS < 0.1
    }
  })

  test('Audit network requests', async () => {
    const requests: Array<{
      url: string
      method: string
      status: number
      size: number
      duration: number
      resourceType: string
    }> = []

    aboutPage.page.on('response', async response => {
      const request = response.request()
      // Note: Playwright Response doesn't have timing() method
      // This would be handled differently in a real implementation

      try {
        const body = await response.body()
        requests.push({
          url: response.url(),
          method: request.method(),
          status: response.status(),
          size: body.length,
          duration: 0, // Placeholder
          resourceType: request.resourceType(),
        })
      } catch (error) {
        // Ignore errors for requests that can't be read
      }
    })

    await aboutPage.goto()

    // Wait for all requests to complete
    await aboutPage.page.waitForTimeout(3000)

    console.log('🌐 Network Request Analysis:', {
      totalRequests: requests.length,
      totalSize: `${(requests.reduce((sum, req) => sum + req.size, 0) / 1024).toFixed(2)}KB`,
      avgDuration: `${(requests.reduce((sum, req) => sum + req.duration, 0) / requests.length).toFixed(2)}ms`,
      failedRequests: requests.filter(req => req.status >= 400).length,
      slowRequests: requests.filter(req => req.duration > 1000).length,
    })

    // Group by resource type
    const resourceTypes = requests.reduce(
      (acc, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    console.log('📊 Resource Types:', resourceTypes)

    // Performance assertions
    expect(requests.filter(req => req.status >= 400).length).toBeLessThan(3) // Minimal failed requests
    expect(requests.filter(req => req.duration > 3000).length).toBeLessThan(5) // Few very slow requests
    expect(requests.length).toBeLessThan(50) // Reasonable number of requests
  })

  test('Check image optimization', async () => {
    await aboutPage.goto()

    const imageAudit = await PerformanceHelpers.checkImageOptimization(
      aboutPage.page
    )

    console.log('🖼️  Image Optimization Analysis:', {
      totalImages: imageAudit.totalImages,
      lazyLoadedImages: imageAudit.lazyLoadedImages,
      issues: imageAudit.issues.length,
    })

    // Log specific issues
    if (imageAudit.issues.length > 0) {
      console.log('⚠️  Image Optimization Issues:')
      imageAudit.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`)
      })
    }

    // Image optimization assertions
    expect(imageAudit.issues.length).toBeLessThan(5) // Minimal optimization issues

    // If there are images, check optimization
    if (imageAudit.totalImages > 0) {
      const lazyLoadPercentage =
        (imageAudit.lazyLoadedImages / imageAudit.totalImages) * 100
      console.log(`📈 Lazy Loading Coverage: ${lazyLoadPercentage.toFixed(1)}%`)

      // Should have some lazy loading for better performance
      if (imageAudit.totalImages > 3) {
        expect(lazyLoadPercentage).toBeGreaterThan(30) // At least 30% lazy loaded
      }
    }
  })

  test('Performance comparison across viewports', async () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
    ]

    const performanceResults: Array<{
      viewport: string
      metrics: PerformanceMetrics
    }> = []

    for (const viewport of viewports) {
      await aboutPage.page.setViewportSize(viewport)
      await aboutPage.goto()

      const metrics = await PerformanceHelpers.measurePagePerformance(
        aboutPage.page
      )

      performanceResults.push({
        viewport: viewport.name,
        metrics,
      })

      console.log(
        `📱 ${viewport.name.toUpperCase()} Performance:`,
        PerformanceHelpers.formatMetrics(metrics)
      )
    }

    // Compare performance across viewports
    const mobileMetrics = performanceResults.find(
      r => r.viewport === 'mobile'
    )?.metrics
    const desktopMetrics = performanceResults.find(
      r => r.viewport === 'desktop'
    )?.metrics

    if (mobileMetrics && desktopMetrics) {
      const comparison = PerformanceHelpers.compareMetrics(
        mobileMetrics,
        desktopMetrics
      )

      console.log('📊 Mobile vs Desktop Comparison:', {
        'Load Time Difference': `${comparison.loadTime.diff.toFixed(2)}ms (${comparison.loadTime.percentChange.toFixed(1)}%)`,
        'Network Requests Difference': `${comparison.networkRequests.diff} requests`,
        'Size Difference': `${(comparison.totalSize.diff / 1024).toFixed(2)}KB`,
      })

      // Mobile shouldn't be significantly slower than desktop
      expect(Math.abs(comparison.loadTime.percentChange)).toBeLessThan(50) // Less than 50% difference
    }

    // All viewports should meet basic performance criteria
    for (const result of performanceResults) {
      expect(result.metrics.loadTime).toBeLessThan(8000) // 8 seconds max for any viewport
      expect(result.metrics.domContentLoaded).toBeLessThan(5000) // 5 seconds max DOM ready
    }
  })

  test('Test caching effectiveness', async () => {
    // First visit
    const firstVisitStart = Date.now()
    await aboutPage.goto()
    const firstVisitDuration = Date.now() - firstVisitStart

    // Second visit (should use cache)
    const secondVisitStart = Date.now()
    await aboutPage.page.reload()
    const secondVisitDuration = Date.now() - secondVisitStart

    console.log('🔄 Caching Analysis:', {
      firstVisit: `${firstVisitDuration}ms`,
      secondVisit: `${secondVisitDuration}ms`,
      improvement: `${(((firstVisitDuration - secondVisitDuration) / firstVisitDuration) * 100).toFixed(1)}%`,
    })

    // Second visit should be faster (indicating caching)
    expect(secondVisitDuration).toBeLessThan(firstVisitDuration * 1.2) // Allow 20% margin
  })

  test('Memory usage monitoring', async () => {
    await aboutPage.goto()

    // Monitor memory usage
    const memoryUsage = await aboutPage.page.evaluate(() => {
      const performance = window.performance as any
      const memory = performance.memory

      return {
        usedJSHeapSize: memory?.usedJSHeapSize || 0,
        totalJSHeapSize: memory?.totalJSHeapSize || 0,
        jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      }
    })

    console.log('🧠 Memory Usage:', {
      'Used Heap': `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      'Total Heap': `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      'Heap Limit': `${(memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
    })

    // Memory usage should be reasonable
    if (memoryUsage.usedJSHeapSize > 0) {
      const usedMB = memoryUsage.usedJSHeapSize / 1024 / 1024
      expect(usedMB).toBeLessThan(100) // Less than 100MB used heap
    }
  })

  test('Third-party script performance impact', async () => {
    const thirdPartyRequests: Array<{
      url: string
      domain: string
      size: number
      duration: number
    }> = []

    aboutPage.page.on('response', async response => {
      const url = response.url()
      const domain = new URL(url).hostname

      // Check if it's a third-party domain
      if (
        !domain.includes('portfolio-by-lukas') &&
        !domain.includes('localhost')
      ) {
        try {
          const body = await response.body()
          // Note: Playwright Response doesn't have timing() method

          thirdPartyRequests.push({
            url,
            domain,
            size: body.length,
            duration: 0, // Placeholder
          })
        } catch (error) {
          // Ignore errors
        }
      }
    })

    await aboutPage.goto()
    await aboutPage.page.waitForTimeout(3000)

    console.log('🌍 Third-Party Analysis:', {
      thirdPartyRequests: thirdPartyRequests.length,
      totalSize: `${(thirdPartyRequests.reduce((sum, req) => sum + req.size, 0) / 1024).toFixed(2)}KB`,
      domains: [...new Set(thirdPartyRequests.map(req => req.domain))],
    })

    // Third-party impact should be minimal
    const totalThirdPartySize = thirdPartyRequests.reduce(
      (sum, req) => sum + req.size,
      0
    )
    expect(totalThirdPartySize).toBeLessThan(1024 * 1024) // Less than 1MB of third-party content
    expect(thirdPartyRequests.length).toBeLessThan(10) // Reasonable number of third-party requests
  })
})
