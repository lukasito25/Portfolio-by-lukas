# 🚀 Deployment Guide: Vercel + Cloudflare D1 Integration

## ✅ Completed Setup

1. **Cloudflare D1 Database**: Created and seeded with initial data
2. **Cloudflare Worker API**: Deployed at `https://portfolio-api.hosala-lukas.workers.dev`
3. **API Integration**: Working locally with fallback to Prisma

## 🔧 Required Vercel Environment Variables

To complete the integration, add these environment variables in your Vercel dashboard:

### Production Environment Variables

```env
# Cloudflare D1 API Configuration
NEXT_PUBLIC_API_URL=https://portfolio-api.hosala-lukas.workers.dev
API_SECRET=portfolio-api-secret-2024

# Enable API usage in production
NEXT_PUBLIC_USE_API=true

# Keep existing variables for fallback
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://portfolio-by-lukas.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret
```

## 📋 Step-by-Step Instructions

### 1. Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `portfolio-by-lukas` project
3. Navigate to **Settings** → **Environment Variables**
4. Add the new variables listed above
5. Select **Production** environment for each

### 2. Deploy to Production

After adding the environment variables:

```bash
# From your project root
git add .
git commit -m "🚀 Add Cloudflare D1 integration"
git push origin main
```

Vercel will automatically deploy with the new configuration.

### 3. Test Production Integration

Once deployed, test these endpoints:

- **Homepage**: `https://portfolio-by-lukas.vercel.app/` (should load data from D1)
- **Projects**: `https://portfolio-by-lukas.vercel.app/work` (should show project from D1)
- **Admin Login**: `https://portfolio-by-lukas.vercel.app/admin/login`
  - Email: `admin@example.com`
  - Password: `<ADMIN_PASSWORD>`

## 🔄 How the Integration Works

### Data Service Behavior

- **Production**: Uses Cloudflare D1 API (`NEXT_PUBLIC_USE_API=true`)
- **Development**: Uses local Prisma (`NEXT_PUBLIC_USE_API=false` or undefined)
- **Fallback**: If D1 API fails, automatically falls back to Prisma

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel App    │───▶│ Cloudflare D1   │───▶│   Global Edge   │
│  (Next.js 15)  │    │   Worker API    │    │    Network      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │
         ▼                        │
┌─────────────────┐              │
│ Local Prisma DB │◀─────────────┘
│   (Fallback)    │
└─────────────────┘
```

## 🛡️ Security Features

- **API Authentication**: Bearer token protection for admin endpoints
- **CORS Protection**: Restricted to your domain
- **Environment Separation**: Different configs for dev/prod
- **Graceful Fallback**: Never breaks if API is down

## 📊 Database Contents

The D1 database is pre-populated with:

- **Admin User**: `admin@example.com` / `<ADMIN_PASSWORD>`
- **Sample Project**: Portfolio Website
- **Technologies**: React, Next.js, TypeScript, etc.
- **Blog Post**: Cloudflare D1 tutorial

## 🔍 Monitoring & Debugging

### Cloudflare Dashboard

- View worker logs: [Cloudflare Workers Dashboard](https://dash.cloudflare.com/)
- Monitor D1 usage: Navigate to D1 section
- Check API performance and errors

### Vercel Logs

- Function logs: Vercel Dashboard → Functions
- Build logs: Vercel Dashboard → Deployments

## 🚀 Next Steps

1. **Add Environment Variables** to Vercel
2. **Deploy** and test the integration
3. **Verify Admin Access** works with D1 authentication
4. **Monitor Performance** in both dashboards
5. **Scale** as needed (D1 has generous free tier)

## 💡 Benefits Achieved

- **Edge Performance**: Database queries run at Cloudflare edge
- **Global Scale**: 300+ global locations
- **Zero Config**: No database management needed
- **Cost Effective**: Pay only for usage
- **Reliability**: Automatic fallback to local database
- **Security**: Isolated worker environment

Your portfolio is now running on a globally distributed, edge-optimized architecture! 🎉
