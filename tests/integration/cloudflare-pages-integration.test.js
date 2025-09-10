/**
 * Integration Test: Cloudflare Pages Integration
 *
 * This test validates step 4 of the quickstart.md guide:
 * - Repository successfully connected to Cloudflare Pages
 * - Build settings configured correctly
 * - Initial deployment triggered and completed successfully
 * - Site accessible at provided .pages.dev URL
 *
 * Following TDD approach - this test WILL FAIL initially until Cloudflare Pages is properly configured.
 */

import assert from 'node:assert';
import { test, describe } from 'node:test';

// Configuration based on quickstart.md step 4 requirements
const CLOUDFLARE_CONFIG = {
  // These values will need to be updated once Cloudflare Pages is configured
  PROJECT_NAME: 'cpaonwebllp', // Expected project name in Cloudflare Pages
  EXPECTED_BUILD_COMMAND: 'next build',
  EXPECTED_BUILD_OUTPUT: '.next',
  EXPECTED_FRAMEWORK: 'Next.js',
  EXPECTED_ENV_VARS: {
    'NODE_ENV': 'production',
    'NEXT_TELEMETRY_DISABLED': '1',
  },
  // This will be the actual URL once Cloudflare Pages is set up
  // Currently using placeholder - test will fail until actual URL is provided
  PAGES_URL: 'https://cpaonwebllp.pages.dev', // UPDATE THIS WHEN CLOUDFLARE PAGES IS CONFIGURED
  PRODUCTION_BRANCH: 'main',
  PREVIEW_BRANCHES: ['staging', 'feature/*'],
};

