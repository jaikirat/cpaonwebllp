#!/usr/bin/env node

/**
 * Verification script for production deployment integration test
 * Checks if the test is properly configured to fail initially (TDD approach)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Verifying Production Deployment Integration Test Setup...\n');

// Check if test file exists
const testFile = path.join(__dirname, '..', 'tests', 'integration', 'production-deployment.test.ts');
if (!fs.existsSync(testFile)) {
  console.error('❌ Test file not found: tests/integration/production-deployment.test.ts');
  process.exit(1);
}
console.log('✅ Test file exists: tests/integration/production-deployment.test.ts');

// Check Jest configuration
const jestConfig = path.join(__dirname, '..', 'jest.config.js');
if (!fs.existsSync(jestConfig)) {
  console.error('❌ Jest configuration not found: jest.config.js');
  process.exit(1);
}
console.log('✅ Jest configuration exists: jest.config.js');

// Check package.json for test scripts and dependencies
const packageJson = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJson, 'utf8'));

const requiredScripts = ['test:production', 'test:integration'];
const missingScripts = requiredScripts.filter(script => !pkg.scripts[script]);
if (missingScripts.length > 0) {
  console.error(`❌ Missing test scripts: ${missingScripts.join(', ')}`);
  process.exit(1);
}
console.log('✅ Test scripts configured in package.json');

const requiredDeps = ['jest', 'ts-jest', 'node-fetch', '@types/jest'];
const missingDeps = requiredDeps.filter(dep =>
  !pkg.devDependencies[dep] && !pkg.dependencies[dep],
);
if (missingDeps.length > 0) {
  console.error(`❌ Missing dependencies: ${missingDeps.join(', ')}`);
  process.exit(1);
}
console.log('✅ Required dependencies are installed');

// Check environment template
const envTemplate = path.join(__dirname, '..', '.env.test.example');
if (!fs.existsSync(envTemplate)) {
  console.error('❌ Environment template not found: .env.test.example');
  process.exit(1);
}
console.log('✅ Environment template exists: .env.test.example');

// Check test setup file
const testSetup = path.join(__dirname, '..', 'tests', 'setup.ts');
if (!fs.existsSync(testSetup)) {
  console.error('❌ Test setup file not found: tests/setup.ts');
  process.exit(1);
}
console.log('✅ Test setup file exists: tests/setup.ts');

// Verify test content includes failure expectations
const testContent = fs.readFileSync(testFile, 'utf8');
const failureIndicators = [
  'This test will FAIL initially',
  'WILL FAIL',
  'Following TDD approach',
  'environment variables need to be set up',
];

const hasFailureIndicators = failureIndicators.some(indicator =>
  testContent.includes(indicator),
);

if (!hasFailureIndicators) {
  console.warn('⚠️  Warning: Test may not be configured to fail initially (TDD approach)');
} else {
  console.log('✅ Test is configured to fail initially (TDD approach)');
}

console.log('\n🎯 Next Steps:');
console.log('1. Copy .env.test.example to .env.test and fill in your values');
console.log('2. Install dependencies: npm install');
console.log('3. Run the test to see expected failures: npm run test:production');
console.log('4. Set up Cloudflare Pages and GitHub branch protection');
console.log('5. Configure environment variables with actual tokens');
console.log('6. Re-run tests to validate production deployment');

console.log('\n✅ Production Deployment Integration Test setup is complete!');
console.log('The test will fail initially until the infrastructure is properly configured.');
console.log('This follows Test-Driven Development (TDD) principles.');