# Analytics Integration Guide

This document provides comprehensive information about the portfolio's analytics system, including built-in tracking capabilities and instructions for integrating external analytics services.

## Overview

The portfolio includes a comprehensive analytics system that tracks user engagement, project views, form submissions, and page performance. The system is designed to be privacy-friendly and provides both real-time tracking and historical data analysis.

### Two systems in production

1. **Vercel Web Analytics** — `<Analytics />` is mounted in `src/app/layout.tsx`; aggregate page views + country breakdown in the Vercel dashboard (cookieless). Enable once in the Vercel dashboard (Project → Analytics).
2. **Self-owned analytics** (this doc) — every page view is recorded to the Cloudflare **D1 `Analytics` table** and surfaced at `/admin/analytics`, with **per-page country breakdown, `?ref=` recruiter-link attribution, UTM, and new-vs-returning**.

### Production data flow

`middleware.ts` (resolves country/city from Vercel edge headers, `?ref=`/UTM query params, and a first-party 90-day returning-visitor cookie) → `POST /api/analytics` → **Cloudflare Worker** `/analytics` → **D1**. The dashboard reads `GET /api/analytics` (admin-only) → Worker `/analytics/summary`.

Storage is chosen by `NODE_ENV` + presence of `API_SECRET`: **production** → Worker/D1; **local dev** → Prisma/SQLite (so the dashboard works in dev). The only Vercel env var required is `API_SECRET` (matching the Worker's secret); the Worker URL has a built-in fallback. The Worker lives in `cloudflare-api/` (git-ignored) and is deployed with `wrangler` — see **CUSTOM_RECRUITER_PAGES.md §10** for the full flow, the `?ref=` convention, and the `sink` troubleshooting field.

### `?ref=` is captured on every page, not just fit briefs

`middleware.ts` reads the parameter unconditionally — the only exclusions are the general ones (non-`GET`, `/api/*`, `/_next/*`, `/admin/*`, prefetches, non-navigations, opted-out visitors). So `/?ref=x` and `/about?ref=x` are recorded exactly like `/kraken?ref=x`.

The dashboard shows this two ways: the **Recruiter links** panel groups by `ref` alone, **totalling each token across all paths**, while the pages table groups by `path, ref`. Reusing one token across several briefs therefore pools the count — use a unique token per application (`?ref=zalando-li`, `?ref=ubp-email`) if you want per-application attribution. Values are stored verbatim, so a typo creates its own row.

## Built-in Analytics Features

### Current Analytics Capabilities

1. **Page View Tracking**
   - Automatic tracking of all page visits
   - Session-based tracking with unique session IDs
   - User agent and referrer information
   - Geographic data (when available)

2. **Project Interaction Tracking**
   - Project demo link clicks
   - Source code repository views
   - Project carousel navigation
   - Time spent viewing projects

3. **Contact Form Analytics**
   - Form submission success/failure tracking
   - Form field interaction monitoring
   - Conversion rate analysis

4. **Engagement Metrics**
   - Scroll depth tracking
   - Time on page
   - User interaction events
   - External link clicks

### Analytics Dashboard

The admin analytics dashboard (`/admin/analytics`, admin-only) provides:

- **Key metrics**: total page views, countries, ref-tagged views, returning %
- **Pages table**: per page — total views, **country breakdown** (with flags), and **`?ref=` tags used** (the "who looked, and from where" view)
- **Countries overview**: top countries across all pages
- **Recruiter links**: view counts grouped by `?ref=` tag
- **Recent visits**: latest visits with country, ref, source host, device, dwell/scroll, returning flag, a **confirmed / unconfirmed / bot** badge, and a **local-time timestamp with its timezone** (e.g. `Jul 27, 2026, 11:25 AM GMT+2`)
- **Own-visit filter**: your own visits are **excluded from every figure by default**; the header shows how many were held back and the **My visits hidden / shown** button toggles them back in
- **Bot filter**: automated traffic is likewise excluded by default, with a **Bots hidden / shown** toggle and a per-reason breakdown (`cli 2 · crawler 1 · email-scanner 1`)
- **Visitors**: unique sessions, pages-per-visit, average dwell and scroll, and entry pages
- **Sources**: referring host (`linkedin.com`, `direct`) plus a UTM `source / medium / campaign` breakdown
- **Devices**: type, browser and OS, parsed from the user agent
- **Pages table**: adds **avg. time** and **avg. scroll** per page — the strongest signal a recruiter actually read a brief

### Excluding your own visits

Self-traffic would otherwise inflate the recruiter numbers, so each view is tagged
`isOwner` and hidden from the dashboard unless you ask for it. Two mechanisms, because
neither is reliable on its own:

| Mechanism  | How to enable                                   | Notes                                                                                     |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Cookie** | Visit **`/?owner=1`** once per device/browser   | 1-year cookie; survives IP changes, VPNs, travel. `/?owner=0` clears it. **Recommended.** |
| **IP**     | Set **`OWNER_IPS`** (comma-separated) in Vercel | Catches devices where the cookie was never set or was cleared. Optional.                  |

Owner rows are tagged **`you`** in the recent-visits list when shown. Privacy is unchanged:
the IP is compared in memory in `middleware.ts` and is still never stored — `ipAddress`
remains null in every row.

### Visitor opt-out

The site sets no advertising or cross-site cookies, so its analytics sit inside the
**audience-measurement exemption** from prior consent that the Italian Garante and the
French CNIL recognise — first-party only, aggregate, not shared, short-lived. That
exemption is conditional on visitors being able to refuse, so there is a real opt-out.

**There is deliberately no cookie consent banner.** One was built and then removed: it
competed for the same screen corner as the geo campaign banner, and the exemption means a
pop-up isn't required. Disclosure lives on `/privacy`, which the footer links from every
page, and the opt-out control sits there.

| Piece                   | Where                                                          |
| ----------------------- | -------------------------------------------------------------- |
| Opt-out state + helpers | `src/lib/consent.ts` (`pv_optout` cookie, 1 year)              |
| Reversible control      | `src/components/analytics-opt-out.tsx`, rendered on `/privacy` |

Opting out sets `pv_optout=1` and clears `pv_sid` and `pv_seen`. `middleware.ts` then
skips the analytics branch, so **no page view is recorded and neither cookie is re-set**.
The beacon checks it too.

**Scope, deliberately narrow:** the 1-hour `visitor-country` / `visitor-city` cookies are
_not_ cleared and keep being set. They are personalisation rather than measurement, and
the geo campaign banner they drive is shown to every visitor regardless of opt-out. The
privacy page states this explicitly rather than implying a broader opt-out than exists.

> **`?ref=` must stay person-agnostic.** `/privacy` states these tags "do not contain names
> and are not used to identify individual people". Use channel or page labels
> (`recruiter`, `linkedin-post`, `application`). A personal name would make that statement
> false and turn an exempt measurement tag into personal data.

### Filtering automated traffic

Tracking happens **server-side** in `middleware.ts`, so anything that issues an HTTP request
is recorded — CLI tools, crawlers, uptime monitors and email link scanners included. At one
point **34% of stored rows were automated** and were being counted as real visitors. (The
single largest contributor was a `curl` deploy-polling loop hitting the site every 15
seconds.) Hosted tools like GA4 or Plausible don't have this problem because they track
client-side; that difference, not the vendor, is the quality lever.

Two independent signals, because neither is sufficient alone:

| Signal                                                                                    | Catches                                                                                                                         | Misses                                |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **User-agent classification** (`src/lib/analytics-classify.ts`, runs in `/api/analytics`) | Declared bots and CLI tools — `curl`, `wget`, python, Googlebot, GPTBot/ClaudeBot, Slackbot, Outlook SafeLinks, headless Chrome | Scanners presenting a real browser UA |
| **Client beacon** (`src/components/analytics/page-view-beacon.tsx`)                       | Anything that doesn't execute JavaScript — i.e. exactly those spoofing scanners                                                 | Visitors who block JS                 |

`botReason` records _why_ a row was flagged (`cli`, `crawler`, `ai-bot`, `fetcher`,
`email-scanner`, `headless`, `empty-ua`), so filtering is auditable rather than a silent
drop. Bots are **stored and hidden**, never discarded — toggle **Bots shown** to inspect them.

Classification lives in the API route, not middleware: the middleware bundle is edge runtime
and `ua-parser-js` would bloat it. The route is Node and already receives the user agent.

### The client beacon (engagement + human confirmation)

`<PageViewBeacon/>` is mounted once in `src/app/layout.tsx`. It **never creates a row** — it
confirms the most recent matching one via `POST /api/analytics` with `{type:'confirm'}` →
Worker `POST /analytics/confirm`, matched on the `pv_sid` cookie + path within 30 minutes.
It reports **dwell time** and **max scroll depth**, which can only be measured client-side.

`isHuman` is a **confidence badge and optional filter, not the default filter** — a
privacy-conscious visitor blocking JS would otherwise vanish from the figures. The default
view excludes owner traffic and _declared_ bots; UA-spoofing scanners then surface as
**unconfirmed** rather than being silently dropped.

> **Timestamps.** D1/SQLite writes `CURRENT_TIMESTAMP` as `YYYY-MM-DD HH:MM:SS` in UTC with
> **no timezone marker**. `new Date()` parses that shape as _local_ time, which previously
> made every visit render shifted by the viewer's UTC offset — 2 hours behind in CEST. The
> admin GET endpoint now normalizes those values to explicit ISO-8601 UTC (`…Z`) before they
> reach the client, and the dashboard renders them with the zone shown.

## API Endpoints

### Analytics Data Collection

```
POST /api/analytics
```

Normally fired automatically by `middleware.ts` for real page navigations; the body it sends:

**Request Body:**

```json
{
  "path": "/genius",
  "sessionId": "…",
  "referrer": "https://linkedin.com",
  "source": "ref",
  "medium": "",
  "campaign": "",
  "ref": "recruiter",
  "isReturning": false,
  "isOwner": false,
  "country": "GB",
  "city": "London",
  "userAgent": "…"
}
```

**Response** — includes a non-secret `sink` field showing where the write went (`worker-ok`, `worker-<status>`, `prisma-ok`, or `error:dev-prisma`):

```json
{ "success": true, "sink": "worker-ok" }
```

### Analytics Data Retrieval (admin-only)

```
GET /api/analytics?timeframe=30d
```

Requires an admin session (401 otherwise). Returns the aggregated summary the dashboard renders:

```json
{
  "timeframe": "30d",
  "totalViews": 1234,
  "ownerViews": 18,
  "includeOwner": false,
  "newVsReturning": { "new": 1000, "returning": 234 },
  "pages": [
    {
      "path": "/genius",
      "views": 42,
      "avgDuration": null,
      "countries": [{ "country": "GB", "views": 30 }],
      "refs": [{ "ref": "recruiter", "views": 3 }]
    }
  ],
  "countries": [{ "country": "GB", "views": 300 }],
  "refs": [{ "ref": "recruiter", "views": 3 }],
  "recent": [
    /* latest 25 visits: path, country, city, ref, source, referrer, isReturning,
       isOwner, createdAt (ISO-8601 UTC, e.g. "2026-07-27T09:25:00Z") */
  ]
}
```

`totalViews` and every aggregate exclude owner visits unless the request carries
`?includeOwner=1`; `ownerViews` always reports how many exist in the window.

## Database Schema

### Analytics Table

Mirrored in Prisma (`prisma/schema.prisma`, dev) and D1 (`cloudflare-api/migrations/schema.sql` + `add_analytics_ref_returning.sql` + `add_analytics_owner.sql`, prod). `ref` and `isReturning` were added for recruiter-link attribution and the returning-visitor signal; `isOwner` marks your own visits so they can be excluded. **`ipAddress` is intentionally left null in production** — only country/city (from the edge) and a coarse session id are stored.

```prisma
model Analytics {
  id          String   @id @default(cuid())
  path        String
  title       String?
  sessionId   String
  ipAddress   String?  // not stored in prod (privacy)
  userAgent   String?
  country     String?
  city        String?
  referrer    String?
  source      String?
  medium      String?
  campaign    String?
  ref         String?  // per-recruiter ?ref= tag
  isReturning Boolean  @default(false) // first-party 90-day returning visitor
  isOwner     Boolean  @default(false) // the owner's own visit — hidden from the dashboard by default
  duration    Int?
  scrollDepth Int?
  bounce      Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

## External Analytics Integration

### Google Analytics 4 (GA4)

To integrate GA4:

1. **Install GA4 tracking**:

```bash
npm install gtag
```

2. **Add GA4 configuration** to `next.config.js`:

```javascript
const nextConfig = {
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
}
```

3. **Create GA4 tracking utility** (`lib/gtag.ts`):

```typescript
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

4. **Update analytics provider** to dual-track events:

```typescript
// In analytics provider
import * as gtag from '@/lib/gtag'

const trackEvent = (event: string, properties?: Record<string, any>) => {
  // Built-in tracking
  analytics.trackInteraction(
    'custom',
    event,
    JSON.stringify(properties || {}),
    properties
  )

  // GA4 tracking
  gtag.event({
    action: event,
    category: 'engagement',
    label: properties?.label,
    value: properties?.value,
  })
}
```

### Plausible Analytics

For privacy-focused analytics with Plausible:

1. **Add Plausible script** to `app/layout.tsx`:

```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="yourdomain.com"
          src="https://plausible.io/js/script.js"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

2. **Track custom events**:

```typescript
// Custom event tracking
declare global {
  interface Window {
    plausible: (
      event: string,
      options?: { props: Record<string, string> }
    ) => void
  }
}

export const trackPlausibleEvent = (
  event: string,
  props?: Record<string, string>
) => {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, { props })
  }
}
```

### Vercel Analytics

For seamless Vercel integration:

1. **Install Vercel Analytics**:

```bash
npm install @vercel/analytics
```

2. **Add to root layout**:

```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Privacy Considerations

