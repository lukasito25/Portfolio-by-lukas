import { test, expect } from '@playwright/test'
import { AboutPage } from '../pages/AboutPage'
import { AccessibilityHelpers } from '../helpers/AccessibilityHelpers'

test.describe('Accessibility Audit', () => {
  let aboutPage: AboutPage

  test.beforeEach(async ({ page }) => {
    aboutPage = new AboutPage(page)
    await aboutPage.goto()
  })

  test('Run comprehensive axe accessibility audit', async () => {
    // Run full axe audit
    const auditResults = await AccessibilityHelpers.runAxeAudit(
      aboutPage.page,
      {
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      }
    )

    console.log('🔍 Accessibility Audit Results:', {
      violations: auditResults.summary.violationCount,
      passes: auditResults.summary.passCount,
      incomplete: auditResults.summary.incompleteCount,
    })

    // Log violations in detail
    if (auditResults.violations.length > 0) {
      console.log('🚨 Accessibility Violations:')
      auditResults.violations.forEach((violation, index) => {
        console.log(`${index + 1}. ${violation.id}: ${violation.description}`)
        console.log(`   Impact: ${violation.impact}`)
        console.log(`   Help: ${violation.helpUrl}`)
        console.log(`   Nodes affected: ${violation.nodes.length}`)
      })
    }

    // Accessibility standards
    expect(auditResults.summary.violationCount).toBeLessThan(10) // Allow some minor violations
    expect(auditResults.summary.passCount).toBeGreaterThan(10) // Should have many passing tests
  })

  test('Check keyboard navigation', async () => {
    const keyboardResults = await AccessibilityHelpers.checkKeyboardNavigation(
      aboutPage.page
    )

    console.log('⌨️  Keyboard Navigation Analysis:', {
      focusableElements: keyboardResults.focusableElements.length,
      tabOrder: keyboardResults.tabOrder.slice(0, 5), // First 5 elements
      skipLinks: keyboardResults.skipLinks,
    })

    // Should have focusable elements
    expect(keyboardResults.focusableElements.length).toBeGreaterThan(0)

    // Should have logical tab order
    expect(keyboardResults.tabOrder.length).toBeGreaterThan(0)

    // Check for essential interactive elements
    const hasButtons = keyboardResults.focusableElements.some(
      el => el.tagName === 'button'
    )
    const hasLinks = keyboardResults.focusableElements.some(
      el => el.tagName === 'a'
    )

    expect(hasButtons || hasLinks).toBe(true) // Should have interactive elements
  })

  test('Validate ARIA labels and roles', async () => {
    const ariaResults = await AccessibilityHelpers.checkAriaLabels(
      aboutPage.page
    )

    console.log('🏷️  ARIA Analysis:', {
      totalIssues: ariaResults.length,
      missingAltText: ariaResults.filter(issue => issue.issue.includes('alt'))
        .length,
      missingLabels: ariaResults.filter(issue => issue.issue.includes('label'))
        .length,
      missingRoles: ariaResults.filter(issue => issue.issue.includes('role'))
        .length,
    })

    // Log specific issues
    if (ariaResults.length > 0) {
      console.log('⚠️  ARIA Issues Found:')
      ariaResults.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.element}: ${issue.issue}`)
      })
    }

    // Should have minimal ARIA issues
    expect(ariaResults.length).toBeLessThan(5) // Allow some minor issues
  })

  test('Check heading structure', async () => {
    const headingResults = await AccessibilityHelpers.checkHeadingStructure(
      aboutPage.page
    )

    console.log('📋 Heading Structure Analysis:', {
      totalHeadings: headingResults.totalHeadings,
      hasH1: headingResults.hasH1,
      orderIssues: headingResults.orderIssues.length,
      headingLevels: headingResults.headings.map(
        h => `h${h.level}: ${h.text.slice(0, 50)}...`
      ),
    })

    // Should have at least one H1
    expect(headingResults.hasH1).toBe(true)

    // Should have some headings
    expect(headingResults.totalHeadings).toBeGreaterThan(0)

    // Log heading order issues
    if (headingResults.orderIssues.length > 0) {
      console.log('⚠️  Heading Order Issues:', headingResults.orderIssues)
    }

    // Should have minimal heading order issues
    expect(headingResults.orderIssues.length).toBeLessThan(3)
  })

  test('Test color contrast', async () => {
    const contrastResults = await AccessibilityHelpers.checkColorContrast(
      aboutPage.page
    )

    console.log('🎨 Color Contrast Analysis:', {
      elementsChecked: contrastResults.length,
      potentialIssues: contrastResults.filter(result => result.ratio < 4.5)
        .length,
    })

    // Log color information
    if (contrastResults.length > 0) {
      console.log('🎯 Color Analysis Sample:')
      contrastResults.slice(0, 5).forEach((result, index) => {
        console.log(
          `${index + 1}. ${result.element}: ${result.foreground} on ${result.background}`
        )
      })
    }

    // Should check some elements
    expect(contrastResults.length).toBeGreaterThan(0)
  })

  test('Check focus indicators', async () => {
    // Test focus visibility on interactive elements
    const focusResults = await aboutPage.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select'
      )
      const results: Array<{ element: string; hasFocusStyle: boolean }> = []

      interactiveElements.forEach((element, index) => {
        if (index < 10) {
          // Test first 10 elements
          // Simulate focus
          ;(element as HTMLElement).focus()
          const styles = window.getComputedStyle(element, ':focus')
          const hasOutline = styles.outline !== 'none' && styles.outline !== ''
          const hasBoxShadow = styles.boxShadow !== 'none'
          const hasBorder = styles.borderWidth !== '0px'

          results.push({
            element: element.tagName.toLowerCase(),
            hasFocusStyle: hasOutline || hasBoxShadow || hasBorder,
          })

          // Remove focus
          ;(element as HTMLElement).blur()
        }
      })

      return results
    })

    console.log('🎯 Focus Indicator Analysis:', {
      elementsChecked: focusResults.length,
      elementsWithFocus: focusResults.filter(r => r.hasFocusStyle).length,
      elementsWithoutFocus: focusResults.filter(r => !r.hasFocusStyle).length,
    })

    // Most interactive elements should have focus indicators
    const focusPercentage =
      (focusResults.filter(r => r.hasFocusStyle).length / focusResults.length) *
      100
    expect(focusPercentage).toBeGreaterThan(70) // At least 70% should have focus styles
  })

  test('Test with screen reader simulation', async () => {
    // Check for screen reader friendly elements
    const screenReaderElements = await aboutPage.page.evaluate(() => {
      const results = {
        landmarksCount: document.querySelectorAll(
          '[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer'
        ).length,
        headingsCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6')
          .length,
        listsCount: document.querySelectorAll('ul, ol').length,
        imagesWithAlt: document.querySelectorAll('img[alt]').length,
        imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
        buttonsWithLabels: document.querySelectorAll(
          'button[aria-label], button:not(:empty)'
        ).length,
        linksWithText: document.querySelectorAll('a:not(:empty)').length,
      }

      return results
    })

    console.log('🗣️  Screen Reader Compatibility:', screenReaderElements)

    // Should have proper semantic structure
    expect(screenReaderElements.landmarksCount).toBeGreaterThan(0)
    expect(screenReaderElements.headingsCount).toBeGreaterThan(0)

    // Images should have alt text
    const totalImages =
      screenReaderElements.imagesWithAlt + screenReaderElements.imagesWithoutAlt
    if (totalImages > 0) {
      const altTextPercentage =
        (screenReaderElements.imagesWithAlt / totalImages) * 100
      expect(altTextPercentage).toBeGreaterThan(80) // At least 80% should have alt text
    }
  })

  test('Mobile accessibility testing', async () => {
    // Test accessibility on mobile viewport
    await aboutPage.page.setViewportSize({ width: 375, height: 667 })
    await aboutPage.page.waitForTimeout(500)

    // Check touch target sizes
    const touchTargets = await aboutPage.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input[type="checkbox"], input[type="radio"]'
      )
      const results: Array<{
        element: string
        width: number
        height: number
        meetsMinimum: boolean
      }> = []

      interactiveElements.forEach((element, index) => {
        if (index < 10) {
          // Check first 10 elements
          const rect = element.getBoundingClientRect()
          const meetsMinimum = rect.width >= 44 && rect.height >= 44 // WCAG minimum

          results.push({
            element: element.tagName.toLowerCase(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            meetsMinimum,
          })
        }
      })

      return results
    })

    console.log('📱 Mobile Touch Target Analysis:', {
      elementsChecked: touchTargets.length,
      meetingMinimum: touchTargets.filter(t => t.meetsMinimum).length,
      averageSize: Math.round(
        touchTargets.reduce((sum, t) => sum + Math.min(t.width, t.height), 0) /
          touchTargets.length
      ),
    })

    // Most touch targets should meet minimum size requirements
    const meetsMinimumPercentage =
      (touchTargets.filter(t => t.meetsMinimum).length / touchTargets.length) *
      100
    expect(meetsMinimumPercentage).toBeGreaterThan(70) // At least 70% should meet minimum size
  })
})
