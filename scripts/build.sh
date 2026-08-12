#!/bin/bash

# Production build script for portfolio
echo "🚀 Starting production build..."

# Set default DATABASE_URL if not provided
export DATABASE_URL=${DATABASE_URL:-"file:./dev.db"}

echo "📦 Generating Prisma client..."
npx prisma generate

echo "🗄️ Setting up database..."
npx prisma db push

echo "🌱 Seeding database..."
npm run db:seed

echo "🏗️ Building Next.js application..."
# The script has no `set -e` because the seeding steps above are allowed to be
# noisy without failing a deploy. The Next build is different: without this
# check a compile error still exited 0 and printed "success", so `npm run build`
# — the verification gate before shipping — passed on a broken app.
if ! npx next build; then
  echo "❌ Next.js build failed."
  exit 1
fi

echo "✅ Build completed successfully!"