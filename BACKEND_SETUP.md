# Backend Setup Guide

This guide will help you set up the backend infrastructure for the portfolio website.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Resend account for email functionality (optional)

## Environment Setup

1. **Copy the environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables:**

   Edit `.env` with your actual values:

   ```bash
   # Database - Replace with your PostgreSQL connection string
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db?schema=public"

   # NextAuth.js - Generate a secure secret
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-32-character-secret-key-here"

   # Email Service (Optional - for contact forms)
   RESEND_API_KEY="re_your_api_key_here"

   # Admin Credentials (for seeding)
   ADMIN_EMAIL="your-admin@email.com"
   ADMIN_PASSWORD="secure_password"
   ```

## Database Setup

1. **Generate Prisma Client:**

   ```bash
   npm run db:generate
   ```

2. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

## Available Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:reset` - Reset database and re-seed

## API Endpoints

### Public Endpoints

- `GET /api/projects` - List published projects
- `GET /api/projects/[slug]` - Get project by slug
- `GET /api/blog` - List published blog posts
- `GET /api/blog/[slug]` - Get blog post by slug
- `GET /api/technologies` - List technologies
- `GET /api/tags` - List tags
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter?email=...` - Unsubscribe from newsletter
- `POST /api/analytics` - Track page views

### Admin Endpoints (Authentication Required)

- `POST /api/projects` - Create project
- `PUT /api/projects/[slug]` - Update project
- `DELETE /api/projects/[slug]` - Delete project
- `POST /api/blog` - Create blog post
- `PUT /api/blog/[slug]` - Update blog post
- `DELETE /api/blog/[slug]` - Delete blog post
- `POST /api/technologies` - Create technology
- `POST /api/tags` - Create tag

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- Admin login page: `/admin/login`

## Database Schema

### Core Models

- **User** - Admin users with authentication
- **Project** - Portfolio projects with rich content
- **BlogPost** - Blog articles with tags and categories
- **Technology** - Skills and technologies used
- **Tag** - Blog post tags
- **ContactSubmission** - Contact form submissions
- **Newsletter** - Email newsletter subscribers
- **Analytics** - Page view and engagement tracking
- **MediaFile** - File upload management

### Features

- **Content Management**: Full CRUD for projects and blog posts
- **SEO Optimization**: Meta tags, structured data support
- **Analytics**: Custom analytics tracking
- **Email Integration**: Contact forms and newsletter
- **File Management**: Image and media upload system
- **Rate Limiting**: Configurable rate limits for API endpoints
- **Security**: CORS, authentication, input validation

## Security Features

- **Authentication**: NextAuth.js with secure session management
- **Rate Limiting**: Configurable limits for different endpoint types
- **CORS**: Configurable allowed origins
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **XSS Protection**: Content sanitization and security headers

## Email Integration

The system uses Resend for email functionality:

1. **Contact Form**: Automatic email notifications for new submissions
2. **Newsletter**: Welcome emails and newsletter campaigns
3. **Auto-replies**: Confirmation emails for contact form submissions

To enable email functionality:

1. Sign up for a Resend account
2. Add your API key to `RESEND_API_KEY` in `.env`
3. Update the "from" email addresses in `src/lib/email.ts`

## Development Tips

1. **Database Management**: Use Prisma Studio for visual database management:

   ```bash
   npm run db:studio
   ```

2. **Schema Changes**: After updating `prisma/schema.prisma`:

   ```bash
   npm run db:migrate
   npm run db:generate
   ```

3. **Reset Everything**: To start fresh:
   ```bash
   npm run db:reset
   ```

## Production Deployment

1. **Environment Variables**: Set all production environment variables
2. **Database**: Use a production PostgreSQL database
3. **Email**: Configure production email settings
4. **Secrets**: Use strong, unique secrets for `NEXTAUTH_SECRET`
5. **CORS**: Update `ALLOWED_ORIGINS` for your production domain

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and connection string is correct
2. **Migration Errors**: Check database permissions and connection
3. **Email Issues**: Verify Resend API key and email configuration
4. **Authentication**: Ensure `NEXTAUTH_SECRET` is set and URLs are correct

### Useful Commands

```bash
# Check database connection
npx prisma db pull

# Format Prisma schema
npx prisma format

# View detailed migration status
npx prisma migrate status

# Reset and reseed database
npm run db:reset
```

## Next Steps

After setting up the backend:

1. Start the development server: `npm run dev`
2. Access the admin panel: `http://localhost:3000/admin/login`
3. Use the seeded admin credentials to log in
4. Explore the API endpoints with tools like Postman or curl
5. Customize the content and styling for your portfolio

The backend is now ready to power your professional portfolio website!
