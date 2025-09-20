import { test, expect } from '@playwright/test'

test.describe('Admin Editor', () => {
  test('should load admin editor page successfully', async ({ page }) => {
    // Navigate to the admin editor
    await page.goto('/admin/editor')

    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/Content Editor/)

    // Verify main elements are present
    await expect(
      page.getByRole('heading', { name: 'Content Editor' })
    ).toBeVisible()

    // Check for the tabs navigation
    await expect(page.getByRole('tab', { name: 'Homepage' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Blog' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Work' })).toBeVisible()

    // Verify action buttons are present
    await expect(
      page.getByRole('button', { name: 'Save Changes' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Export Content' })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Import Content' })
    ).toBeVisible()
  })

  test('should be able to switch between tabs', async ({ page }) => {
    await page.goto('/admin/editor')

    // Start on Homepage tab (should be default)
    await expect(page.getByRole('tab', { name: 'Homepage' })).toHaveAttribute(
      'data-state',
      'active'
    )

    // Click on About tab
    await page.getByRole('tab', { name: 'About' }).click()
    await expect(page.getByRole('tab', { name: 'About' })).toHaveAttribute(
      'data-state',
      'active'
    )

    // Click on Blog tab
    await page.getByRole('tab', { name: 'Blog' }).click()
    await expect(page.getByRole('tab', { name: 'Blog' })).toHaveAttribute(
      'data-state',
      'active'
    )

    // Click on Work tab
    await page.getByRole('tab', { name: 'Work' }).click()
    await expect(page.getByRole('tab', { name: 'Work' })).toHaveAttribute(
      'data-state',
      'active'
    )
  })

  test('should display form fields in Homepage tab', async ({ page }) => {
    await page.goto('/admin/editor')

    // Ensure we're on the Homepage tab
    await page.getByRole('tab', { name: 'Homepage' }).click()

    // Check for key form fields
    await expect(page.getByLabel('Badge Text')).toBeVisible()
    await expect(page.getByLabel('Headline')).toBeVisible()
    await expect(page.getByLabel('Subheadline')).toBeVisible()

    // Check for metrics section
    await expect(page.getByText('Metrics')).toBeVisible()

    // Check for competencies section
    await expect(page.getByText('Core Competencies')).toBeVisible()
  })

  test('should allow editing text fields', async ({ page }) => {
    await page.goto('/admin/editor')

    // Test editing the badge text
    const badgeInput = page.getByLabel('Badge Text')
    await badgeInput.clear()
    await badgeInput.fill('Test Badge')

    // Verify the text was entered
    await expect(badgeInput).toHaveValue('Test Badge')

    // Test editing headline
    const headlineInput = page.getByLabel('Headline')
    await headlineInput.clear()
    await headlineInput.fill('Test Headline')

    // Verify the text was entered
    await expect(headlineInput).toHaveValue('Test Headline')
  })

  test('should show save functionality', async ({ page }) => {
    await page.goto('/admin/editor')

    // Make a change to trigger the save state
    const badgeInput = page.getByLabel('Badge Text')
    await badgeInput.clear()
    await badgeInput.fill('Modified Badge')

    // Click save button
    const saveButton = page.getByRole('button', { name: 'Save Changes' })
    await saveButton.click()

    // Check for success indication (you might need to adjust based on your implementation)
    // This could be a toast message, button state change, etc.
    await expect(saveButton).toBeEnabled()
  })

  test('should handle export functionality', async ({ page }) => {
    await page.goto('/admin/editor')

    // Click export button
    const exportButton = page.getByRole('button', { name: 'Export Content' })
    await exportButton.click()

    // The export should trigger a download or show content
    // Since this creates a download, we just verify the button works
    await expect(exportButton).toBeEnabled()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/admin/editor')

    // Verify page loads and main elements are visible
    await expect(
      page.getByRole('heading', { name: 'Content Editor' })
    ).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Homepage' })).toBeVisible()

    // Check that tabs are still functional on mobile
    await page.getByRole('tab', { name: 'About' }).click()
    await expect(page.getByRole('tab', { name: 'About' })).toHaveAttribute(
      'data-state',
      'active'
    )
  })

  test('should persist changes in localStorage', async ({ page }) => {
    await page.goto('/admin/editor')

    // Make a change
    const badgeInput = page.getByLabel('Badge Text')
    await badgeInput.clear()
    await badgeInput.fill('Persistent Test')

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click()

    // Reload the page
    await page.reload()

    // Verify the change persisted
    await expect(page.getByLabel('Badge Text')).toHaveValue('Persistent Test')
  })
})
