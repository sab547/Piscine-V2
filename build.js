#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Run the build
  execSync('next build', { stdio: 'inherit' });

  // Ensure the problematic directory exists
  const dashboardServerPath = path.join(process.cwd(), '.next/server/app/(dashboard)');
  if (!fs.existsSync(dashboardServerPath)) {
    fs.mkdirSync(dashboardServerPath, { recursive: true });
  }

  // Create a dummy manifest file if it doesn't exist
  const manifestPath = path.join(dashboardServerPath, 'page_client-reference-manifest.js');
  if (!fs.existsSync(manifestPath)) {
    fs.writeFileSync(manifestPath, '{}');
  }

  console.log('✓ Build completed successfully');
  process.exit(0);
} catch (error) {
  console.error('✗ Build failed:', error.message);
  process.exit(1);
}
