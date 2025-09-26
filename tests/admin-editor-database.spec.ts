import { test, expect, Page, BrowserContext } from '@playwright/test'

/**
 * Comprehensive Admin Editor Database Integration Tests
 *
 * This test suite focuses on verifying that the admin editor correctly
 * integrates with the database backend and provides real-time content
 * updates across the website.
 */

// Test utilities for database operations and content management
class AdminEditorTestUtils {
  constructor(private page: Page) {}

  /**
   * Logs in to the admin panel using development credentials
   */
  async loginAsAdmin() {
    await this.page.goto('/admin/login')
    await this.page.getByPlaceholder('Email address').fill('admin@localhost')
    await this.page.getByPlaceholder('Password').fill('admin123')
    await this.page.getByRole('button', { name: 'Sign in' }).click()

    // Wait for successful login redirect
    await expect(this.page).toHaveURL(/\/admin/)
  }

  /**
   * Navigates to the admin editor and waits for content to load
   */
  async goToEditor() {
    await this.page.goto('/admin/editor')
    await expect(this.page.getByRole('heading', { name: /Database Content Editor/i })).toBeVisible()

    // Wait for database content loading to complete
    await this.page.waitForFunction(() => {
      const loadingIndicator = document.querySelector('[data-testid="loading-content"]')
      return !loadingIndicator || !loadingIndicator.textContent?.includes('Loading content from database')
    }, { timeout: 10000 })
  }

  /**
   * Updates a simple text field and verifies the change is reflected
   */
  async updateTextField(labelText: string, newValue: string) {
    const field = this.page.getByLabel(labelText)
    await field.clear()
    await field.fill(newValue)

    // Verify the field shows the new value
    await expect(field).toHaveValue(newValue)

    // Verify that unsaved changes indicator appears
    await expect(this.page.getByText('Unsaved Changes')).toBeVisible()

    return newValue
  }

  /**
   * Saves content and waits for success confirmation
   */
  async saveContent() {
    const saveButton = this.page.getByRole('button', { name: /Save to Database/i })
    await expect(saveButton).toBeEnabled()

    await saveButton.click()

    // Wait for loading state
    await expect(this.page.getByText(/Saving/i)).toBeVisible({ timeout: 5000 })

    // Wait for save completion - either success message or last saved timestamp
    await this.page.waitForFunction(() => {
      const lastSaved = document.querySelector(':text("Last saved:")')
      const successMessage = document.querySelector(':text("Successfully updated")')
      return lastSaved || successMessage
    }, { timeout: 15000 })

    // Verify unsaved changes indicator is gone
    await expect(this.page.getByText('Unsaved Changes')).not.toBeVisible({ timeout: 5000 })
  }

  /**
   * Switches to a specific tab in the editor
   */
  async switchToTab(tabName: string) {
    await this.page.getByRole('tab', { name: tabName }).click()
    await expect(this.page.getByRole('tab', { name: tabName })).toHaveAttribute('data-state', 'active')
  }

  /**
   * Adds a new item to an array field (like competencies or metrics)
   */
  async addArrayItem(addButtonText: string) {
    const addButton = this.page.getByRole('button', { name: addButtonText })
    const itemCountBefore = await this.getArrayItemCount(addButtonText)

    await addButton.click()

    // Wait for the new item to appear
    await this.page.waitForFunction(
      (expectedCount) => {
        const items = document.querySelectorAll('[data-array-item]')
        return items.length > expectedCount
      },
      itemCountBefore,
      { timeout: 5000 }
    )
  }

  /**
   * Gets the current count of array items for a specific section
   */
  async getArrayItemCount(sectionIdentifier: string): Promise<number> {
    // This is a helper function - in real implementation you'd need to
    // identify array items by a more specific selector
    const items = await this.page.locator('[data-array-item]').count()
    return items
  }

  /**
   * Verifies content appears on the live website
   */
  async verifyContentOnLiveSite(url: string, expectedContent: string) {
    const context = this.page.context()
    const livePage = await context.newPage()

    try {
      await livePage.goto(url)
      await expect(livePage.getByText(expectedContent)).toBeVisible({ timeout: 10000 })
    } finally {
      await livePage.close()
    }
  }

