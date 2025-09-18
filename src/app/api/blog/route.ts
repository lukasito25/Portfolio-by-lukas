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
  createBlogPostSchema,
  paginationSchema,
  searchSchema,
} from '@/lib/validations'

// GET /api/blog - List blog posts with pagination and filtering
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
      tag: searchParams.get('tag'),
      status: searchParams.get('status'),
      featured: searchParams.get('featured'),
    })

    const skip = (pagination.page - 1) * pagination.limit

    // Build where clause
    const where: Prisma.BlogPostWhereInput = {}

    if (search.q) {
      where.OR = [
        { title: { contains: search.q, mode: 'insensitive' } },
        { excerpt: { contains: search.q, mode: 'insensitive' } },
        { content: { contains: search.q, mode: 'insensitive' } },
      ]
    }

    if (search.category) {
      where.category = search.category
    }

    if (search.tag) {
      where.tags = {
        some: { slug: search.tag },
      }
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

    // Get blog posts with author and tags
    const [blogPosts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          tags: true,
        },
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: pagination.limit,
      }),
      prisma.blogPost.count({ where }),
    ])

    const totalPages = Math.ceil(total / pagination.limit)

    return createApiResponse({
      blogPosts,
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
    console.error('Error fetching blog posts:', error)
    return createErrorResponse('Failed to fetch blog posts', 500)
  }
}

// POST /api/blog - Create new blog post (admin only)
export const POST = withAuth(
  withRateLimit(async (req: NextRequest, session: Session) => {
    try {
      const body = await req.json()
      const data = createBlogPostSchema.parse(body)

      // Check if slug already exists
      const existingPost = await prisma.blogPost.findUnique({
        where: { slug: data.slug },
      })

      if (existingPost) {
        return createErrorResponse(
          'A blog post with this slug already exists',
          409
        )
      }

      // Connect tags if provided
      const connectTags = data.tags?.length
        ? { connect: data.tags.map(id => ({ id })) }
        : undefined

      const blogPost = await prisma.blogPost.create({
        data: {
          ...data,
          authorId: session.user.id,
          tags: connectTags,
          publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
        },
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
          tags: true,
        },
      })

      return createApiResponse(blogPost, 201)
    } catch (error) {
      console.error('Error creating blog post:', error)
      if (error instanceof Error && error.message.includes('validation')) {
        return createErrorResponse('Invalid input data', 400)
      }
      return createErrorResponse('Failed to create blog post', 500)
    }
  })
)
