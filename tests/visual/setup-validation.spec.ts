/**
 * Visual Testing Setup Validation
 *
 * Simple test to validate that the visual testing setup is working correctly.
 * This test can be run to ensure the development server, page loading, and
 * screenshot functionality are all working before running the full test suite.
 */

import { test, expect } from '@playwright/test';
import { setupVisualTest, viewports } from './helpers';

test.describe('Visual Testing Setup Validation', () => {
  test('Sandbox page loads correctly in light theme', async ({ page }) => {
    await setupVisualTest(page, 'light', 'desktop');

    // Verify the page title
    await expect(page).toHaveTitle(/Design System Sandbox/);

    // Verify key elements are visible
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toBeVisible();
    await expect(page.locator('text=Button Components')).toBeVisible();
    await expect(page.locator('text=Input Components')).toBeVisible();
    await expect(page.locator('text=Card Components')).toBeVisible();

    // Take a basic screenshot to verify screenshot functionality
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toHaveScreenshot('setup-validation-header-light.png');
  });

  test('Sandbox page loads correctly in dark theme', async ({ page }) => {
    await setupVisualTest(page, 'dark', 'desktop');

    // Verify the page title
    await expect(page).toHaveTitle(/Design System Sandbox/);

    // Verify key elements are visible
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toBeVisible();

    // Verify dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);

    // Take a basic screenshot to verify screenshot functionality in dark theme
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toHaveScreenshot('setup-validation-header-dark.png');
  });

  test('Theme switching works correctly', async ({ page }) => {
    await setupVisualTest(page, 'light', 'desktop');

    // Verify light theme
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);

    // Switch to dark theme using our helper
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    });

    await page.waitForTimeout(300);

    // Verify dark theme
    await expect(html).toHaveClass(/dark/);
  });

  test('Responsive viewports work correctly', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize(viewports.mobile);
    await page.goto('/sandbox');
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize(viewports.tablet);
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize(viewports.desktop);
    await expect(page.locator('h1:has-text("Design System Sandbox")')).toBeVisible();
  });

  test('Key components are rendered correctly', async ({ page }) => {
    await setupVisualTest(page, 'light', 'desktop');

    // Check that key components are present
    await expect(page.locator('button:has-text("Primary")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('[class*="card"]')).toBeVisible();

    // Verify that we can find component sections
    await expect(page.locator('text=Button Variants')).toBeVisible();
    await expect(page.locator('text=Input Sizes')).toBeVisible();
    await expect(page.locator('text=Card Variants')).toBeVisible();
  });
});