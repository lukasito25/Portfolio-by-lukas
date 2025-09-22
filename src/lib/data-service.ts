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
    this.useApi = !isDevelopment || USE_API
  }

  async getProjects() {
    if (this.useApi) {
      try {
        const { projects } = await apiClient.getProjects()
        return projects
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
        return projects
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
