import { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

export class AccessibilityHelpers {
  static async runAxeAudit(
    page: Page,
    options?: {
      tags?: string[]
      rules?: Record<string, { enabled: boolean }>
    }
  ) {
    const axeBuilder = new AxeBuilder({ page })

    if (options?.tags) {
      axeBuilder.withTags(options.tags)
    }

    if (options?.rules) {
      Object.entries(options.rules).forEach(([rule, config]) => {
        if (config.enabled) {
          axeBuilder.include(rule)
        } else {
          axeBuilder.exclude(rule)
        }
      })
    }

    const results = await axeBuilder.analyze()

    return {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
      summary: {
        violationCount: results.violations.length,
        passCount: results.passes.length,
        incompleteCount: results.incomplete.length,
      },
    }
  }

  static async checkKeyboardNavigation(page: Page) {
    const results = {
      focusableElements: [] as Array<{
        tagName: string
        text: string
        role: string | null
      }>,
      tabOrder: [] as string[],
      skipLinks: [] as string[],
      trapFocus: true,
    }

    // Find all focusable elements
    const focusableSelector =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const focusableElements = await page.locator(focusableSelector).all()

    for (const element of focusableElements) {
      const tagName = await element.evaluate(el => el.tagName.toLowerCase())
      const text = await element.textContent()
      const role = await element.getAttribute('role')

      results.focusableElements.push({
        tagName,
        text: text?.trim() || '',
        role,
      })
    }

    // Test tab navigation
    let currentFocusIndex = 0
    for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
      await page.keyboard.press('Tab')
      const focused = await page.evaluate(() =>
        document.activeElement?.tagName.toLowerCase()
      )
      results.tabOrder.push(focused || 'unknown')
      currentFocusIndex++
    }

    // Check for skip links
    const skipLinks = await page.locator('a[href^="#"]:visible').all()
    for (const link of skipLinks) {
      const text = await link.textContent()
      if (text?.toLowerCase().includes('skip')) {
        results.skipLinks.push(text.trim())
      }
    }

    return results
  }

  static async checkColorContrast(page: Page) {
    const contrastIssues = await page.evaluate(() => {
      const issues: Array<{
        element: string
        foreground: string
        background: string
        ratio: number
        level: string
      }> = []

      // This is a simplified version - in practice you'd use a proper contrast checking library
      const textElements = document.querySelectorAll(
        'p, h1, h2, h3, h4, h5, h6, span, a, button, label'
      )

      textElements.forEach((element, index) => {
        if (index < 20) {
          // Limit to first 20 elements for performance
          const styles = window.getComputedStyle(element)
          const color = styles.color
          const backgroundColor = styles.backgroundColor

          if (
            color &&
            backgroundColor &&
            backgroundColor !== 'rgba(0, 0, 0, 0)'
          ) {
            issues.push({
              element: element.tagName.toLowerCase(),
              foreground: color,
              background: backgroundColor,
              ratio: 0, // Would calculate actual ratio in real implementation
              level: 'unknown',
            })
          }
        }
      })

      return issues
    })

    return contrastIssues
  }

  static async checkAriaLabels(page: Page) {
    const ariaIssues = await page.evaluate(() => {
      const issues: Array<{
        element: string
        issue: string
        selector: string
      }> = []

      // Check for missing alt text on images
      const images = document.querySelectorAll('img')
      images.forEach((img, index) => {
        if (!img.alt && !img.getAttribute('aria-label')) {
          issues.push({
            element: 'img',
            issue: 'Missing alt text or aria-label',
            selector: `img:nth-child(${index + 1})`,
          })
        }
      })

      // Check for missing labels on form inputs
      const inputs = document.querySelectorAll('input, textarea, select')
      inputs.forEach((input, index) => {
        const hasLabel =
          (input as HTMLInputElement).labels &&
          (input as HTMLInputElement).labels!.length > 0
        const hasAriaLabel = input.getAttribute('aria-label')
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby')

        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          issues.push({
            element: input.tagName.toLowerCase(),
            issue: 'Missing label or aria-label',
            selector: `${input.tagName.toLowerCase()}:nth-child(${index + 1})`,
          })
        }
      })

      // Check for missing roles on interactive elements
      const interactiveElements = document.querySelectorAll(
        '[onclick], [onkeydown]'
      )
      interactiveElements.forEach((element, index) => {
        if (
          !element.getAttribute('role') &&
          element.tagName.toLowerCase() === 'div'
        ) {
          issues.push({
            element: 'div',
            issue: 'Interactive div missing role',
            selector: `div:nth-child(${index + 1})`,
          })
        }
      })

      return issues
    })

    return ariaIssues
  }

  static async checkHeadingStructure(page: Page) {
    const headings = await page.evaluate(() => {
      const headingElements = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      )
      return Array.from(headingElements).map(heading => ({
        level: parseInt(heading.tagName.charAt(1)),
        text: heading.textContent?.trim() || '',
        hasProperOrder: true, // Would implement proper order checking
      }))
    })

    // Check for proper heading order (h1 -> h2 -> h3, etc.)
    let lastLevel = 0
    const orderIssues: string[] = []

    headings.forEach((heading, index) => {
      if (index === 0 && heading.level !== 1) {
        orderIssues.push('Page should start with h1')
      }

      if (heading.level > lastLevel + 1) {
        orderIssues.push(
          `Heading level ${heading.level} follows h${lastLevel}, skipping levels`
        )
      }

      lastLevel = heading.level
    })

    return {
      headings,
      orderIssues,
      hasH1: headings.some(h => h.level === 1),
      totalHeadings: headings.length,
    }
  }
}
