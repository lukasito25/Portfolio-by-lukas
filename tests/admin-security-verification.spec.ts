import { test, expect } from '@playwright/test'

/**
 * Admin Panel Security Verification Test
 *
 * This test verifies that the admin panel properly handles security scenarios:
 * - Rejects invalid credentials
 * - Redirects unauthenticated users
 * - Protects admin routes
 */

test.describe('Admin Panel Security Verification', () => {
  test('should reject invalid login credentials', async ({ page }) => {
    await page.goto('/admin/login')
    await page.waitForLoadState('networkidle')

    // Try invalid credentials
    await page.fill('#email', 'invalid@email.com')
    await page.fill('#password', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message and stay on login page
    await expect(page.locator('text=Invalid credentials')).toBeVisible({
      timeout: 5000,
    })
    expect(page.url()).toContain('/admin/login')

    console.log('✅ Invalid credentials properly rejected')
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies()

    // Try to access admin dashboard directly without login
    await page.goto('/admin')

    // Should be redirected to login page
    await page.waitForURL('**/admin/login**', { timeout: 10000 })
    expect(page.url()).toContain('/admin/login')

    console.log('✅ Unauthenticated users redirected to login')
  })

  test('should protect admin editor route', async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies()

    // Try to access admin editor directly without login
    await page.goto('/admin/editor')

    // Should be redirected to login page
    await page.waitForURL('**/admin/login**', { timeout: 10000 })
    expect(page.url()).toContain('/admin/login')

    console.log('✅ Admin editor route protected')
  })

  test('comprehensive security check', async ({ page }) => {
    console.log('🔒 Starting Admin Panel Security Verification...\n')

    const securityTests = {
      invalidCredentialsRejected: false,
      unauthenticatedRedirection: false,
      adminRoutesProtected: false,
    }

    // Test 1: Invalid credentials
    try {
      await page.goto('/admin/login')
      await page.fill('#email', 'test@invalid.com')
      await page.fill('#password', 'wrongpassword')
      await page.click('button[type="submit"]')

      await expect(page.locator('text=Invalid credentials')).toBeVisible({
        timeout: 5000,
      })
      expect(page.url()).toContain('/admin/login')

      securityTests.invalidCredentialsRejected = true
      console.log('✅ Invalid credentials rejected: PASS')
    } catch (error) {
      console.log('❌ Invalid credentials rejected: FAIL')
    }

    // Test 2: Unauthenticated access
    try {
      await page.context().clearCookies()
      await page.goto('/admin')
      await page.waitForURL('**/admin/login**', { timeout: 8000 })

      securityTests.unauthenticatedRedirection = true
      console.log('✅ Unauthenticated redirection: PASS')
    } catch (error) {
      console.log('❌ Unauthenticated redirection: FAIL')
    }

    // Test 3: Protected routes
    try {
      await page.goto('/admin/editor')
      await page.waitForURL('**/admin/login**', { timeout: 8000 })

      securityTests.adminRoutesProtected = true
      console.log('✅ Admin routes protected: PASS')
    } catch (error) {
      console.log('❌ Admin routes protected: FAIL')
    }

    const passedTests = Object.values(securityTests).filter(Boolean).length
    const totalTests = Object.keys(securityTests).length

    console.log('\n' + '='.repeat(60))
    console.log('🔒 ADMIN PANEL SECURITY RESULTS')
    console.log('='.repeat(60))
    console.log(`Security Score: ${passedTests}/${totalTests} tests passed`)
    console.log('')

    Object.entries(securityTests).forEach(([test, result]) => {
      const status = result ? '✅ PASS' : '❌ FAIL'
      const testName = test.replace(/([A-Z])/g, ' $1').toLowerCase()
      console.log(`  ${status} - ${testName}`)
    })

    if (passedTests === totalTests) {
      console.log(
        '\n🛡️  SECURITY STATUS: EXCELLENT - All security measures working properly'
      )
    } else {
      console.log(
        '\n⚠️  SECURITY STATUS: NEEDS ATTENTION - Some security measures failed'
      )
    }

    console.log('='.repeat(60))

    expect(passedTests).toBe(totalTests)
  })
})
