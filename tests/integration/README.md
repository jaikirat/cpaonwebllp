# Integration Tests

This directory contains integration tests that validate the complete setup and configuration of the project as described in the quickstart guide.

## Custom Domain Setup Integration Test

### Overview

The `custom-domain-setup.test.ts` file contains comprehensive tests for validating the custom domain configuration as specified in **quickstart.md step 5**.

### What It Tests

The test suite validates the following requirements:

1. **DNS Configuration Validation**
   - DNS A records point to Cloudflare IP addresses
   - CNAME records are properly configured (if used)
   - DNS resolution works for both domains

2. **SSL Certificate Validation**
   - Valid SSL certificates are installed and configured
   - Certificate chain is properly established
   - Certificates are not expired and issued by trusted CAs

3. **HTTPS Redirection**
   - HTTP requests automatically redirect to HTTPS
   - Proper redirect status codes (301, 302, 308)
   - Redirect URLs are correctly formed

4. **Domain Accessibility**
   - Domains serve content successfully over HTTPS
   - Proper security headers are present
   - Content is being served correctly

5. **Branch Alias Configuration**
   - Production domain (`cpaonweb.com`) serves main branch content
   - Staging domain (`staging.cpaonweb.com`) serves staging branch content

### Running the Tests

#### Prerequisites

Before running these tests, ensure:

1. **Domains are configured**: `cpaonweb.com` and `staging.cpaonweb.com`
2. **DNS records are set**: A records or CNAME records pointing to Cloudflare
3. **SSL certificates are issued**: Cloudflare has provisioned SSL certificates
4. **Cloudflare Pages is deployed**: Both production and staging environments are live

#### Test Commands

```bash
# Run all integration tests
npm run test:integration

# Run only the custom domain setup test
npm run test:integration:domain

# Run with verbose output
npm test -- tests/integration/custom-domain-setup.test.ts --verbose

# Run with coverage
npm run test:coverage -- tests/integration/custom-domain-setup.test.ts
```

### TDD Approach - Expected Initial Failures

**🚨 IMPORTANT: These tests are designed to FAIL initially following TDD principles.**

When you first run these tests (before configuring custom domains), you should expect:

```
❌ DNS Configuration Validation
  - DNS resolution will fail for unconfigured domains
  - A records won't point to Cloudflare IPs

❌ SSL Certificate Validation  
  - SSL certificates won't be available for unconfigured domains
  - Certificate validation will timeout or fail

❌ HTTPS Redirection
  - HTTP to HTTPS redirection won't work
  - Connection errors for HTTP requests

❌ Domain Accessibility
  - Domains won't be accessible over HTTPS
  - Missing security headers

❌ Branch Alias Configuration
  - Staging subdomain won't be configured
  - Content differences won't be testable
```

### Configuration Progress

As you complete the custom domain setup (quickstart.md step 5), tests will gradually pass:

1. **After DNS configuration**: DNS tests will pass
2. **After domain addition in Cloudflare Pages**: Basic accessibility tests will pass  
3. **After SSL certificate provisioning**: SSL and HTTPS tests will pass
4. **After branch aliases configuration**: All tests will pass

### Test Configuration

#### Domains Tested

- **Production**: `cpaonweb.com` (main branch)
- **Staging**: `staging.cpaonweb.com` (staging branch)

#### Timeouts

- **Network operations**: 30 seconds
- **DNS resolution**: 30 seconds
- **SSL validation**: 30 seconds

#### Expected Cloudflare IP Ranges

The tests validate DNS records point to Cloudflare IP ranges:
- `104.x.x.x`
- `172.x.x.x` 
- `188.x.x.x`
- `203.x.x.x`
- `198.x.x.x`

### Troubleshooting

#### Common Issues

1. **DNS Resolution Failures**
   ```
   Error: DNS records not configured for cpaonweb.com
   ```
   - **Solution**: Add A records in your domain registrar's DNS settings
   - **Cloudflare IPs**: Check Cloudflare Pages custom domain section for correct IPs

2. **SSL Certificate Errors**
   ```
   Error: No SSL certificate found for cpaonweb.com  
   ```
   - **Solution**: Wait for Cloudflare to issue certificates (can take 24-48 hours)
   - **Check**: Cloudflare Pages > Custom domains > Certificate status

3. **Connection Timeouts**
   ```
   Error: Domain accessibility test timeout for cpaonweb.com
   ```
   - **Solution**: Ensure domain is properly configured and propagated
   - **Check**: Use `dig cpaonweb.com` or online DNS checkers

4. **Branch Alias Issues**
   ```
   Error: staging.cpaonweb.com not accessible
   ```
   - **Solution**: Configure staging branch alias in Cloudflare Pages settings
   - **Check**: Cloudflare Pages > Settings > Domains

#### Debugging Steps

1. **Check DNS propagation**:
   ```bash
   # Check A records
   dig cpaonweb.com A
   dig staging.cpaonweb.com A
   
   # Check from multiple locations
   nslookup cpaonweb.com 8.8.8.8
   ```

2. **Verify SSL certificates**:
   ```bash
   # Check certificate details
   openssl s_client -connect cpaonweb.com:443 -servername cpaonweb.com
   
   # Check certificate chain
   curl -I https://cpaonweb.com
   ```

3. **Test domain accessibility**:
   ```bash
   # Test HTTP to HTTPS redirect
   curl -I http://cpaonweb.com
   
   # Test HTTPS accessibility
   curl -I https://cpaonweb.com
   ```

### Success Criteria

✅ **All tests pass when:**
- DNS records are configured and propagated
- SSL certificates are issued and valid
- Domains are accessible over HTTPS
- Security headers are present
- Branch aliases are properly configured

The test suite validates that your custom domain setup matches the requirements specified in quickstart.md step 5 and is ready for production use.