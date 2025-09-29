import { Page, expect } from '@playwright/test'

export class ComparisonHelpers {
  static async comparePageContent(page1: Page, page2: Page, selector: string) {
    const content1 = await page1.locator(selector).textContent()
    const content2 = await page2.locator(selector).textContent()

    return {
      areEqual: content1 === content2,
      content1,
      content2,
      difference:
        content1 !== content2 ? { page1: content1, page2: content2 } : null,
    }
  }

  static async compareElementCount(page1: Page, page2: Page, selector: string) {
    const count1 = await page1.locator(selector).count()
    const count2 = await page2.locator(selector).count()

    return {
      areEqual: count1 === count2,
      count1,
      count2,
      difference: count1 !== count2 ? { page1: count1, page2: count2 } : null,
    }
  }

  static async compareVisibleElements(
    page1: Page,
    page2: Page,
    selector: string
  ) {
    const elements1 = await page1.locator(selector).all()
    const elements2 = await page2.locator(selector).all()

    const visible1 = []
    const visible2 = []

    for (const el of elements1) {
      if (await el.isVisible()) {
        visible1.push(await el.textContent())
      }
    }

    for (const el of elements2) {
      if (await el.isVisible()) {
        visible2.push(await el.textContent())
      }
    }

    return {
      areEqual: JSON.stringify(visible1) === JSON.stringify(visible2),
      visible1,
      visible2,
      difference:
        JSON.stringify(visible1) !== JSON.stringify(visible2)
          ? { page1: visible1, page2: visible2 }
          : null,
    }
  }

  static async checkConsoleErrors(page: Page) {
    const errors: string[] = []
    const warnings: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text())
      }
    })

    return { errors, warnings }
  }

  static async checkNetworkRequests(page: Page) {
    const failedRequests: Array<{ url: string; status: number }> = []
    const slowRequests: Array<{ url: string; duration: number }> = []

    page.on('response', response => {
      const duration = response.timing()?.responseEnd || 0

      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status(),
        })
      }

      if (duration > 3000) {
        // Requests taking more than 3 seconds
        slowRequests.push({
          url: response.url(),
          duration,
        })
      }
    })

    return { failedRequests, slowRequests }
  }

  static async waitForContentLoad(page: Page, timeout = 10000) {
    // Wait for network to be idle
    await page.waitForLoadState('networkidle', { timeout })

    // Wait for any loading spinners to disappear
    await page
      .waitForSelector('[data-testid="loading"]', {
        state: 'detached',
        timeout: 5000,
      })
      .catch(() => {
        // Ignore if no loading spinner exists
      })

    // Wait for main content to be visible
    await page.waitForSelector('main, [role="main"]', { timeout })
  }

  static async takeFullPageScreenshot(page: Page, name: string) {
    return await page.screenshot({
      path: `tests/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    })
  }

  static async compareScreenshots(page1: Page, page2: Page, name: string) {
    const screenshot1 = await page1.screenshot({ fullPage: true })
    const screenshot2 = await page2.screenshot({ fullPage: true })

    // Note: For actual visual comparison, you'd use a library like pixelmatch
    // This is a simplified version that just captures both screenshots
    return {
      screenshot1,
      screenshot2,
      // In a real implementation, you'd compare the buffers
      areIdentical: false, // Placeholder
    }
  }
}
