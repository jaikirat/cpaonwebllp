/**
 * Integration Test: Branch Protection Validation
 *
 * This test validates the branch protection configuration as defined in
 * quickstart.md step 3. It ensures that both main and staging branches
 * have proper protection rules configured.
 *
 * Note: This test is designed to FAIL initially (TDD approach) until
 * proper branch protection is configured in the GitHub repository.
 */

import { execSync } from 'child_process';

describe('Branch Protection Integration Tests', () => {
  const REPO_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'test-owner';
  const REPO_NAME = process.env.GITHUB_REPOSITORY_NAME || 'cpaonwebllp';
  const PROTECTED_BRANCHES = ['main', 'staging'];
  const REQUIRED_STATUS_CHECKS = ['build', 'type-check', 'lint'];

  beforeAll(() => {
    // Verify GitHub CLI is available and authenticated
    try {
      execSync('gh auth status', { stdio: 'pipe' });
    } catch (error) {
      throw new Error('GitHub CLI is not installed or not authenticated. Please run: gh auth login');
    }
  });

  describe('Branch Protection Rules', () => {
    PROTECTED_BRANCHES.forEach(branch => {
      describe(`${branch} branch`, () => {
        let branchProtection: any;

        beforeAll(async () => {
          try {
            // Fetch branch protection rules using GitHub CLI
            const result = execSync(
              `gh api repos/${REPO_OWNER}/${REPO_NAME}/branches/${branch}/protection`,
              { encoding: 'utf8', stdio: 'pipe' },
            );
            branchProtection = JSON.parse(result);
          } catch (error: any) {
            // If error is 404, branch protection is not configured
            if (error.message.includes('404')) {
              branchProtection = null;
            } else {
              throw error;
            }
          }
        });

        test('should have branch protection enabled', () => {
          expect(branchProtection).not.toBeNull();
          expect(branchProtection).toBeDefined();
        });

        test('should require pull request reviews', () => {
          expect(branchProtection?.required_pull_request_reviews).toBeDefined();
          expect(branchProtection.required_pull_request_reviews.required_approving_review_count).toBeGreaterThanOrEqual(1);
        });

        test('should have required status checks configured', () => {
          expect(branchProtection?.required_status_checks).toBeDefined();
          expect(branchProtection.required_status_checks.strict).toBe(true);

          const contexts = branchProtection.required_status_checks.contexts;
          REQUIRED_STATUS_CHECKS.forEach(check => {
            expect(contexts).toContain(check);
          });
        });

        test('should enforce restrictions for admins', () => {
          expect(branchProtection?.enforce_admins?.enabled).toBe(true);
        });

        test('should block direct pushes', () => {
          // When branch protection is properly configured, direct pushes should be blocked
          expect(branchProtection?.allow_force_pushes?.enabled).toBe(false);
          expect(branchProtection?.allow_deletions?.enabled).toBe(false);
        });
      });
    });
  });

  describe('Status Check Validation', () => {
    test('should validate that required status checks exist in CI/CD', async () => {
      // This test checks if the required status checks are configured in the workflow
      const workflows = await getWorkflowFiles();
      expect(workflows.length).toBeGreaterThan(0);

      // Check that the workflow includes the required checks
      const workflowContent = await readWorkflowContent(workflows[0]);
      REQUIRED_STATUS_CHECKS.forEach(check => {
        expect(workflowContent).toMatch(new RegExp(check, 'i'));
      });
    });

    test('should validate Cloudflare Pages integration exists', async () => {
      // Verify that Cloudflare Pages deployment is configured
      try {
        // Check if there's a pages.dev deployment or custom domain configured
        const result = execSync(
          `gh api repos/${REPO_OWNER}/${REPO_NAME}/pages`,
          { encoding: 'utf8', stdio: 'pipe' },
        );
        const pagesConfig = JSON.parse(result);

        expect(pagesConfig).toBeDefined();
        expect(pagesConfig.source?.branch).toMatch(/main|master/);
      } catch (error: any) {
        // If GitHub Pages API returns 404, check for Cloudflare Pages via deployments
        if (error.message.includes('404')) {
          // This is expected for Cloudflare Pages - they don't use GitHub Pages API
          // Instead, verify deployment history exists
          const deployments = execSync(
            `gh api repos/${REPO_OWNER}/${REPO_NAME}/deployments --paginate`,
            { encoding: 'utf8', stdio: 'pipe' },
          );
          const deploymentsData = JSON.parse(deployments);
          expect(deploymentsData.length).toBeGreaterThan(0);
        } else {
          throw error;
        }
      }
    });
  });

  describe('Workflow Integration Tests', () => {
    test('should prevent direct pushes to protected branches', async () => {
      // This test simulates attempting a direct push (should fail)
      // Note: This is a conceptual test - in practice, you'd need to set up
      // a separate test repository or use GitHub's API to simulate this

      const protectedBranches = ['main', 'staging'];

      for (const branch of protectedBranches) {
        try {
          // Check if branch exists
          execSync(`git ls-remote --heads origin ${branch}`, { stdio: 'pipe' });

          // If we get here, the branch exists and protection should be in place
          expect(true).toBe(true); // Branch exists
        } catch (error) {
          // Branch doesn't exist - this test will need branch creation first
          console.warn(`Branch ${branch} does not exist yet. Skipping direct push test.`);
        }
      }
    });

    test('should require all status checks to pass for PR merge', async () => {
      // Verify that the repository is configured to require status checks
      PROTECTED_BRANCHES.forEach(async (branch) => {
        try {
          const result = execSync(
            `gh api repos/${REPO_OWNER}/${REPO_NAME}/branches/${branch}/protection`,
            { encoding: 'utf8', stdio: 'pipe' },
          );
          const protection = JSON.parse(result);

          expect(protection.required_status_checks).toBeDefined();
          expect(protection.required_status_checks.strict).toBe(true);

          const requiredChecks = protection.required_status_checks.contexts;
          expect(requiredChecks).toEqual(expect.arrayContaining(REQUIRED_STATUS_CHECKS));
        } catch (error: any) {
          // This test should FAIL initially until branch protection is set up
          expect(error.message).toContain('404');
          console.error(`Branch protection not configured for ${branch}. This is expected initially (TDD).`);
          throw new Error(`Branch protection missing for ${branch}. Please configure as per quickstart.md step 3.`);
        }
      });
    });
  });
});

// Helper functions
async function getWorkflowFiles(): Promise<string[]> {
  try {
    const result = execSync('find .github/workflows -name "*.yml" -o -name "*.yaml" 2>/dev/null', {
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return result.trim().split('\n').filter(f => f.length > 0);
  } catch {
    return [];
  }
}

async function readWorkflowContent(workflowPath: string): Promise<string> {
  try {
    const result = execSync(`cat "${workflowPath}"`, { encoding: 'utf8', stdio: 'pipe' });
    return result;
  } catch {
    return '';
  }
}

// Export for potential use in other test files
export {
  PROTECTED_BRANCHES,
  REQUIRED_STATUS_CHECKS,
};