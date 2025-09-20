import { test, expect } from '@playwright/test'

test.describe('Admin Access Control', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access admin editor without authentication
    await page.goto('/admin/editor')

    // Should be redirected to login page with callback URL
    await expect(page).toHaveURL(/\/admin\/login.*callbackUrl/)

    // Check that the callback URL parameter is set correctly
    const url = new URL(page.url())
    const callbackUrl = url.searchParams.get('callbackUrl')
    expect(callbackUrl).toBe('/admin/editor')
  })

  test('should redirect admin root to login', async ({ page }) => {
    // Try to access admin root without authentication
    await page.goto('/admin')

    // Should be redirected to login page with callback URL
    await expect(page).toHaveURL(/\/admin\/login.*callbackUrl/)

    // Check that the callback URL parameter is set correctly
    const url = new URL(page.url())
    const callbackUrl = url.searchParams.get('callbackUrl')
    expect(callbackUrl).toBe('/admin')
  })

  test('should show admin login form', async ({ page }) => {
    // Navigate directly to login page
    await page.goto('/admin/login')

    // Check if login form elements are present
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('should maintain callback URL in login form', async ({ page }) => {
    // Access login with a specific callback URL
    await page.goto('/admin/login?callbackUrl=/admin/editor')

    // Verify the page loaded correctly
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()

    // The form should preserve the callback URL for after login
    await expect(page).toHaveURL(/callbackUrl.*admin.*editor/)
  })

  test('should handle direct admin editor access flow', async ({ page }) => {
    // This tests the complete flow a user would experience

    // 1. User tries to access admin editor directly
    await page.goto('/admin/editor')

    // 2. Gets redirected to login with callback
    await expect(page).toHaveURL(/\/admin\/login.*callbackUrl/)

    // 3. Sees the login form
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
    await expect(page.getByPlaceholder('Password')).toBeVisible()

    // 4. Can see instructions for development
    await expect(page.getByText('Development credentials')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Try to access admin on mobile
    await page.goto('/admin/editor')

    // Should still redirect to login
    await expect(page).toHaveURL(/\/admin\/login.*callbackUrl/)

    // Login form should be visible and functional on mobile
    await expect(
      page.getByRole('heading', { name: 'Admin Login' })
    ).toBeVisible()
    await expect(page.getByPlaceholder('Email address')).toBeVisible()
  })
})

test.describe('Admin Security', () => {
  test('should not expose admin content without authentication', async ({
    page,
  }) => {
    // Try to access admin editor
    const response = await page.goto('/admin/editor')

    // Should not get 200 OK for the editor content
    // Should be redirected (3xx status)
    expect(response?.status()).toBeGreaterThanOrEqual(300)
    expect(response?.status()).toBeLessThan(400)
  })

  test('should protect admin API routes', async ({ page }) => {
    // Try to access a protected API route
    const response = await page.goto('/api/projects')

    // Should get 401 Unauthorized or redirect
    expect([401, 307].includes(response?.status() || 0)).toBeTruthy()
  })
})
