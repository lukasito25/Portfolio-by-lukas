import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Extract client information
    const userAgent = request.headers.get('user-agent') || ''
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ipAddress = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'

    // Create contact submission
    const contactSubmission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject || 'New Contact Form Submission',
        message: body.message,
        phone: body.phone || '',
        company: body.company || '',
        projectType: body.projectType || '',
        budgetRange: body.budgetRange || '',
        source: body.source || 'contact-form',
        ipAddress,
        userAgent,
        status: 'NEW',
      },
    })

    // Send email notification
    try {
      await sendContactEmail({
        name: body.name,
        email: body.email,
        subject: body.subject || 'New Contact Form Submission',
        message: body.message,
        phone: body.phone,
        company: body.company,
      })
      console.log('Contact email sent successfully')
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      // Continue execution even if email fails
    }

    console.log('New contact submission:', {
      id: contactSubmission.id,
      name: body.name,
      email: body.email,
      company: body.company,
      projectType: body.projectType,
    })

    return NextResponse.json({
      success: true,
      message: 'Contact submission received successfully',
      submissionId: contactSubmission.id,
    })
  } catch (error) {
    console.error('Contact submission error:', error)

    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Contact API is working',
    timestamp: new Date().toISOString(),
  })
}