### Data Collection Principles

1. **No Personal Information**: The system collects no personally identifiable information
2. **Session-Based Tracking**: Uses temporary session IDs, not persistent cookies
3. **Anonymized IP Addresses**: IP addresses are anonymized for geographic data only
4. **No Cross-Site Tracking**: All tracking is limited to the portfolio domain

### GDPR Compliance

The built-in analytics system is designed to be GDPR-compliant:

- No personal data collection
- No persistent tracking cookies
- Clear data retention policies
- User consent not required for anonymous analytics

### Data Retention

Analytics data retention policy:

- Raw analytics data: 12 months
- Aggregated statistics: 24 months
- Automatic cleanup of old data

## Performance Optimization

### Analytics Performance Tips

1. **Batch Events**: The system automatically batches analytics events to reduce API calls
2. **Lazy Loading**: Analytics scripts load only after page interaction
3. **Local Storage**: Temporary caching of events for offline resilience
4. **Minimal Payload**: Only essential data is transmitted

### Monitoring Analytics Performance

Track analytics system performance:

```typescript
// Monitor analytics API performance
const trackAnalyticsPerformance = () => {
  const start = performance.now()

  fetch('/api/analytics', {
    /* request */
  }).then(() => {
    const duration = performance.now() - start
    console.log(`Analytics request took ${duration}ms`)
  })
}
```

