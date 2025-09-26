#!/usr/bin/env node
/**
 * Utility script to generate bcrypt hash for admin password
 * Usage: node scripts/hash-password.js "your-password-here"
 */

const bcrypt = require('bcryptjs');

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('❌ Please provide a password as an argument');
  console.log('Usage: node scripts/hash-password.js "your-password-here"');
  process.exit(1);
}

// Generate bcrypt hash with salt rounds of 12 (same as in production)
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }

  console.log('✅ Password hash generated successfully!');
  console.log('');
  console.log('📝 Use this information to update your production database:');
  console.log('');
  console.log('Email:', 'lukas.hosala@icloud.com');
  console.log('Password (plaintext):', password);
  console.log('Password (bcrypt hash):', hash);
  console.log('');
  console.log('🔒 Keep the plaintext password secure and use the hash in the database.');
});