#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const envPath = path.join(__dirname, '../apps/web/.env.local');
const envExamplePath = path.join(__dirname, '../apps/web/env.example');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Please update it manually with your Firebase configuration.');
  console.log('📋 Use the template in apps/web/env.example as a reference.');
  return;
}

// Copy the example file
if (fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env.local from template');
  console.log('📝 Please edit apps/web/.env.local with your Firebase configuration values');
} else {
  console.log('❌ env.example not found. Creating basic .env.local template...');
  
  const basicEnvContent = `# Firebase Configuration
# Copy this file to .env.local and fill in your Firebase project values

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
`;

  fs.writeFileSync(envPath, basicEnvContent);
  console.log('✅ Created basic .env.local template');
}

console.log('\n📋 Next steps:');
console.log('1. Edit apps/web/.env.local with your Firebase configuration');
console.log('2. Get your Firebase config from: https://console.firebase.google.com/');
console.log('3. Run: pnpm dev'); 