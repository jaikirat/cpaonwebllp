import { test, expect, Page } from '@playwright/test';

/**
 * Mobile Navigation E2E Tests
 *
 * Tests the complete mobile navigation experience including:
 * - Mobile menu toggle functionality
 * - Touch interactions
 * - Responsive behavior across different screen sizes
 * - Mobile dropdown/accordion menus
 * - Swipe gestures
 * - Performance on mobile devices
 */

// Configure tests to run on mobile viewports
test.use({
  viewport: { width: 375, height: 667 } // iPhone SE size
});

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display mobile menu toggle button on small screens', async ({ page }) => {
    // Check that mobile menu toggle is visible
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuToggle).toBeVisible();

    // Check that desktop navigation is hidden on mobile
    const desktopNav = page.locator('[data-testid="desktop-navigation"]');
    await expect(desktopNav).toBeHidden();

    // Verify toggle button has proper accessibility
    await expect(menuToggle).toHaveAttribute('aria-label');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should open mobile menu when toggle button is tapped', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Initially menu should be closed
    await expect(mobileMenu).toBeHidden();

    // Tap the menu toggle
    await menuToggle.tap();

    // Menu should open
    await expect(mobileMenu).toBeVisible({ timeout: 500 });
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
  });

  test('should close mobile menu when toggle button is tapped again', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open the menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Close the menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeHidden({ timeout: 500 });
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should display all navigation links in mobile menu', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

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
      const navLink = mobileMenu.locator(`a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toContainText(link.text);
    }
  });

  test('should handle Services submenu in mobile navigation', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Find Services link/button
    const servicesToggle = mobileMenu.locator('[data-testid="services-toggle"]');
    await expect(servicesToggle).toBeVisible();

    // Tap to expand Services submenu
    await servicesToggle.tap();

    // Check Services submenu items are visible
    const expectedServices = [
      { text: 'Tax Services', href: '/services/tax' },
      { text: 'Accounting', href: '/services/accounting' },
      { text: 'Advisory', href: '/services/advisory' }
    ];

    for (const service of expectedServices) {
      const serviceLink = mobileMenu.locator(`a[href="${service.href}"]`);
      await expect(serviceLink).toBeVisible();
      await expect(serviceLink).toContainText(service.text);
    }
  });

  test('should handle Resources submenu in mobile navigation', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Find Resources toggle
    const resourcesToggle = mobileMenu.locator('[data-testid="resources-toggle"]');
    await expect(resourcesToggle).toBeVisible();

    // Tap to expand Resources submenu
    await resourcesToggle.tap();

    // Check Resources submenu items are visible
    const expectedResources = [
      { text: 'Blog', href: '/resources/blog' },
      { text: 'Guides', href: '/resources/guides' },
      { text: 'Calculators', href: '/resources/calculators' }
    ];

    for (const resource of expectedResources) {
      const resourceLink = mobileMenu.locator(`a[href="${resource.href}"]`);
      await expect(resourceLink).toBeVisible();
      await expect(resourceLink).toContainText(resource.text);
    }
  });

  test('should close mobile menu when navigation link is tapped', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Tap on a navigation link
    const aboutLink = mobileMenu.locator('a[href="/about"]');
    await aboutLink.tap();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Menu should close and page should navigate
    await expect(mobileMenu).toBeHidden();
    await expect(page).toHaveURL('/about');
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should close mobile menu when tapping outside', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Tap outside the menu (on the main content)
    await page.locator('main').tap();

    // Menu should close
    await expect(mobileMenu).toBeHidden({ timeout: 500 });
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should handle different screen sizes responsively', async ({ page }) => {
    // Test tablet size (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Mobile toggle should still be visible on tablet
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuToggle).toBeVisible();

    // Test larger mobile size (414px - iPhone Plus)
    await page.setViewportSize({ width: 414, height: 736 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Mobile toggle should be visible
    await expect(menuToggle).toBeVisible();

    // Test very small screen (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Mobile toggle should still work
    await expect(menuToggle).toBeVisible();
    await menuToggle.tap();

    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();
  });

  test('should support touch gestures for menu interaction', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open menu with touch
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Test scrolling within the menu if content is long
    const menuItems = mobileMenu.locator('nav a');
    const itemCount = await menuItems.count();

    if (itemCount > 5) {
      // Try to scroll within the menu
      const menuContainer = mobileMenu.locator('nav');
      await menuContainer.scroll({ top: 100 });

      // Menu should still be open after scrolling
      await expect(mobileMenu).toBeVisible();
    }
  });

  test('should meet mobile navigation performance requirements', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Test menu open timing
    const openStart = Date.now();
    await menuToggle.tap();
    await mobileMenu.waitForElementState('visible');
    const openTime = Date.now() - openStart;

    // Should open quickly (under 200ms)
    expect(openTime).toBeLessThan(200);

    // Test menu close timing
    const closeStart = Date.now();
    await menuToggle.tap();
    await mobileMenu.waitForElementState('hidden');
    const closeTime = Date.now() - closeStart;

    // Should close quickly (under 200ms)
    expect(closeTime).toBeLessThan(200);
  });

  test('should handle orientation changes', async ({ page }) => {
    // Start in portrait mode
    await page.setViewportSize({ width: 375, height: 667 });

    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await expect(menuToggle).toBeVisible();

    // Open menu
    await menuToggle.tap();
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Change to landscape mode
    await page.setViewportSize({ width: 667, height: 375 });

    // Menu should still work in landscape
    await expect(menuToggle).toBeVisible();
    await expect(mobileMenu).toBeVisible();

    // Close and reopen menu in landscape
    await menuToggle.tap();
    await expect(mobileMenu).toBeHidden();

    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();
  });

  test('should show active link state in mobile menu', async ({ page }) => {
    // Navigate to About page
    await page.goto('/about');
    await page.waitForLoadState('networkidle');

    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Check that About link has active state
    const aboutLink = mobileMenu.locator('a[href="/about"]');
    await expect(aboutLink).toHaveClass(/active/);

    // Check that other links don't have active state
    const homeLink = mobileMenu.locator('a[href="/"]');
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('should handle submenu toggle states correctly', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open mobile menu
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    // Initially, Services submenu should be collapsed
    const servicesToggle = mobileMenu.locator('[data-testid="services-toggle"]');
    await expect(servicesToggle).toHaveAttribute('aria-expanded', 'false');

    // Expand Services submenu
    await servicesToggle.tap();
    await expect(servicesToggle).toHaveAttribute('aria-expanded', 'true');

    // Collapse Services submenu
    await servicesToggle.tap();
    await expect(servicesToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should maintain menu state during navigation', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Open menu and expand Services
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();

    const servicesToggle = mobileMenu.locator('[data-testid="services-toggle"]');
    await servicesToggle.tap();

    // Navigate to tax services
    const taxLink = mobileMenu.locator('a[href="/services/tax"]');
    await taxLink.tap();
    await page.waitForLoadState('networkidle');

    // Menu should close after navigation
    await expect(mobileMenu).toBeHidden();

    // When reopening menu, Services should be collapsed again
    await menuToggle.tap();
    await expect(servicesToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should handle rapid menu toggle interactions', async ({ page }) => {
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');

    // Rapidly toggle menu multiple times
    await menuToggle.tap();
    await menuToggle.tap();
    await menuToggle.tap();
    await menuToggle.tap();

    // Final state should be consistent (closed)
    await expect(mobileMenu).toBeHidden();
    await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');

    // Should still work normally after rapid toggling
    await menuToggle.tap();
    await expect(mobileMenu).toBeVisible();
  });
});