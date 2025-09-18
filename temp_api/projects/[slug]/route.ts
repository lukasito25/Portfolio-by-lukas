import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Session } from 'next-auth'
import {
  withAuth,
  withRateLimit,
  createApiResponse,
  createErrorResponse,
} from '@/lib/api-middleware'
import { updateProjectSchema } from '@/lib/validations'

interface RouteParams {
  params: { slug: string }
}

// GET /api/projects/[slug] - Get single project by slug
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        technologies: true,
      },
    })

    if (!project) {
      return createErrorResponse('Project not found', 404)
    }

    // Only show published projects to non-admin users
    // In a real app, you'd check the user's role here
    if (project.status !== 'PUBLISHED') {
      return createErrorResponse('Project not found', 404)
    }

    // Increment view count
    await prisma.project.update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    })

    return createApiResponse(project)
  } catch (error) {
    console.error('Error fetching project:', error)
    return createErrorResponse('Failed to fetch project', 500)
  }
}

// PUT /api/projects/[slug] - Update project (admin only)
export const PUT = withAuth(
  withRateLimit(
    async (req: NextRequest, session: Session, { params }: RouteParams) => {
      try {
        const body = await req.json()
        const data = updateProjectSchema.parse(body)

        const existingProject = await prisma.project.findUnique({
          where: { slug: params.slug },
        })

        if (!existingProject) {
          return createErrorResponse('Project not found', 404)
        }

        // Check if new slug conflicts with existing project
        if (data.slug && data.slug !== params.slug) {
          const conflictingProject = await prisma.project.findUnique({
            where: { slug: data.slug },
          })

          if (conflictingProject) {
            return createErrorResponse(
              'A project with this slug already exists',
              409
            )
          }
        }

        // Handle technologies update
        const updateData: Prisma.ProjectUpdateInput = { ...data }

        if (data.technologies) {
          updateData.technologies = {
            set: [], // Clear existing connections
            connect: data.technologies.map(id => ({ id })),
          }
        }

        // Set publishedAt if status changes to PUBLISHED
        if (
          data.status === 'PUBLISHED' &&
          existingProject.status !== 'PUBLISHED'
        ) {
          updateData.publishedAt = new Date()
        }

        const project = await prisma.project.update({
          where: { slug: params.slug },
          data: updateData,
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
            technologies: true,
          },
        })

        return createApiResponse(project)
      } catch (error) {
        console.error('Error updating project:', error)
        if (error instanceof Error && error.message.includes('validation')) {
          return createErrorResponse('Invalid input data', 400)
        }
        return createErrorResponse('Failed to update project', 500)
      }
    }
  )
)

// DELETE /api/projects/[slug] - Delete project (admin only)
export const DELETE = withAuth(
  withRateLimit(
    async (req: NextRequest, session: Session, { params }: RouteParams) => {
      try {
        const project = await prisma.project.findUnique({
          where: { slug: params.slug },
        })

        if (!project) {
          return createErrorResponse('Project not found', 404)
        }

        await prisma.project.delete({
          where: { slug: params.slug },
        })

        return createApiResponse({ message: 'Project deleted successfully' })
      } catch (error) {
        console.error('Error deleting project:', error)
        return createErrorResponse('Failed to delete project', 500)
      }
    }
  )
)
