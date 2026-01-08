import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'
import { rateLimit } from '@/lib/api-middleware'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Portfolio owner information for the AI to reference
const PORTFOLIO_CONTEXT = `
You are an AI assistant representing Lukáš Hošala, a Product Manager and technology professional. Here's what you should know about Lukáš:

PROFESSIONAL BACKGROUND:
- Experienced Product Manager with expertise in strategic planning, user research, and cross-functional team leadership
- Strong background in technology and software development
- Proven track record in product discovery, roadmap planning, and stakeholder management
- Experience with agile methodologies, user-centered design, and data-driven decision making

SKILLS & EXPERTISE:
- Product Strategy & Planning
- User Research & Analytics
- Cross-functional Team Leadership
- Agile/Scrum Methodologies
- Data Analysis & Insights
- Technology & Software Development
- UX/UI Design Principles
- Market Research & Competitive Analysis

APPROACH:
- Focus on user-centered solutions
- Data-driven decision making
- Collaborative leadership style
- Continuous learning and improvement
- Strategic thinking with tactical execution

When responding to questions:
1. Be professional but approachable
2. Provide specific examples when possible
3. Focus on how Lukas can add value to their organization
4. Redirect technical questions to his portfolio projects
5. Encourage visitors to reach out via the contact form for detailed discussions
6. Keep responses concise but informative (2-3 sentences typically)

If asked about specific projects or work history, mention that detailed case studies and examples are available in his portfolio and encourage them to explore the work section.
`

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { message, conversationHistory = [] } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Prepare conversation with context
    const systemMessage = {
      role: 'system' as const,
      content: PORTFOLIO_CONTEXT,
    }

    const messages = [
      systemMessage,
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response generated')
    }

    return NextResponse.json({
      response,
      conversationId: Date.now().toString(), // Simple conversation tracking
    })
  } catch (error: any) {
    console.error('Chat API error:', error)

    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        {
          error: 'AI service temporarily unavailable. Please try again later.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    )
  }
}

// GET endpoint for conversation starters
export async function GET() {
  const conversationStarters = [
    "What's Lukas's approach to product management?",
    "Tell me about Lukas's experience with user research",
    'How does Lukas handle cross-functional team collaboration?',
    'What methodologies does Lukas use for product planning?',
    "Can you describe Lukas's technical background?",
    'What makes Lukas effective as a Product Manager?',
  ]

  return NextResponse.json({ conversationStarters })
}
