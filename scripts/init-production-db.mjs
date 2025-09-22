#!/usr/bin/env node

/**
 * Production database initialization script
 * This ensures the database is properly set up for production deployment
 */

import { execSync } from 'child_process';
import path from 'path';

async function initProductionDatabase() {
  console.log('🚀 Initializing production database...');

  try {
    // Ensure we're in the right directory
    process.chdir(path.dirname(__dirname));

    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Push database schema
    console.log('🗄️ Pushing database schema...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

    // Seed the database
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('✅ Production database initialized successfully!');

    // Log admin credentials for reference
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log(`
🔑 Admin Credentials:
Email: ${adminEmail}
Password: ${adminPassword}

📱 Access the admin panel at: /admin/login
    `);

  } catch (error) {
    console.error('❌ Failed to initialize production database:', error.message);
    process.exit(1);
  }
}

// Only run if this script is executed directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  initProductionDatabase();
}

export { initProductionDatabase };