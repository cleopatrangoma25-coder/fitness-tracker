#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to staging with authentication setup...');

// Check if environment variables are set up
const envPath = path.join(__dirname, '../apps/web/.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found. Please run: pnpm setup:env');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('your_api_key_here')) {
  console.error('❌ Please update apps/web/.env.local with your Firebase configuration values');
  console.error('📋 Get your Firebase config from: https://console.firebase.google.com/');
  process.exit(1);
}

// Verify Firebase configuration
console.log('🔐 Verifying Firebase configuration...');
try {
  const config = {
    apiKey: envContent.match(/VITE_FIREBASE_API_KEY=(.+)/)?.[1],
    authDomain: envContent.match(/VITE_FIREBASE_AUTH_DOMAIN=(.+)/)?.[1],
    projectId: envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/)?.[1],
    storageBucket: envContent.match(/VITE_FIREBASE_STORAGE_BUCKET=(.+)/)?.[1],
    messagingSenderId: envContent.match(/VITE_FIREBASE_MESSAGING_SENDER_ID=(.+)/)?.[1],
    appId: envContent.match(/VITE_FIREBASE_APP_ID=(.+)/)?.[1],
  };

  if (!config.apiKey || config.apiKey.includes('placeholder')) {
    console.error('❌ Invalid Firebase API key detected');
    process.exit(1);
  }

  if (!config.projectId || config.projectId.includes('placeholder')) {
    console.error('❌ Invalid Firebase project ID detected');
    process.exit(1);
  }

  console.log(`✅ Firebase project: ${config.projectId}`);
  console.log(`✅ Auth domain: ${config.authDomain}`);
} catch (error) {
  console.error('❌ Error verifying Firebase configuration:', error.message);
  process.exit(1);
}

// Build all packages
console.log('📦 Building packages...');
try {
  execSync('pnpm build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('💡 This might be due to Firebase configuration. Please check your .env.local file.');
  process.exit(1);
}

// Deploy to Firebase development environment
console.log('🌐 Deploying to Firebase development environment...');
try {
  execSync('firebase use development', { stdio: 'inherit' });
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Staging deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

// Post-deployment authentication verification
console.log('🔍 Verifying authentication setup...');
try {
  // Check if we can access Firebase project
  const projectInfo = execSync('firebase projects:list --json', { encoding: 'utf8' });
  const projects = JSON.parse(projectInfo);
  const currentProject = projects.result.find(p => p.projectId === 'fitness-tracker-dev-4499e');
  
  if (currentProject) {
    console.log(`✅ Firebase project accessible: ${currentProject.projectId}`);
    console.log(`✅ Project name: ${currentProject.displayName}`);
  } else {
    console.warn('⚠️  Could not verify Firebase project access');
  }
} catch (error) {
  console.warn('⚠️  Could not verify Firebase project access:', error.message);
}

console.log('\n🎉 Deployment Summary:');
console.log('✅ Environment variables verified');
console.log('✅ Firebase configuration validated');
console.log('✅ Application built successfully');
console.log('✅ Deployed to Firebase Hosting');
console.log('\n🌐 Your app is live at: https://fitness-tracker-dev-4499e.web.app');
console.log('🔐 Test authentication at: https://fitness-tracker-dev-4499e.web.app/auth');
console.log('🐛 Debug issues at: https://fitness-tracker-dev-4499e.web.app/debug');
console.log('\n📋 Next steps:');
console.log('1. Test user registration and login');
console.log('2. Verify profile management works');
console.log('3. Check protected routes');
console.log('4. Test workout features'); 