import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

// POST - Track analytics events
export async function POST(request: NextRequest) {
  // If using external API, disable local analytics to avoid Prisma issues
  if (USE_API) {
    return NextResponse.json(
      { message: 'Analytics disabled when using external API' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    // Extract client information
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'

    // Handle different event types
    if (body.name) {
      // This is an event from the analytics library
      const eventData = {
        path: body.properties?.url
          ? new URL(body.properties.url).pathname
          : '/',
        title: body.properties?.title || '',
        sessionId: body.sessionId,
        ipAddress,
        userAgent,
        referrer: body.properties?.referrer || '',
        source: body.properties?.source || 'direct',
        medium: body.properties?.medium || '',
        campaign: body.properties?.campaign || '',
        duration: body.properties?.duration
          ? parseInt(body.properties.duration)
          : null,
        scrollDepth: body.properties?.scrollDepth
          ? parseInt(body.properties.scrollDepth)
          : null,
        country: body.properties?.country || '',
        city: body.properties?.city || '',
      }

      const analyticsEntry = await prisma.analytics.create({
        data: eventData,
      })

      return NextResponse.json({
        success: true,
        id: analyticsEntry.id,
      })
    } else {
      // Direct analytics data
      const analyticsEntry = await prisma.analytics.create({
        data: {
          path: body.path || '/',
          title: body.title || '',
          sessionId: body.sessionId || `session_${Date.now()}`,
          ipAddress,
          userAgent,
          referrer: body.referrer || '',
          source: body.source || 'direct',
          medium: body.medium || '',
          campaign: body.campaign || '',
          duration: body.duration || null,
          scrollDepth: body.scrollDepth || null,
          country: body.country || '',
          city: body.city || '',
        },
      })

      return NextResponse.json({
        success: true,
        id: analyticsEntry.id,
      })
    }
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}

// GET - Retrieve analytics data for dashboard
export async function GET(request: NextRequest) {
  // If using external API, return mock data instead of Prisma queries
  if (USE_API) {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'

    // Return mock analytics data
    const mockData = {
      analytics: [],
      pagination: {
        page: 1,
        limit: 50,
        total: 0,
        pages: 0,
      },
      stats: {
        topPages: [
          { path: '/', _count: { id: 450 }, _avg: { duration: 120000 } },
          { path: '/about', _count: { id: 280 }, _avg: { duration: 95000 } },
          { path: '/work', _count: { id: 220 }, _avg: { duration: 150000 } },
          { path: '/blog', _count: { id: 180 }, _avg: { duration: 85000 } },
          { path: '/contact', _count: { id: 120 }, _avg: { duration: 60000 } },
        ],
        topSources: [
          { source: 'direct', _count: { id: 420 } },
          { source: 'google', _count: { id: 280 } },
          { source: 'linkedin', _count: { id: 150 } },
          { source: 'github', _count: { id: 100 } },
          { source: 'twitter', _count: { id: 50 } },
        ],
        totalViews: 1250,
        timeframe,
      },
    }

    return NextResponse.json(mockData)
  }

  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '30d'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    // Calculate date range
    const now = new Date()
    let startDate: Date
    switch (timeframe) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Get paginated analytics data
    const [analytics, totalCount] = await Promise.all([
      prisma.analytics.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
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

    // Get aggregated stats
    const [topPages, topSources, totalViews] = await Promise.all([
      // Top pages with average duration
      prisma.analytics.groupBy({
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
      }),

      // Top traffic sources
      prisma.analytics.groupBy({
        by: ['source'],
        where: {
          createdAt: {
            gte: startDate,
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
        take: 10,
      }),

      // Total views count
      prisma.analytics.count({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
      }),
    ])

    const response = {
      analytics,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      stats: {
        topPages,
        topSources,
        totalViews,
        timeframe,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Analytics retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    )
  }
}
