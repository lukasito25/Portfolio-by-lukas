# 🌐 Cloudflare D1 Database Setup Guide

## Prerequisites

- Cloudflare account
- Wrangler CLI installed: `npm install -g wrangler`

## Step 1: Create D1 Database

```bash
# Login to Cloudflare
wrangler login

# Create a new D1 database
wrangler d1 create portfolio-db

# This will output something like:
# database_name = "portfolio-db"
# database_id = "your-database-id-here"
```

## Step 2: Generate Database Schema

```bash
# Generate the schema from Prisma
npx prisma generate sql > schema.sql

# Or manually export the schema:
npx prisma db push --create-only
```

## Step 3: Apply Schema to D1

```bash
# Apply the schema to your D1 database
wrangler d1 execute portfolio-db --file=schema.sql

# Or apply migrations individually
wrangler d1 execute portfolio-db --command="CREATE TABLE ..."
```

## Step 4: Update Environment Variables

In your Vercel environment variables, set:

```bash
DATABASE_URL="file:./local.db"  # For local development
```

For production, you'll use Cloudflare's D1 binding instead of a URL.

## Step 5: Seed the Database

```bash
# Run the seed script against D1
wrangler d1 execute portfolio-db --file=seed.sql
```

## Integration Options

### Option A: Deploy to Cloudflare Pages (Recommended)

- Deploy your Next.js app to Cloudflare Pages
- Use D1 binding directly
- Better integration with Cloudflare ecosystem

### Option B: Keep Vercel, Use D1 via API

- Create Cloudflare Worker API endpoints
- Call these endpoints from your Vercel app
- More complex but keeps your current deployment

## Next Steps

1. Choose integration option
2. Update your DATABASE_URL configuration
3. Test the connection
4. Deploy and verify

Would you like me to help with any specific step?
