import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import {
  withAuth,
  withRateLimit,
  createApiResponse,
  createErrorResponse,
} from '@/lib/api-middleware'
import { createTechnologySchema, paginationSchema } from '@/lib/validations'

// GET /api/technologies - List technologies
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const pagination = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const category = searchParams.get('category')
    const level = searchParams.get('level')

    const skip = (pagination.page - 1) * pagination.limit

    const where: Prisma.TechnologyWhereInput = {}

    if (category) {
      where.category = category
    }

    if (level) {
      where.level = level
    }

    const [technologies, total] = await Promise.all([
      prisma.technology.findMany({
        where,
        include: {
          _count: {
            select: { projects: true },
          },
        },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
        skip,
        take: pagination.limit,
      }),
      prisma.technology.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return createApiResponse({
      technologies,
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
    console.error('Error fetching technologies:', error)
    return createErrorResponse('Failed to fetch technologies', 500)
  }
}

// POST /api/technologies - Create new technology (admin only)
export const POST = withAuth(
  withRateLimit(async (req: NextRequest) => {
    try {
      const body = await req.json()
      const data = createTechnologySchema.parse(body)

      // Check if slug already exists
      const existingTechnology = await prisma.technology.findUnique({
        where: { slug: data.slug },
      })

      if (existingTechnology) {
        return createErrorResponse(
          'A technology with this slug already exists',
          409
        )
      }

      const technology = await prisma.technology.create({
        data,
        include: {
          _count: {
            select: { projects: true },
          },
        },
      })

      return createApiResponse(technology, 201)
    } catch (error) {
      console.error('Error creating technology:', error)
      if (error instanceof Error && error.message.includes('validation')) {
        return createErrorResponse('Invalid input data', 400)
      }
      return createErrorResponse('Failed to create technology', 500)
    }
  })
)
