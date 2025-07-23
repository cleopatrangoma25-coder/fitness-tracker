#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating .env.local file...');

const envPath = path.join(__dirname, '../apps/web/.env.local');

const envContent = `# Firebase Configuration for Staging Environment
# Development Project: fitness-tracker-dev-4499e
# 
# IMPORTANT: Replace the placeholder values below with your actual Firebase configuration
# Get these values from: https://console.firebase.google.com/project/fitness-tracker-dev-4499e/settings/general

NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_placeholder_key_replace_with_actual
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=fitness-tracker-dev-4499e.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=fitness-tracker-dev-4499e
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=fitness-tracker-dev-4499e.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Instructions:
# 1. Go to https://console.firebase.google.com/project/fitness-tracker-dev-4499e/settings/general
# 2. Scroll down to "Your apps" section
# 3. Click on your web app (or create one if it doesn't exist)
# 4. Copy the configuration values and replace the placeholders above
# 5. Save the file and run: pnpm deploy:staging
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created apps/web/.env.local');
  console.log('📝 Please edit the file with your actual Firebase configuration values');
  console.log('🔗 Get your config from: https://console.firebase.google.com/project/fitness-tracker-dev-4499e/settings/general');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
  process.exit(1);
} 