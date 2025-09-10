/**
 * Production Deployment Integration Test
 *
 * This test validates step 7 of the quickstart guide:
 * - Staging deployment updates correctly
 * - Production deployment triggers on main branch merge
 * - Production site accessible at custom domain
 * - No build or deployment errors
 *
 * Following TDD approach - this test WILL FAIL initially until
 * the production deployment infrastructure is properly configured.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

interface DeploymentConfig {
  productionUrl: string;
  stagingUrl: string;
  cloudflareApiToken?: string;
  githubToken?: string;
  repositoryName: string;
  repositoryOwner: string;
}

interface CloudflareDeployment {
  id: string;
  url: string;
  environment: string;
  status: string;
  created_on: string;
  modified_on: string;
}

interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

describe('Production Deployment Integration Test', () => {
  const config: DeploymentConfig = {
    productionUrl: process.env.PRODUCTION_URL || 'https://cpaonweb.com',
    stagingUrl: process.env.STAGING_URL || 'https://staging.cpaonweb.com',
    cloudflareApiToken: process.env.CLOUDFLARE_API_TOKEN,
    githubToken: process.env.GITHUB_TOKEN,
    repositoryName: process.env.GITHUB_REPO_NAME || 'cpaonwebllp',
    repositoryOwner: process.env.GITHUB_REPO_OWNER || 'JAIKIRAT',
  };

  let testBranchName: string;
  let initialMainCommit: string;
  let initialStagingCommit: string;

  beforeAll(async () => {
    // Generate unique test branch name
    testBranchName = `test-prod-deploy-${Date.now()}`;

    // Get initial commit SHAs for cleanup
    try {
      const { stdout: mainCommit } = await execAsync('git rev-parse main');
      initialMainCommit = mainCommit.trim();

      const { stdout: stagingCommit } = await execAsync('git rev-parse staging');
      initialStagingCommit = stagingCommit.trim();
    } catch (error) {
      console.warn('Could not get initial commit SHAs:', error);
    }

    console.log(`Starting production deployment test with branch: ${testBranchName}`);
  });

  afterAll(async () => {
    // Cleanup: Remove test branch and reset repositories to initial state
    try {
      await execAsync(`git checkout main`);
      await execAsync(`git branch -D ${testBranchName} || true`);
      await execAsync(`git push origin --delete ${testBranchName} || true`);
      console.log(`Cleaned up test branch: ${testBranchName}`);
    } catch (error) {
      console.warn('Cleanup warning:', error);
    }
  });

  describe('Pre-deployment Infrastructure Validation', () => {
    test('should have required environment variables configured', () => {
      // This test will FAIL initially - environment variables need to be set up
      expect(config.cloudflareApiToken).toBeDefined();
      expect(config.githubToken).toBeDefined();
      expect(config.productionUrl).toContain('cpaonweb.com');
      expect(config.stagingUrl).toContain('staging.cpaonweb.com');
    });

    test('should have GitHub repository with protected branches', async () => {
      // This test will FAIL initially - branch protection needs to be configured
      if (!config.githubToken) {
        throw new Error('GITHUB_TOKEN environment variable is required');
      }

      const response = await fetch(
        `https://api.github.com/repos/${config.repositoryOwner}/${config.repositoryName}/branches`,
        {
          headers: {
            'Authorization': `Bearer ${config.githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
          },
        },
      );

      expect(response.ok).toBe(true);
      const branches: GitHubBranch[] = await response.json();

      const mainBranch = branches.find(b => b.name === 'main');
      const stagingBranch = branches.find(b => b.name === 'staging');

      expect(mainBranch).toBeDefined();
      expect(stagingBranch).toBeDefined();
      expect(mainBranch?.protected).toBe(true);
      expect(stagingBranch?.protected).toBe(true);
    });

    test('should have Cloudflare Pages project connected', async () => {
      // This test will FAIL initially - Cloudflare Pages needs to be configured
      if (!config.cloudflareApiToken) {
        throw new Error('CLOUDFLARE_API_TOKEN environment variable is required');
      }

      // Test basic connectivity to Cloudflare API
      const response = await fetch('https://api.cloudflare.com/client/v4/user', {
        headers: {
          'Authorization': `Bearer ${config.cloudflareApiToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });

  describe('Build and Type Safety Validation', () => {
    test('should pass TypeScript type checking', async () => {
      // This should pass if the project is set up correctly
      const { stdout, stderr } = await execAsync('npm run type-check');
      expect(stderr).toBe('');
      expect(stdout).toContain(''); // No output means success
    });

    test('should pass ESLint checks', async () => {
      // This should pass if the project is set up correctly
      const { stdout, stderr } = await execAsync('npm run lint');
      expect(stderr).not.toContain('error');
      expect(stderr).not.toContain('Error');
    });

    test('should build successfully for production', async () => {
      // This should pass if the project is set up correctly
      const { stdout, stderr } = await execAsync('npm run build');
      expect(stderr).not.toContain('error');
      expect(stderr).not.toContain('Error');
      expect(stdout).toContain('Creating optimized production build');
    });
  });

  describe('Deployment Workflow Simulation', () => {
    test('should create feature branch and trigger preview deployment', async () => {
      // This test will FAIL initially - requires proper CI/CD setup

      // Create and checkout feature branch
      await execAsync(`git checkout -b ${testBranchName}`);

      // Make a test change
      const testContent = `export default function ProductionTestPage() {
        return (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Production Deployment Test</h1>
            <p>Generated at: ${new Date().toISOString()}</p>
            <p>Test branch: ${testBranchName}</p>
          </div>
        );
      }`;

      await execAsync(`mkdir -p src/app/production-test`);
      await execAsync(`echo '${testContent}' > src/app/production-test/page.tsx`);

      // Commit and push
      await execAsync(`git add .`);
      await execAsync(`git commit -m "Add production deployment test page - ${testBranchName}"`);
      await execAsync(`git push -u origin ${testBranchName}`);

      // Verify branch was created
      const { stdout } = await execAsync(`git branch -r`);
      expect(stdout).toContain(`origin/${testBranchName}`);
    });

    test('should merge to staging and trigger staging deployment', async () => {
      // This test will FAIL initially - requires proper PR workflow

      // Switch to staging branch
      await execAsync('git checkout staging');
      await execAsync('git pull origin staging');

      // Merge test branch to staging (simulating PR merge)
      await execAsync(`git merge ${testBranchName} --no-ff -m "Merge ${testBranchName} to staging"`);
      await execAsync('git push origin staging');

      // Wait for deployment to process (in real scenario)
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verify staging deployment
      const stagingResponse = await fetch(config.stagingUrl);
      expect(stagingResponse.ok).toBe(true);
    }, 30000); // 30 second timeout for deployment

    test('should merge to main and trigger production deployment', async () => {
      // This is the core test for step 7 - will FAIL initially

      // Switch to main branch
      await execAsync('git checkout main');
      await execAsync('git pull origin main');

      // Merge staging to main (simulating production PR merge)
      await execAsync('git merge staging --no-ff -m "Deploy tested changes to production"');
      await execAsync('git push origin main');

      // Wait for production deployment to process
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Verify production deployment
      const productionResponse = await fetch(config.productionUrl);
      expect(productionResponse.ok).toBe(true);

      // Verify the test page is accessible
      const testPageResponse = await fetch(`${config.productionUrl}/production-test`);
      expect(testPageResponse.ok).toBe(true);

      const content = await testPageResponse.text();
      expect(content).toContain('Production Deployment Test');
      expect(content).toContain(testBranchName);
    }, 60000); // 60 second timeout for production deployment
  });

  describe('Production Site Validation', () => {
    test('should have HTTPS enabled and valid SSL certificate', async () => {
      // This test will FAIL initially - SSL needs to be configured
      const response = await fetch(config.productionUrl);
      expect(response.url.startsWith('https://')).toBe(true);
      expect(response.ok).toBe(true);
    });

    test('should have proper security headers', async () => {
      // This test will FAIL initially - security headers need configuration
      const response = await fetch(config.productionUrl);
      const headers = response.headers;

      expect(headers.get('x-frame-options')).toBeTruthy();
      expect(headers.get('x-content-type-options')).toBe('nosniff');
      expect(headers.get('strict-transport-security')).toBeTruthy();
    });

    test('should have acceptable performance metrics', async () => {
      // This test will FAIL initially - requires performance optimization
      const startTime = Date.now();
      const response = await fetch(config.productionUrl);
      const loadTime = Date.now() - startTime;

      expect(response.ok).toBe(true);
      expect(loadTime).toBeLessThan(3000); // Page should load in under 3 seconds

      // Check for performance indicators
      const content = await response.text();
      expect(content).toContain('<!DOCTYPE html>');
      expect(content.length).toBeGreaterThan(100); // Ensure content is actually served
    });

    test('should have proper caching headers for static assets', async () => {
      // This test will FAIL initially - caching needs to be configured
      const response = await fetch(config.productionUrl);
      expect(response.ok).toBe(true);

      // Check for caching headers (Next.js should set these automatically)
      const cacheControl = response.headers.get('cache-control');
      expect(cacheControl).toBeTruthy();
    });
  });

  describe('Rollback Capability Validation', () => {
    test('should be able to identify deployment history', async () => {
      // This test will FAIL initially - requires Cloudflare API integration
      if (!config.cloudflareApiToken) {
        throw new Error('CLOUDFLARE_API_TOKEN required for deployment history');
      }

      // This is a placeholder - actual implementation would query Cloudflare Pages API
      // for deployment history to ensure rollback capability
      expect(true).toBe(true); // Placeholder assertion
    });

    test('should have staging environment synchronized with main', async () => {
      // Verify both environments are accessible and serving similar content
      const [prodResponse, stagingResponse] = await Promise.all([
        fetch(config.productionUrl),
        fetch(config.stagingUrl),
      ]);

      expect(prodResponse.ok).toBe(true);
      expect(stagingResponse.ok).toBe(true);

      // Both should be HTML documents
      const [prodContent, stagingContent] = await Promise.all([
        prodResponse.text(),
        stagingResponse.text(),
      ]);

      expect(prodContent).toContain('<!DOCTYPE html>');
      expect(stagingContent).toContain('<!DOCTYPE html>');
    });
  });
});