/**
 * Hybrid Data Service
 * Uses local Prisma for development and Cloudflare D1 API for production
 */

import { prisma } from './prisma'
import { apiClient, checkApiHealth } from './api-client'

const isDevelopment = process.env.NODE_ENV === 'development'
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'
const isBrowser = typeof window !== 'undefined'

class DataService {
  private useApi: boolean

  constructor() {
    // Enable API usage based on environment variable
    // In production or browser, always use API
    this.useApi = USE_API || !isDevelopment || isBrowser
  }

  async getProjects() {
    if (this.useApi) {
      try {
        const { projects } = await apiClient.getProjects()
        // Fetch technologies for each project
        const projectsWithTechnologies = await Promise.all(
          projects.map(async (project: any) => {
            try {
              const { technologies } = await apiClient.getProjectTechnologies(
                project.slug
              )
              return { ...project, technologies }
            } catch (error) {
              console.error(
                `Failed to fetch technologies for ${project.slug}:`,
                error
              )
              return { ...project, technologies: [] }
            }
          })
        )
        return projectsWithTechnologies
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Fallback to local Prisma only on server
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        technologies: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
    })
  }

  async getFeaturedProjects() {
    if (this.useApi) {
      try {
        const { projects } = await apiClient.getFeaturedProjects()
        // Fetch technologies for each project
        const projectsWithTechnologies = await Promise.all(
          projects.map(async (project: any) => {
            try {
              const { technologies } = await apiClient.getProjectTechnologies(
                project.slug
              )
              return { ...project, technologies }
            } catch (error) {
              console.error(
                `Failed to fetch technologies for ${project.slug}:`,
                error
              )
              return { ...project, technologies: [] }
            }
          })
        )
        return projectsWithTechnologies
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.project.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      include: {
        technologies: true,
      },
      orderBy: { sortOrder: 'asc' },
    })
  }

  async getProject(slug: string) {
    // Try local API first in development or browser
    if (isDevelopment || isBrowser) {
      try {
        const response = await fetch(`/api/projects/${slug}`)
        if (response.ok) {
          const data = await response.json()
          return data.project
        }
      } catch (error) {
        console.error('Local API failed for getProject:', error)
      }
    }

    if (this.useApi) {
      try {
        const { project } = await apiClient.getProject(slug)
        return project // technologies are already included in the API response
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          // In browser, try local API as fallback
          try {
            const response = await fetch(`/api/projects/${slug}`)
            if (response.ok) {
              const data = await response.json()
              return data.project
            }
          } catch (localError) {
            console.error('Local API fallback failed:', localError)
          }
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    const project = await prisma.project.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        technologies: true,
      },
    })

    if (project) {
      // Increment view count for local database
      if (isBrowser) {
        throw new Error('Cannot use local database in browser')
      }
      await prisma.project.update({
        where: { id: project.id },
        data: { views: { increment: 1 } },
      })
    }

