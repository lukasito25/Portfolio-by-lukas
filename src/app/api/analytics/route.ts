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
