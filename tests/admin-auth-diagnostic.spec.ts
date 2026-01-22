import { test, expect } from '@playwright/test'

/**
 * Diagnostic Test for Admin Authentication
 *
 * This simplified test helps identify what's happening with the authentication flow
 */

test.describe('Admin Authentication Diagnostic', () => {
  test('diagnose login flow step by step', async ({ page }) => {
    console.log('🔍 Starting admin login diagnostic...')

    // Step 1: Check if we can access the login page
    console.log('📍 Step 1: Navigating to login page')
    await page.goto('/admin/login')
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()
    console.log('✅ Login page loaded successfully')

    // Step 2: Fill in credentials
    console.log('📍 Step 2: Filling in credentials')
    await page.getByPlaceholder('Email address').fill('admin@portfolio.local')
    await page.getByPlaceholder('Password').fill('admin123')
    console.log('✅ Credentials filled')

    // Step 3: Click sign in and monitor what happens
    console.log('📍 Step 3: Clicking sign in')

    // Monitor network requests during login
    const requests: string[] = []
    const responses: Array<{ url: string; status: number }> = []

    page.on('request', request => {
      requests.push(request.url())
    })

    page.on('response', response => {
      responses.push({ url: response.url(), status: response.status() })
    })

    await page.getByRole('button', { name: 'Sign in' }).click()

    // Wait a bit to see what happens
    await page.waitForTimeout(3000)

    console.log('📍 Step 4: Current URL after login attempt:', page.url())

    // Log network activity
    console.log('📍 Recent requests:', requests.slice(-10))
    console.log('📍 Recent responses:', responses.slice(-10))

    // Check if we're still on login page or redirected
    const isOnLoginPage = page.url().includes('/admin/login')
    console.log('📍 Still on login page?', isOnLoginPage)

    if (!isOnLoginPage) {
      console.log('✅ Redirected away from login page')
      console.log('📍 Current page URL:', page.url())

      // Try to find any admin-related content
      const bodyText = await page.locator('body').textContent()
      console.log(
        '📍 Page contains "admin":',
        bodyText?.toLowerCase().includes('admin')
      )
      console.log(
        '📍 Page contains "dashboard":',
        bodyText?.toLowerCase().includes('dashboard')
      )
      console.log(
        '📍 Page contains "editor":',
        bodyText?.toLowerCase().includes('editor')
      )
    } else {
      console.log('❌ Still on login page - login may have failed')

      // Check for error messages
      const errorText = await page
        .locator('[data-testid="error"], .error, [role="alert"]')
        .textContent()
        .catch(() => null)
      if (errorText) {
        console.log('📍 Error message found:', errorText)
      }
    }
  })

  test('diagnose API endpoints directly', async ({ page }) => {
    console.log('🔍 Testing API endpoints directly...')

    // Test API endpoints without authentication
    const endpoints = [
      '/api/health',
      '/api/admin-proxy/content',
      '/api/content',
      '/api/projects',
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`📍 Testing ${endpoint}`)
        const response = await page.request.get(endpoint)
        console.log(`📍 ${endpoint}: ${response.status()}`)
      } catch (error) {
        console.log(`❌ ${endpoint}: Error - ${error}`)
      }
    }
  })

  test('check environment and configuration', async ({ page }) => {
    console.log('🔍 Checking environment configuration...')

    // Navigate to a page and check console for any config issues
    const consoleMessages: string[] = []
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`)
    })

    await page.goto('/')
    await page.waitForTimeout(2000)

    console.log('📍 Console messages:')
    consoleMessages.forEach(msg => console.log(`  ${msg}`))

    // Try to access a protected route and see what happens
    await page.goto('/admin')
    await page.waitForTimeout(2000)

    console.log('📍 Current URL after /admin access:', page.url())

    const finalConsoleMessages = consoleMessages.slice(
      consoleMessages.length - 10
    )
    console.log('📍 Recent console messages:')
    finalConsoleMessages.forEach(msg => console.log(`  ${msg}`))
  })
})
