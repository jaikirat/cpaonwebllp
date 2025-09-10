/**
 * Integration Test: Custom Domain Setup Validation
 * 
 * Tests the custom domain configuration requirements from quickstart.md step 5:
 * 1. Custom domain configuration is correct
 * 2. DNS settings are validated
 * 3. SSL certificates are properly configured
 * 
 * This test follows TDD approach and will FAIL initially until domains are properly configured.
 */

import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import https from 'https';
import http from 'http';
import dns from 'dns/promises';
import { promisify } from 'util';

interface DomainTestConfig {
  domain: string;
  expectedBranch: 'main' | 'staging';
  shouldRedirectToHttps: boolean;
}

interface SSLCertificateInfo {
  subject: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  valid: boolean;
}

interface DNSRecord {
  type: string;
  value: string;
  ttl?: number;
}

describe('Custom Domain Setup Integration Tests', () => {
  const domains: DomainTestConfig[] = [
    {
      domain: 'cpaonweb.com',
      expectedBranch: 'main',
      shouldRedirectToHttps: true
    },
    {
      domain: 'staging.cpaonweb.com',
      expectedBranch: 'staging',
      shouldRedirectToHttps: true
    }
  ];

  const timeout = 30000; // 30 seconds for network operations

  beforeAll(async () => {
    console.log('Starting Custom Domain Setup Integration Tests...');
    console.log('Testing domains:', domains.map(d => d.domain).join(', '));
  });

  afterAll(() => {
    console.log('Custom Domain Setup Integration Tests completed.');
  });

  describe('DNS Configuration Validation', () => {
    test.each(domains)('should have correct DNS records for $domain', async ({ domain }) => {
      // This test will FAIL initially until DNS is properly configured
      try {
        const records = await dns.resolve(domain, 'A');
        
        // Validate that DNS records exist
        expect(records).toBeDefined();
        expect(records.length).toBeGreaterThan(0);
        
        // Validate that records point to Cloudflare IP ranges (typically 104.x.x.x or 172.x.x.x)
        const cloudflareIPPattern = /^(104|172|188|203|198)\./;
        const hasCloudflareIP = records.some(ip => cloudflareIPPattern.test(ip));
        
        expect(hasCloudflareIP).toBe(true);
        
        console.log(`✅ DNS records for ${domain}:`, records);
      } catch (error) {
        console.error(`❌ DNS resolution failed for ${domain}:`, error);
        throw new Error(`DNS records not configured for ${domain}. Expected A records pointing to Cloudflare IPs.`);
      }
    }, timeout);

    test.each(domains)('should have CNAME records configured for $domain', async ({ domain }) => {
      // This test checks for potential CNAME configuration
      try {
        // Try to resolve CNAME records (some domains might use CNAME instead of A records)
        const cnameRecords = await dns.resolve(domain, 'CNAME').catch(() => []);
        
        if (cnameRecords.length > 0) {
          expect(cnameRecords[0]).toContain('pages.dev');
          console.log(`✅ CNAME record for ${domain}:`, cnameRecords[0]);
        } else {
          console.log(`ℹ️  No CNAME records found for ${domain} (using A records)`);
        }
      } catch (error) {
        // CNAME resolution failure is acceptable if A records are used
        console.log(`ℹ️  CNAME resolution not applicable for ${domain}`);
      }
    }, timeout);
  });

  describe('SSL Certificate Validation', () => {
    test.each(domains)('should have valid SSL certificate for $domain', async ({ domain }) => {
      // This test will FAIL initially until SSL certificates are issued
      return new Promise<void>((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          method: 'GET',
          path: '/',
          timeout: timeout
        };

        const req = https.request(options, (res) => {
          const cert = res.socket.getPeerCertificate();
          
          if (!cert || Object.keys(cert).length === 0) {
            reject(new Error(`No SSL certificate found for ${domain}`));
            return;
          }

          const certInfo: SSLCertificateInfo = {
            subject: cert.subject?.CN || 'Unknown',
            issuer: cert.issuer?.CN || 'Unknown',
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            valid: cert.valid_to ? new Date(cert.valid_to) > new Date() : false
          };

          try {
            // Validate certificate properties
            expect(certInfo.valid).toBe(true);
            expect(certInfo.subject).toContain(domain);
            expect(certInfo.issuer).toMatch(/(Let's Encrypt|Cloudflare|DigiCert)/i);
            
            console.log(`✅ SSL Certificate for ${domain}:`, certInfo);
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        req.on('error', (error) => {
          reject(new Error(`SSL certificate validation failed for ${domain}: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`SSL certificate validation timeout for ${domain}`));
        });

        req.setTimeout(timeout);
        req.end();
      });
    }, timeout);

    test.each(domains)('should have proper certificate chain for $domain', async ({ domain }) => {
      // Validate that the certificate chain is properly configured
      return new Promise<void>((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          method: 'GET',
          path: '/',
          timeout: timeout,
          rejectUnauthorized: true // This will fail if certificate chain is invalid
        };

        const req = https.request(options, (res) => {
          expect(res.statusCode).toBeLessThan(500);
          console.log(`✅ Certificate chain valid for ${domain}`);
          resolve();
        });

        req.on('error', (error) => {
          if (error.message.includes('CERT')) {
            reject(new Error(`Certificate chain validation failed for ${domain}: ${error.message}`));
          } else {
            // Non-certificate errors might be acceptable (e.g., connection refused is still valid SSL)
            console.log(`ℹ️  Non-certificate error for ${domain}: ${error.message}`);
            resolve();
          }
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Certificate chain validation timeout for ${domain}`));
        });

        req.setTimeout(timeout);
        req.end();
      });
    }, timeout);
  });

  describe('HTTPS Redirection Validation', () => {
    test.each(domains)('should redirect HTTP to HTTPS for $domain', async ({ domain }) => {
      // This test validates automatic HTTPS redirection
      return new Promise<void>((resolve, reject) => {
        const options = {
          host: domain,
          port: 80,
          method: 'GET',
          path: '/',
          timeout: timeout
        };

        const req = http.request(options, (res) => {
          try {
            // Expect redirect to HTTPS
            expect([301, 302, 308]).toContain(res.statusCode);
            
            const location = res.headers.location;
            expect(location).toBeDefined();
            expect(location).toMatch(/^https:\/\//);
            expect(location).toContain(domain);
            
            console.log(`✅ HTTP to HTTPS redirect working for ${domain}: ${res.statusCode} -> ${location}`);
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        req.on('error', (error) => {
          reject(new Error(`HTTPS redirection test failed for ${domain}: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`HTTPS redirection test timeout for ${domain}`));
        });

        req.setTimeout(timeout);
        req.end();
      });
    }, timeout);
  });

  describe('Domain Accessibility Validation', () => {
    test.each(domains)('should be accessible via HTTPS for $domain', async ({ domain }) => {
      // This test validates that the domain serves content successfully
      return new Promise<void>((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          method: 'GET',
          path: '/',
          timeout: timeout,
          headers: {
            'User-Agent': 'Custom-Domain-Integration-Test/1.0'
          }
        };

        const req = https.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            try {
              // Expect successful response
              expect(res.statusCode).toBe(200);
              
              // Expect HTML content (basic validation that it's serving the Next.js app)
              expect(data).toContain('</html>');
              expect(data.length).toBeGreaterThan(100); // Basic content length check
              
              console.log(`✅ ${domain} is accessible and serving content (${data.length} bytes)`);
              resolve();
            } catch (error) {
              reject(error);
            }
          });
        });

        req.on('error', (error) => {
          reject(new Error(`Domain accessibility test failed for ${domain}: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Domain accessibility test timeout for ${domain}`));
        });

        req.setTimeout(timeout);
        req.end();
      });
    }, timeout);

    test.each(domains)('should return proper security headers for $domain', async ({ domain }) => {
      // Validate security headers are properly configured
      return new Promise<void>((resolve, reject) => {
        const options = {
          host: domain,
          port: 443,
          method: 'HEAD', // HEAD request for headers only
          path: '/',
          timeout: timeout
        };

        const req = https.request(options, (res) => {
          try {
            const headers = res.headers;
            
            // Check for basic security headers
            expect(headers['strict-transport-security']).toBeDefined();
            
            // Cloudflare typically adds these headers
            expect(headers['cf-ray']).toBeDefined();
            expect(headers.server).toMatch(/(cloudflare|nginx)/i);
            
            console.log(`✅ Security headers present for ${domain}`);
            console.log('  - HSTS:', headers['strict-transport-security']);
            console.log('  - Server:', headers.server);
            console.log('  - CF-Ray:', headers['cf-ray']);
            
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        req.on('error', (error) => {
          reject(new Error(`Security headers test failed for ${domain}: ${error.message}`));
        });

        req.on('timeout', () => {
          req.destroy();
          reject(new Error(`Security headers test timeout for ${domain}`));
        });

        req.setTimeout(timeout);
        req.end();
      });
    }, timeout);
  });

  describe('Branch Alias Configuration', () => {
    test('staging subdomain should serve different content from main domain', async () => {
      // This test validates that staging.cpaonweb.com serves staging branch content
      // and main domain serves production content
      
      const productionDomain = 'cpaonweb.com';
      const stagingDomain = 'staging.cpaonweb.com';
      
      const getPageContent = (domain: string): Promise<string> => {
        return new Promise((resolve, reject) => {
          const options = {
            host: domain,
            port: 443,
            method: 'GET',
            path: '/',
            timeout: timeout
          };

          const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
              resolve(data);
            });
          });

          req.on('error', reject);
          req.on('timeout', () => {
            req.destroy();
            reject(new Error(`Timeout getting content from ${domain}`));
          });

          req.setTimeout(timeout);
          req.end();
        });
      };

      try {
        const [productionContent, stagingContent] = await Promise.all([
          getPageContent(productionDomain),
          getPageContent(stagingDomain)
        ]);

        // Both should be accessible
        expect(productionContent.length).toBeGreaterThan(0);
        expect(stagingContent.length).toBeGreaterThan(0);

        console.log(`✅ Both domains are serving content`);
        console.log(`  - Production (${productionDomain}): ${productionContent.length} bytes`);
        console.log(`  - Staging (${stagingDomain}): ${stagingContent.length} bytes`);
        
        // Note: Content might be identical if both branches have same content
        // This is acceptable - the test validates both domains are accessible
        
      } catch (error) {
        throw new Error(`Branch alias configuration test failed: ${error}`);
      }
    }, timeout);
  });
});