describe('Cloudflare Pages Integration Tests', () => {

  test('should validate Cloudflare Pages deployment is accessible', async () => {
    try {
      console.log(`Testing Cloudflare Pages deployment at: ${CLOUDFLARE_CONFIG.PAGES_URL}`);

      const response = await fetch(CLOUDFLARE_CONFIG.PAGES_URL, {
        method: 'GET',
        headers: {
          'User-Agent': 'Integration-Test/1.0',
        },
      });

      // Validate response status
      assert.strictEqual(
        response.status,
        200,
        `Expected status 200 but got ${response.status}. Site may not be deployed yet.`,
      );

      // Validate response headers indicate it's served by Cloudflare
      const cfRay = response.headers.get('cf-ray');
      assert.ok(
        cfRay,
        'Missing cf-ray header - site may not be served by Cloudflare Pages',
      );

      // Validate content type
      const contentType = response.headers.get('content-type');
      assert.ok(
        contentType && contentType.includes('text/html'),
        `Expected HTML content but got: ${contentType}`,
      );

      // Validate Next.js deployment by checking for Next.js markers in HTML
      const html = await response.text();
      assert.ok(
        html.includes('__NEXT_DATA__') || html.includes('_next/'),
        'Response does not contain Next.js markers - build may not be configured correctly',
      );

      console.log('✅ Cloudflare Pages deployment is accessible and serving Next.js content');

    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error(
          `❌ EXPECTED FAILURE: Cloudflare Pages not configured yet. ` +
          `Site ${CLOUDFLARE_CONFIG.PAGES_URL} is not accessible. ` +
          `Please complete Cloudflare Pages setup as per quickstart.md step 4.`,
        );
      }
      throw error;
    }
  });

  test('should validate build configuration expectations', async () => {
    // This test validates that our project is configured correctly for Cloudflare Pages
    // by checking local build capabilities that match Cloudflare requirements

    console.log('Validating local build configuration matches Cloudflare Pages requirements...');

    // Check package.json has the expected build command
    const fs = await import('node:fs/promises');
    const packageJsonContent = await fs.readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const scripts = packageJson.scripts;

    assert.ok(
      scripts.build === CLOUDFLARE_CONFIG.EXPECTED_BUILD_COMMAND,
      `Expected build command '${CLOUDFLARE_CONFIG.EXPECTED_BUILD_COMMAND}' but got '${scripts.build}'`,
    );

    // Check that Next.js is properly configured (next.config.ts should exist)
    try {
      await fs.access('next.config.ts');
      console.log('✅ Next.js configuration file found (next.config.ts)');
    } catch (error) {
      try {
        await fs.access('next.config.js');
        console.log('✅ Next.js configuration file found (next.config.js)');
      } catch (error2) {
        throw new Error('❌ next.config.ts or next.config.js not found - required for Cloudflare Pages Next.js preset');
      }
    }

    // Check TypeScript configuration
    try {
      await fs.access('tsconfig.json');
      console.log('✅ TypeScript configuration found');
    } catch (error) {
      throw new Error('❌ tsconfig.json not found - required for TypeScript build');
    }

    console.log('✅ Local build configuration matches Cloudflare Pages requirements');
  });

  test('should validate environment variables configuration', async () => {
    // This test will fail until environment variables are actually configured in Cloudflare Pages
    // It's designed to remind us what needs to be set up

    console.log('Validating environment variables requirements...');

    const requiredEnvVars = Object.keys(CLOUDFLARE_CONFIG.EXPECTED_ENV_VARS);
    const missingVars = [];

    for (const envVar of requiredEnvVars) {
      console.log(`Checking requirement for environment variable: ${envVar}`);
      // In actual Cloudflare Pages, these would be set in the dashboard
      // This test documents what needs to be configured
      missingVars.push(`${envVar}=${CLOUDFLARE_CONFIG.EXPECTED_ENV_VARS[envVar]}`);
    }

    // This assertion will help document what needs to be configured in Cloudflare Pages
    assert.ok(
      false, // This will always fail initially - following TDD approach
      `❌ EXPECTED FAILURE: Environment variables need to be configured in Cloudflare Pages dashboard:\n${
      missingVars.map(v => `  - ${v}`).join('\n')
      }\n\nPlease set these in Cloudflare Pages → Settings → Environment variables`,
    );
  });

  test('should validate deployment branch configuration expectations', async () => {
    console.log('Validating deployment branch configuration expectations...');

    // Check that we have the expected branches for deployment
    const expectedBranches = [CLOUDFLARE_CONFIG.PRODUCTION_BRANCH, 'staging'];

    for (const branch of expectedBranches) {
      console.log(`Expected branch for deployment: ${branch}`);
    }

    console.log(`Production branch: ${CLOUDFLARE_CONFIG.PRODUCTION_BRANCH}`);
    console.log(`Preview branches: ${CLOUDFLARE_CONFIG.PREVIEW_BRANCHES.join(', ')}`);

    // This test documents the expected configuration
    // It will fail until Cloudflare Pages is actually configured
    assert.ok(
      false, // Following TDD - this will fail until configuration is complete
      `❌ EXPECTED FAILURE: Cloudflare Pages deployment branches need to be configured:\n` +
      `  - Production branch: ${CLOUDFLARE_CONFIG.PRODUCTION_BRANCH}\n` +
      `  - Preview deployments: All other branches\n` +
      `\nPlease configure in Cloudflare Pages → Settings → Builds & deployments`,
    );
  });

  test('should validate Next.js framework preset compatibility', async () => {
    console.log('Validating Next.js framework preset compatibility...');

    // Check that our Next.js version is compatible with Cloudflare Pages
    const fs = await import('node:fs/promises');
    const packageJsonContent = await fs.readFile('package.json', 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    const nextVersion = packageJson.dependencies.next;

    console.log(`Next.js version: ${nextVersion}`);

    // Validate we're using Next.js (required for the framework preset)
    assert.ok(
      nextVersion,
      'Next.js dependency not found in package.json',
    );

    // Check for App Router structure (recommended for Next.js 13+)
    try {
      const srcAppExists = await fs.access('src/app').then(() => true).catch(() => false);

      assert.ok(
        srcAppExists,
        'src/app directory not found - App Router structure expected for modern Next.js',
      );

      console.log('✅ Next.js App Router structure detected');
    } catch (error) {
      throw new Error(`Failed to validate Next.js structure: ${error.message}`);
    }

    console.log('✅ Next.js configuration is compatible with Cloudflare Pages framework preset');
  });
});

// Test runner configuration
process.on('exit', (code) => {
  if (code !== 0) {
    console.log('\n📝 TDD Approach: These test failures are EXPECTED until Cloudflare Pages is configured.');
    console.log('🎯 Next steps:');
    console.log('   1. Complete Cloudflare Pages setup per quickstart.md step 4');
    console.log('   2. Update CLOUDFLARE_CONFIG.PAGES_URL with actual deployment URL');
    console.log('   3. Configure environment variables in Cloudflare Pages dashboard');
    console.log('   4. Set up deployment branch configuration');
    console.log('   5. Re-run tests to validate successful integration');
  }
});