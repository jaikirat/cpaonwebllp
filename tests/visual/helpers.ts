/**
 * Visual Testing Helper Functions
 *
 * Common utilities and helpers for visual regression tests
 */

import { Page, expect } from '@playwright/test';

// Viewport configurations
export const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
} as const;

export type ViewportName = keyof typeof viewports;

// Theme configurations
export const themes = ['light', 'dark'] as const;
export type Theme = typeof themes[number];

/**
 * Set theme on the page and wait for transitions
 */
export async function setTheme(page: Page, theme: Theme): Promise<void> {
  await page.evaluate((theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, theme);

  // Wait for theme transition to complete
  await page.waitForTimeout(300);
}

/**
 * Wait for page to be fully loaded and stable for screenshots
 */
export async function waitForPageStability(page: Page): Promise<void> {
  // Wait for all animations and transitions to complete
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);

  // Disable animations for consistent screenshots
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}

/**
 * Take component screenshot with consistent naming and options
 */
export async function takeComponentScreenshot(
  page: Page,
  selector: string,
  name: string,
  theme: Theme,
  viewport: ViewportName
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  await expect(element).toHaveScreenshot(`${name}-${theme}-${viewport}.png`, {
    animations: 'disabled',
    mask: [page.locator('[data-testid="loading-spinner"]')],
  });
}

/**
 * Setup page for visual testing with theme and viewport
 */
export async function setupVisualTest(
  page: Page,
  theme: Theme,
  viewport: ViewportName,
  path = '/sandbox'
): Promise<void> {
  await page.setViewportSize(viewports[viewport]);
  await page.goto(path);
  await waitForPageStability(page);
  await setTheme(page, theme);
}

/**
 * Get common test data for all theme and viewport combinations
 */
export function getTestCombinations() {
  const combinations: Array<{ theme: Theme; viewport: ViewportName; viewportConfig: { width: number; height: number } }> = [];

  for (const theme of themes) {
    for (const [viewportName, viewportConfig] of Object.entries(viewports)) {
      combinations.push({
        theme,
        viewport: viewportName as ViewportName,
        viewportConfig
      });
    }
  }

  return combinations;
}

/**
 * Common selectors for sandbox components
 */
export const selectors = {
  // Button selectors
  buttonVariants: '.space-y-8 .flex.flex-wrap.gap-4',
  buttonSizes: 'text=Button Sizes >> .. >> .. >> .flex.flex-wrap.items-center.gap-4',
  buttonWithIcons: 'text=Buttons with Icons >> .. >> .. >> .space-y-3',
  buttonStates: 'text=Button States >> .. >> .. >> .space-y-4',
  buttonLoadingStates: 'text=Loading States Demo >> .. >> .. >> .space-y-3',
  buttonFullWidth: 'text=Full Width Buttons >> .. >> .. >> .space-y-3.max-w-md',

  // Input selectors
  inputSizes: 'text=Input Sizes >> .. >> .. >> .space-y-4',
  inputStates: 'text=Input States >> .. >> .. >> .space-y-4',
  inputWithIcons: 'text=Input with Icons >> .. >> .. >> .space-y-4',
  inputInteractiveFeatures: 'text=Interactive Features >> .. >> .. >> .space-y-4',
  inputTypes: 'text=Input Types >> .. >> .. >> .grid.grid-cols-1.md\\:grid-cols-2.gap-6',
  completeForm: 'text=Complete Form Example >> .. >> .. >> form.space-y-4.max-w-md',

  // Card selectors
  cardVariants: 'text=Card Variants >> .. >> .. >> .grid.gap-4',
  cardSizes: 'text=Card Sizes >> .. >> .. >> .space-y-4',
  structuredCards: '.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
  interactiveCards: '.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 >> nth=1',
  complexCardLayouts: 'text=Complex Card Layouts >> .. >> .. >> .grid.grid-cols-1.md\\:grid-cols-2.gap-6',

  // Theme selectors
  themeAwareComponents: 'text=Theme-Aware Card >> .. >> .. >> .. >> .grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
  themeTransitionEffects: 'text=Theme Transition Effects >> .. >> .. >> .space-y-6',
  designSystemOverview: 'text=Design System Overview >> .. >> .grid.gap-6.grid-cols-1',

  // Layout selectors
  mainContent: 'main.max-w-7xl.mx-auto',
  themeControls: '[data-testid="theme-controls"], .flex.items-center.justify-center.gap-4',
} as const;

/**
 * Wait for component to be in a stable state before screenshot
 */
export async function waitForComponentStability(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  // Wait for any lazy loading or dynamic content
  await page.waitForTimeout(100);

  // Ensure no loading states are present
  await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible().catch(() => {
    // Ignore if loading spinner doesn't exist
  });
}

/**
 * Test interactive state of a component
 */
export async function testInteractiveState(
  page: Page,
  selector: string,
  state: 'hover' | 'focus' | 'active',
  screenshotName: string
): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  switch (state) {
    case 'hover':
      await element.hover();
      break;
    case 'focus':
      await element.focus();
      break;
    case 'active':
      await element.dispatchEvent('mousedown');
      break;
  }

  await page.waitForTimeout(100);

  await expect(element).toHaveScreenshot(`${screenshotName}-${state}.png`, {
    animations: 'disabled',
  });

  // Reset state
  if (state === 'active') {
    await element.dispatchEvent('mouseup');
  } else if (state === 'focus') {
    await page.keyboard.press('Tab');
  }
}

/**
 * Compare full page screenshots between themes
 */
export async function compareFullPageThemes(
  page: Page,
  name: string,
  viewport: ViewportName
): Promise<void> {
  await setupVisualTest(page, 'light', viewport);
  await expect(page).toHaveScreenshot(`${name}-light-${viewport}.png`, {
    animations: 'disabled',
    fullPage: true,
  });

  await setupVisualTest(page, 'dark', viewport);
  await expect(page).toHaveScreenshot(`${name}-dark-${viewport}.png`, {
    animations: 'disabled',
    fullPage: true,
  });
}