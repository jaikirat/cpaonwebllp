import { test, expect, Page } from '@playwright/test';

/**
 * Desktop Navigation E2E Tests
 *
 * Tests the complete desktop navigation experience including:
 * - Header navigation menu
 * - Dropdown menus for Services and Resources
 * - Breadcrumb navigation
 * - Footer navigation links
 * - Active link highlighting
 * - Navigation performance
 */

test.describe('Desktop Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('should display header navigation with all primary links', async ({ page }) => {
    // Verify header exists and is visible
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Check all primary navigation items are present
    const expectedLinks = [
      { text: 'Home', href: '/' },
      { text: 'Services', href: '/services' },
      { text: 'Pricing', href: '/pricing' },
      { text: 'Industries', href: '/industries' },
      { text: 'About', href: '/about' },
      { text: 'Resources', href: '/resources' },
      { text: 'Contact', href: '/contact' }
    ];

    for (const link of expectedLinks) {
      const navLink = page.locator(`header nav a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toContainText(link.text);
    }
  });

  test('should show Services dropdown menu on hover', async ({ page }) => {
    // Hover over Services link
    const servicesLink = page.locator('header nav a[href="/services"]');
    await servicesLink.hover();

    // Wait for dropdown to appear
    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible({ timeout: 500 });

    // Check dropdown contains expected service links
    const expectedServices = [
      { text: 'Tax Services', href: '/services/tax' },
      { text: 'Accounting', href: '/services/accounting' },
      { text: 'Advisory', href: '/services/advisory' }
    ];

    for (const service of expectedServices) {
      const serviceLink = dropdown.locator(`a[href="${service.href}"]`);
      await expect(serviceLink).toBeVisible();
      await expect(serviceLink).toContainText(service.text);
    }
  });

  test('should show Resources dropdown menu on hover', async ({ page }) => {
    // Hover over Resources link
    const resourcesLink = page.locator('header nav a[href="/resources"]');
    await resourcesLink.hover();

    // Wait for dropdown to appear
    const dropdown = page.locator('[data-testid="resources-dropdown"]');
    await expect(dropdown).toBeVisible({ timeout: 500 });

    // Check dropdown contains expected resource links
    const expectedResources = [
      { text: 'Blog', href: '/resources/blog' },
      { text: 'Guides', href: '/resources/guides' },
      { text: 'Calculators', href: '/resources/calculators' }
    ];

    for (const resource of expectedResources) {
      const resourceLink = dropdown.locator(`a[href="${resource.href}"]`);
      await expect(resourceLink).toBeVisible();
      await expect(resourceLink).toContainText(resource.text);
    }
  });

  test('should hide dropdown menus when moving mouse away', async ({ page }) => {
    // Hover over Services to show dropdown
    await page.locator('header nav a[href="/services"]').hover();
    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible();

    // Move mouse away from dropdown area
    await page.locator('header').hover({ position: { x: 10, y: 10 } });

    // Dropdown should hide
    await expect(dropdown).toBeHidden({ timeout: 1000 });
  });

  test('should navigate to pages and show correct active state', async ({ page }) => {
    // Navigate to About page
    await page.click('header nav a[href="/about"]');
    await page.waitForLoadState('networkidle');

    // Check URL changed
    await expect(page).toHaveURL('/about');

    // Check active state highlighting
    const aboutLink = page.locator('header nav a[href="/about"]');
    await expect(aboutLink).toHaveClass(/active/);

    // Check other links are not active
    const homeLink = page.locator('header nav a[href="/"]');
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('should display breadcrumbs on navigation', async ({ page }) => {
    // Navigate to a service page
    await page.goto('/services/tax');
    await page.waitForLoadState('networkidle');

    // Check breadcrumbs exist
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    await expect(breadcrumbs).toBeVisible();

    // Check breadcrumb structure
    await expect(breadcrumbs.locator('a[href="/"]')).toContainText('Home');
    await expect(breadcrumbs.locator('a[href="/services"]')).toContainText('Services');
    await expect(breadcrumbs.locator('[aria-current="page"]')).toContainText('Tax Services');
  });

  test('should display footer navigation', async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Check footer navigation links
    const expectedFooterLinks = [
      { text: 'FAQs', href: '/faqs' },
      { text: 'Privacy Policy', href: '/legal/privacy' },
      { text: 'Terms of Service', href: '/legal/terms' },
      { text: 'Sitemap', href: '/sitemap' }
    ];

    for (const link of expectedFooterLinks) {
      const footerLink = footer.locator(`a[href="${link.href}"]`);
      await expect(footerLink).toBeVisible();
      await expect(footerLink).toContainText(link.text);
    }
  });

  test('should handle dropdown navigation with keyboard and mouse', async ({ page }) => {
    // Test Services dropdown with click
    await page.click('header nav a[href="/services"]');

    // Should show dropdown
    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible();

    // Click on Tax Services
    await page.click('a[href="/services/tax"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/services/tax');
  });

  test('should maintain navigation state across page loads', async ({ page }) => {
    // Navigate through multiple pages
    await page.click('a[href="/services"]');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="/pricing"]');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="/contact"]');
    await page.waitForLoadState('networkidle');

    // Verify final URL
    await expect(page).toHaveURL('/contact');

    // Verify navigation is still functional
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Test going back to home
    await page.click('a[href="/"]');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });

  test('should meet navigation performance requirements', async ({ page }) => {
    // Test navigation timing
    const start = Date.now();

    await page.click('a[href="/about"]');
    await page.waitForLoadState('networkidle');

    const navigationTime = Date.now() - start;

    // Should navigate in under 2 seconds (allowing for network delays)
    expect(navigationTime).toBeLessThan(2000);
  });

  test('should handle dropdown timing correctly', async ({ page }) => {
    // Test dropdown show/hide timing
    const servicesLink = page.locator('header nav a[href="/services"]');
    const dropdown = page.locator('[data-testid="services-dropdown"]');

    // Hover and measure time to show
    const showStart = Date.now();
    await servicesLink.hover();
    await dropdown.waitForElementState('visible');
    const showTime = Date.now() - showStart;

    // Should appear quickly (under 200ms)
    expect(showTime).toBeLessThan(200);

    // Move away and measure time to hide
    const hideStart = Date.now();
    await page.locator('header').hover({ position: { x: 10, y: 10 } });
    await dropdown.waitForElementState('hidden');
    const hideTime = Date.now() - hideStart;

    // Should hide with reasonable delay (under 1000ms)
    expect(hideTime).toBeLessThan(1000);
  });

  test('should work with browser back/forward buttons', async ({ page }) => {
    // Navigate forward through pages
    await page.click('a[href="/services"]');
    await page.waitForLoadState('networkidle');

    await page.click('a[href="/pricing"]');
    await page.waitForLoadState('networkidle');

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/services');

    // Verify navigation is still active
    const servicesLink = page.locator('header nav a[href="/services"]');
    await expect(servicesLink).toHaveClass(/active/);

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/pricing');

    const pricingLink = page.locator('header nav a[href="/pricing"]');
    await expect(pricingLink).toHaveClass(/active/);
  });

  test('should handle external link behavior', async ({ page }) => {
    // Note: Testing external links in E2E requires careful handling
    // We'll test that external links have proper attributes
    const externalLinks = page.locator('a[target="_blank"]');

    if (await externalLinks.count() > 0) {
      // Check first external link has security attributes
      const firstExternal = externalLinks.first();
      await expect(firstExternal).toHaveAttribute('rel', /noopener/);
    }
  });
});