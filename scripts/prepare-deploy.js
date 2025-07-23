#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Preparing deployment...');

// Build all packages
console.log('📦 Building packages...');
try {
  execSync('pnpm build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

console.log('✅ Deployment preparation completed!'); 