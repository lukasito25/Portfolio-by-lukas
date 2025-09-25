/**
 * API Client for Cloudflare D1 Worker
 * Handles all external API calls to the Cloudflare Worker
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://portfolio-api.hosala-lukas.workers.dev'
const API_SECRET = process.env.API_SECRET

class ApiClient {
  private baseUrl: string
  private secret?: string

  constructor(baseUrl: string = API_BASE_URL, secret?: string) {
    this.baseUrl = baseUrl
    this.secret = secret || API_SECRET
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add authorization header for admin routes
    if (endpoint.startsWith('/admin') && this.secret) {
      headers['Authorization'] = `Bearer ${this.secret}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
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
