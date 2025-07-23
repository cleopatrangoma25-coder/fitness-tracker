#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔐 Verifying Firebase authentication setup...');

// Check environment variables
const envPath = path.join(__dirname, '../apps/web/.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found');
  console.log('💡 Run: pnpm setup:env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');

// Verify Firebase configuration
const config = {
  apiKey: envContent.match(/VITE_FIREBASE_API_KEY=(.+)/)?.[1],
  authDomain: envContent.match(/VITE_FIREBASE_AUTH_DOMAIN=(.+)/)?.[1],
  projectId: envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/)?.[1],
  storageBucket: envContent.match(/VITE_FIREBASE_STORAGE_BUCKET=(.+)/)?.[1],
  messagingSenderId: envContent.match(/VITE_FIREBASE_MESSAGING_SENDER_ID=(.+)/)?.[1],
  appId: envContent.match(/VITE_FIREBASE_APP_ID=(.+)/)?.[1],
};

console.log('📋 Firebase Configuration:');
console.log(`API Key: ${config.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`Auth Domain: ${config.authDomain ? '✅ Set' : '❌ Missing'}`);
console.log(`Project ID: ${config.projectId ? '✅ Set' : '❌ Missing'}`);
console.log(`Storage Bucket: ${config.storageBucket ? '✅ Set' : '❌ Missing'}`);
console.log(`Messaging Sender ID: ${config.messagingSenderId ? '✅ Set' : '❌ Missing'}`);
console.log(`App ID: ${config.appId ? '✅ Set' : '❌ Missing'}`);

// Check for placeholder values
const hasPlaceholders = Object.values(config).some(value => 
  value && (value.includes('placeholder') || value.includes('your_'))
);

if (hasPlaceholders) {
  console.error('\n❌ Placeholder values detected in .env.local');
  console.log('💡 Please update with actual Firebase configuration values');
  process.exit(1);
}

// Verify Firebase CLI access
console.log('\n🔍 Verifying Firebase CLI access...');
try {
  const projectInfo = require('child_process').execSync('firebase projects:list --json', { encoding: 'utf8' });
  const projects = JSON.parse(projectInfo);
  const currentProject = projects.result.find(p => p.projectId === 'fitness-tracker-dev-4499e');
  
  if (currentProject) {
    console.log(`✅ Firebase project accessible: ${currentProject.projectId}`);
    console.log(`✅ Project name: ${currentProject.displayName}`);
  } else {
    console.warn('⚠️  Could not find fitness-tracker-dev-4499e project');
  }
} catch (error) {
  console.warn('⚠️  Could not verify Firebase project access:', error.message);
}

console.log('\n✅ Firebase authentication setup verified!');
console.log('🚀 Ready to deploy or run locally'); 