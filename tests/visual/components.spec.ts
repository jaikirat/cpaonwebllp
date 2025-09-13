/**
 * T021: Visual Regression Tests for Design System Components
 *
 * Comprehensive visual regression testing for Button, Input, and Card components
 * covering all variants, states, themes, and responsive layouts using Playwright.
 *
 * Test Coverage:
 * - Button: all variants (primary, secondary, outline, ghost, link, destructive) in light/dark themes
 * - Input: normal, error, disabled states in light/dark themes
 * - Card: header, content, footer variations in light/dark themes
 * - Responsive layouts: mobile (320px), tablet (768px), desktop (1200px)
 * - Theme switching functionality on sandbox page
 * - Interactive states (hover, focus, active)
 */

import { test, expect, Page } from '@playwright/test';

// Viewport configurations for responsive testing
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
} as const;

type ViewportName = keyof typeof viewports;

// Theme configurations
const themes = ['light', 'dark'] as const;
type Theme = typeof themes[number];

/**
 * Helper function to set theme on the page
 */
async function setTheme(page: Page, theme: Theme): Promise<void> {
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
 * Helper function to wait for page to be fully loaded and stable
 */
async function waitForPageStability(page: Page): Promise<void> {
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
 * Helper function to take component screenshot
 */
async function takeComponentScreenshot(
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

test.describe('Button Component Visual Regression', () => {
  for (const theme of themes) {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      test(`Button variants - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Navigate to button variants section
        const buttonVariantsSection = page.locator('[data-testid="button-variants"], .space-y-8 .flex.flex-wrap.gap-4').first();
        await expect(buttonVariantsSection).toBeVisible();

        // Take screenshot of all button variants
        await takeComponentScreenshot(
          page,
          '.space-y-8 .flex.flex-wrap.gap-4',
          'button-variants',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Button sizes - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find button sizes section
        const buttonSizesSection = page.locator('text=Button Sizes').locator('..').locator('..').locator('.flex.flex-wrap.items-center.gap-4');
        await expect(buttonSizesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Button Sizes >> .. >> .. >> .flex.flex-wrap.items-center.gap-4',
          'button-sizes',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Button with icons - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find button with icons section
        const buttonIconsSection = page.locator('text=Buttons with Icons').locator('..').locator('..').locator('.space-y-3').first();
        await expect(buttonIconsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Buttons with Icons >> .. >> .. >> .space-y-3',
          'button-with-icons',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Button states - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find button states section
        const buttonStatesSection = page.locator('text=Button States').locator('..').locator('..').locator('.space-y-4').first();
        await expect(buttonStatesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Button States >> .. >> .. >> .space-y-4',
          'button-states',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Button loading states - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find loading states demo section
        const loadingStatesSection = page.locator('text=Loading States Demo').locator('..').locator('..').locator('.space-y-3').first();
        await expect(loadingStatesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Loading States Demo >> .. >> .. >> .space-y-3',
          'button-loading-states',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Button full width - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find full width buttons section
        const fullWidthSection = page.locator('text=Full Width Buttons').locator('..').locator('..').locator('.space-y-3.max-w-md');
        await expect(fullWidthSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Full Width Buttons >> .. >> .. >> .space-y-3.max-w-md',
          'button-full-width',
          theme,
          viewportName as ViewportName
        );
      });
    }
  }
});

test.describe('Input Component Visual Regression', () => {
  for (const theme of themes) {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      test(`Input sizes - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find input sizes section
        const inputSizesSection = page.locator('text=Input Sizes').locator('..').locator('..').locator('.space-y-4').first();
        await expect(inputSizesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Input Sizes >> .. >> .. >> .space-y-4',
          'input-sizes',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Input states - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find input states section
        const inputStatesSection = page.locator('text=Input States').locator('..').locator('..').locator('.space-y-4').first();
        await expect(inputStatesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Input States >> .. >> .. >> .space-y-4',
          'input-states',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Input with icons - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find input with icons section
        const inputIconsSection = page.locator('text=Input with Icons').locator('..').locator('..').locator('.space-y-4').first();
        await expect(inputIconsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Input with Icons >> .. >> .. >> .space-y-4',
          'input-with-icons',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Input interactive features - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find interactive features section
        const interactiveFeaturesSection = page.locator('text=Interactive Features').locator('..').locator('..').locator('.space-y-4').first();
        await expect(interactiveFeaturesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Interactive Features >> .. >> .. >> .space-y-4',
          'input-interactive-features',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Input types showcase - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find input types section
        const inputTypesSection = page.locator('text=Input Types').locator('..').locator('..').locator('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
        await expect(inputTypesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Input Types >> .. >> .. >> .grid.grid-cols-1.md\\:grid-cols-2.gap-6',
          'input-types',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Complete form example - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find complete form example section
        const formSection = page.locator('text=Complete Form Example').locator('..').locator('..').locator('form.space-y-4.max-w-md');
        await expect(formSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Complete Form Example >> .. >> .. >> form.space-y-4.max-w-md',
          'complete-form',
          theme,
          viewportName as ViewportName
        );
      });
    }
  }
});

test.describe('Card Component Visual Regression', () => {
  for (const theme of themes) {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      test(`Card variants - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find card variants section
        const cardVariantsSection = page.locator('text=Card Variants').locator('..').locator('..').locator('.grid.gap-4');
        await expect(cardVariantsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Card Variants >> .. >> .. >> .grid.gap-4',
          'card-variants',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Card sizes - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find card sizes section
        const cardSizesSection = page.locator('text=Card Sizes').locator('..').locator('..').locator('.space-y-4').first();
        await expect(cardSizesSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Card Sizes >> .. >> .. >> .space-y-4',
          'card-sizes',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Structured cards - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find structured cards section (cards with header, content, footer)
        const structuredCardsSection = page.locator('.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3').first();
        await expect(structuredCardsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          '.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
          'structured-cards',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Interactive cards - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find interactive and special cards section
        const interactiveCardsSection = page.locator('.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3').nth(1);
        await expect(interactiveCardsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          '.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 >> nth=1',
          'interactive-cards',
          theme,
          viewportName as ViewportName
        );
      });

      test(`Complex card layouts - ${theme} theme - ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto('/sandbox');
        await waitForPageStability(page);
        await setTheme(page, theme);

        // Find complex card layouts section
        const complexCardsSection = page.locator('text=Complex Card Layouts').locator('..').locator('..').locator('.grid.grid-cols-1.md\\:grid-cols-2.gap-6').first();
        await expect(complexCardsSection).toBeVisible();

        await takeComponentScreenshot(
          page,
          'text=Complex Card Layouts >> .. >> .. >> .grid.grid-cols-1.md\\:grid-cols-2.gap-6',
          'complex-card-layouts',
          theme,
          viewportName as ViewportName
        );
      });
    }
  }
});

test.describe('Theme System Visual Regression', () => {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    test(`Theme-aware components - light theme - ${viewportName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/sandbox');
      await waitForPageStability(page);
      await setTheme(page, 'light');

      // Find theme-aware component showcase
      const themeShowcaseSection = page.locator('text=Theme-Aware Card').locator('..').locator('..').locator('..').locator('.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3').first();
      await expect(themeShowcaseSection).toBeVisible();

      await takeComponentScreenshot(
        page,
        'text=Theme-Aware Card >> .. >> .. >> .. >> .grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
        'theme-aware-components',
        'light',
        viewportName as ViewportName
      );
    });

    test(`Theme-aware components - dark theme - ${viewportName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/sandbox');
      await waitForPageStability(page);
      await setTheme(page, 'dark');

      // Find theme-aware component showcase
      const themeShowcaseSection = page.locator('text=Theme-Aware Card').locator('..').locator('..').locator('..').locator('.grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3').first();
      await expect(themeShowcaseSection).toBeVisible();

      await takeComponentScreenshot(
        page,
        'text=Theme-Aware Card >> .. >> .. >> .. >> .grid.gap-6.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
        'theme-aware-components',
        'dark',
        viewportName as ViewportName
      );
    });

    test(`Theme transition effects - ${viewportName}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/sandbox');
      await waitForPageStability(page);
      await setTheme(page, 'light');

      // Find theme transition demonstration section
      const transitionSection = page.locator('text=Theme Transition Effects').locator('..').locator('..').locator('.space-y-6');
      await expect(transitionSection).toBeVisible();

      await takeComponentScreenshot(
        page,
        'text=Theme Transition Effects >> .. >> .. >> .space-y-6',
        'theme-transition-effects-light',
        'light',
        viewportName as ViewportName
      );

      // Switch to dark theme and capture
      await setTheme(page, 'dark');
      await takeComponentScreenshot(
        page,
        'text=Theme Transition Effects >> .. >> .. >> .space-y-6',
        'theme-transition-effects-dark',
        'dark',
        viewportName as ViewportName
      );
    });
  }
});

test.describe('Theme Switching Functionality', () => {
  test('Theme controls - light to dark transition', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);

    // Ensure we start in light mode
    await setTheme(page, 'light');

    // Find and click theme toggle
    const themeControls = page.locator('[data-testid="theme-controls"], .flex.items-center.justify-center.gap-4').first();
    await expect(themeControls).toBeVisible();

    // Take screenshot of theme controls in light mode
    await expect(themeControls).toHaveScreenshot('theme-controls-light-desktop.png', {
      animations: 'disabled',
    });

    // Switch to dark theme
    await setTheme(page, 'dark');

    // Take screenshot of theme controls in dark mode
    await expect(themeControls).toHaveScreenshot('theme-controls-dark-desktop.png', {
      animations: 'disabled',
    });
  });

  test('Full page theme switching', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);

    // Test light theme - full page screenshot
    await setTheme(page, 'light');
    await expect(page).toHaveScreenshot('sandbox-page-light-desktop.png', {
      animations: 'disabled',
      fullPage: true,
    });

    // Test dark theme - full page screenshot
    await setTheme(page, 'dark');
    await expect(page).toHaveScreenshot('sandbox-page-dark-desktop.png', {
      animations: 'disabled',
      fullPage: true,
    });
  });

  test('Design system overview section', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);

    // Test light theme
    await setTheme(page, 'light');

    const designSystemSection = page.locator('text=Design System Overview').locator('..').locator('.grid.gap-6.grid-cols-1').first();
    await expect(designSystemSection).toBeVisible();

    await expect(designSystemSection).toHaveScreenshot('design-system-overview-light-desktop.png', {
      animations: 'disabled',
    });

    // Test dark theme
    await setTheme(page, 'dark');

    await expect(designSystemSection).toHaveScreenshot('design-system-overview-dark-desktop.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Interactive States Visual Testing', () => {
  test('Button hover states', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);
    await setTheme(page, 'light');

    // Find the first primary button
    const primaryButton = page.locator('button:has-text("Primary")').first();
    await expect(primaryButton).toBeVisible();

    // Test normal state
    await expect(primaryButton).toHaveScreenshot('button-primary-normal.png', {
      animations: 'disabled',
    });

    // Test hover state
    await primaryButton.hover();
    await page.waitForTimeout(100);
    await expect(primaryButton).toHaveScreenshot('button-primary-hover.png', {
      animations: 'disabled',
    });
  });

  test('Input focus states', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);
    await setTheme(page, 'light');

    // Find the first input
    const firstInput = page.locator('input[type="text"]').first();
    await expect(firstInput).toBeVisible();

    // Test normal state
    await expect(firstInput).toHaveScreenshot('input-normal.png', {
      animations: 'disabled',
    });

    // Test focus state
    await firstInput.focus();
    await page.waitForTimeout(100);
    await expect(firstInput).toHaveScreenshot('input-focus.png', {
      animations: 'disabled',
    });
  });

  test('Card interactive states', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);
    await setTheme(page, 'light');

    // Find an interactive card
    const interactiveCard = page.locator('text=Interactive Card').locator('..');
    await expect(interactiveCard).toBeVisible();

    // Test normal state
    await expect(interactiveCard).toHaveScreenshot('card-interactive-normal.png', {
      animations: 'disabled',
    });

    // Test hover state
    await interactiveCard.hover();
    await page.waitForTimeout(100);
    await expect(interactiveCard).toHaveScreenshot('card-interactive-hover.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Responsive Layout Testing', () => {
  for (const theme of themes) {
    test(`Responsive grid layouts - ${theme} theme`, async ({ page }) => {
      await setTheme(page, theme);

      // Test mobile viewport
      await page.setViewportSize(viewports.mobile);
      await page.goto('/sandbox');
      await waitForPageStability(page);

      const mainContent = page.locator('main.max-w-7xl.mx-auto');
      await expect(mainContent).toBeVisible();
      await expect(mainContent).toHaveScreenshot(`sandbox-main-content-${theme}-mobile.png`, {
        animations: 'disabled',
      });

      // Test tablet viewport
      await page.setViewportSize(viewports.tablet);
      await page.waitForTimeout(300);
      await expect(mainContent).toHaveScreenshot(`sandbox-main-content-${theme}-tablet.png`, {
        animations: 'disabled',
      });

      // Test desktop viewport
      await page.setViewportSize(viewports.desktop);
      await page.waitForTimeout(300);
      await expect(mainContent).toHaveScreenshot(`sandbox-main-content-${theme}-desktop.png`, {
        animations: 'disabled',
      });
    });
  }
});

test.describe('Component Integration Testing', () => {
  test('Components working together', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);
    await setTheme(page, 'light');

    // Test a complex section with multiple components
    const complexSection = page.locator('text=User Profile Card').locator('..').locator('..');
    await expect(complexSection).toBeVisible();

    await expect(complexSection).toHaveScreenshot('complex-component-integration-light.png', {
      animations: 'disabled',
    });

    // Test in dark theme
    await setTheme(page, 'dark');
    await expect(complexSection).toHaveScreenshot('complex-component-integration-dark.png', {
      animations: 'disabled',
    });
  });

  test('Form integration with all components', async ({ page }) => {
    await page.setViewportSize(viewports.desktop);
    await page.goto('/sandbox');
    await waitForPageStability(page);
    await setTheme(page, 'light');

    // Find the complete form example
    const formExample = page.locator('text=Complete Form Example').locator('..').locator('..').locator('form');
    await expect(formExample).toBeVisible();

    await expect(formExample).toHaveScreenshot('form-integration-light.png', {
      animations: 'disabled',
    });

    // Test in dark theme
    await setTheme(page, 'dark');
    await expect(formExample).toHaveScreenshot('form-integration-dark.png', {
      animations: 'disabled',
    });
  });
});