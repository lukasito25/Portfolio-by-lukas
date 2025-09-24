# Analytics Integration Guide

This document provides comprehensive information about the portfolio's analytics system, including built-in tracking capabilities and instructions for integrating external analytics services.

## Overview

The portfolio includes a comprehensive analytics system that tracks user engagement, project views, form submissions, and page performance. The system is designed to be privacy-friendly and provides both real-time tracking and historical data analysis.

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

The admin analytics dashboard (`/admin/analytics`) provides:

- **Key Metrics**: Total views, unique visitors, session duration
- **Top Pages**: Most visited pages with average duration
- **Traffic Sources**: Breakdown of visitor referrers
- **Recent Activity**: Real-time visitor activity feed

## API Endpoints

### Analytics Data Collection

```
POST /api/analytics
```

**Request Body:**

```json
{
  "path": "/",
  "title": "Portfolio Home",
  "sessionId": "session_1234567890_abc123",
  "referrer": "https://google.com",
  "source": "google",
  "medium": "organic",
  "duration": 30000,
  "scrollDepth": 75,
  "country": "US",
  "city": "San Francisco"
}
```

### Analytics Data Retrieval

```
GET /api/analytics?timeframe=30d&page=1&limit=50
```

**Response:**

```json
{
  "analytics": [
    /* analytics entries */
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1234,
    "pages": 25
  },
  "stats": {
    "topPages": [
      /* page statistics */
    ],
    "topSources": [
      /* traffic sources */
    ],
    "totalViews": 1234,
    "timeframe": "30d"
  }
}
```

## Database Schema

### Analytics Table

```sql
model Analytics {
  id          String   @id @default(cuid())
  path        String
  title       String?
  sessionId   String
  ipAddress   String?
  userAgent   String?
  country     String?
  city        String?
  referrer    String?
  source      String?
  medium      String?
  campaign    String?
  duration    Int?
  scrollDepth Int?
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