  /**
   * Reloads content from database and verifies it loads correctly
   */
  async reloadFromDatabase() {
    await this.page.getByRole('button', { name: /Reload from Database/i }).click()

    // Wait for loading indicator
    await expect(this.page.getByText(/Loading content from database/i)).toBeVisible({ timeout: 5000 })

    // Wait for content to load
    await this.page.waitForFunction(() => {
      const loadingText = document.querySelector(':text("Loading content from database")')
      return !loadingText
    }, { timeout: 10000 })
  }
}

test.describe('Admin Editor Database Integration', () => {
  let adminUtils: AdminEditorTestUtils

  test.beforeEach(async ({ page }) => {
    adminUtils = new AdminEditorTestUtils(page)
    await adminUtils.loginAsAdmin()
  })

  test('should load content from database on initial page load', async ({ page }) => {
    // Navigate to editor
    await adminUtils.goToEditor()

    // Verify key content sections are visible and populated
    await expect(page.getByLabel('Hero Badge')).toBeVisible()
    await expect(page.getByLabel('Hero Badge')).not.toHaveValue('')

    // Check that content loading completed successfully
    await expect(page.getByText('Database Error')).not.toBeVisible()

    // Verify that the database connection indicator shows success
    await expect(page.locator('[data-testid="database-status"]')).toBeVisible()
  })

  test('should handle database loading errors gracefully', async ({ page }) => {
    // Simulate network failure by intercepting API calls
    await page.route('**/api/content/**', route => {
      route.abort('failed')
    })

    await page.goto('/admin/editor')

    // Should show error message but still load the page
    await expect(page.getByText(/Failed to load content from database/i)).toBeVisible()
    await expect(page.getByText('Database Error')).toBeVisible()

    // Should fall back to default content
    await expect(page.getByLabel('Hero Badge')).toBeVisible()
  })

  test('should save simple text field changes to database', async ({ page }) => {
    await adminUtils.goToEditor()

    // Update hero badge text
    const testValue = `Test Badge ${Date.now()}`
    await adminUtils.updateTextField('Hero Badge', testValue)

    // Save changes
    await adminUtils.saveContent()

    // Reload page and verify persistence
    await page.reload()
    await adminUtils.goToEditor()

    await expect(page.getByLabel('Hero Badge')).toHaveValue(testValue)
  })

  test('should update homepage content and reflect changes on live site', async ({ page }) => {
    await adminUtils.goToEditor()

    // Update hero badge with unique content
    const uniqueContent = `Live Update Test ${Date.now()}`
    await adminUtils.updateTextField('Hero Badge', uniqueContent)

    // Save changes
    await adminUtils.saveContent()

    // Verify content appears on homepage
    await adminUtils.verifyContentOnLiveSite('/', uniqueContent)
  })

  test('should handle complex content updates (arrays and nested objects)', async ({ page }) => {
    await adminUtils.goToEditor()

    // Test updating metrics (array of objects)
    const metricInputs = page.locator('[placeholder="Value"]')
    const firstMetric = metricInputs.first()

    const uniqueValue = `${Date.now()}`
    await firstMetric.clear()
    await firstMetric.fill(uniqueValue)

    // Save changes
    await adminUtils.saveContent()

    // Reload and verify persistence
    await page.reload()
    await adminUtils.goToEditor()

    await expect(metricInputs.first()).toHaveValue(uniqueValue)
  })

  test('should synchronize content across different editor tabs', async ({ page }) => {
    await adminUtils.goToEditor()

    // Switch to About tab and update content
    await adminUtils.switchToTab('About')

    const aboutTestValue = `About Test ${Date.now()}`
    await adminUtils.updateTextField('Title', aboutTestValue)

    // Save changes
    await adminUtils.saveContent()

    // Verify content appears on about page
    await adminUtils.verifyContentOnLiveSite('/about', aboutTestValue)
  })

  test('should handle blog content updates correctly', async ({ page }) => {
    await adminUtils.goToEditor()

    // Switch to Blog tab
    await adminUtils.switchToTab('Blog')

    // Update blog hero title
    const blogTestValue = `Blog Hero ${Date.now()}`
    await adminUtils.updateTextField('Title', blogTestValue)

    // Save changes
    await adminUtils.saveContent()

    // Verify on blog page
    await adminUtils.verifyContentOnLiveSite('/blog', blogTestValue)
  })

  test('should handle work/portfolio content updates', async ({ page }) => {
    await adminUtils.goToEditor()

    // Switch to Work tab
    await adminUtils.switchToTab('Work')

    // Update work hero title
    const workTestValue = `Work Portfolio ${Date.now()}`
    await adminUtils.updateTextField('Title', workTestValue)

    // Save changes
    await adminUtils.saveContent()

    // Verify on work page
    await adminUtils.verifyContentOnLiveSite('/work', workTestValue)
  })

  test('should show proper loading states during save operations', async ({ page }) => {
    await adminUtils.goToEditor()

    // Make a change
    await adminUtils.updateTextField('Hero Badge', `Loading Test ${Date.now()}`)

    // Click save and verify loading states
    const saveButton = page.getByRole('button', { name: /Save to Database/i })
    await saveButton.click()

    // Should show loading spinner in button
    await expect(page.locator('[data-testid="save-loading"]')).toBeVisible({ timeout: 5000 })

    // Should disable the save button during saving
    await expect(saveButton).toBeDisabled({ timeout: 5000 })

    // Wait for save to complete
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-test-id="save-button"]')
      return button && !button.hasAttribute('disabled')
    }, { timeout: 15000 })
  })

  test('should handle save failures gracefully', async ({ page }) => {
    await adminUtils.goToEditor()

    // Intercept API calls to simulate server error
    await page.route('**/api/content/**', route => {
      if (route.request().method() === 'PUT' || route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Database error' })
        })
      } else {
        route.continue()
      }
    })

    // Make a change
    await adminUtils.updateTextField('Hero Badge', 'Error Test')

    // Try to save
    const saveButton = page.getByRole('button', { name: /Save to Database/i })
    await saveButton.click()

    // Should show error message
    await expect(page.getByText(/Failed to save content/i)).toBeVisible({ timeout: 10000 })

    // Should keep unsaved changes indicator
    await expect(page.getByText('Unsaved Changes')).toBeVisible()
  })

  test('should reload content from database correctly', async ({ page }) => {
    await adminUtils.goToEditor()

    // Make unsaved changes
    await adminUtils.updateTextField('Hero Badge', 'Unsaved Change')
    await expect(page.getByText('Unsaved Changes')).toBeVisible()

    // Reload from database (should show confirmation dialog)
    await page.getByRole('button', { name: /Reload from Database/i }).click()

    // Accept the confirmation dialog
    page.on('dialog', dialog => dialog.accept())

    // Wait for reload to complete
    await adminUtils.reloadFromDatabase()

    // Verify unsaved changes are gone
    await expect(page.getByText('Unsaved Changes')).not.toBeVisible()
  })

  test('should export content correctly', async ({ page }) => {
    await adminUtils.goToEditor()

    // Set up download handler
    const downloadPromise = page.waitForEvent('download')

    // Click export button
    await page.getByRole('button', { name: /Export JSON/i }).click()

    // Wait for download
    const download = await downloadPromise

    // Verify download properties
    expect(download.suggestedFilename()).toMatch(/site-content-\d{4}-\d{2}-\d{2}\.json/)
  })

  test('should handle content import correctly', async ({ page }) => {
    await adminUtils.goToEditor()

    // Create a test JSON content file
    const testContent = {
      homepage: {
        hero: {
          badge: "Imported Test Content",
          headline: ["Imported", "Headline"],
          subheadline: "Imported subheadline",
          metrics: [{ value: "999", label: "Test Metric" }]
        },
        competencies: [],
        cta: { title: "Imported CTA", description: "Imported description" }
      }
    }

    // Create file input and upload
    const fileInput = page.locator('input[type="file"]')

    // Create a temporary file with test content
    const buffer = Buffer.from(JSON.stringify(testContent))
    await fileInput.setInputFiles({
      name: 'test-content.json',
      mimeType: 'application/json',
      buffer
    })

    // Verify content was imported
    await expect(page.getByLabel('Hero Badge')).toHaveValue('Imported Test Content')
    await expect(page.getByText('Unsaved Changes')).toBeVisible()
  })
})

