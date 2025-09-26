/**
 * API Client for Cloudflare D1 Worker
 * Handles all external API calls to the Cloudflare Worker
 */

import { deduplicatedFetch } from './request-deduplication'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Use admin proxy for admin routes when running in browser
    const isAdminRoute =
      endpoint.startsWith('/admin') ||
      (endpoint === '/content' && options.method !== 'GET') ||
      (endpoint.startsWith('/content/') && options.method !== 'GET')

    const isBrowser = typeof window !== 'undefined'

    let url: string
    if (isAdminRoute && isBrowser) {
      // Use the Next.js admin proxy for authenticated routes
      url = `/api/admin-proxy${endpoint}`
    } else {
      // Use direct Cloudflare API for public routes or server-side calls
      url = `${this.baseUrl}${endpoint}`
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    const requestOptions: RequestInit = {
      ...options,
      headers,
    }

    // Use deduplication for all requests to prevent infinite loops
    // Enable caching for GET requests, disable for mutations
    const enableCaching = !options.method || options.method === 'GET'

    return deduplicatedFetch<T>(url, requestOptions, enableCaching)
  }

  // Projects API
  async getProjects() {
    return this.request<{ projects: any[] }>('/projects')
  }

  async getFeaturedProjects() {
    return this.request<{ projects: any[] }>('/projects/featured')
  }

  async getProject(slug: string) {
    return this.request<{ project: any }>(`/projects/${slug}`)
  }

  async getProjectTechnologies(slug: string) {
    return this.request<{ technologies: any[] }>(
      `/projects/${slug}/technologies`
    )
  }

  // Blog API
  async getBlogPosts() {
    return this.request<{ posts: any[] }>('/blog')
  }

  async getFeaturedBlogPosts() {
    return this.request<{ posts: any[] }>('/blog/featured')
  }

  async getBlogPost(slug: string) {
    return this.request<{ post: any }>(`/blog/${slug}`)
  }

  async getBlogPostTags(slug: string) {
    return this.request<{ tags: any[] }>(`/blog/${slug}/tags`)
  }

  // Technologies API
  async getTechnologies() {
    return this.request<{ technologies: any[] }>('/technologies')
  }

  // Auth API
  async verifyCredentials(email: string, password: string) {
    return this.request<{ user: any }>('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async getUser(id: string) {
    return this.request<{ user: any }>(`/auth/user/${id}`)
  }

  // Admin API
  async getAdminProjects() {
    return this.request<{ projects: any[] }>('/admin/projects')
  }

  async createProject(data: any) {
    return this.request<{ success: boolean; projectId: string }>(
      '/admin/projects',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  async updateProject(id: string, data: any) {
    return this.request<{ success: boolean }>(`/admin/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProject(id: string) {
    return this.request<{ success: boolean }>(`/admin/projects/${id}`, {
      method: 'DELETE',
    })
  }

  async getAdminBlogPosts() {
    return this.request<{ posts: any[] }>('/admin/blog')
  }

  // Technologies API (Admin routes)
  async createTechnology(data: any) {
    return this.request<{ success: boolean; technologyId: string }>(
      '/admin/technologies',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  async updateTechnology(id: string, data: any) {
    return this.request<{ success: boolean }>(`/admin/technologies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTechnology(id: string) {
    return this.request<{ success: boolean }>(`/admin/technologies/${id}`, {
      method: 'DELETE',
    })
  }

  // Contact Submissions API (Admin routes)
  async getContactSubmissions() {
    return this.request<{ submissions: any[] }>('/admin/contact')
  }

  async updateContactSubmission(id: string, data: any) {
    return this.request<{ success: boolean }>(`/admin/contact/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Recruiter Pages API
  async getRecruiterPage(slug: string) {
    return this.request<{ page: any }>(`/recruiter/${slug}`)
  }

  async getAdminRecruiterPages() {
    return this.request<{ pages: any[] }>('/admin/recruiter')
  }

  async createRecruiterPage(data: any) {
    return this.request<{ success: boolean; pageId: string }>(
      '/admin/recruiter',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    )
  }

  async updateRecruiterPage(id: string, data: any) {
    return this.request<{ success: boolean }>(`/admin/recruiter/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteRecruiterPage(id: string) {
    return this.request<{ success: boolean }>(`/admin/recruiter/${id}`, {
      method: 'DELETE',
    })
  }

  // Analytics API
  async trackRecruiterPageView(pageId: string, viewData: any) {
    return this.request<{ success: boolean }>(
      `/analytics/recruiter/${pageId}/view`,
      {
        method: 'POST',
        body: JSON.stringify(viewData),
      }
    )
  }

  async trackRecruiterPageInteraction(pageId: string, interactionData: any) {
    return this.request<{ success: boolean }>(
      `/analytics/recruiter/${pageId}/interaction`,
      {
        method: 'POST',
        body: JSON.stringify(interactionData),
      }
    )
  }

  // Content Management API
  async getContentSection(section: string) {
    return this.request<{ success: boolean; content: any }>(
      `/content/${section}`
    )
  }

  async getAllContent() {
    return this.request<{ success: boolean; content: any }>('/content')
  }

  async updateContentSection(section: string, content: any) {
    return this.request<{ success: boolean; itemsUpdated: number }>(
      `/content/${section}`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    )
  }

  async updateContentItem(
    section: string,
    key: string,
    value: any,
    type: string = 'text'
  ) {
    const keyParam = key.replace(/\./g, '_') // Convert dots to underscores for URL
    return this.request<{ success: boolean; id: string }>(
      `/content/${section}/${keyParam}`,
      {
        method: 'PUT',
        body: JSON.stringify({ value, type }),
      }
    )
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