    return project
  }

  async getBlogPosts() {
    if (this.useApi) {
      try {
        const { posts } = await apiClient.getBlogPosts()
        return posts || []
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          // Return empty array instead of throwing error
          return []
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      return []
    }

    try {
      return await prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
      })
    } catch (error) {
      console.error('Failed to fetch blog posts:', error)
      return []
    }
  }

  async getFeaturedBlogPosts() {
    if (this.useApi) {
      try {
        const { posts } = await apiClient.getFeaturedBlogPosts()
        return posts
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true,
      },
      include: {
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    })
  }

  async getBlogPost(slug: string) {
    if (this.useApi) {
      try {
        const { post } = await apiClient.getBlogPost(slug)
        const { tags } = await apiClient.getBlogPostTags(slug)
        return { ...post, tags }
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        tags: true,
      },
    })

    if (post) {
      if (isBrowser) {
        throw new Error('Cannot use local database in browser')
      }
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      })
    }

    return post
  }

  async verifyAdminCredentials(email: string, password: string) {
    if (this.useApi) {
      try {
        const { user } = await apiClient.verifyCredentials(email, password)
        return user
      } catch (error) {
        console.error('API auth failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    // Fallback to local Prisma for auth (existing implementation)
    const bcrypt = await import('bcryptjs')

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      return null
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid || user.role !== 'ADMIN') {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }

  // Admin methods (always try API first for admin operations)
  async getAdminProjects() {
    if (this.useApi) {
      try {
        const { projects } = await apiClient.getAdminProjects()
        return projects || []
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          // Return empty array instead of throwing error
          return []
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      return []
    }

    try {
      return await prisma.project.findMany({
        include: {
          technologies: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      console.error('Failed to fetch admin projects:', error)
      return []
    }
  }

  async createProject(data: any) {
    if (this.useApi) {
      try {
        return await apiClient.createProject(data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    const project = await prisma.project.create({
      data,
      include: {
        technologies: true,
      },
    })

    return { success: true, projectId: project.id }
  }

  async updateProject(id: string, data: any) {
    if (this.useApi) {
      try {
        return await apiClient.updateProject(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.project.update({
      where: { id },
      data,
    })

    return { success: true }
  }

  async deleteProject(id: string) {
    if (this.useApi) {
      try {
        return await apiClient.deleteProject(id)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.project.delete({
      where: { id },
    })

    return { success: true }
  }

  // Technologies/Skills CRUD operations
  async getTechnologies() {
    if (this.useApi) {
      try {
        const { technologies } = await apiClient.getTechnologies()
        return technologies
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.technology.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })
  }

  async createTechnology(data: any) {
    if (this.useApi) {
      try {
        // return await apiClient.createTechnology(data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    const technology = await prisma.technology.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        category: data.category,
        level: data.level,
      },
    })

    return { success: true, technologyId: technology.id }
  }

  async updateTechnology(id: string, data: any) {
    if (this.useApi) {
      try {
        // return await apiClient.updateTechnology(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.technology.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        category: data.category,
        level: data.level,
      },
    })

    return { success: true }
  }

  async deleteTechnology(id: string) {
    if (this.useApi) {
      try {
        // return await apiClient.deleteTechnology(id)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.technology.delete({
      where: { id },
    })

    return { success: true }
  }

  // Contact Submissions CRUD operations
  async getContactSubmissions() {
    if (this.useApi) {
      try {
        const { submissions } = await apiClient.getContactSubmissions()
        return submissions || []
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          // Return empty array instead of throwing error
          return []
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      return []
    }

    try {
      return await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      })
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error)
      return []
    }
  }

  async updateContactSubmission(id: string, data: any) {
    if (this.useApi) {
      try {
        // return await apiClient.updateContactSubmission(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.contactSubmission.update({
      where: { id },
      data: {
        status: data.status,
        responded: data.status === 'RESPONDED',
        respondedAt: data.respondedAt ? new Date(data.respondedAt) : undefined,
      },
    })

    return { success: true }
  }

  // Recruiter Pages CRUD operations
  async getRecruiterPage(slug: string) {
    if (this.useApi) {
      try {
        const { page } = await apiClient.getRecruiterPage(slug)
        return page
      } catch (error) {
        console.error('API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.recruiterPage.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  }

  async getAdminRecruiterPages() {
    if (this.useApi) {
      try {
        const { pages } = await apiClient.getAdminRecruiterPages()
        return pages || []
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          // Return empty array instead of throwing error
          return []
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    return await prisma.recruiterPage.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            analytics: true,
            interactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createRecruiterPage(data: any) {
    if (this.useApi) {
      try {
        return await apiClient.createRecruiterPage(data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    const page = await prisma.recruiterPage.create({
      data: {
        ...data,
        customContent: data.customContent
          ? JSON.stringify(data.customContent)
          : null,
        companyInfo: data.companyInfo ? JSON.stringify(data.companyInfo) : null,
        challenges: data.challenges ? JSON.stringify(data.challenges) : null,
        solutions: data.solutions ? JSON.stringify(data.solutions) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return { success: true, pageId: page.id }
  }

  async updateRecruiterPage(id: string, data: any) {
    if (this.useApi) {
      try {
        return await apiClient.updateRecruiterPage(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.recruiterPage.update({
      where: { id },
      data: {
        ...data,
        customContent: data.customContent
          ? JSON.stringify(data.customContent)
          : undefined,
        companyInfo: data.companyInfo
          ? JSON.stringify(data.companyInfo)
          : undefined,
        challenges: data.challenges
          ? JSON.stringify(data.challenges)
          : undefined,
        solutions: data.solutions ? JSON.stringify(data.solutions) : undefined,
      },
    })

    return { success: true }
  }

  async deleteRecruiterPage(id: string) {
    if (this.useApi) {
      try {
        return await apiClient.deleteRecruiterPage(id)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.recruiterPage.delete({
      where: { id },
    })

    return { success: true }
  }

  async trackRecruiterPageView(pageId: string, viewData: any) {
    if (this.useApi) {
      try {
        return await apiClient.trackRecruiterPageView(pageId, viewData)
      } catch (error) {
        console.error('Analytics API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    // Increment view count
    await prisma.recruiterPage.update({
      where: { id: pageId },
      data: { views: { increment: 1 } },
    })

    // Record analytics if data is provided
    if (viewData.sessionId || viewData.ipAddress) {
      if (isBrowser) {
        throw new Error('Cannot use local database in browser')
      }
      await prisma.recruiterPageAnalytics.create({
        data: {
          pageId,
          sessionId: viewData.sessionId || `session_${Date.now()}`,
          ipAddress: viewData.ipAddress,
          userAgent: viewData.userAgent,
          referrer: viewData.referrer,
        },
      })
    }

    return { success: true }
  }

  async trackRecruiterPageInteraction(pageId: string, interactionData: any) {
    if (this.useApi) {
      try {
        return await apiClient.trackRecruiterPageInteraction(
          pageId,
          interactionData
        )
      } catch (error) {
        console.error('Analytics API failed, falling back to local:', error)
        if (isBrowser) {
          throw new Error(
            'API unavailable and cannot use local database in browser'
          )
        }
      }
    }

    // Before using Prisma, check if we're in browser
    if (isBrowser) {
      throw new Error('Cannot use local database in browser')
    }

    await prisma.recruiterPageInteraction.create({
      data: {
        pageId,
        sessionId: interactionData.sessionId,
        elementType: interactionData.elementType,
        elementId: interactionData.elementId,
        actionType: interactionData.actionType,
        inputData: interactionData.inputData
          ? JSON.stringify(interactionData.inputData)
          : undefined,
        result: interactionData.result
          ? JSON.stringify(interactionData.result)
          : undefined,
        duration: interactionData.duration,
      },
    })

    return { success: true }
  }

  // Utility method to check which service is being used
  async getServiceInfo() {
    const apiHealthy = await checkApiHealth()

    return {
      usingApi: this.useApi && apiHealthy,
      apiHealthy,
      development: isDevelopment,
      fallbackAvailable: true,
    }
  }

  // Content Management Methods
  async getContentSection(section: string): Promise<any> {
    if (this.useApi) {
      try {
        const response = await apiClient.getContentSection(section)
        const content = response.content

        // Check if content is actually populated (not just an empty object)
        if (
          content &&
          typeof content === 'object' &&
          Object.keys(content).length > 0
        ) {
          return content
        }

        // If API returns empty content, fall back to default
        const { defaultContent } = await import('./content-config')
        return defaultContent[section as keyof typeof defaultContent] || {}
      } catch {
        // API unavailable (expected in local dev) — using static default content
        const { defaultContent } = await import('./content-config')
        return defaultContent[section as keyof typeof defaultContent] || {}
      }
    }

    // Fallback to static content for development
    const { defaultContent } = await import('./content-config')
    return defaultContent[section as keyof typeof defaultContent] || {}
  }

  async getAllContent(): Promise<any> {
    if (this.useApi) {
      try {
        const response = await apiClient.getAllContent()
        return response.content
      } catch (error) {
        console.error('API failed for getAllContent:', error)
        throw error
      }
    }

    // Fallback to static content for development
    const { defaultContent } = await import('./content-config')
    return defaultContent
  }

  async updateContentSection(
    section: string,
    content: any
  ): Promise<{ success: boolean; itemsUpdated?: number }> {
    if (this.useApi) {
      try {
        return await apiClient.updateContentSection(section, content)
      } catch (error) {
        console.error('API failed for updateContentSection:', error)
        throw error
      }
    }

    throw new Error('Content updates require API connection')
  }

  async updateContentItem(
    section: string,
    key: string,
    value: any,
    type: string = 'text'
  ): Promise<{ success: boolean; id?: string }> {
    if (this.useApi) {
      try {
        return await apiClient.updateContentItem(section, key, value, type)
      } catch (error) {
        console.error('API failed for updateContentItem:', error)
        throw error
      }
    }

    throw new Error('Content updates require API connection')
  }

  /* ---------------------------------------------------------------- *
   * Generated fit briefs (/admin/applications → /brief/[slug])
   *
   * These are server-only. Unlike the public content methods they do not go
   * through `apiClient`: the Worker's /briefs routes are secret-authenticated,
   * and `apiClient` is the browser-safe client with no secret to send. The
   * pattern mirrors src/app/api/campaigns/route.ts — read the Worker directly
   * with API_SECRET on the server, choose Prisma when there is no secret (local
   * dev), and never let either path reach the browser.
   * ---------------------------------------------------------------- */

  /**
   * Development keeps generated briefs in local SQLite; everywhere else they
   * live in D1.
   *
   * Note this deliberately differs from /api/campaigns, which keys on
   * API_SECRET alone so the admin panel and the live banner can never disagree
   * about what is running. Briefs have no such cross-environment coupling —
   * both the panel and the page read the same store — and a brief drafted while
   * experimenting locally must not land in production D1, where it would be one
   * click from being published at a real URL.
   */
  private briefStore(): 'worker' | 'prisma' {
    // Explicit override, set by `scripts/apply.ts --production`.
    //
    // Generation runs locally (it needs the agent suite on localhost), but a
    // brief is only useful once it is at a URL a recruiter can open. Without
    // this the two halves never meet: the draft lands in local SQLite while the
    // live site reads D1 and returns 404.
    const forced = process.env.BRIEF_STORE
    if (forced === 'prisma') return 'prisma'
    if (forced === 'worker') {
      if (!process.env.API_SECRET) {
        throw new Error(
          'BRIEF_STORE=worker needs API_SECRET set — it is what authorises writes to the live database.'
        )
      }
      return 'worker'
    }

    if (process.env.NODE_ENV === 'development') return 'prisma'
    if (!process.env.API_SECRET) {
      throw new Error(
        'API_SECRET is required to read or write generated briefs outside development.'
      )
    }
    return 'worker'
  }

  private async briefFetch(path: string, init?: RequestInit) {
    const base = (
      process.env.NEXT_PUBLIC_API_URL ||
      'https://portfolio-api.hosala-lukas.workers.dev'
    ).replace(/\/$/, '')

    return fetch(`${base}/briefs${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_SECRET}`,
        ...(init?.headers || {}),
      },
      cache: 'no-store',
    })
  }

  /** Rehydrate a Prisma row (JSON stored as text) into the API's shape. */
  private briefFromPrisma(row: any) {
    const parse = (value: string, fallback: unknown) => {
      try {
        return JSON.parse(value)
      } catch {
        return fallback
      }
    }
    return {
      id: row.id,
      slug: row.slug,
      companyName: row.companyName,
      roleTitle: row.roleTitle,
      sourceUrl: row.sourceUrl ?? null,
      sourceKind: row.sourceKind,
      status: row.status,
      previewToken: row.previewToken,
      jobSpec: parse(row.jobSpec, {}),
      content: parse(row.content, {}),
      generatedContent: parse(row.generatedContent ?? '{}', {}),
      cvContent: parse(row.cvContent, {}),
      coverLetter: parse(row.coverLetter, {}),
      brand: parse(row.brand, {}),
      warnings: parse(row.warnings, []),
      applicationStatus: row.applicationStatus ?? 'not_sent',
      sentAt: row.sentAt ?? null,
      sentVia: row.sentVia ?? null,
      sentSnapshot: parse(row.sentSnapshot ?? '{}', {}),
      outcomeNotes: row.outcomeNotes ?? null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      publishedAt: row.publishedAt ?? null,
    }
  }

  private assertServer(what: string) {
    if (isBrowser) {
      throw new Error(`${what} is server-only; call it through an API route`)
    }
  }

  /**
   * One brief by slug. Drafts resolve only when `token` matches their
   * previewToken — enforced here and again in the Worker, so a missing check on
   * one side cannot expose an unpublished brief.
   */
  async getBriefBySlug(slug: string, token?: string) {
    this.assertServer('getBriefBySlug')

    if (this.briefStore() === 'worker') {
      const qs = token ? `?token=${encodeURIComponent(token)}` : ''
      const res = await this.briefFetch(`/${encodeURIComponent(slug)}${qs}`)
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`Brief fetch failed: ${res.status}`)
      const { brief } = await res.json()
      return brief
    }

    const row = await prisma.generatedBrief.findUnique({ where: { slug } })
    if (!row) return null
    if (row.status !== 'published' && token !== row.previewToken) return null
    return this.briefFromPrisma(row)
  }

  /** Admin list. Summaries only — the content JSON is the bulk of a row. */
  async listBriefs() {
    this.assertServer('listBriefs')

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch('')
      if (!res.ok) throw new Error(`Brief list failed: ${res.status}`)
      const { briefs } = await res.json()
      return briefs
    }

    const rows = await prisma.generatedBrief.findMany({
      orderBy: { updatedAt: 'desc' },
    })
    return rows.map(row => {
      const brief = this.briefFromPrisma(row)
      return {
        id: brief.id,
        slug: brief.slug,
        companyName: brief.companyName,
        roleTitle: brief.roleTitle,
        sourceUrl: brief.sourceUrl,
        sourceKind: brief.sourceKind,
        status: brief.status,
        previewToken: brief.previewToken,
        locales: Object.keys(brief.content as Record<string, unknown>),
        warningCount: (brief.warnings as unknown[]).length,
        createdAt: brief.createdAt,
        updatedAt: brief.updatedAt,
        publishedAt: brief.publishedAt,
      }
    })
  }

  /** Full record by id, for the admin review screen. */
  async getBriefById(id: string) {
    this.assertServer('getBriefById')

    if (this.briefStore() === 'worker') {
      const list = await this.listBriefs()
      const match = list.find((b: any) => b.id === id)
      if (!match) return null
      const res = await this.briefFetch(
        `/${encodeURIComponent(match.slug)}?token=${encodeURIComponent(match.previewToken)}`
      )
      if (res.status === 404) return null
      if (!res.ok) throw new Error(`Brief fetch failed: ${res.status}`)
      const { brief } = await res.json()
      return brief
    }

    const row = await prisma.generatedBrief.findUnique({ where: { id } })
    return row ? this.briefFromPrisma(row) : null
  }

  async createBrief(data: any) {
    this.assertServer('createBrief')

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch('', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Brief create failed: ${res.status}`)
      }
      const { brief } = await res.json()
      return brief
    }

    const row = await prisma.generatedBrief.create({
      data: {
        id: data.id,
        slug: data.slug,
        companyName: data.companyName ?? '',
        roleTitle: data.roleTitle ?? '',
        sourceUrl: data.sourceUrl ?? null,
        sourceKind: data.sourceKind ?? 'text',
        status: data.status ?? 'draft',
        previewToken: data.previewToken,
        jobSpec: JSON.stringify(data.jobSpec ?? {}),
        content: JSON.stringify(data.content ?? {}),
        generatedContent: JSON.stringify(data.generatedContent ?? {}),
        cvContent: JSON.stringify(data.cvContent ?? {}),
        coverLetter: JSON.stringify(data.coverLetter ?? {}),
        brand: JSON.stringify(data.brand ?? {}),
        warnings: JSON.stringify(data.warnings ?? []),
      },
    })
    return this.briefFromPrisma(row)
  }

  async updateBrief(id: string, data: any) {
    this.assertServer('updateBrief')

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch(`/${encodeURIComponent(id)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Brief update failed: ${res.status}`)
      }
      const { brief } = await res.json()
      return brief
    }

    const patch: Record<string, unknown> = {}
    for (const field of [
      'slug',
      'companyName',
      'roleTitle',
      'sourceUrl',
      'sourceKind',
      'status',
      'applicationStatus',
      'sentVia',
      'outcomeNotes',
    ]) {
      if (data[field] !== undefined) patch[field] = data[field]
    }
    if (data.sentAt !== undefined) {
      patch.sentAt = data.sentAt ? new Date(data.sentAt) : null
    }
    for (const field of [
      'jobSpec',
      'content',
      'generatedContent',
      'cvContent',
      'coverLetter',
      'brand',
      'warnings',
      'sentSnapshot',
    ]) {
      if (data[field] !== undefined) patch[field] = JSON.stringify(data[field])
    }
    if (data.status === 'published') patch.publishedAt = new Date()
    if (data.status === 'draft') patch.publishedAt = null

    const row = await prisma.generatedBrief.update({
      where: { id },
      data: patch,
    })
    return this.briefFromPrisma(row)
  }

  async deleteBrief(id: string) {
    this.assertServer('deleteBrief')

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch(`/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Brief delete failed: ${res.status}`)
      return { success: true }
    }

    await prisma.generatedBrief.delete({ where: { id } })
    return { success: true }
  }

  /* ---------------------------------------------------------------- *
   * Edit learning
   *
   * Same store selection as briefs, for the same reason: an edit belongs
   * next to the brief it came from. Splitting them would put the training
   * signal in one database and the material it describes in another.
   *
   * These were Prisma-only until the generator moved to Cloud Run. Every
   * pipeline step then ran on Vercel, where `file:./dev.db` does not exist,
   * and generation died on `prisma.applicationEdit.findMany()` with SQLite
   * error 14 — a feature that had never run outside a laptop.
   * ---------------------------------------------------------------- */

  async recentApplicationEdits(limit = 12): Promise<ApplicationEditRecord[]> {
    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch(`/edits/recent?limit=${limit}`)
      if (!res.ok) throw new Error(`Edit fetch failed: ${res.status}`)
      const data = (await res.json()) as { edits: ApplicationEditRecord[] }
      return data.edits ?? []
    }

    const rows = await prisma.applicationEdit.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
    return rows.map(row => ({
      id: row.id,
      kind: row.kind,
      locale: row.locale,
      path: row.path,
      before: row.before,
      after: row.after,
    }))
  }

  async recordApplicationEdits(
    briefId: string,
    pairs: Omit<ApplicationEditRecord, 'id'>[]
  ): Promise<number> {
    if (!pairs.length) return 0

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch(`/${briefId}/edits`, {
        method: 'POST',
        body: JSON.stringify({ pairs }),
      })
      if (!res.ok) throw new Error(`Edit record failed: ${res.status}`)
      return pairs.length
    }

    await prisma.$transaction([
      prisma.applicationEdit.deleteMany({
        where: { briefId, path: { in: pairs.map(p => p.path) } },
      }),
      prisma.applicationEdit.createMany({
        data: pairs.map(pair => ({ briefId, ...pair })),
      }),
    ])
    return pairs.length
  }

  async undistilledApplicationEdits(): Promise<ApplicationEditRecord[]> {
    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch('/edits/undistilled')
      if (!res.ok) throw new Error(`Edit fetch failed: ${res.status}`)
      const data = (await res.json()) as { edits: ApplicationEditRecord[] }
      return data.edits ?? []
    }

    const rows = await prisma.applicationEdit.findMany({
      where: { distilled: false },
      orderBy: { createdAt: 'asc' },
    })
    return rows.map(row => ({
      id: row.id,
      kind: row.kind,
      locale: row.locale,
      path: row.path,
      before: row.before,
      after: row.after,
    }))
  }

  async markApplicationEditsDistilled(ids: string[]): Promise<void> {
    if (!ids.length) return

    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch('/edits/distilled', {
        method: 'POST',
        body: JSON.stringify({ ids }),
      })
      if (!res.ok) throw new Error(`Edit update failed: ${res.status}`)
      return
    }

    await prisma.applicationEdit.updateMany({
      where: { id: { in: ids } },
      data: { distilled: true },
    })
  }

  async applicationEditCount(): Promise<number> {
    if (this.briefStore() === 'worker') {
      const res = await this.briefFetch('/edits/count')
      if (!res.ok) throw new Error(`Edit count failed: ${res.status}`)
      const data = (await res.json()) as { count: number }
      return data.count ?? 0
    }

    return prisma.applicationEdit.count()
  }
}

export interface ApplicationEditRecord {
  id?: string
  kind: string
  locale: string
  path: string
  before: string
  after: string
}

export const dataService = new DataService()
