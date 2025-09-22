# 🚀 Cloudflare D1 API Setup Instructions

## Prerequisites

1. Cloudflare account
2. Wrangler CLI: `npm install -g wrangler`
3. Node.js and npm

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd cloudflare-api
npm install
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Create D1 Database

```bash
npm run d1:create
```

This will output something like:

```
✅ Successfully created DB 'portfolio-db'
Created your database using D1's new storage backend.
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-database-id-here"
```

### 4. Update wrangler.toml

Copy the `database_id` from step 3 and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "your-actual-database-id"  # Replace this
```

### 5. Apply Database Schema

```bash
npm run d1:migrate
```

### 6. Seed Database with Initial Data

```bash
npm run d1:seed
```

### 7. Test Locally

```bash
npm run dev
```

Visit `http://localhost:8787` to test your API.

### 8. Deploy to Cloudflare

```bash
npm run deploy
```

## Environment Variables

Update these in `wrangler.toml`:

```toml
[vars]
CORS_ORIGIN = "https://portfolio-by-lukas.vercel.app"
API_SECRET = "your-secure-api-secret-here"
```

## API Endpoints

Your deployed API will be available at:
`https://portfolio-api.your-username.workers.dev`

### Public Endpoints:

- `GET /` - Health check
- `GET /projects` - All published projects
- `GET /projects/featured` - Featured projects
- `GET /projects/:slug` - Single project
- `GET /blog` - All published blog posts
- `GET /blog/featured` - Featured blog posts
- `GET /blog/:slug` - Single blog post

### Admin Endpoints (require Authorization header):

- `GET /admin/projects` - All projects (including drafts)
- `POST /admin/projects` - Create project
- `PUT /admin/projects/:id` - Update project
- `DELETE /admin/projects/:id` - Delete project

## Next Steps

1. Note your deployed API URL
2. Update your Vercel app to use this API
3. Add the API_SECRET to your Vercel environment variables
4. Test the integration

## Troubleshooting

- Check Cloudflare dashboard for deployment logs
- Use `wrangler tail` to see live logs
- Verify D1 database has data with `wrangler d1 execute portfolio-db --command="SELECT * FROM User LIMIT 1"`
