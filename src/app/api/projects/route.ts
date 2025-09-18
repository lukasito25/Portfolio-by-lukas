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
import {
  createProjectSchema,
  paginationSchema,
  searchSchema,
} from '@/lib/validations'

// GET /api/projects - List projects with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Parse and validate query parameters
    const pagination = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const search = searchSchema.parse({
      q: searchParams.get('q'),
      category: searchParams.get('category'),
      status: searchParams.get('status'),
      featured: searchParams.get('featured'),
    })

    const skip = (pagination.page - 1) * pagination.limit

    // Build where clause
    const where: Prisma.ProjectWhereInput = {}

    if (search.q) {
      where.OR = [
        { title: { contains: search.q, mode: 'insensitive' } },
        { description: { contains: search.q, mode: 'insensitive' } },
        { excerpt: { contains: search.q, mode: 'insensitive' } },
      ]
    }

    if (search.category) {
      where.category = search.category
    }

    if (search.status) {
      where.status = search.status
    } else {
      // Default to published for public API
      where.status = 'PUBLISHED'
    }

    if (search.featured !== undefined) {
      where.featured = search.featured
    }

    // Get projects with author and technologies
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          technologies: true,
        },
        orderBy: [
          { featured: 'desc' },
          { sortOrder: 'asc' },
          { publishedAt: 'desc' },
        ],
        skip,
        take: pagination.limit,
      }),
      prisma.project.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return createApiResponse({
      projects,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return createErrorResponse('Failed to fetch projects', 500)
  }
}

// POST /api/projects - Create new project (admin only)
export const POST = withAuth(
  withRateLimit(async (req: NextRequest, session: Session) => {
    try {
      const body = await req.json()
      const data = createProjectSchema.parse(body)

      // Check if slug already exists
      const existingProject = await prisma.project.findUnique({
        where: { slug: data.slug },
      })

      if (existingProject) {
        return createErrorResponse(
          'A project with this slug already exists',
          409
        )
      }

      // Connect technologies if provided
      const connectTechnologies = data.technologies?.length
        ? { connect: data.technologies.map(id => ({ id })) }
        : undefined

      const project = await prisma.project.create({
        data: {
          ...data,
          authorId: session.user.id,
          technologies: connectTechnologies,
          publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          technologies: true,
        },
      })

      return createApiResponse(project, 201)
    } catch (error) {
      console.error('Error creating project:', error)
      if (error instanceof Error && error.message.includes('validation')) {
        return createErrorResponse('Invalid input data', 400)
      }
      return createErrorResponse('Failed to create project', 500)
    }
  })
)
