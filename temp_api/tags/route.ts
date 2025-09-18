import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  withAuth,
  withRateLimit,
  createApiResponse,
  createErrorResponse,
} from '@/lib/api-middleware'
import { createTagSchema, paginationSchema } from '@/lib/validations'

// GET /api/tags - List tags
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const pagination = paginationSchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
    })

    const skip = (pagination.page - 1) * pagination.limit

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        include: {
          _count: {
            select: { blogPosts: true },
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: pagination.limit,
      }),
      prisma.tag.count(),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return createApiResponse({
      tags,
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
    console.error('Error fetching tags:', error)
    return createErrorResponse('Failed to fetch tags', 500)
  }
}

// POST /api/tags - Create new tag (admin only)
export const POST = withAuth(
  withRateLimit(async (req: NextRequest) => {
    try {
      const body = await req.json()
      const data = createTagSchema.parse(body)

      // Check if slug already exists
      const existingTag = await prisma.tag.findUnique({
        where: { slug: data.slug },
      })

      if (existingTag) {
        return createErrorResponse('A tag with this slug already exists', 409)
      }

      const tag = await prisma.tag.create({
        data,
        include: {
          _count: {
            select: { blogPosts: true },
          },
        },
      })

      return createApiResponse(tag, 201)
    } catch (error) {
      console.error('Error creating tag:', error)
      if (error instanceof Error && error.message.includes('validation')) {
        return createErrorResponse('Invalid input data', 400)
      }
      return createErrorResponse('Failed to create tag', 500)
    }
  })
)
