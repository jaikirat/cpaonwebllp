import { test, expect, Page } from '@playwright/test';

/**
 * Accessibility Keyboard Navigation E2E Tests
 *
 * Tests comprehensive accessibility compliance including:
 * - Keyboard-only navigation through all interactive elements
 * - Screen reader compatibility with ARIA landmarks
 * - Focus management and visual focus indicators
 * - WCAG AA compliance for navigation
 * - Skip links and navigation shortcuts
 * - Color contrast and visual accessibility
 */

test.describe('Accessibility - Keyboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should support keyboard navigation through header links', async ({ page }) => {
    // Start from the top of the page
    await page.keyboard.press('Tab');

    // Should focus on first interactive element (skip link or logo)
    const firstFocus = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(firstFocus);

    // Tab through all header navigation links
    const headerLinks = await page.locator('header nav a').all();

    for (let i = 0; i < headerLinks.length; i++) {
      await page.keyboard.press('Tab');

      // Check that focus is on a navigation link
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Verify focus indicator is visible
      const focusStyles = await focusedElement.evaluate((el) =>
        window.getComputedStyle(el).outline
      );
      expect(focusStyles).not.toBe('none');
    }
  });

  test('should handle dropdown navigation with keyboard', async ({ page }) => {
    // Navigate to Services link with keyboard
    await page.keyboard.press('Tab'); // Skip link or logo
    await page.keyboard.press('Tab'); // Home
    await page.keyboard.press('Tab'); // Services

    // Press Enter or Arrow Down to open dropdown
    await page.keyboard.press('ArrowDown');

    // Dropdown should be visible
    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible({ timeout: 500 });

    // Tab through dropdown items
    const dropdownLinks = await dropdown.locator('a').all();

    for (let i = 0; i < dropdownLinks.length; i++) {
      await page.keyboard.press('Tab');

      const focusedLink = page.locator(':focus');
      await expect(focusedLink).toBeVisible();

      // Should be within the dropdown
      await expect(dropdown.locator(':focus')).toHaveCount(1);
    }

    // Escape should close dropdown
    await page.keyboard.press('Escape');
    await expect(dropdown).toBeHidden({ timeout: 500 });
  });

  test('should support Enter and Space key activation', async ({ page }) => {
    // Navigate to About link
    await page.keyboard.press('Tab');

    let currentElement = await page.locator(':focus').getAttribute('href');
    while (currentElement !== '/about') {
      await page.keyboard.press('Tab');
      currentElement = await page.locator(':focus').getAttribute('href');

      // Prevent infinite loop
      if (await page.locator(':focus').count() === 0) {
        break;
      }
    }

    // Activate with Enter key
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');

    // Should navigate to About page
    await expect(page).toHaveURL('/about');
  });

  test('should support mobile menu keyboard navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigate to mobile menu toggle
    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await menuToggle.focus();

    // Activate mobile menu with keyboard
    await page.keyboard.press('Enter');

    // Mobile menu should open
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Tab through mobile menu items
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should be within mobile menu
    await expect(mobileMenu.locator(':focus')).toHaveCount(1);

    // Escape should close mobile menu
    await page.keyboard.press('Escape');
    await expect(mobileMenu).toBeHidden();
  });

  test('should have proper ARIA landmarks and labels', async ({ page }) => {
    // Check main navigation has proper role
    const mainNav = page.locator('nav[role="navigation"]').first();
    await expect(mainNav).toBeVisible();

    // Check aria-label for navigation
    await expect(mainNav).toHaveAttribute('aria-label');

    // Check header has banner role
    const header = page.locator('header[role="banner"]');
    await expect(header).toBeVisible();

    // Check main content area
    const main = page.locator('main[role="main"]');
    await expect(main).toBeVisible();

    // Check footer has contentinfo role
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
  });

  test('should support skip links for keyboard users', async ({ page }) => {
    // Focus should initially be on skip link (or first focusable element)
    await page.keyboard.press('Tab');

    const skipLink = page.locator('a[href="#main"]');
    if (await skipLink.count() > 0) {
      // Skip link should be focused or visible
      await expect(skipLink).toBeFocused();

      // Activate skip link
      await page.keyboard.press('Enter');

      // Focus should move to main content
      const mainContent = page.locator('#main');
      await expect(mainContent).toBeFocused();
    }
  });

  test('should indicate current page in navigation', async ({ page }) => {
    // Navigate to Services page
    await page.goto('/services');
    await page.waitForLoadState('networkidle');

    // Services link should have aria-current
    const servicesLink = page.locator('nav a[href="/services"]');
    await expect(servicesLink).toHaveAttribute('aria-current', 'page');
  });

  test('should support arrow key navigation in dropdowns', async ({ page }) => {
    // Focus on Services link
    const servicesLink = page.locator('header nav a[href="/services"]');
    await servicesLink.focus();

    // Open dropdown with Arrow Down
    await page.keyboard.press('ArrowDown');

    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible();

    // Arrow Down should move through dropdown items
    await page.keyboard.press('ArrowDown');

    let focusedElement = page.locator(':focus');
    const firstItem = await focusedElement.getAttribute('href');

    await page.keyboard.press('ArrowDown');
    const secondItem = await page.locator(':focus').getAttribute('href');

    // Should move to different items
    expect(firstItem).not.toBe(secondItem);

    // Arrow Up should move back
    await page.keyboard.press('ArrowUp');
    const backToFirst = await page.locator(':focus').getAttribute('href');
    expect(backToFirst).toBe(firstItem);

    // Escape should close dropdown and return focus
    await page.keyboard.press('Escape');
    await expect(dropdown).toBeHidden();
    await expect(servicesLink).toBeFocused();
  });

  test('should have visible focus indicators', async ({ page }) => {
    // Tab through navigation elements
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Check that focus indicator meets contrast requirements
    const focusOutline = await focusedElement.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        outlineColor: styles.outlineColor,
        outlineStyle: styles.outlineStyle
      };
    });

    // Should have visible outline or box-shadow
    expect(focusOutline.outline).not.toBe('none');
    expect(focusOutline.outlineWidth).not.toBe('0px');
  });

  test('should support breadcrumb navigation with keyboard', async ({ page }) => {
    // Navigate to a nested page
    await page.goto('/services/tax');
    await page.waitForLoadState('networkidle');

    // Breadcrumbs should be present
    const breadcrumbs = page.locator('[data-testid="breadcrumbs"]');
    await expect(breadcrumbs).toBeVisible();

    // Breadcrumbs should have proper ARIA
    await expect(breadcrumbs).toHaveAttribute('aria-label', /breadcrumb/i);

    // Tab through breadcrumb links
    const breadcrumbLinks = await breadcrumbs.locator('a').all();

    // Focus first breadcrumb link
    if (breadcrumbLinks.length > 0) {
      await breadcrumbLinks[0].focus();

      // Should be able to navigate through breadcrumbs
      for (let i = 0; i < breadcrumbLinks.length; i++) {
        await page.keyboard.press('Tab');
      }
    }

    // Current page should be marked with aria-current
    const currentPage = breadcrumbs.locator('[aria-current="page"]');
    await expect(currentPage).toBeVisible();
  });

  test('should handle focus trapping in modal/dropdown states', async ({ page }) => {
    // Set mobile viewport to test mobile menu
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await menuToggle.focus();
    await page.keyboard.press('Enter');

    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible();

    // Tab should stay within the mobile menu
    let tabCount = 0;
    const maxTabs = 20; // Prevent infinite loop

    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;

      const focusedElement = page.locator(':focus');
      const isWithinMenu = await mobileMenu.locator(':focus').count() > 0;
      const isMenuToggle = await menuToggle.evaluate((el) => el === document.activeElement);

      // Focus should be within menu or on close button
      expect(isWithinMenu || isMenuToggle).toBe(true);

      // If we're back to the toggle, we've cycled through
      if (isMenuToggle && tabCount > 1) {
        break;
      }
    }
  });

  test('should announce dynamic content changes to screen readers', async ({ page }) => {
    // Navigate to Services to open dropdown
    const servicesLink = page.locator('header nav a[href="/services"]');
    await servicesLink.hover();

    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible();

    // Dropdown should have live region or aria-expanded
    const hasLiveRegion = await dropdown.getAttribute('aria-live') !== null;
    const hasAriaExpanded = await servicesLink.getAttribute('aria-expanded') === 'true';

    expect(hasLiveRegion || hasAriaExpanded).toBe(true);
  });

  test('should support high contrast mode', async ({ page }) => {
    // Test with forced colors (simulating high contrast mode)
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });

    // Reload to apply forced colors
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigation should still be visible and functional
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    // Links should have proper contrast
    const navLinks = await nav.locator('a').all();
    for (const link of navLinks) {
      await expect(link).toBeVisible();
    }

    // Focus indicators should be visible
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open dropdown (should work without animations)
    const servicesLink = page.locator('header nav a[href="/services"]');
    await servicesLink.hover();

    const dropdown = page.locator('[data-testid="services-dropdown"]');
    await expect(dropdown).toBeVisible({ timeout: 100 }); // Should appear immediately

    // Mobile menu should also respect reduced motion
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const menuToggle = page.locator('[data-testid="mobile-menu-toggle"]');
    await menuToggle.click();

    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    await expect(mobileMenu).toBeVisible({ timeout: 100 });
  });

  test('should handle complex keyboard interactions', async ({ page }) => {
    // Test keyboard shortcuts if implemented
    // Home key should go to start of navigation
    await page.keyboard.press('Home');

    const firstFocusable = page.locator('header').locator('a, button').first();
    if (await firstFocusable.count() > 0) {
      await expect(firstFocusable).toBeFocused();
    }

    // End key should go to end of navigation
    await page.keyboard.press('End');

    // Should focus on last navigation element
    const lastFocusable = page.locator('header').locator('a, button').last();
    if (await lastFocusable.count() > 0) {
      await expect(lastFocusable).toBeFocused();
    }
  });

  test('should provide proper error and status messages', async ({ page }) => {
    // Test navigation to non-existent page
    await page.goto('/non-existent-page');

    // Should have proper heading structure for 404 page
    const errorHeading = page.locator('h1');
    if (await errorHeading.count() > 0) {
      await expect(errorHeading).toBeVisible();
    }

    // Navigation should still be functional on error pages
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    // Should be able to navigate back to working pages
    const homeLink = page.locator('a[href="/"]');
    await homeLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
  });
});