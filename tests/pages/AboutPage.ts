import { Page, Locator } from '@playwright/test'

export class AboutPage {
  readonly page: Page
  readonly heroSection: Locator
  readonly navigationMenu: Locator
  readonly themeToggle: Locator
  readonly mobileMenuToggle: Locator
  readonly leadershipSection: Locator
  readonly journeySection: Locator
  readonly competenciesSection: Locator
  readonly personalSection: Locator
  readonly footerSection: Locator

  constructor(page: Page) {
    this.page = page
    this.heroSection = page
      .locator('[data-section="hero"], .hero-section, section')
      .first()
    this.navigationMenu = page.locator('nav, [role="navigation"]')
    this.themeToggle = page.locator(
      '[aria-label*="theme"], [data-testid="theme-toggle"], button:has-text("theme")'
    )
    this.mobileMenuToggle = page.locator(
      '[aria-label*="menu"], [data-testid="mobile-menu"], .hamburger'
    )
    this.leadershipSection = page.locator(
      '[data-section="leadership"], section:has-text("Leadership")'
    )
    this.journeySection = page.locator(
      '[data-section="journey"], section:has-text("Journey")'
    )
    this.competenciesSection = page.locator(
      '[data-section="competencies"], section:has-text("Competencies")'
    )
    this.personalSection = page.locator(
      '[data-section="personal"], section:has-text("Personal")'
    )
    this.footerSection = page.locator('footer')
  }

  async goto() {
    await this.page.goto('/about')
    await this.waitForPageLoad()
  }

  async waitForPageLoad() {
    // Wait for main content to be visible
    await this.page.waitForSelector('main, [role="main"]', { timeout: 10000 })

    // Wait for any loading spinners to disappear
    await this.page
      .waitForSelector('[data-testid="loading"]', {
        state: 'detached',
        timeout: 5000,
      })
      .catch(() => {
        // Ignore if no loading spinner exists
      })

    // Wait for network to settle
    await this.page.waitForLoadState('networkidle')
  }

  async checkHeroSection() {
    const isVisible = await this.heroSection.isVisible()
    const text = await this.heroSection.textContent()

    return {
      isVisible,
      hasContent: text && text.trim().length > 0,
      content: text?.trim(),
    }
  }

  async checkNavigationMenu() {
    const isVisible = await this.navigationMenu.isVisible()
    const links = await this.navigationMenu.locator('a').all()
    const linkTexts: string[] = []
    const linkHrefs: string[] = []

    for (const link of links) {
      const text = await link.textContent()
      const href = await link.getAttribute('href')
      if (text) linkTexts.push(text.trim())
      if (href) linkHrefs.push(href)
    }

    return {
      isVisible,
      linkCount: links.length,
      linkTexts,
      linkHrefs,
      hasActiveLink: linkTexts.some(text =>
        text.toLowerCase().includes('about')
      ),
    }
  }

  async testThemeToggle() {
    const initialTheme = await this.page.evaluate(() => {
      return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light'
    })

    if (await this.themeToggle.isVisible()) {
      await this.themeToggle.click()
      await this.page.waitForTimeout(500) // Wait for theme transition

      const newTheme = await this.page.evaluate(() => {
        return document.documentElement.classList.contains('dark')
          ? 'dark'
          : 'light'
      })

      return {
        initialTheme,
        newTheme,
        toggled: initialTheme !== newTheme,
        toggleExists: true,
      }
    }

    return {
      initialTheme,
      newTheme: initialTheme,
      toggled: false,
      toggleExists: false,
    }
  }

  async testMobileMenu() {
    // Check if mobile menu toggle is visible (usually only on smaller screens)
    if (!(await this.mobileMenuToggle.isVisible())) {
      return {
        toggleExists: false,
        menuOpened: false,
        menuClosed: false,
      }
    }

    // Open mobile menu
    await this.mobileMenuToggle.click()
    await this.page.waitForTimeout(300)

    const menuOpenState = await this.page
      .locator('[data-testid="mobile-menu-content"], .mobile-menu-open')
      .isVisible()

    // Close mobile menu
    await this.mobileMenuToggle.click()
    await this.page.waitForTimeout(300)

    const menuClosedState = !(await this.page
      .locator('[data-testid="mobile-menu-content"], .mobile-menu-open')
      .isVisible())

    return {
      toggleExists: true,
      menuOpened: menuOpenState,
      menuClosed: menuClosedState,
    }
  }

  async checkSectionContent() {
    const sections = [
      { name: 'hero', locator: this.heroSection },
      { name: 'leadership', locator: this.leadershipSection },
      { name: 'journey', locator: this.journeySection },
      { name: 'competencies', locator: this.competenciesSection },
      { name: 'personal', locator: this.personalSection },
    ]

    const sectionData = []

    for (const section of sections) {
      const isVisible = await section.locator.isVisible()
      const content = await section.locator.textContent()
      const hasImages = (await section.locator.locator('img').count()) > 0
      const hasButtons = (await section.locator.locator('button').count()) > 0
      const hasLinks = (await section.locator.locator('a').count()) > 0

      sectionData.push({
        name: section.name,
        isVisible,
        hasContent: content && content.trim().length > 0,
        contentLength: content?.trim().length || 0,
        hasImages,
        hasButtons,
        hasLinks,
      })
    }

    return sectionData
  }

  async checkResponsiveLayout() {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1440, height: 900 },
    ]

    const layoutResults = []

    for (const viewport of viewports) {
      await this.page.setViewportSize(viewport)
      await this.page.waitForTimeout(500) // Wait for layout adjustment

      const heroVisible = await this.heroSection.isVisible()
      const navVisible = await this.navigationMenu.isVisible()
      const mobileMenuVisible = await this.mobileMenuToggle.isVisible()

      layoutResults.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        heroVisible,
        navVisible,
        mobileMenuVisible,
        hasHorizontalScroll: await this.page.evaluate(
          () => document.body.scrollWidth > window.innerWidth
        ),
      })
    }

    return layoutResults
  }

  async getAllLinks() {
    const links = await this.page.locator('a[href]').all()
    const linkData = []

    for (const link of links) {
      const text = await link.textContent()
      const href = await link.getAttribute('href')
      const isExternal =
        href?.startsWith('http') && !href.includes(this.page.url())

      linkData.push({
        text: text?.trim() || '',
        href: href || '',
        isExternal,
        isInternal: !isExternal && href?.startsWith('/'),
        isAnchor: href?.startsWith('#'),
      })
    }

    return linkData
  }

  async checkImages() {
    const images = await this.page.locator('img').all()
    const imageData = []

    for (const img of images) {
      const src = await img.getAttribute('src')
      const alt = await img.getAttribute('alt')
      const loading = await img.getAttribute('loading')
      const isLoaded = await img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalHeight !== 0
      )

      imageData.push({
        src: src || '',
        alt: alt || '',
        loading,
        isLoaded,
        hasAlt: !!alt && alt.length > 0,
      })
    }

    return imageData
  }
}