## Troubleshooting

### Common Issues

1. **Analytics Not Recording**
   - Check if analytics is enabled in production
   - Verify API endpoint is accessible
   - Ensure proper session ID generation

2. **Missing Data in Dashboard**
   - Confirm database connectivity
   - Check API endpoint responses
   - Verify proper data aggregation

3. **Performance Issues**
   - Monitor analytics API response times
   - Check for excessive event generation
   - Optimize database queries

### Debug Mode

Enable debug mode for analytics:

```typescript
// In analytics.ts
const isDebugMode = process.env.NODE_ENV === 'development'

if (isDebugMode) {
  console.log('Analytics event:', event)
}
```

## Migration Guide

### From Google Analytics Universal

To migrate from GA Universal to the built-in system:

1. **Export existing data** from GA Universal
2. **Map events** to the new analytics schema
3. **Update tracking codes** throughout the application
4. **Test thoroughly** in staging environment

### Adding External Analytics

To add external analytics alongside the built-in system:

1. **Maintain dual tracking** during transition period
2. **Compare data accuracy** between systems
3. **Gradually phase out** old tracking if desired
4. **Document changes** for team members

## Advanced Configuration

### Custom Event Tracking

Define custom events for specific portfolio interactions:

```typescript
// Custom project tracking
export const trackProjectInteraction = (projectId: string, action: string) => {
  trackEvent('project_interaction', {
    project_id: projectId,
    action: action,
    timestamp: Date.now(),
  })
}

// Custom conversion tracking
export const trackConversion = (type: string, value?: number) => {
  trackEvent('conversion', {
    conversion_type: type,
    value: value,
    page: window.location.pathname,
  })
}
```

