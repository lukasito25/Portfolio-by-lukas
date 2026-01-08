import { test, expect } from '@playwright/test'

/**
 * Current State Assessment Tests
 *
 * This test suite performs a comprehensive assessment of the current portfolio
 * application state to validate functionality and identify issues.
 */

test.describe('Current Application State Assessment', () => {
  test('Homepage analysis - content and name validation', async ({ page }) => {
    await page.goto('/')

    console.log('📍 Testing Homepage')

    // Check what name is actually displayed
    const pageContent = await page.content()
    console.log('🔍 Looking for name variations...')

    if (pageContent.includes('Lukáš Hošala')) {
      console.log('✅ Found name with diacritics: Lukáš Hošala')
    } else if (pageContent.includes('Lukas Hosala')) {
      console.log('⚠️ Found name without diacritics: Lukas Hosala')
    } else {
      console.log('❌ Name not found in expected format')
    }

    // Check for professional content
    const professionalKeywords = [
      'Product Manager',
      'Technical Leader',
      'Leadership',
      'Software',
      'Engineer',
    ]
    console.log('🔍 Looking for professional content...')

    for (const keyword of professionalKeywords) {
      if (pageContent.toLowerCase().includes(keyword.toLowerCase())) {
        console.log(`✅ Found: ${keyword}`)
      }
    }

    // Capture page title
    const title = await page.title()
    console.log(`📄 Page Title: ${title}`)

    // Check for loading state
    const loadingElement = await page.locator('text="Loading"').isVisible()
    if (loadingElement) {
      console.log('⚠️ Page is in loading state')
      await page.waitForTimeout(5000) // Wait a bit more for content to load
    }

    expect(page.url()).toBe('http://localhost:3001/')
  })

  test('Admin login functionality analysis', async ({ page }) => {
    console.log('📍 Testing Admin Login')

    await page.goto('/admin/login')

    // Check login form elements
    console.log('🔍 Checking login form elements...')

    const emailField = page.getByPlaceholder('Email address')
    const passwordField = page.getByPlaceholder('Password')
    const signInButton = page.getByRole('button', { name: 'Sign in' })

    await expect(emailField).toBeVisible()
    await expect(passwordField).toBeVisible()
    await expect(signInButton).toBeVisible()
    console.log('✅ Login form elements are present')

    // Test login process
    console.log('🔑 Testing login with credentials...')
    await emailField.fill('lukas.hosala@gmail.com')
    await passwordField.fill('admin123')
    await signInButton.click()

    // Wait for redirect and check result
    await page.waitForTimeout(3000)

    const currentUrl = page.url()
    console.log(`🔗 Post-login URL: ${currentUrl}`)

    if (currentUrl.includes('/admin')) {
      console.log('✅ Successfully redirected to admin area')

      // Capture what's actually on the admin page
      const adminPageContent = await page.textContent('body')
      console.log(
        '📝 Admin page contains (first 200 chars):',
        adminPageContent?.substring(0, 200)
      )

      // Look for admin navigation elements
      const adminElements = [
        'Dashboard',
        'Admin',
        'Settings',
        'Editor',
        'Projects',
        'Skills',
        'Blog',
        'Analytics',
        'Content',
        'Management',
      ]

      console.log('🔍 Looking for admin elements...')
      for (const element of adminElements) {
        if (
          await page.locator(`text="${element}"`).isVisible({ timeout: 2000 })
        ) {
          console.log(`✅ Found: ${element}`)
        }
      }
    } else {
      console.log('❌ Login failed or did not redirect to admin')
    }
  })

  test('Navigation and pages assessment', async ({ page }) => {
    console.log('📍 Testing Navigation and Pages')

    const pages = [
      { url: '/', name: 'Homepage' },
      { url: '/about', name: 'About' },
      { url: '/work', name: 'Work' },
      { url: '/skills', name: 'Skills' },
      { url: '/blog', name: 'Blog' },
      { url: '/contact', name: 'Contact' },
    ]

    for (const pageInfo of pages) {
      console.log(`🔍 Testing ${pageInfo.name} page...`)

      try {
        await page.goto(pageInfo.url)
        await page.waitForLoadState('networkidle')

        const title = await page.title()
        const pageText = await page.textContent('body')

        console.log(`  ✅ ${pageInfo.name} loads successfully`)
        console.log(`  📄 Title: ${title}`)
        console.log(`  📝 Content length: ${pageText?.length || 0} characters`)

        // Check for navigation elements
        const nav = await page.locator('nav').first()
        if (await nav.isVisible()) {
          console.log(`  🧭 Navigation present`)
        }

        // Look for key content indicators
        if (pageInfo.url === '/about') {
          const hasExperience =
            pageText?.toLowerCase().includes('experience') ||
            pageText?.toLowerCase().includes('career')
          console.log(`  👔 Has experience content: ${hasExperience}`)
        }

        if (pageInfo.url === '/work') {
          const hasProjects =
            pageText?.toLowerCase().includes('project') ||
            pageText?.toLowerCase().includes('portfolio')
          console.log(`  💼 Has project content: ${hasProjects}`)
        }

        if (pageInfo.url === '/skills') {
          const hasSkills =
            pageText?.toLowerCase().includes('skill') ||
            pageText?.toLowerCase().includes('technology')
          console.log(`  🛠️ Has skills content: ${hasSkills}`)
        }
      } catch (error) {
        console.log(`  ❌ ${pageInfo.name} failed to load: ${error.message}`)
      }
    }
  })

  test('Admin sections exploration', async ({ page }) => {
    console.log('📍 Exploring Admin Sections')

    // Login first
    await page.goto('/admin/login')
    await page.getByPlaceholder('Email address').fill('lukas.hosala@gmail.com')
    await page.getByPlaceholder('Password').fill('admin123')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForTimeout(3000)

    if (!page.url().includes('/admin')) {
      console.log('❌ Failed to login to admin')
      return
    }

    console.log('✅ Logged into admin, exploring available sections...')

    // Try different admin routes
    const adminRoutes = [
      '/admin',
      '/admin/dashboard',
      '/admin/editor',
      '/admin/projects',
      '/admin/skills',
      '/admin/blog',
      '/admin/analytics',
      '/admin/settings',
    ]

    for (const route of adminRoutes) {
      console.log(`🔍 Testing route: ${route}`)

      try {
        await page.goto(route)
        await page.waitForLoadState('networkidle')

        const pageTitle = await page.title()
        const hasContent = await page
          .locator('main, .main, .content')
          .isVisible({ timeout: 3000 })

        console.log(`  📄 Title: ${pageTitle}`)
        console.log(`  ✅ Has main content: ${hasContent}`)

        // Look for specific admin functionality
        const forms = await page.locator('form').count()
        const inputs = await page.locator('input').count()
        const buttons = await page.locator('button').count()

        console.log(
          `  📋 Forms: ${forms}, Inputs: ${inputs}, Buttons: ${buttons}`
        )
      } catch (error) {
        console.log(`  ❌ Failed to load ${route}: ${error.message}`)
      }
    }
  })

  test('Data and content analysis', async ({ page }) => {
    console.log('📍 Analyzing Data and Content')

    // Check each main page for content quality
    const pages = ['/', '/about', '/work', '/skills']

    for (const url of pages) {
      console.log(`🔍 Analyzing content on ${url}`)
      await page.goto(url)

      const content = await page.textContent('body')
      const wordCount = content?.split(' ').length || 0

      console.log(`  📊 Word count: ${wordCount}`)

      // Look for placeholder or default content
      const hasPlaceholder =
        content?.includes('Lorem ipsum') ||
        content?.includes('placeholder') ||
        content?.includes('example')

      console.log(`  🎯 Has placeholder content: ${hasPlaceholder}`)

      // Look for professional content
      const professionalTerms = [
        'product manager',
        'technical leader',
        'software engineer',
        'leadership',
        'development',
        'strategy',
        'ai/ml',
        'data',
      ]

      const foundTerms = professionalTerms.filter(
        term => content?.toLowerCase().includes(term) || false
      )

      console.log(`  💼 Professional terms found: ${foundTerms.join(', ')}`)
    }
  })

  test('Responsive design and performance check', async ({ page }) => {
    console.log('📍 Testing Responsive Design and Performance')

    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
    ]

    for (const viewport of viewports) {
      console.log(
        `🔍 Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})`
      )

      await page.setViewportSize(viewport)

      const startTime = Date.now()
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const loadTime = Date.now() - startTime

      console.log(`  ⏱️ Load time: ${loadTime}ms`)

      // Check if main content is visible
      const mainVisible = await page.locator('main, .main').isVisible()
      const navVisible = await page.locator('nav').isVisible()

      console.log(`  👁️ Main content visible: ${mainVisible}`)
      console.log(`  🧭 Navigation visible: ${navVisible}`)
    }
  })
})
