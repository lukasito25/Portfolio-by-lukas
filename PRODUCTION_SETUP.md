# 🔐 Production Admin Access Setup

## Step 1: Vercel Environment Variables

Add these in your **Vercel Dashboard > Settings > Environment Variables**:

```bash
# Authentication (Required)
NEXTAUTH_SECRET=your-secure-random-secret-here
NEXTAUTH_URL=https://your-domain.vercel.app

# Admin Credentials (Required)
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password

# Database (Required for SQLite)
DATABASE_URL=file:./dev.db
```

## Step 2: Generate Secure Secret

Run this to generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Or visit: https://generate-secret.vercel.app/32

## Step 3: Deploy and Access

1. **Deploy to Vercel**: The build process will automatically:
   - Generate Prisma client
   - Initialize the database schema
   - Seed the database with your admin user

2. **Access Admin Panel**: Visit `https://your-domain.vercel.app/admin/login`

3. **Login**: Use your ADMIN_EMAIL and ADMIN_PASSWORD from step 1

4. **Start Editing**: Navigate to `/admin/editor` to manage your content

## Current Development Credentials

- Email: `admin@example.com`
- Password: `admin123`

## How the Production Setup Works

The build process (`npm run build`) automatically:

1. Generates the Prisma client
2. Pushes the database schema to SQLite
3. Seeds the database with initial data including your admin user
4. Builds the Next.js application

Your admin user is created using the environment variables you set in Vercel, ensuring secure access to the admin panel.

## Security Notes

- Use a strong, unique password for production
- NEXTAUTH_SECRET should be different for each environment
- Admin credentials are hashed with bcrypt (12 rounds)
- Session tokens are JWT-based for stateless authentication

## Troubleshooting

If login fails:

1. Check environment variables in Vercel
2. Ensure DATABASE_URL is set correctly
3. Verify your domain in NEXTAUTH_URL
4. Check deployment logs for seed script execution
