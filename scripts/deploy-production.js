#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to PRODUCTION...');

// Check if environment variables are set up
const envPath = path.join(__dirname, '../apps/web/.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local not found. Please run: pnpm setup:env');
  process.exit(1);
}

// Read current environment configuration
const envContent = fs.readFileSync(envPath, 'utf8');

// Check if this is production configuration
if (envContent.includes('fitness-tracker-dev-4499e')) {
  console.log('⚠️  Current environment is configured for development');
  console.log('🔄 Updating environment for production deployment...');
  
  // Update environment variables for production
  const productionEnv = envContent
    .replace(/fitness-tracker-dev-4499e/g, 'fitness-tracker-11c7a')
    .replace(/547911348305/g, '785812522585')
    .replace(/AIzaSyBv-emUyOcZlOSed2QI0NesI4CPNO05CPY/g, 'AIzaSyCV6dPnopH-sKyuhWRX2lXMIJ_vo5d9wfk')
    .replace(/8e8b59ee17f8e03e6bc870/g, '61a3365c8ac50cc8529348');
  
  // Create backup of current config
  fs.writeFileSync(envPath + '.backup', envContent);
  console.log('✅ Backup created: .env.local.backup');
  
  // Update with production config
  fs.writeFileSync(envPath, productionEnv);
  console.log('✅ Environment updated for production');
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
    console.error('📋 Please update apps/web/.env.local with your production Firebase configuration');
    console.error('🔗 Get your production config from: https://console.firebase.google.com/project/fitness-tracker-11c7a/overview');
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

// Deploy to Firebase production environment
console.log('🌐 Deploying to Firebase PRODUCTION environment...');
try {
  execSync('firebase use production', { stdio: 'inherit' });
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ PRODUCTION deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}

// Post-deployment verification
console.log('🔍 Verifying production deployment...');
try {
  const projectInfo = execSync('firebase projects:list --json', { encoding: 'utf8' });
  const projects = JSON.parse(projectInfo);
  const currentProject = projects.result.find(p => p.projectId === 'fitness-tracker-11c7a');
  
  if (currentProject) {
    console.log(`✅ Firebase production project accessible: ${currentProject.projectId}`);
    console.log(`✅ Project name: ${currentProject.displayName}`);
  } else {
    console.warn('⚠️  Could not verify Firebase production project access');
  }
} catch (error) {
  console.warn('⚠️  Could not verify Firebase project access:', error.message);
}

console.log('\n🎉 PRODUCTION Deployment Summary:');
console.log('✅ Environment variables verified');
console.log('✅ Firebase configuration validated');
console.log('✅ Application built successfully');
console.log('✅ Deployed to Firebase Hosting (PRODUCTION)');
console.log('\n🌐 Your PRODUCTION app is live at: https://fitness-tracker-11c7a.web.app');
console.log('🔐 Test authentication at: https://fitness-tracker-11c7a.web.app/auth');
console.log('🐛 Debug issues at: https://fitness-tracker-11c7a.web.app/debug');
console.log('\n📋 Production verification checklist:');
console.log('1. Test user registration and login');
console.log('2. Verify profile management works');
console.log('3. Check protected routes');
console.log('4. Test workout features');
console.log('5. Verify data persistence');
console.log('6. Check performance and loading times');
console.log('\n⚠️  IMPORTANT: This is PRODUCTION - all data will be real user data!'); 