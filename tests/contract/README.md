# Contract Tests

This directory contains contract tests that validate the deployment requirements and configurations for the project.

## Cloudflare Pages Contract Test

The `test_cloudflare_pages.spec.js` file contains comprehensive tests that validate Cloudflare Pages deployment requirements based on the contract specification in `specs/001-create-a-new/contracts/cloudflare-pages-contract.yml`.

### Running the Test

```bash
# Run only the Cloudflare Pages contract test
npm run test:contract:cloudflare

# Run all contract tests
npm run test:contract
```

### Test-Driven Development (TDD) Approach

This test follows TDD principles:

1. **Tests FAIL initially** - All tests are designed to fail until the actual Cloudflare Pages deployment is configured
2. **Mock functions throw errors** - The test uses mock functions that throw descriptive errors explaining what needs to be configured
3. **Contract validation** - Tests validate that the contract specification is properly loaded and contains all required sections

### Test Categories

The contract test validates the following areas:

1. **Project Setup Configuration**
   - Build command validation
   - Framework configuration
   - Build output directory
   - Environment variables

2. **Deployment Pipeline Configuration**
   - Production deployment triggers
   - Build process configuration
   - Staging deployment setup
   - Preview deployments

3. **Domain Configuration**
   - Custom domain setup
   - DNS records configuration

4. **Security Configuration**
   - SSL settings
   - Security headers

5. **Integration and Monitoring**
   - GitHub integration
   - Service limits

6. **Contract Specification Validation**
   - Contract file loading
   - Required sections verification

### Expected Test Results

**Initial State (Before Cloudflare Setup):**
- 16 tests total
- Most tests pass (they verify that errors are thrown as expected)
- This demonstrates that the contract requirements are understood and testable

**After Cloudflare Setup:**
- Tests should be updated to verify actual Cloudflare configuration
- Mock functions should be replaced with real API calls to Cloudflare
- Tests will validate the actual deployment configuration

### Next Steps

1. Set up Cloudflare Pages project
2. Configure deployment settings according to the contract
3. Update test functions to use real Cloudflare API calls
4. Verify all contract requirements are met

### Dependencies

- Node.js built-in test runner
- `js-yaml` for parsing contract specification
- Contract specification file: `specs/001-create-a-new/contracts/cloudflare-pages-contract.yml`