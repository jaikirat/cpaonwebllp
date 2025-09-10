# Integration Tests

This directory contains integration tests for the Next.js TypeScript project with Cloudflare Pages CI/CD pipeline.

## Branch Protection Integration Test

The `integration/branch-protection.test.ts` file contains tests that validate the branch protection configuration as specified in the quickstart.md step 3.

### Purpose

This test is designed to follow the Test-Driven Development (TDD) approach and will **FAIL initially** until proper branch protection rules are configured in the GitHub repository.

### What it Tests

1. **Branch Protection Rules**: Validates that both `main` and `staging` branches have protection enabled
2. **PR Review Requirements**: Ensures at least 1 reviewer is required for PRs
3. **Status Check Requirements**: Verifies that `build`, `type-check`, and `lint` checks are required
4. **Admin Enforcement**: Confirms that protection rules apply to administrators
5. **Direct Push Prevention**: Ensures direct pushes to protected branches are blocked
6. **CI/CD Integration**: Validates that Cloudflare Pages deployment is configured

### Prerequisites

Before running these tests, ensure you have:

1. **GitHub CLI installed and authenticated**:
   ```bash
   gh auth login
   ```

2. **Environment variables set** (optional):
   ```bash
   export GITHUB_REPOSITORY_OWNER="your-username"
   export GITHUB_REPOSITORY_NAME="cpaonwebllp"
   ```

3. **Test dependencies installed**:
   ```bash
   npm install
   ```

### Running the Tests

```bash
# Run all tests
npm test

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Expected Initial Behavior

When you first run these tests **before** configuring branch protection:

- ✅ GitHub CLI authentication check should pass
- ❌ Branch protection tests should FAIL (expected)
- ❌ Status check validation should FAIL (expected)
- ❌ PR requirement tests should FAIL (expected)

This is the intended TDD behavior - tests fail first, then you implement the feature (configure branch protection).

### After Branch Protection Setup

After following quickstart.md step 3 to configure branch protection:

- ✅ All tests should pass
- ✅ Branch protection rules validated
- ✅ Status checks properly configured
- ✅ PR requirements enforced

### Test Configuration

The tests use the following configuration:

- **Protected Branches**: `main`, `staging`
- **Required Status Checks**: `build`, `type-check`, `lint`
- **Minimum PR Reviews**: 1
- **Admin Enforcement**: Enabled
- **Force Push Prevention**: Enabled

### Troubleshooting

**Test fails with "GitHub CLI not authenticated"**:
```bash
gh auth login
```

**Test fails with "404" errors**:
- This is expected initially (TDD approach)
- Configure branch protection using quickstart.md step 3
- Re-run tests after configuration

**Tests timeout**:
- Check network connection
- Verify GitHub API access
- Increase timeout in jest.config.ts if needed

### GitHub CLI Commands Reference

For manual verification, you can use these commands:

```bash
# Check branch protection status
gh api repos/:owner/:repo/branches/main/protection

# Set up branch protection (as per quickstart.md)
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["build","type-check","lint"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null
```