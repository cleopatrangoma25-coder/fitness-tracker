#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Updating environment variables with Firebase configuration...');

const envPath = path.join(__dirname, '../apps/web/.env.local');

// Firebase configuration for staging environment
const firebaseConfig = {
  apiKey: 'AIzaSyBv-emUyOcZlOSed2QI0NesI4CPNO05CPY',
  authDomain: 'fitness-tracker-dev-4499e.firebaseapp.com',
  projectId: 'fitness-tracker-dev-4499e',
  storageBucket: 'fitness-tracker-dev-4499e.firebasestorage.app',
  messagingSenderId: '547911348305',
  appId: '1:547911348305:web:8e8b59ee17f8e03e6bc870'
};

// Create environment file content
const envContent = `# Firebase Configuration for Staging Environment
VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
`;

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Environment file updated successfully!');
  console.log(`📁 File location: ${envPath}`);
  console.log(`🌐 Project ID: ${firebaseConfig.projectId}`);
  console.log(`🔐 Auth Domain: ${firebaseConfig.authDomain}`);
} catch (error) {
  console.error('❌ Error updating environment file:', error.message);
  process.exit(1);
}

console.log('\n📋 Next steps:');
console.log('1. Rebuild the application: pnpm build');
console.log('2. Redeploy to staging: firebase deploy --only hosting');
console.log('3. Test the application at: https://fitness-tracker-dev-4499e.web.app'); 