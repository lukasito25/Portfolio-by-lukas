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

# Database (Already configured)
DATABASE_URL=file:./dev.db
```

## Step 2: Generate Secure Secret

Run this to generate NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

Or visit: https://generate-secret.vercel.app/32

## Step 3: Access Admin Editor

1. Visit: `https://your-domain.vercel.app/admin/editor`
2. Login with your ADMIN_EMAIL and ADMIN_PASSWORD
3. Start editing your portfolio content!

## Current Development Credentials

- Email: `admin@example.com`
- Password: `admin123`

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
