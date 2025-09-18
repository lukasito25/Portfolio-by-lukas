import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  withRateLimit,
  createApiResponse,
  createErrorResponse,
  getClientIdentifier,
} from '@/lib/api-middleware'
import { contactFormSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'

// POST /api/contact - Submit contact form
export const POST = withRateLimit(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = contactFormSchema.parse(body)

    // Get client information for spam protection
    const ipAddress = getClientIdentifier(req)
    const userAgent = req.headers.get('user-agent') || undefined

    // Create contact submission
    const submission = await prisma.contactSubmission.create({
      data: {
        ...data,
        ipAddress,
        userAgent,
      },
    })

    // Send notification email
    try {
      await sendContactEmail({
        name: data.name,
        email: data.email,
        subject: data.subject || 'New Contact Form Submission',
        message: data.message,
        phone: data.phone,
        company: data.company,
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return createApiResponse(
      {
        message: 'Contact form submitted successfully',
        id: submission.id,
      },
      201
    )
  } catch (error) {
    console.error('Error submitting contact form:', error)
    if (error instanceof Error && error.message.includes('validation')) {
      return createErrorResponse('Invalid form data', 400)
    }
    return createErrorResponse('Failed to submit contact form', 500)
  }
}, 'contact')
