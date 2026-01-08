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
npx next build --webpack

echo "✅ Build completed successfully!"