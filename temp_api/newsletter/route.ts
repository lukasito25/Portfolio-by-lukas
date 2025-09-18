import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  withRateLimit,
  createApiResponse,
  createErrorResponse,
  getClientIdentifier,
} from '@/lib/api-middleware'
import { newsletterSchema } from '@/lib/validations'
import { sendWelcomeEmail } from '@/lib/email'

// POST /api/newsletter - Subscribe to newsletter
export const POST = withRateLimit(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = newsletterSchema.parse(body)

    const ipAddress = getClientIdentifier(req)

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email: data.email },
    })

    if (existingSubscription) {
      if (existingSubscription.subscribed) {
        return createErrorResponse('Email already subscribed', 409)
      } else {
        // Reactivate subscription
        const subscription = await prisma.newsletter.update({
          where: { email: data.email },
          data: {
            subscribed: true,
            name: data.name || existingSubscription.name,
            source: data.source || existingSubscription.source,
            ipAddress,
            subscribedAt: new Date(),
            unsubscribedAt: null,
          },
        })

        return createApiResponse({
          message: 'Successfully resubscribed to newsletter',
          id: subscription.id,
        })
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletter.create({
      data: {
        ...data,
        ipAddress,
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail({
        email: data.email,
        name: data.name,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if email fails
    }

    return createApiResponse(
      {
        message: 'Successfully subscribed to newsletter',
        id: subscription.id,
      },
      201
    )
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    if (error instanceof Error && error.message.includes('validation')) {
      return createErrorResponse('Invalid email data', 400)
    }
    return createErrorResponse('Failed to subscribe to newsletter', 500)
  }
}, 'newsletter')

// DELETE /api/newsletter - Unsubscribe from newsletter
export const DELETE = withRateLimit(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return createErrorResponse('Email parameter is required', 400)
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (!subscription || !subscription.subscribed) {
      return createErrorResponse('Email not found or already unsubscribed', 404)
    }

    await prisma.newsletter.update({
      where: { email },
      data: {
        subscribed: false,
        unsubscribedAt: new Date(),
      },
    })

    return createApiResponse({
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return createErrorResponse('Failed to unsubscribe from newsletter', 500)
  }
}, 'newsletter')
