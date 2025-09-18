import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/api-middleware'
import { calculateLeadScore } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const {
      type,
      visitor,
      pageView,
      interaction,
      lead,
      visitorId,
      sessionId,
      timeOnPage,
      scrollDepth,
    } = await request.json()

    if (!type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    const now = new Date()

    switch (type) {
      case 'page_view':
        if (!visitor || !pageView) {
          return NextResponse.json(
            {
              error: 'Visitor and pageView data required for page_view events',
            },
            { status: 400 }
          )
        }

        // Upsert visitor
        const existingVisitor = await prisma.visitor.upsert({
          where: { id: visitor.id },
          update: {
            lastSeen: now,
            userAgent: visitor.userAgent,
            timezone: visitor.location?.timezone,
          },
          create: {
            id: visitor.id,
            sessionId: visitor.sessionId,
            userAgent: visitor.userAgent || '',
            referrer: visitor.referrer,
            deviceType: visitor.device?.type || 'unknown',
            browser: visitor.device?.browser || 'unknown',
            os: visitor.device?.os || 'unknown',
            screenResolution: visitor.device?.screenResolution || 'unknown',
            country: visitor.location?.country,
            city: visitor.location?.city,
            timezone: visitor.location?.timezone || 'UTC',
            firstSeen: now,
            lastSeen: now,
          },
        })

        // Create page view
        const newPageView = await prisma.pageView.create({
          data: {
            visitorId: visitor.id,
            sessionId: visitor.sessionId,
            path: pageView.path,
            title: pageView.title,
            timestamp: now,
            exitPage: false,
          },
        })

        return NextResponse.json({ success: true, id: newPageView.id })

      case 'interaction':
        if (!interaction) {
          return NextResponse.json(
            { error: 'Interaction data required for interaction events' },
            { status: 400 }
          )
        }

        const newInteraction = await prisma.interactionEvent.create({
          data: {
            visitorId: interaction.visitorId,
            sessionId: interaction.sessionId,
            type: interaction.type,
            element: interaction.element,
            value: interaction.value,
            timestamp: now,
            metadata: interaction.metadata || {},
          },
        })

        return NextResponse.json({ success: true, id: newInteraction.id })

      case 'lead':
        if (!lead) {
          return NextResponse.json(
            { error: 'Lead data required for lead events' },
            { status: 400 }
          )
        }

        // Calculate lead score
        const interactions = await prisma.interactionEvent.findMany({
          where: { visitorId: lead.visitorId },
        })

        const visitorData = await prisma.visitor.findUnique({
          where: { id: lead.visitorId },
        })

        if (!visitorData) {
          return NextResponse.json(
            { error: 'Visitor not found' },
            { status: 404 }
          )
        }

        const deviceData = {
          type: visitorData.deviceType,
          browser: visitorData.browser,
          os: visitorData.os,
          screenResolution: visitorData.screenResolution,
        }

        const locationData = {
          country: visitorData.country,
          city: visitorData.city,
          timezone: visitorData.timezone,
        }

        const mockVisitorData = {
          id: visitorData.id,
          sessionId: visitorData.sessionId,
          timestamp: visitorData.firstSeen,
          userAgent: visitorData.userAgent,
          referrer: visitorData.referrer,
          device: deviceData,
          location: locationData,
        }

        const mockInteractions = interactions.map(i => ({
          ...i,
          timestamp: i.timestamp,
        }))

        const score = calculateLeadScore(mockVisitorData, mockInteractions)

        const newLead = await prisma.lead.create({
          data: {
            visitorId: lead.visitorId,
            email: lead.email,
            name: lead.name,
            source: lead.source || 'portfolio',
            score,
            status: 'new',
            timestamp: now,
          },
        })

        return NextResponse.json({ success: true, id: newLead.id, score })

      case 'page_exit':
        if (!visitorId || !sessionId) {
          return NextResponse.json(
            { error: 'VisitorId and sessionId required for page_exit events' },
            { status: 400 }
          )
        }

        // Update the most recent page view for this visitor/session
        const lastPageView = await prisma.pageView.findFirst({
          where: {
            visitorId,
            sessionId,
            timeOnPage: null,
          },
          orderBy: {
            timestamp: 'desc',
          },
        })

        if (lastPageView) {
          await prisma.pageView.update({
            where: { id: lastPageView.id },
            data: {
              timeOnPage,
              scrollDepth,
              exitPage: true,
            },
          })
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json(
          { error: 'Invalid event type' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
