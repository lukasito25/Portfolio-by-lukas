import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Session } from 'next-auth'
import { authOptions } from './auth'
import { RateLimiterMemory } from 'rate-limiter-flexible'

// Rate limiter instances
const rateLimiters = {
  general: new RateLimiterMemory({
    points: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '30'),
    duration: 60,
  }),
  contact: new RateLimiterMemory({
    points: 5, // 5 contact form submissions per hour
    duration: 3600,
  }),
  newsletter: new RateLimiterMemory({
    points: 3, // 3 newsletter signups per hour
    duration: 3600,
  }),
}

type AuthenticatedHandler = (
  req: NextRequest,
  session: Session
) => Promise<Response>

export async function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, session)
  }
}

type RateLimitedHandler = (
  req: NextRequest,
  ...args: unknown[]
) => Promise<Response>

export async function withRateLimit(
  handler: RateLimitedHandler,
  limiterType: keyof typeof rateLimiters = 'general'
) {
  return async (req: NextRequest, ...args: unknown[]) => {
    if (process.env.RATE_LIMIT_ENABLED === 'true') {
      const identifier = getClientIdentifier(req)
      const limiter = rateLimiters[limiterType]

      try {
        await limiter.consume(identifier)
      } catch {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        )
      }
    }

    return handler(req, ...args)
  }
}

type CorsHandler = (req: NextRequest, ...args: unknown[]) => Promise<Response>

export function withCors(handler: CorsHandler) {
  return async (req: NextRequest, ...args: unknown[]) => {
    const origin = req.headers.get('origin')
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',')

    if (origin && allowedOrigins.includes(origin)) {
      const response = await handler(req, ...args)
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
      )
      return response
    }

    return handler(req, ...args)
  }
}

export function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip')
  return ip || 'anonymous'
}

export function createApiResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status })
}

export function createErrorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}
