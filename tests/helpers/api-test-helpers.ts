import { Page, expect } from '@playwright/test'

/**
 * API Testing Helpers for Database Operations
 *
 * This module provides utilities for testing API endpoints and database
 * operations in the admin editor context.
 */

export interface ContentUpdateResponse {
  success: boolean
  itemsUpdated?: number
  error?: string
}

export interface DatabaseTestConfig {
  apiBaseUrl?: string
  useLocalDb?: boolean
  skipApiTests?: boolean
}

export class ApiTestHelpers {
  constructor(
    private page: Page,
    private config: DatabaseTestConfig = {}
  ) {
    this.config.apiBaseUrl = this.config.apiBaseUrl || 'http://localhost:3001/api'
  }

  /**
   * Directly test API endpoints for content operations
   */
  async testContentApi(section: string, content: any): Promise<ContentUpdateResponse> {
    try {
      const response = await this.page.request.put(`${this.config.apiBaseUrl}/content/${section}`, {
        data: content,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      return {
        success: response.ok(),
        itemsUpdated: result.itemsUpdated,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API request failed'
      }
    }
  }

  /**
   * Verify content exists in the database by fetching it directly
   */
  async verifyContentInDatabase(section: string, expectedContent: any): Promise<boolean> {
    try {
      const response = await this.page.request.get(`${this.config.apiBaseUrl}/content/${section}`)

      if (!response.ok()) {
        console.error(`Failed to fetch content for section ${section}: ${response.status()}`)
        return false
      }

      const actualContent = await response.json()

      // Compare key fields to verify content was saved
      return this.compareContentObjects(expectedContent, actualContent.content)
    } catch (error) {
      console.error('Database verification failed:', error)
      return false
    }
  }

  /**
   * Get all content from database for verification
   */
  async getAllContentFromDatabase(): Promise<any> {
    try {
      const response = await this.page.request.get(`${this.config.apiBaseUrl}/content/all`)

      if (!response.ok()) {
        throw new Error(`Failed to fetch all content: ${response.status()}`)
      }

      const result = await response.json()
      return result.content
    } catch (error) {
      console.error('Failed to get all content:', error)
      throw error
    }
  }

  /**
   * Simulate API failures for error testing
   */
  async simulateApiFailure(endpoint: string, statusCode: number = 500) {
    await this.page.route(`**/api/${endpoint}**`, route => {
      route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Simulated API failure for testing',
          code: statusCode
        })
      })
    })
  }

  /**
   * Restore normal API responses (remove mocks)
   */
  async restoreApiResponses() {
    await this.page.unroute('**/api/**')
  }

  /**
   * Test database health and connectivity
   */
  async testDatabaseHealth(): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await this.page.request.get(`${this.config.apiBaseUrl}/health`)

      if (response.ok()) {
        const health = await response.json()
        return {
          healthy: health.database?.connected === true,
          error: health.database?.error
        }
      } else {
        return {
          healthy: false,
          error: `Health check failed: ${response.status()}`
        }
      }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Health check error'
      }
    }
  }

  /**
   * Wait for API request to complete with timeout
   */
  async waitForApiRequest(urlPattern: string, options: { timeout?: number; method?: string } = {}): Promise<any> {
    const { timeout = 10000, method = 'GET' } = options

    return this.page.waitForRequest(request => {
      const url = request.url()
      const requestMethod = request.method()

      return url.includes(urlPattern) &&
             (method === 'ALL' || requestMethod === method)
    }, { timeout })
  }

  /**
   * Wait for API response with specific criteria
   */
  async waitForApiResponse(urlPattern: string, options: { timeout?: number; status?: number } = {}): Promise<any> {
    const { timeout = 10000, status = 200 } = options

    return this.page.waitForResponse(response => {
      const url = response.url()
      const responseStatus = response.status()

      return url.includes(urlPattern) && responseStatus === status
    }, { timeout })
  }

  /**
   * Monitor network activity during operations
   */
  async monitorNetworkActivity(operation: () => Promise<void>): Promise<{
    requests: any[]
    responses: any[]
    failures: any[]
  }> {
    const requests: any[] = []
    const responses: any[] = []
    const failures: any[] = []

    // Set up monitoring
    this.page.on('request', request => {
      if (request.url().includes('/api/')) {
        requests.push({
          url: request.url(),
          method: request.method(),
          timestamp: Date.now()
        })
      }
    })

    this.page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push({
          url: response.url(),
          status: response.status(),
          timestamp: Date.now()
        })
      }
    })

    this.page.on('requestfailed', request => {
      if (request.url().includes('/api/')) {
        failures.push({
          url: request.url(),
          failure: request.failure()?.errorText,
          timestamp: Date.now()
        })
      }
    })

    try {
      await operation()
    } finally {
      // Clean up event listeners
      this.page.removeAllListeners('request')
      this.page.removeAllListeners('response')
      this.page.removeAllListeners('requestfailed')
    }

    return { requests, responses, failures }
  }

  /**
   * Compare two content objects for equality (deep comparison)
   */
  private compareContentObjects(expected: any, actual: any): boolean {
    try {
      // Simple deep comparison - you might want a more sophisticated comparison
      return JSON.stringify(expected) === JSON.stringify(actual)
    } catch {
      return false
    }
  }
}

