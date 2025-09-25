/**
 * Hybrid Data Service
 * Uses local Prisma for development and Cloudflare D1 API for production
 */

import { prisma } from './prisma'
import { apiClient, checkApiHealth } from './api-client'

const isDevelopment = process.env.NODE_ENV === 'development'
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

class DataService {
  private useApi: boolean

  constructor() {
    // Enable API usage based on environment variable
    this.useApi = USE_API || !isDevelopment
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
      }
    }

    // Fallback to local Prisma
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
      }
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
    if (this.useApi) {
      try {
        const { project } = await apiClient.getProject(slug)
        const { technologies } = await apiClient.getProjectTechnologies(slug)
        return { ...project, technologies }
      } catch (error) {
        console.error('API failed, falling back to local:', error)
      }
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
        return posts
      } catch (error) {
        console.error('API failed, falling back to local:', error)
      }
    }

    return await prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
  }

  async getFeaturedBlogPosts() {
    if (this.useApi) {
      try {
        const { posts } = await apiClient.getFeaturedBlogPosts()
        return posts
      } catch (error) {
        console.error('API failed, falling back to local:', error)
      }
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
      }
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
      }
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
        return projects
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
    }

    return await prisma.project.findMany({
      include: {
        technologies: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createProject(data: any) {
    if (this.useApi) {
      try {
        return await apiClient.createProject(data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
      }
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
        // const { submissions } = await apiClient.getContactSubmissions()
        // return submissions
      } catch (error) {
        console.error('API failed, falling back to local:', error)
      }
    }

    return await prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })
  }

  async updateContactSubmission(id: string, data: any) {
    if (this.useApi) {
      try {
        // return await apiClient.updateContactSubmission(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
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
        // const { page } = await apiClient.getRecruiterPage(slug)
        // return page
      } catch (error) {
        console.error('API failed, falling back to local:', error)
      }
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
        // const { pages } = await apiClient.getAdminRecruiterPages()
        // return pages
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
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
        // return await apiClient.createRecruiterPage(data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
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
        // return await apiClient.updateRecruiterPage(id, data)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
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
        // return await apiClient.deleteRecruiterPage(id)
      } catch (error) {
        console.error('Admin API failed, falling back to local:', error)
      }
    }

    await prisma.recruiterPage.delete({
      where: { id },
    })

    return { success: true }
  }

  async trackRecruiterPageView(pageId: string, viewData: any) {
    if (this.useApi) {
      try {
        // return await apiClient.trackRecruiterPageView(pageId, viewData)
      } catch (error) {
        console.error('Analytics API failed, falling back to local:', error)
      }
    }

    // Increment view count
    await prisma.recruiterPage.update({
      where: { id: pageId },
      data: { views: { increment: 1 } },
    })

    // Record analytics if data is provided
    if (viewData.sessionId || viewData.ipAddress) {
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
        // return await apiClient.trackRecruiterPageInteraction(
        //   pageId,
        //   interactionData
        // )
      } catch (error) {
        console.error('Analytics API failed, falling back to local:', error)
      }
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
}

export const dataService = new DataService()
