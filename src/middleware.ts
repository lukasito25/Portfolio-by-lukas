import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const protectedRoutes = ['/admin', '/api/projects', '/api/blog']
const publicApiRoutes = [
  '/api/auth',
  '/api/contact',
  '/api/newsletter',
  '/api/analytics',
]

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl

  // Security headers for all responses
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Build page-view tracking context for real page navigations (not APIs,
  // assets, admin, or prefetches). This is also where we resolve the visitor's
  // edge geo (Vercel headers — populated in production; absent locally, where
  // the banner's ?geo=/?city= overrides fill in) and expose it as cookies for
  // the client-side location-campaign banner.
  const h = request.headers

  // Prefetch detection. `next-router-prefetch` alone is NOT reliable — it does
  // not consistently survive to the edge, which let the App Router prefetch a
  // page's whole nav and log a phantom view for every link. Check every signal:
  // Next's own headers, the legacy `purpose`, and `Sec-Purpose` (Speculation
  // Rules, which prefetches with Sec-Fetch-Dest: document).
  const secPurpose = h.get('sec-purpose') || ''
  const isPrefetch =
    Boolean(h.get('next-router-prefetch')) ||
    Boolean(h.get('x-middleware-prefetch')) ||
    h.get('purpose') === 'prefetch' ||
    secPurpose.includes('prefetch')

  // Positive navigation test, rather than trusting prefetch headers to be
  // absent. A real page load is Sec-Fetch-Dest: document; router prefetches and
  // RSC payload fetches are 'empty'. Clients that send no Sec-Fetch-Dest at all
  // (older Safari, curl, feed readers) fall back to "count it, unless it's an
  // RSC fetch" so they aren't silently dropped.
  const dest = h.get('sec-fetch-dest')
  const isNavigation = dest ? dest === 'document' : !h.get('rsc')

  // The admin dashboard renders the public nav and footer, so its own prefetches
  // would otherwise show up as visits to every page on the site.
  const fromAdmin = (() => {
    const referer = h.get('referer')
    if (!referer) return false
    try {
      return new URL(referer).pathname.startsWith('/admin')
    } catch {
      return false
    }
  })()

  // Opting out (see /privacy) stops analytics: no page-view record and no
  // session or returning-visitor cookie. The short-lived geo pair below is NOT
  // analytics — it decides which campaign banner a visitor sees, and that
  // banner is shown either way — so it survives the opt-out.
  const optedOut = request.cookies.get('pv_optout')?.value === '1'

  const isPageView =
    request.method === 'GET' &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.startsWith('/admin') &&
    !isPrefetch &&
    isNavigation &&
    !fromAdmin

  let pageView: Record<string, unknown> | null = null

  if (isPageView) {
    const country =
      request.headers.get('x-vercel-ip-country') || request.geo?.country || ''
    const city = decodeURIComponent(
      request.headers.get('x-vercel-ip-city') || request.geo?.city || ''
    )
    const params = request.nextUrl.searchParams
    const ref = params.get('ref')
    const base = { path: '/', sameSite: 'lax' as const }

    // Banner geo cookies (1h, client-readable)
    if (country)
      response.cookies.set('visitor-country', country, {
        ...base,
        maxAge: 3600,
      })
    if (city)
      response.cookies.set('visitor-city', city, { ...base, maxAge: 3600 })

    // Everything below is analytics. An opted-out visitor keeps the geo cookies
    // above (so campaign banners still work) but is otherwise untracked.
    if (!optedOut) {
      // First-party returning-visitor flag — read the INCOMING cookie (before
      // we refresh it), giving a 90-day rolling "seen before" window.
      const isReturning = Boolean(request.cookies.get('pv_seen'))
      response.cookies.set('pv_seen', '1', {
        ...base,
        maxAge: 60 * 60 * 24 * 90,
      })

      // Coarse session id (~30 min) to group one visit's page views.
      let sessionId = request.cookies.get('pv_sid')?.value || ''
      if (!sessionId) {
        sessionId = crypto.randomUUID()
        response.cookies.set('pv_sid', sessionId, { ...base, maxAge: 60 * 30 })
      }

      // Owner ("my own visits") flag — the dashboard hides these by default so
      // self-traffic doesn't inflate recruiter numbers. Two mechanisms, because
      // neither is reliable alone:
      //   - Visit `/?owner=1` once per device to set a 1-year cookie. Survives IP
      //     changes (mobile, VPN, travel) and is the recommended way in.
      //     `/?owner=0` clears it again.
      //   - OWNER_IPS (comma-separated env var) matches the edge client IP for
      //     devices where the cookie was never set or has been cleared. The IP is
      //     only compared in memory here and is never stored — see the schema,
      //     where ipAddress is deliberately left null.
      const ownerParam = params.get('owner')
      if (ownerParam === '1') {
        response.cookies.set('pv_owner', '1', {
          ...base,
          maxAge: 60 * 60 * 24 * 365,
        })
      } else if (ownerParam === '0') {
        response.cookies.set('pv_owner', '', { ...base, maxAge: 0 })
      }

      const ownerIps = (process.env.OWNER_IPS || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      const clientIp = (
        request.headers.get('x-vercel-forwarded-for') ||
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        ''
      )
        .split(',')[0]
        .trim()

      const isOwner =
        ownerParam === '1' ||
        (ownerParam !== '0' &&
          (Boolean(request.cookies.get('pv_owner')) ||
            (clientIp !== '' && ownerIps.includes(clientIp))))

      pageView = {
        path: pathname,
        country,
        city,
        ref: ref || null,
        source: params.get('utm_source') || (ref ? 'ref' : 'direct'),
        medium: params.get('utm_medium') || '',
        campaign: params.get('utm_campaign') || '',
        isReturning,
        isOwner,
        sessionId,
        referrer: request.headers.get('referer') || '',
        userAgent: request.headers.get('user-agent') || '',
      }
    }
  }

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
    // For admin pages, redirect to login (but exclude the login page itself)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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

  // Page-view tracking (opt out with ANALYTICS_ENABLED=false). Handed to
  // event.waitUntil so the edge runtime keeps the request alive until the write
  // completes — a bare un-awaited fetch here gets cancelled once the response is
  // returned, which silently dropped views (?ref= hits among them).
  if (pageView && process.env.ANALYTICS_ENABLED !== 'false') {
    event.waitUntil(trackPageView(request.nextUrl.origin, pageView))
  }

  return response
}

function trackPageView(
  origin: string,
  data: Record<string, unknown>
): Promise<void> {
  // Non-blocking for the visitor, but awaited by the runtime: the
  // /api/analytics route persists it (forwarding to the Cloudflare Worker in
  // production). Failures are swallowed — analytics must never affect the page
  // response.
  return fetch(`${origin}/api/analytics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(() => undefined)
    .catch(() => undefined)
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
