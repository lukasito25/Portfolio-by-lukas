import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  withRateLimit,
  createApiResponse,
  createErrorResponse,
  getClientIdentifier,
} from '@/lib/api-middleware'
import { analyticsSchema } from '@/lib/validations'

// POST /api/analytics - Track page view or event
export const POST = withRateLimit(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = analyticsSchema.parse(body)

    if (process.env.ANALYTICS_ENABLED !== 'true') {
      return createApiResponse({ message: 'Analytics disabled' })
    }

    const ipAddress = getClientIdentifier(req)
    const userAgent = req.headers.get('user-agent') || undefined

    // Extract location info (in a real app, you might use a service like MaxMind)
    // For now, we'll leave these as undefined
    const country = undefined
    const city = undefined

    // Parse referrer information
    let source = undefined
    let medium = undefined
    let campaign = undefined

    if (data.referrer) {
      try {
        const referrerUrl = new URL(data.referrer)
        const hostname = referrerUrl.hostname.toLowerCase()

        // Categorize traffic sources
        if (hostname.includes('google')) {
          source = 'google'
          medium = 'organic'
        } else if (hostname.includes('github')) {
          source = 'github'
          medium = 'social'
        } else if (hostname.includes('linkedin')) {
          source = 'linkedin'
          medium = 'social'
        } else if (hostname.includes('twitter') || hostname.includes('x.com')) {
          source = 'twitter'
          medium = 'social'
        } else {
          source = hostname
          medium = 'referral'
        }

        // Extract campaign parameters
        const searchParams = referrerUrl.searchParams
        campaign = searchParams.get('utm_campaign') || undefined
      } catch {
        // Invalid referrer URL
      }
    }

    // Create analytics record
    const analyticsRecord = await prisma.analytics.create({
      data: {
        path: data.path,
        title: data.title,
        sessionId: data.sessionId,
        ipAddress,
        userAgent,
        country,
        city,
        referrer: data.referrer,
        source,
        medium,
        campaign,
        duration: data.duration,
        bounce: data.bounce ?? false,
      },
    })

    return createApiResponse({ id: analyticsRecord.id }, 201)
  } catch (error) {
    console.error('Error recording analytics:', error)
    if (error instanceof Error && error.message.includes('validation')) {
      return createErrorResponse('Invalid analytics data', 400)
    }
    return createErrorResponse('Failed to record analytics', 500)
  }
})

// GET /api/analytics - Get analytics data (admin only)
export const GET = withRateLimit(async (req: NextRequest) => {
  try {
    // TODO: Add authentication check for admin access

    const url = new URL(req.url)
    const timeframe = url.searchParams.get('timeframe') || '30d'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')

    const skip = (page - 1) * limit

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeframe) {
      case '1d':
        startDate.setDate(now.getDate() - 1)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get analytics data
    const [analytics, total] = await Promise.all([
      prisma.analytics.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.analytics.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ])

    // Get summary statistics
    const stats = await prisma.analytics.groupBy({
      by: ['path'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      _avg: {
        duration: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    })

    // Get source statistics
    const sources = await prisma.analytics.groupBy({
      by: ['source'],
      where: {
        createdAt: {
          gte: startDate,
        },
        source: {
          not: null,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    })

    return createApiResponse({
      analytics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        topPages: stats,
        topSources: sources,
        totalViews: total,
        timeframe,
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return createErrorResponse('Failed to fetch analytics', 500)
  }
})
