# Production Deployment Guide

## 🚀 SEO Optimizations Completed

✅ **Comprehensive SEO Meta Tags Added:**

- Global layout with template titles
- Page-specific metadata for all visible pages (Home, About, Skills, Work, Contact)
- Open Graph tags for social media sharing
- Twitter Card optimization
- Canonical URLs for all pages
- Structured keywords targeting Product Management and adidas Digital Sports

✅ **SEO Infrastructure:**

- Dynamic sitemap.xml generation (`/src/app/sitemap.ts`)
- Robots.txt configuration for optimal crawling
- Google verification ready (update verification code)

## 📋 Pre-Deployment Checklist

1. **Environment Variables (Required for Production):**

   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="https://lukashosala.com"
   NEXT_PUBLIC_USE_API="true"
   ```

2. **SEO Configuration Updates:**
   - Update Google verification code in `src/app/layout.tsx` (line 86)
   - Replace social media handles (@lukashosala) with actual handles
   - Add actual Open Graph images (`/og-image.jpg`, `/twitter-image.jpg`)

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
cd "/Users/lukashosala/Documents/Claude AI apps/Portfolio by Lukas"
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir .next
```

### Option 3: Traditional Hosting

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Post-Deployment Tasks

1. **Google Search Console:**
   - Submit sitemap: `https://lukashosala.com/sitemap.xml`
   - Verify robots.txt: `https://lukashosala.com/robots.txt`

2. **Social Media Verification:**
   - Test Open Graph: https://developers.facebook.com/tools/debug/
   - Test Twitter Cards: https://cards-dev.twitter.com/validator

3. **Performance Testing:**
   - Google PageSpeed Insights
   - Core Web Vitals assessment

4. **Analytics:**
   - Enable **Vercel Web Analytics** in the Vercel dashboard (Project → Analytics) — the `<Analytics/>` component is already deployed.
   - For the **self-owned analytics dashboard** (`/admin/analytics`): set the `API_SECRET` env var in Vercel (matching the Cloudflare Worker's secret) — this is the only env var it needs. The Worker URL has a built-in fallback.
   - Deploy the Cloudflare Worker (separate, git-ignored `cloudflare-api/`) whenever its analytics code changes:
     ```bash
     cd cloudflare-api
     npx wrangler d1 execute portfolio-db --remote --file=migrations/add_analytics_ref_returning.sql  # once
     npx wrangler deploy
     ```
   - Verify: `curl -sX POST https://<site>/api/analytics -H 'content-type: application/json' -d '{"path":"/","ref":"probe"}'` → expect `"sink":"worker-ok"`. Full details in `ANALYTICS.md` and `CUSTOM_RECRUITER_PAGES.md` §10.

## 📊 SEO Features Summary

- **Technical SEO:** Sitemap, robots.txt, canonical URLs
- **On-Page SEO:** Title templates, meta descriptions, structured data
- **Social SEO:** Open Graph, Twitter Cards
- **Content SEO:** Keyword-optimized for "Product Manager", "adidas Digital Sports", "Team Leadership"

Your portfolio is now SEO-optimized and ready for production deployment! 🚀
