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
import { updateBlogPostSchema } from '@/lib/validations'

interface RouteParams {
  params: { slug: string }
}

// GET /api/blog/[slug] - Get single blog post by slug
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        tags: true,
      },
    })

    if (!blogPost) {
      return createErrorResponse('Blog post not found', 404)
    }

    // Only show published posts to non-admin users
    if (blogPost.status !== 'PUBLISHED') {
      return createErrorResponse('Blog post not found', 404)
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { id: blogPost.id },
      data: { views: { increment: 1 } },
    })

    return createApiResponse(blogPost)
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return createErrorResponse('Failed to fetch blog post', 500)
  }
}

// PUT /api/blog/[slug] - Update blog post (admin only)
export const PUT = withAuth(
  withRateLimit(
    async (req: NextRequest, session: Session, { params }: RouteParams) => {
      try {
        const body = await req.json()
        const data = updateBlogPostSchema.parse(body)

        const existingPost = await prisma.blogPost.findUnique({
          where: { slug: params.slug },
        })

        if (!existingPost) {
          return createErrorResponse('Blog post not found', 404)
        }

        // Check if new slug conflicts with existing post
        if (data.slug && data.slug !== params.slug) {
          const conflictingPost = await prisma.blogPost.findUnique({
            where: { slug: data.slug },
          })

          if (conflictingPost) {
            return createErrorResponse(
              'A blog post with this slug already exists',
              409
            )
          }
        }

        // Handle tags update
        const updateData: Prisma.BlogPostUpdateInput = { ...data }

        if (data.tags) {
          updateData.tags = {
            set: [], // Clear existing connections
            connect: data.tags.map(id => ({ id })),
          }
        }

        // Set publishedAt if status changes to PUBLISHED
        if (
          data.status === 'PUBLISHED' &&
          existingPost.status !== 'PUBLISHED'
        ) {
          updateData.publishedAt = new Date()
        }

        const blogPost = await prisma.blogPost.update({
          where: { slug: params.slug },
          data: updateData,
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
            tags: true,
          },
        })

        return createApiResponse(blogPost)
      } catch (error) {
        console.error('Error updating blog post:', error)
        if (error instanceof Error && error.message.includes('validation')) {
          return createErrorResponse('Invalid input data', 400)
        }
        return createErrorResponse('Failed to update blog post', 500)
      }
    }
  )
)

// DELETE /api/blog/[slug] - Delete blog post (admin only)
export const DELETE = withAuth(
  withRateLimit(
    async (req: NextRequest, session: Session, { params }: RouteParams) => {
      try {
        const blogPost = await prisma.blogPost.findUnique({
          where: { slug: params.slug },
        })

        if (!blogPost) {
          return createErrorResponse('Blog post not found', 404)
        }

        await prisma.blogPost.delete({
          where: { slug: params.slug },
        })

        return createApiResponse({ message: 'Blog post deleted successfully' })
      } catch (error) {
        console.error('Error deleting blog post:', error)
        return createErrorResponse('Failed to delete blog post', 500)
      }
    }
  )
)