/**
 * Database State Management for Tests
 */
export class DatabaseStateManager {
  constructor(private apiHelpers: ApiTestHelpers) {}

  /**
   * Create a snapshot of current database state
   */
  async createSnapshot(): Promise<any> {
    return await this.apiHelpers.getAllContentFromDatabase()
  }

  /**
   * Restore database state from snapshot
   */
  async restoreSnapshot(snapshot: any): Promise<void> {
    // In a real scenario, you might want to restore each section
    for (const [section, content] of Object.entries(snapshot)) {
      await this.apiHelpers.testContentApi(section, content)
    }
  }

  /**
   * Reset database to default content
   */
  async resetToDefaults(): Promise<void> {
    const { defaultContent } = await import('../../src/lib/content-config')

    for (const [section, content] of Object.entries(defaultContent)) {
      await this.apiHelpers.testContentApi(section, content)
    }
  }

  /**
   * Seed database with test data
   */
  async seedTestData(): Promise<any> {
    const testData = {
      homepage: {
        hero: {
          badge: "TEST MODE - Database Integration Tests",
          headline: ["Testing", "Database", "Integration"],
          subheadline: "This content is created by automated tests",
          metrics: [
            { value: "100%", label: "Test Coverage" },
            { value: "0", label: "Failures" }
          ]
        },
        competencies: [
          {
            title: "Test Automation",
            description: "Automated testing of database operations"
          }
        ],
        cta: {
          title: "Test Environment",
          description: "This is test data for validation"
        }
      },
      about: {
        hero: {
          title: "Test About Page",
          description: "Testing database integration for about page content",
          quickStats: [
            { label: "Test Status", value: "Running" }
          ]
        },
        philosophy: {
          title: "Test Philosophy",
          description: "Testing philosophy updates",
          cards: [
            {
              title: "Test Card",
              description: "Test card description"
            }
          ]
        },
        journey: {
          title: "Test Journey",
          positions: []
        }
      },
      blog: {
        hero: {
          title: "Test Blog",
          description: "Testing blog content updates"
        },
        featured: {
          title: "Test Article",
          description: "Test article description",
          keyInsights: ["Test insight 1", "Test insight 2"]
        },
        articles: [],
        expertise: {
          title: "Test Expertise",
          areas: []
        }
      },
      work: {
        hero: {
          title: "Test Work Page",
          description: "Testing work page updates"
        },
        featured: {
          title: "Test Project",
          challenge: "Test challenge",
          solution: "Test solution",
          impact: "Test impact"
        },
        projects: []
      }
    }

    // Seed each section
    for (const [section, content] of Object.entries(testData)) {
      const result = await this.apiHelpers.testContentApi(section, content)
      if (!result.success) {
        throw new Error(`Failed to seed test data for ${section}: ${result.error}`)
      }
    }

    return testData
  }
}

