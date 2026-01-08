import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createApiResponse, createErrorResponse } from '@/lib/api-middleware'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    if (!slug) {
      return createErrorResponse('Project slug is required', 400)
    }

    // Get project with author and technologies
    const project = await prisma.project.findUnique({
      where: { slug },
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

    // Only return published projects for non-admin users
    if (project.status !== 'PUBLISHED') {
      return createErrorResponse('Project not found', 404)
    }

    return createApiResponse({ project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return createErrorResponse('Failed to fetch project', 500)
  }
}
