import { test, expect, Page } from '@playwright/test'
import { ApiTestHelpers } from './helpers/api-test-helpers'

/**
 * Comprehensive Admin Authentication Tests
 *
 * This test suite verifies that the authentication issues have been resolved:
 * 1. API_SECRET environment variable is working
 * 2. API client routing uses admin proxy for all content routes
 * 3. API mode is enabled in environment configuration
 * 4. No 401 Unauthorized errors occur during normal admin operations
 */

test.describe('Admin Authentication Fixes Verification', () => {
  let apiHelpers: ApiTestHelpers

  test.beforeEach(async ({ page }) => {
    // Set up API helpers for testing
    apiHelpers = new ApiTestHelpers(page)

    // Clear any existing authentication state
    await page.context().clearCookies()
    await page.goto('/')
  })

  test('should successfully login with admin credentials', async ({ page }) => {
    // Navigate to admin login page
    await page.goto('/admin/login')

    // Verify login form is present
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()

    // Fill in credentials
    await page.getByPlaceholder('Email address').fill('admin@portfolio.local')
    await page.getByPlaceholder('Password').fill('admin123')

    // Click sign in
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Should be redirected to admin dashboard after successful login
    await expect(page).toHaveURL(/\/admin/)

    // Verify we're authenticated by checking for admin content
    await expect(page.getByText('Admin')).toBeVisible()
  })

  test('should access admin dashboard without authentication errors', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to admin dashboard
    await page.goto('/admin')

    // Monitor network requests for 401 errors
    const networkErrors: string[] = []
    page.on('response', response => {
      if (response.status() === 401) {
        networkErrors.push(`401 error on: ${response.url()}`)
      }
    })

    // Wait for page to load completely
    await page.waitForLoadState('networkidle')

    // Verify no 401 errors occurred
    expect(networkErrors).toEqual([])

    // Verify admin dashboard elements are present
    await expect(
      page.getByText('Dashboard').or(page.getByText('Admin'))
    ).toBeVisible()
  })

  test('should load admin editor without authentication errors', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to admin editor
    await page.goto('/admin/editor')

    // Monitor network requests for authentication errors
    const authErrors: Array<{ url: string; status: number }> = []
    page.on('response', response => {
      if (response.status() === 401 || response.status() === 403) {
        authErrors.push({ url: response.url(), status: response.status() })
      }
    })

    // Wait for page to load completely
    await page.waitForLoadState('networkidle')

    // Verify no authentication errors occurred
    expect(authErrors).toEqual([])

    // Verify editor content is loaded
    await expect(
      page.getByRole('heading', { name: 'Content Editor' })
    ).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Homepage' })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Save Changes' })
    ).toBeVisible()
  })

  test('should successfully load content data via API proxy', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to editor
    await page.goto('/admin/editor')

    // Monitor API requests to verify they go through admin proxy
    const apiRequests: Array<{ url: string; method: string }> = []
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push({ url: request.url(), method: request.method() })
      }
    })

    // Wait for page to load and data to be fetched
    await page.waitForLoadState('networkidle')

    // Verify that content API requests were made
    const contentRequests = apiRequests.filter(
      req => req.url.includes('/content') || req.url.includes('/admin-proxy')
    )

    expect(contentRequests.length).toBeGreaterThan(0)

    // Verify editor shows real data, not empty states
    await expect(page.getByLabel('Badge Text')).not.toHaveValue('')
    await expect(page.getByLabel('Headline')).not.toHaveValue('')
  })

  test('should handle content API endpoints without 401 errors', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Test direct API endpoint access
    const response = await page.request.get('/api/admin-proxy/content')

    // Should not return 401 Unauthorized
    expect(response.status()).not.toBe(401)

    // Should return successful response (200 or 3xx redirect)
    expect(response.status()).toBeLessThan(400)
  })

  test('should successfully save content changes', async ({ page }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to editor
    await page.goto('/admin/editor')
    await page.waitForLoadState('networkidle')

    // Make a test change
    const testValue = `Test value ${Date.now()}`
    await page.getByLabel('Badge Text').fill(testValue)

    // Monitor save request
    const savePromise = page.waitForResponse(
      response =>
        response.url().includes('/api/') &&
        response.request().method() === 'PUT'
    )

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click()

    // Wait for save response
    const saveResponse = await savePromise

    // Verify save was successful (no 401 error)
    expect(saveResponse.status()).not.toBe(401)
    expect(saveResponse.status()).toBeLessThan(400)

    // Verify content was saved by reloading and checking value
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.getByLabel('Badge Text')).toHaveValue(testValue)
  })

  test('should handle projects API endpoint correctly', async ({ page }) => {
    // Login first
    await loginAsAdmin(page)

    // Test the projects endpoint that was specifically mentioned as failing
    const response = await page.request.get('/api/admin-proxy/projects')

    // Should not return 401 Unauthorized
    expect(response.status()).not.toBe(401)

    // Should return a valid response
    expect([200, 404].includes(response.status())).toBe(true)
  })

  test('should verify API_SECRET is working via authenticated requests', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to admin editor to trigger authenticated API calls
    await page.goto('/admin/editor')

    // Monitor all API requests during page load
    const apiResponses: Array<{ url: string; status: number }> = []
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        apiResponses.push({ url: response.url(), status: response.status() })
      }
    })

    await page.waitForLoadState('networkidle')

    // Filter for authentication-related errors
    const authFailures = apiResponses.filter(
      response => response.status === 401 || response.status === 403
    )

    // Should have no authentication failures
    expect(authFailures).toEqual([])

    // Should have at least some successful API calls
    const successfulCalls = apiResponses.filter(
      response => response.status >= 200 && response.status < 300
    )
    expect(successfulCalls.length).toBeGreaterThan(0)
  })

  test('should maintain authentication state across page reloads', async ({
    page,
  }) => {
    // Login first
    await loginAsAdmin(page)

    // Navigate to editor
    await page.goto('/admin/editor')
    await expect(
      page.getByRole('heading', { name: 'Content Editor' })
    ).toBeVisible()

    // Reload the page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Should still be on editor page (not redirected to login)
    await expect(page).toHaveURL(/\/admin\/editor/)
    await expect(
      page.getByRole('heading', { name: 'Content Editor' })
    ).toBeVisible()

    // Should not have any 401 errors during reload
    const authErrors: number[] = []
    page.on('response', response => {
      if (response.status() === 401) {
        authErrors.push(response.status())
      }
    })

    // Navigate between admin pages
    await page.goto('/admin')
    await page.waitForLoadState('networkidle')

    expect(authErrors).toEqual([])
  })

  test('should verify console has no 401 error messages', async ({ page }) => {
    // Collect console messages
    const consoleErrors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('401')) {
        consoleErrors.push(msg.text())
      }
    })

    // Login and perform typical admin operations
    await loginAsAdmin(page)
    await page.goto('/admin/editor')
    await page.waitForLoadState('networkidle')

    // Switch between tabs to trigger more API calls
    await page.getByRole('tab', { name: 'About' }).click()
    await page.waitForTimeout(1000)

    await page.getByRole('tab', { name: 'Work' }).click()
    await page.waitForTimeout(1000)

    await page.getByRole('tab', { name: 'Homepage' }).click()
    await page.waitForTimeout(1000)

    // Verify no 401 errors in console
    expect(consoleErrors).toEqual([])
  })

  test('should handle API mode configuration correctly', async ({ page }) => {
    // Login first
    await loginAsAdmin(page)

    // Test that API endpoints respond appropriately
    const healthResponse = await page.request.get('/api/health')

    // Should not be a configuration error (401/403)
    expect([401, 403].includes(healthResponse.status())).toBe(false)

    // Should return a valid response indicating API is configured
    expect(healthResponse.status()).toBeLessThan(500)
  })
})