test.describe('Admin Editor Cross-Tab Synchronization', () => {
  let context: BrowserContext
  let adminUtils: AdminEditorTestUtils

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext()
  })

  test.afterAll(async () => {
    await context.close()
  })

  test('should synchronize content changes across multiple browser tabs', async () => {
    // Open first tab
    const page1 = await context.newPage()
    const adminUtils1 = new AdminEditorTestUtils(page1)
    await adminUtils1.loginAsAdmin()
    await adminUtils1.goToEditor()

    // Open second tab
    const page2 = await context.newPage()
    const adminUtils2 = new AdminEditorTestUtils(page2)
    await adminUtils2.loginAsAdmin()
    await adminUtils2.goToEditor()

    // Make change in first tab
    const testValue = `Multi-tab test ${Date.now()}`
    await adminUtils1.updateTextField('Hero Badge', testValue)
    await adminUtils1.saveContent()

    // Refresh second tab and verify change
    await page2.reload()
    await adminUtils2.goToEditor()
    await expect(page2.getByLabel('Hero Badge')).toHaveValue(testValue)

    // Clean up
    await page1.close()
    await page2.close()
  })
})

test.describe('Admin Editor Performance and Reliability', () => {
  let adminUtils: AdminEditorTestUtils

  test.beforeEach(async ({ page }) => {
    adminUtils = new AdminEditorTestUtils(page)
    await adminUtils.loginAsAdmin()
  })

  test('should handle large content updates efficiently', async ({ page }) => {
    await adminUtils.goToEditor()

    // Create a large content update
    const largeText = 'A'.repeat(5000) // 5KB of text
    await adminUtils.updateTextField('Subheadline', largeText)

    // Measure save time
    const startTime = Date.now()
    await adminUtils.saveContent()
    const saveTime = Date.now() - startTime

    // Should save within reasonable time (adjust threshold as needed)
    expect(saveTime).toBeLessThan(10000) // 10 seconds

    // Verify content was saved correctly
    await page.reload()
    await adminUtils.goToEditor()
    await expect(page.getByLabel('Subheadline')).toHaveValue(largeText)
  })

  test('should handle rapid consecutive changes correctly', async ({ page }) => {
    await adminUtils.goToEditor()

    // Make multiple rapid changes
    const baseValue = Date.now().toString()
    for (let i = 1; i <= 5; i++) {
      await adminUtils.updateTextField('Hero Badge', `${baseValue}-${i}`)
      await page.waitForTimeout(100) // Small delay between changes
    }

    const finalValue = `${baseValue}-5`

    // Save and verify final value persisted
    await adminUtils.saveContent()
    await page.reload()
    await adminUtils.goToEditor()

    await expect(page.getByLabel('Hero Badge')).toHaveValue(finalValue)
  })

  test('should maintain data integrity during network interruptions', async ({ page }) => {
    await adminUtils.goToEditor()

    // Make initial change and save
    const initialValue = `Network test ${Date.now()}`
    await adminUtils.updateTextField('Hero Badge', initialValue)
    await adminUtils.saveContent()

    // Simulate network interruption
    await page.context().setOffline(true)

    // Try to make another change
    await adminUtils.updateTextField('Hero Badge', 'Offline change')

    // Try to save (should fail)
    const saveButton = page.getByRole('button', { name: /Save to Database/i })
    await saveButton.click()

    // Should show error
    await expect(page.getByText(/Failed to save/i)).toBeVisible({ timeout: 10000 })

    // Restore network
    await page.context().setOffline(false)

    // Reload and verify original value is intact
    await page.reload()
    await adminUtils.goToEditor()
    await expect(page.getByLabel('Hero Badge')).toHaveValue(initialValue)
  })
})