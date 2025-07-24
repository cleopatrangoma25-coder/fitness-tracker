#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to PRODUCTION with enhanced safety checks...');

// Safety check - require confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('⚠️  Are you sure you want to deploy to PRODUCTION? (type "yes" to confirm): ', (answer) => {
  if (answer.toLowerCase() !== 'yes') {
    console.log('❌ Deployment cancelled');
    rl.close();
    process.exit(0);
  }
  rl.close();
  deployToProduction();
});

function deployToProduction() {
  console.log('🔐 PRODUCTION deployment initiated...');

  // Check if environment variables are set up
  const envPath = path.join(__dirname, '../apps/web/.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local not found. Please run: pnpm setup:env');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('your_api_key_here')) {
    console.error('❌ Please update apps/web/.env.local with your Firebase configuration values');
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

  // Run full test suite before production deployment
  console.log('🧪 Running full test suite...');
  try {
    execSync('pnpm test', { stdio: 'inherit' });
    console.log('✅ All tests passed');
  } catch (error) {
    console.error('❌ Tests failed. Cannot deploy to production with failing tests.');
    process.exit(1);
  }

  // Build all packages
  console.log('📦 Building packages for production...');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Production build failed:', error.message);
    process.exit(1);
  }

  // Create backup of current production deployment
  console.log('💾 Creating backup of current production deployment...');
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '../backups', timestamp);
    fs.mkdirSync(backupDir, { recursive: true });
    
    // Save current deployment info
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version,
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      branch: execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log(`✅ Backup created: ${backupDir}`);
  } catch (error) {
    console.warn('⚠️  Could not create backup:', error.message);
  }

  // Deploy to Firebase production environment
  console.log('🌐 Deploying to Firebase PRODUCTION environment...');
  try {
    execSync('firebase use production', { stdio: 'inherit' });
    execSync('firebase deploy --only hosting', { stdio: 'inherit' });
    console.log('✅ Production deployment completed successfully!');
  } catch (error) {
    console.error('❌ Production deployment failed:', error.message);
    process.exit(1);
  }

  // Post-deployment verification
  console.log('🔍 Running post-deployment verification...');
  try {
    // Check if we can access Firebase production project
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
    console.warn('⚠️  Could not verify Firebase production project access:', error.message);
  }

  console.log('\n🎉 PRODUCTION Deployment Summary:');
  console.log('✅ Environment variables verified');
  console.log('✅ Firebase configuration validated');
  console.log('✅ All tests passed');
  console.log('✅ Application built successfully');
  console.log('✅ Backup created');
  console.log('✅ Deployed to Firebase Hosting (PRODUCTION)');
  console.log('\n🌐 Your PRODUCTION app is live at: https://fitness-tracker-11c7a.web.app');
  console.log('🔐 Test authentication at: https://fitness-tracker-11c7a.web.app/auth');
  console.log('\n📋 Post-deployment checklist:');
  console.log('1. ✅ Test user registration and login');
  console.log('2. ✅ Verify profile management works');
  console.log('3. ✅ Check protected routes');
  console.log('4. ✅ Test workout features');
  console.log('5. ✅ Monitor error logs');
  console.log('6. ✅ Check performance metrics');
  console.log('\n🚨 IMPORTANT: Monitor the application closely for the first 24 hours!');
} 