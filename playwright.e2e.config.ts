import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Configuration for Navigation Tests
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 2,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/e2e-html-report' }],
    ['json', { outputFile: 'test-results/e2e-test-results.json' }],
    ['list'] // Console output
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video recording */
    video: 'retain-on-failure',

    /* Additional settings for navigation tests */
    ignoreHTTPSErrors: true,

    /* Wait for page loads */
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },

  /* Configure projects for major browsers and devices */
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: [
        'tests/e2e/desktop-navigation.spec.ts',
        'tests/e2e/accessibility.spec.ts'
      ]
    },

    {
      name: 'Desktop Firefox',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: [
        'tests/e2e/desktop-navigation.spec.ts',
        'tests/e2e/accessibility.spec.ts'
      ]
    },

    {
      name: 'Desktop Safari',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 }
      },
      testMatch: [
        'tests/e2e/desktop-navigation.spec.ts',
        'tests/e2e/accessibility.spec.ts'
      ]
    },

    /* Mobile navigation tests */
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5']
      },
      testMatch: [
        'tests/e2e/mobile-navigation.spec.ts',
        'tests/e2e/accessibility.spec.ts'
      ]
    },

    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 12']
      },
      testMatch: [
        'tests/e2e/mobile-navigation.spec.ts',
        'tests/e2e/accessibility.spec.ts'
      ]
    },

    /* Tablet testing */
    {
      name: 'Tablet',
      use: {
        ...devices['iPad Pro'],
      },
      testMatch: [
        'tests/e2e/mobile-navigation.spec.ts'
      ]
    },

    /* Accessibility-focused testing */
    {
      name: 'Accessibility',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        // Additional accessibility settings
        extraHTTPHeaders: {
          // Force high contrast if supported
          'Sec-CH-Prefers-Color-Scheme': 'dark',
        }
      },
      testMatch: [
        'tests/e2e/accessibility.spec.ts'
      ]
    }
  ],

  /* E2E test timeout settings */
  timeout: 30000,
  expect: {
    /* Maximum time expect() should wait for the condition to be met */
    timeout: 5000,
  },

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe'
  },

  /* Output directories */
  outputDir: 'test-results/e2e-artifacts',
});