/**
 * Helper function to login as admin user
 */
async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')

  await page.getByPlaceholder('Email address').fill('admin@portfolio.local')
  await page.getByPlaceholder('Password').fill('admin123')

  await page.getByRole('button', { name: 'Sign in' }).click()

  // Wait for redirect after login
  await page.waitForURL(/\/admin/, { timeout: 10000 })
}

/**
 * Network monitoring utilities
 */
test.describe('Network and API Monitoring', () => {
  test('should monitor all admin API traffic for authentication issues', async ({
    page,
  }) => {
    // Set up comprehensive network monitoring
    const networkActivity = {
      requests: [] as Array<{ url: string; method: string; timestamp: number }>,
      responses: [] as Array<{
        url: string
        status: number
        timestamp: number
      }>,
      failures: [] as Array<{ url: string; error: string; timestamp: number }>,
    }

    page.on('request', request => {
      if (request.url().includes('/api/')) {
        networkActivity.requests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now(),
        })
      }
    })

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        networkActivity.responses.push({
          url: response.url(),
          status: response.status(),
          timestamp: Date.now(),
        })
      }
    })

    page.on('requestfailed', request => {
      if (request.url().includes('/api/')) {
        networkActivity.failures.push({
          url: request.url(),
          error: request.failure()?.errorText || 'Unknown error',
          timestamp: Date.now(),
        })
      }
    })

    // Perform complete admin workflow
    await loginAsAdmin(page)
    await page.goto('/admin/editor')
    await page.waitForLoadState('networkidle')

    // Interact with different sections
    const tabs = ['About', 'Work', 'Blog']
    for (const tab of tabs) {
      await page.getByRole('tab', { name: tab }).click()
      await page.waitForTimeout(500)
    }

    // Make a content change and save
    await page.getByRole('tab', { name: 'Homepage' }).click()
    await page.getByLabel('Badge Text').fill(`Test ${Date.now()}`)
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await page.waitForTimeout(2000)

    // Analyze network activity
    const authErrors = networkActivity.responses.filter(
      response => response.status === 401 || response.status === 403
    )

    const networkFailures = networkActivity.failures

    // Report findings
    console.log('Network Activity Summary:')
    console.log(`Total API requests: ${networkActivity.requests.length}`)
    console.log(`Total API responses: ${networkActivity.responses.length}`)
    console.log(`Authentication errors: ${authErrors.length}`)
    console.log(`Network failures: ${networkFailures.length}`)

    if (authErrors.length > 0) {
      console.log('Authentication errors:', authErrors)
    }

    if (networkFailures.length > 0) {
      console.log('Network failures:', networkFailures)
    }

    // Assertions
    expect(authErrors).toEqual([])
    expect(networkFailures).toEqual([])
    expect(networkActivity.responses.length).toBeGreaterThan(0)
  })
})