### Analytics Middleware

Create middleware for advanced analytics processing:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Track page views at middleware level
  const response = NextResponse.next()

  // Add analytics headers
  response.headers.set('X-Analytics-Session', generateSessionId())
  response.headers.set('X-Analytics-Timestamp', Date.now().toString())

  return response
}
```

## Support and Maintenance

### Regular Maintenance Tasks

1. **Weekly**: Review analytics dashboard for anomalies
2. **Monthly**: Clean up old analytics data
3. **Quarterly**: Analyze traffic patterns and optimize tracking
4. **Annually**: Review privacy compliance and update policies

### Getting Help

For analytics system support:

1. **Check logs**: Review application logs for analytics errors
2. **Database queries**: Use direct database queries for data verification
3. **Performance monitoring**: Use APM tools to monitor analytics performance
4. **Documentation**: Refer to this guide for configuration questions

---

## Quick Start Checklist

- [ ] Analytics API endpoints working
- [ ] Dashboard displaying data correctly
- [ ] Project interaction tracking enabled
- [ ] Contact form analytics implemented
- [ ] External analytics integrated (optional)
- [ ] Privacy policy updated
- [ ] Performance monitoring in place
- [ ] Team trained on analytics dashboard

For questions or issues, please refer to the troubleshooting section or create an issue in the project repository.