/**
 * Performance Testing Utilities
 */
export class PerformanceTestUtils {
  constructor(private page: Page) {}

  /**
   * Measure API response time
   */
  async measureApiResponseTime(url: string, method: string = 'GET'): Promise<number> {
    const startTime = Date.now()

    try {
      const response = await this.page.request.fetch(url, { method })
      const endTime = Date.now()

      return endTime - startTime
    } catch (error) {
      const endTime = Date.now()
      console.error(`API request failed: ${error}`)
      return endTime - startTime // Still return timing even on failure
    }
  }

  /**
   * Measure content save operation time
   */
  async measureSaveOperationTime(saveOperation: () => Promise<void>): Promise<number> {
    const startTime = Date.now()
    await saveOperation()
    return Date.now() - startTime
  }

  /**
   * Test concurrent operations
   */
  async testConcurrentOperations(operations: (() => Promise<void>)[], maxConcurrency: number = 5): Promise<{
    totalTime: number
    successCount: number
    failureCount: number
    errors: any[]
  }> {
    const startTime = Date.now()
    const errors: any[] = []
    let successCount = 0
    let failureCount = 0

    // Execute operations with controlled concurrency
    const semaphore = new Array(maxConcurrency).fill(null).map(() => Promise.resolve())
    let semaphoreIndex = 0

    const promises = operations.map(async (operation) => {
      const currentSemaphore = semaphore[semaphoreIndex]
      semaphoreIndex = (semaphoreIndex + 1) % maxConcurrency

      await currentSemaphore

      try {
        await operation()
        successCount++
      } catch (error) {
        failureCount++
        errors.push(error)
      }
    })

    await Promise.allSettled(promises)

    const totalTime = Date.now() - startTime

    return {
      totalTime,
      successCount,
      failureCount,
      errors
    }
  }
}

/**
 * Content Validation Utilities
 */
export class ContentValidationUtils {
  /**
   * Validate content structure matches expected schema
   */
  static validateContentStructure(content: any, expectedStructure: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    const validateObject = (obj: any, expected: any, path: string = '') => {
      for (const [key, value] of Object.entries(expected)) {
        const currentPath = path ? `${path}.${key}` : key

        if (!(key in obj)) {
          errors.push(`Missing property: ${currentPath}`)
          continue
        }

        const actualValue = obj[key]
        const expectedType = typeof value

        if (expectedType === 'object' && value !== null) {
          if (Array.isArray(value)) {
            if (!Array.isArray(actualValue)) {
              errors.push(`Expected array at ${currentPath}, got ${typeof actualValue}`)
            } else if (value.length > 0) {
              // Validate array elements structure
              actualValue.forEach((item, index) => {
                validateObject(item, value[0], `${currentPath}[${index}]`)
              })
            }
          } else {
            if (typeof actualValue !== 'object' || actualValue === null) {
              errors.push(`Expected object at ${currentPath}, got ${typeof actualValue}`)
            } else {
              validateObject(actualValue, value, currentPath)
            }
          }
        } else if (typeof actualValue !== expectedType) {
          errors.push(`Type mismatch at ${currentPath}: expected ${expectedType}, got ${typeof actualValue}`)
        }
      }
    }

    validateObject(content, expectedStructure)

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate content against business rules
   */
  static validateBusinessRules(content: any): { valid: boolean; warnings: string[] } {
    const warnings: string[] = []

    // Example business rules validation
    if (content.homepage?.hero?.headline?.length > 5) {
      warnings.push('Homepage hero headline has more than 5 lines, which may affect display')
    }

    if (content.homepage?.hero?.badge?.length > 200) {
      warnings.push('Hero badge text is very long and may be truncated')
    }

    if (content.homepage?.competencies?.length > 10) {
      warnings.push('Too many competencies may overwhelm users')
    }

    // Add more business rules as needed

    return {
      valid: warnings.length === 0,
      warnings
    }
  }
}