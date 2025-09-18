import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'
import { prisma } from '@/lib/prisma'
import {
  withRateLimit,
  createApiResponse,
  createErrorResponse,
  getClientIdentifier,
} from '@/lib/api-middleware'
import { contactFormSchema } from '@/lib/validations'
import { sendContactEmail } from '@/lib/email'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// AI-powered lead qualification and categorization
async function qualifyLead(data: any) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      category: 'general',
      priority: 'medium',
      qualification_score: 50,
      suggestions: ['Follow up within 24 hours'],
      intent: 'unknown',
    }
  }

  try {
    const prompt = `
Analyze this contact form submission and provide lead qualification:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject || 'Not provided'}
Message: ${data.message}

Provide a JSON response with:
1. category: "recruitment", "consulting", "partnership", "general", "spam"
2. priority: "high", "medium", "low"
3. qualification_score: number from 0-100
4. intent: "hiring", "project_inquiry", "collaboration", "information_seeking", "spam"
5. suggestions: array of 2-3 follow-up suggestions

Consider factors like:
- Professional email domain vs generic email
- Company information provided
- Message quality and specificity
- Indicators of hiring intent (recruiter, HR, hiring manager terms)
- Project inquiry signals (budget, timeline, specific needs)
- Spam indicators (generic messages, suspicious patterns)
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      try {
        return JSON.parse(response)
      } catch {
        // Fallback if JSON parsing fails
        return {
          category: 'general',
          priority: 'medium',
          qualification_score: 60,
          suggestions: ['Review message content', 'Follow up within 24 hours'],
          intent: 'information_seeking',
        }
      }
    }
  } catch (error) {
    console.error('AI qualification error:', error)
  }

  // Fallback qualification
  return {
    category: 'general',
    priority: 'medium',
    qualification_score: 50,
    suggestions: ['Follow up within 24 hours'],
    intent: 'unknown',
  }
}

// Generate personalized follow-up suggestions
async function generateFollowUpSuggestions(qualification: any, data: any) {
  if (!process.env.OPENAI_API_KEY) {
    return [
      'Thank them for their interest',
      'Provide relevant portfolio examples',
      'Schedule a follow-up call',
    ]
  }

  try {
    const prompt = `
Based on this lead qualification, suggest 3 specific follow-up actions:

Category: ${qualification.category}
Intent: ${qualification.intent}
Priority: ${qualification.priority}
Name: ${data.name}
Company: ${data.company || 'Individual'}
Message: ${data.message}

Provide 3 specific, actionable follow-up suggestions tailored to this lead. Be concise and professional.
`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content
    if (response) {
      return response
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 3)
    }
  } catch (error) {
    console.error('Follow-up suggestions error:', error)
  }

  return [
    'Review their specific needs',
    'Share relevant case studies',
    'Schedule a consultation call',
  ]
}

// POST /api/contact - Submit contact form with AI enhancement
export const POST = withRateLimit(async (req: NextRequest) => {
  try {
    const body = await req.json()
    const data = contactFormSchema.parse(body)

    // Get client information for spam protection
    const ipAddress = getClientIdentifier(req)
    const userAgent = req.headers.get('user-agent') || undefined

    // AI-powered lead qualification
    const qualification = await qualifyLead(data)

    // Generate follow-up suggestions
    const followUpSuggestions = await generateFollowUpSuggestions(
      qualification,
      data
    )

    // Create contact submission with AI insights
    const submission = await prisma.contactSubmission.create({
      data: {
        ...data,
        ipAddress,
        userAgent,
        // Add AI-generated fields
        category: qualification.category,
        priority: qualification.priority,
        qualificationScore: qualification.qualification_score,
        intent: qualification.intent,
        aiSuggestions: followUpSuggestions,
      },
    })

    // Track this as a lead in analytics
    try {
      await fetch(`${req.nextUrl.origin}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          lead: {
            email: data.email,
            name: data.name,
            source: 'contact_form',
            score: qualification.qualification_score,
            status: 'new',
          },
        }),
      })
    } catch (analyticsError) {
      console.error('Failed to track lead in analytics:', analyticsError)
    }

    // Send enhanced notification email
    try {
      await sendContactEmail({
        name: data.name,
        email: data.email,
        subject: data.subject || 'New Contact Form Submission',
        message: data.message,
        phone: data.phone,
        company: data.company,
        // Include AI insights in email
        qualification,
        followUpSuggestions,
      })
    } catch (emailError) {
      console.error('Failed to send contact email:', emailError)
      // Don't fail the request if email fails, just log it
    }

    return createApiResponse(
      {
        message: 'Contact form submitted successfully',
        id: submission.id,
        qualification: {
          category: qualification.category,
          priority: qualification.priority,
          suggestions: followUpSuggestions.slice(0, 2), // Only return first 2 suggestions to user
        },
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
