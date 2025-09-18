import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const protectedRoutes = ['/admin', '/api/projects', '/api/blog']
const publicApiRoutes = [
  '/api/auth',
  '/api/contact',
  '/api/newsletter',
  '/api/analytics',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Security headers for all responses
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // CORS handling for API routes
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',')

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS'
      )
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With'
      )
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(
    route =>
      pathname.startsWith(route) &&
      !publicApiRoutes.some(publicRoute => pathname.startsWith(publicRoute))
  )

  if (isProtectedRoute) {
    // For admin pages, redirect to login
    if (pathname.startsWith('/admin')) {
      const token = await getToken({ req: request })

      if (!token || token.role !== 'ADMIN') {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }

    // For protected API routes, return 401
    if (pathname.startsWith('/api/')) {
      const token = await getToken({ req: request })

      if (!token || token.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401, headers: response.headers }
        )
      }
    }
  }

  // Analytics tracking for page views
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // Track page view (in a real app, you might want to do this client-side)
    trackPageView(request, pathname)
  }

  return response
}

async function trackPageView(request: NextRequest, pathname: string) {
  if (process.env.ANALYTICS_ENABLED !== 'true') {
    return
  }

  try {
    // Generate a session ID from IP and user agent
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    const sessionId = btoa(`${ip}:${userAgent}`).substring(0, 32)

    // Send analytics data to our API (fire and forget)
    fetch(`${request.nextUrl.origin}/api/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        sessionId,
        referrer: request.headers.get('referer'),
        userAgent,
      }),
    }).catch(error => {
      console.error('Failed to track page view:', error)
    })
  } catch (error) {
    console.error('Error in analytics tracking:', error)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}
