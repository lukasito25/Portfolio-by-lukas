/**
 * Enhanced API Client for Cloudflare D1 Worker
 * Handles all external API calls with comprehensive error handling and retry logic
 */

import { deduplicatedFetch, requestDeduplicator } from './request-deduplication'
import {
  AppError,
  ErrorFactory,
  RetryManager,
  NetworkStatusManager,
} from './error-handling'
import {
  ErrorCode,
  ErrorSeverity,
  getDefaultSeverityForErrorCode,
  type ErrorCodeType,
} from './error-constants'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'

export interface ApiRequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  skipRetry?: boolean
  skipCache?: boolean
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  timestamp: string
  requestId?: string
}

export interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
    timestamp: string
    requestId?: string
  }
}

class ApiClient {
  private baseUrl: string
  private defaultTimeout: number = 30000 // 30 seconds
  private networkManager: NetworkStatusManager

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.networkManager = NetworkStatusManager.getInstance()
  }

  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    // Check network status first
    if (!this.networkManager.getIsOnline()) {
      throw ErrorFactory.createOfflineError()
    }

    // Use admin proxy for admin routes when running in browser
    const method = options.method || 'GET'
    const isAdminRoute =
      endpoint.startsWith('/admin') ||
      (endpoint === '/content' && method !== 'GET') ||
      (endpoint.startsWith('/content/') && method !== 'GET')

    const isBrowser = typeof window !== 'undefined'

    let url: string
    if (isAdminRoute && isBrowser) {
      // Use the Next.js admin proxy for authenticated routes
      url = `/api/admin-proxy${endpoint}`
    } else {
      // Use direct Cloudflare API for public routes or server-side calls
      url = `${this.baseUrl}${endpoint}`
    }

    const {
      timeout = this.defaultTimeout,
      retries = 3,
      skipRetry = false,
      skipCache = false,
      ...requestOptions
    } = options

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(requestOptions.headers as Record<string, string>),
    }

    const finalOptions: RequestInit = {
      ...requestOptions,
      headers,
      signal: this.createTimeoutSignal(timeout),
    }

    // Determine caching strategy
    const enableCaching =
      !skipCache && (!requestOptions.method || requestOptions.method === 'GET')

    // Execute request with retry logic if not disabled
    if (skipRetry || !this.shouldRetry(requestOptions.method)) {
      return this.executeRequest<T>(url, finalOptions, enableCaching)
    }

    return RetryManager.withRetry(
      () => this.executeRequest<T>(url, finalOptions, enableCaching),
      {
        maxAttempts: retries,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffFactor: 2,
        shouldRetry: (error: AppError) => this.shouldRetryError(error),
      }
    )
  }

  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    enableCaching: boolean
  ): Promise<T> {
    try {
      const response = await deduplicatedFetch<any>(url, options, enableCaching)

      // Handle different response structures
      if (response.error) {
        // API returned an error response
        throw this.createErrorFromApiResponse(response as ApiErrorResponse)
      }

      // Return the data based on response structure
      if (response.data !== undefined) {
        return response.data
      }

      // Legacy responses or direct data
      return response
    } catch (error) {
      // Handle network and parsing errors
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw ErrorFactory.createTimeoutError('Request timed out', {
            url,
            timeout: this.defaultTimeout,
          })
        }

        if (error.message.includes('fetch')) {
          throw ErrorFactory.createNetworkError('Network request failed', {
            url,
            originalError: error.message,
          })
        }
      }

      // Re-throw AppError instances
      if (this.isAppError(error)) {
        throw error
      }

      // Convert unknown errors
      throw ErrorFactory.fromError(error as Error, { url })
    }
  }

  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
    return controller.signal
  }

  private shouldRetry(method?: string): boolean {
    // Only retry safe methods
    return !method || ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())
  }

  private shouldRetryError(error: AppError): boolean {
    // Don't retry certain error types
    const nonRetryableCodes = [
      ErrorCode.UNAUTHORIZED,
      ErrorCode.FORBIDDEN,
      ErrorCode.NOT_FOUND,
      ErrorCode.VALIDATION_ERROR,
    ]

    return error.retryable && !nonRetryableCodes.includes(error.code as any)
  }

  private createErrorFromApiResponse(response: ApiErrorResponse): AppError {
    const { error } = response

    return {
      code: error.code as ErrorCodeType,
      message: error.message,
      userMessage: error.message,
      severity: this.getSeverityFromCode(error.code),
      timestamp: new Date(error.timestamp),
      context: {
        details: error.details,
        requestId: error.requestId,
      },
      recoverable: this.isRecoverableCode(error.code),
      retryable: this.isRetryableCode(error.code),
    }
  }

  private getSeverityFromCode(code: string): any {
    // Use centralized error severity mapping
    return getDefaultSeverityForErrorCode(code as any) || ErrorSeverity.LOW
  }

  private isRecoverableCode(code: string): boolean {
    const nonRecoverableCodes = ['NOT_FOUND', 'FORBIDDEN']
    return !nonRecoverableCodes.some(nc => code.includes(nc))
  }

  private isRetryableCode(code: string): boolean {
    const nonRetryableCodes = [
      'UNAUTHORIZED',
      'FORBIDDEN',
      'NOT_FOUND',
      'VALIDATION_ERROR',
    ]
    return !nonRetryableCodes.some(nc => code.includes(nc))
  }

  private isAppError(error: any): error is AppError {
    return (
      error &&
      typeof error.code === 'string' &&
      typeof error.message === 'string'
    )
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.request<any>('/', {
        timeout: 5000,
        retries: 1,
      })
      return {
        status: response.status || 'healthy',
        timestamp: response.timestamp || new Date().toISOString(),
      }
    } catch (error) {
      throw ErrorFactory.createNetworkError('Health check failed', {
        baseUrl: this.baseUrl,
        error,
      })
    }
  }

  // Projects API with error handling
  async getProjects(options?: ApiRequestOptions) {
    try {
      return await this.request<{ projects: any[] }>('/projects', options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('projects', {
        endpoint: '/projects',
      })
    }
  }

  async getFeaturedProjects(options?: ApiRequestOptions) {
    try {
      return await this.request<{ projects: any[] }>(
        '/projects/featured',
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('featured projects', {
        endpoint: '/projects/featured',
      })
    }
  }

  async getProject(slug: string, options?: ApiRequestOptions) {
    if (!slug) {
      throw ErrorFactory.createValidationError('Project slug is required')
    }

    try {
      return await this.request<{ project: any }>(`/projects/${slug}`, options)
    } catch (error) {
      if (this.isAppError(error) && error.code === ErrorCode.NOT_FOUND) {
        throw ErrorFactory.createNotFoundError('Project', { slug })
      }
      throw ErrorFactory.createContentLoadingError('project', {
        slug,
        endpoint: `/projects/${slug}`,
      })
    }
  }

  async getProjectTechnologies(slug: string, options?: ApiRequestOptions) {
    if (!slug) {
      throw ErrorFactory.createValidationError('Project slug is required')
    }

    try {
      return await this.request<{ technologies: any[] }>(
        `/projects/${slug}/technologies`,
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('project technologies', {
        slug,
      })
    }
  }

  // Blog API with error handling
  async getBlogPosts(options?: ApiRequestOptions) {
    try {
      return await this.request<{ posts: any[] }>('/blog', options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('blog posts', {
        endpoint: '/blog',
      })
    }
  }

  async getFeaturedBlogPosts(options?: ApiRequestOptions) {
    try {
      return await this.request<{ posts: any[] }>('/blog/featured', options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('featured blog posts', {
        endpoint: '/blog/featured',
      })
    }
  }

  async getBlogPost(slug: string, options?: ApiRequestOptions) {
    if (!slug) {
      throw ErrorFactory.createValidationError('Blog post slug is required')
    }

    try {
      return await this.request<{ post: any }>(`/blog/${slug}`, options)
    } catch (error) {
      if (this.isAppError(error) && error.code === ErrorCode.NOT_FOUND) {
        throw ErrorFactory.createNotFoundError('Blog post', { slug })
      }
      throw ErrorFactory.createContentLoadingError('blog post', { slug })
    }
  }

  async getBlogPostTags(slug: string, options?: ApiRequestOptions) {
    if (!slug) {
      throw ErrorFactory.createValidationError('Blog post slug is required')
    }

    try {
      return await this.request<{ tags: any[] }>(`/blog/${slug}/tags`, options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('blog post tags', { slug })
    }
  }

  // Technologies API with error handling
  async getTechnologies(options?: ApiRequestOptions) {
    try {
      return await this.request<{ technologies: any[] }>(
        '/technologies',
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('technologies', {
        endpoint: '/technologies',
      })
    }
  }

  // Auth API with error handling
  async verifyCredentials(
    email: string,
    password: string,
    options?: ApiRequestOptions
  ) {
    if (!email || !password) {
      throw ErrorFactory.createValidationError(
        'Email and password are required'
      )
    }

    try {
      return await this.request<{ user: any }>('/auth/verify', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        skipRetry: true, // Don't retry auth requests
        ...options,
      })
    } catch (error) {
      if (this.isAppError(error)) {
        throw error // Re-throw API errors (unauthorized, etc.)
      }
      throw ErrorFactory.createFormError('Authentication failed', {
        email: email.replace(/@.*/, '@***'),
      })
    }
  }

  async getUser(id: string, options?: ApiRequestOptions) {
    if (!id) {
      throw ErrorFactory.createValidationError('User ID is required')
    }

    try {
      return await this.request<{ user: any }>(`/auth/user/${id}`, options)
    } catch (error) {
      if (this.isAppError(error) && error.code === ErrorCode.NOT_FOUND) {
        throw ErrorFactory.createNotFoundError('User', { userId: id })
      }
      throw ErrorFactory.createContentLoadingError('user', { userId: id })
    }
  }

  // Admin API with error handling
  async getAdminProjects(options?: ApiRequestOptions) {
    try {
      return await this.request<{ projects: any[] }>('/admin/projects', options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('admin projects', {
        endpoint: '/admin/projects',
      })
    }
  }

  async createProject(data: any, options?: ApiRequestOptions) {
    if (!data) {
      throw ErrorFactory.createValidationError('Project data is required')
    }

    try {
      return await this.request<{ success: boolean; projectId: string }>(
        '/admin/projects',
        {
          method: 'POST',
          body: JSON.stringify(data),
          skipRetry: true, // Don't retry mutations
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to create project', { data })
    }
  }

  async updateProject(id: string, data: any, options?: ApiRequestOptions) {
    if (!id) {
      throw ErrorFactory.createValidationError('Project ID is required')
    }
    if (!data) {
      throw ErrorFactory.createValidationError('Project data is required')
    }

    try {
      return await this.request<{ success: boolean }>(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        skipRetry: true,
        ...options,
      })
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to update project', {
        projectId: id,
      })
    }
  }

  async deleteProject(id: string, options?: ApiRequestOptions) {
    if (!id) {
      throw ErrorFactory.createValidationError('Project ID is required')
    }

    try {
      return await this.request<{ success: boolean }>(`/admin/projects/${id}`, {
        method: 'DELETE',
        skipRetry: true,
        ...options,
      })
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to delete project', {
        projectId: id,
      })
    }
  }

  // Recruiter Pages API with error handling
  async getRecruiterPage(slug: string, options?: ApiRequestOptions) {
    if (!slug) {
      throw ErrorFactory.createValidationError(
        'Recruiter page slug is required'
      )
    }

    try {
      return await this.request<{ page: any }>(`/recruiter/${slug}`, options)
    } catch (error) {
      if (this.isAppError(error) && error.code === ErrorCode.NOT_FOUND) {
        throw ErrorFactory.createNotFoundError('Recruiter page', { slug })
      }
      throw ErrorFactory.createContentLoadingError('recruiter page', { slug })
    }
  }

  async getAdminRecruiterPages(options?: ApiRequestOptions) {
    try {
      return await this.request<{ pages: any[] }>('/admin/recruiter', options)
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('admin recruiter pages')
    }
  }

  async createRecruiterPage(data: any, options?: ApiRequestOptions) {
    if (!data) {
      throw ErrorFactory.createValidationError(
        'Recruiter page data is required'
      )
    }

    try {
      return await this.request<{ success: boolean; pageId: string }>(
        '/admin/recruiter',
        {
          method: 'POST',
          body: JSON.stringify(data),
          skipRetry: true,
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to create recruiter page', {
        data,
      })
    }
  }

  async updateRecruiterPage(
    id: string,
    data: any,
    options?: ApiRequestOptions
  ) {
    if (!id) {
      throw ErrorFactory.createValidationError('Recruiter page ID is required')
    }
    if (!data) {
      throw ErrorFactory.createValidationError(
        'Recruiter page data is required'
      )
    }

    try {
      return await this.request<{ success: boolean }>(
        `/admin/recruiter/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
          skipRetry: true,
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to update recruiter page', {
        pageId: id,
      })
    }
  }

  async deleteRecruiterPage(id: string, options?: ApiRequestOptions) {
    if (!id) {
      throw ErrorFactory.createValidationError('Recruiter page ID is required')
    }

    try {
      return await this.request<{ success: boolean }>(
        `/admin/recruiter/${id}`,
        {
          method: 'DELETE',
          skipRetry: true,
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to delete recruiter page', {
        pageId: id,
      })
    }
  }

  // Content Management API with error handling
  async getContentSection(section: string, options?: ApiRequestOptions) {
    if (!section) {
      throw ErrorFactory.createValidationError('Content section is required')
    }

    try {
      return await this.request<{ success: boolean; content: any }>(
        `/content/${section}`,
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError(
        `content section: ${section}`,
        { section }
      )
    }
  }

  async getAllContent(options?: ApiRequestOptions) {
    try {
      return await this.request<{ success: boolean; content: any }>(
        '/content',
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('content', {
        endpoint: '/content',
      })
    }
  }

  async updateContentSection(
    section: string,
    content: any,
    options?: ApiRequestOptions
  ) {
    if (!section) {
      throw ErrorFactory.createValidationError('Content section is required')
    }
    if (!content) {
      throw ErrorFactory.createValidationError('Content data is required')
    }

    try {
      const result = await this.request<{
        success: boolean
        itemsUpdated: number
      }>(`/content/${section}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        skipRetry: true,
        ...options,
      })

      // Clear cache for content endpoints after successful update
      if (result.success) {
        requestDeduplicator.clearCache('/content')
        console.log(
          `Cache cleared for content updates after updating section: ${section}`
        )
      }

      return result
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to update content section', {
        section,
      })
    }
  }

  async updateContentItem(
    section: string,
    key: string,
    value: any,
    type: string = 'text',
    options?: ApiRequestOptions
  ) {
    if (!section || !key) {
      throw ErrorFactory.createValidationError('Section and key are required')
    }

    try {
      const keyParam = key.replace(/\./g, '_') // Convert dots to underscores for URL
      const result = await this.request<{ success: boolean; id: string }>(
        `/content/${section}/${keyParam}`,
        {
          method: 'PUT',
          body: JSON.stringify({ value, type }),
          skipRetry: true,
          ...options,
        }
      )

      // Clear cache for content endpoints after successful update
      if (result.success) {
        requestDeduplicator.clearCache('/content')
        console.log(
          `Cache cleared for content updates after updating item: ${section}.${key}`
        )
      }

      return result
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to update content item', {
        section,
        key,
      })
    }
  }

  // Contact submissions API
  async getContactSubmissions(options?: ApiRequestOptions) {
    try {
      return await this.request<{ submissions: any[] }>(
        '/admin/contact',
        options
      )
    } catch (error) {
      throw ErrorFactory.createContentLoadingError('contact submissions')
    }
  }

  // Recruiter analytics API
  async trackRecruiterPageView(
    pageId: string,
    viewData: any,
    options?: ApiRequestOptions
  ) {
    if (!pageId) {
      throw ErrorFactory.createValidationError('Page ID is required')
    }

    try {
      return await this.request<{ success: boolean }>(
        `/admin/recruiter/${pageId}/analytics/view`,
        {
          method: 'POST',
          body: JSON.stringify(viewData),
          skipRetry: true,
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to track page view', {
        pageId,
      })
    }
  }

  async trackRecruiterPageInteraction(
    pageId: string,
    interactionData: any,
    options?: ApiRequestOptions
  ) {
    if (!pageId) {
      throw ErrorFactory.createValidationError('Page ID is required')
    }

    try {
      return await this.request<{ success: boolean }>(
        `/admin/recruiter/${pageId}/analytics/interaction`,
        {
          method: 'POST',
          body: JSON.stringify(interactionData),
          skipRetry: true,
          ...options,
        }
      )
    } catch (error) {
      if (this.isAppError(error)) {
        throw error
      }
      throw ErrorFactory.createFormError('Failed to track page interaction', {
        pageId,
      })
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export class for custom instances
export { ApiClient }

// Helper function to check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    return response.ok
  } catch {
    return false
  }
}
