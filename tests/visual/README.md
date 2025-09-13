# Visual Regression Tests

This directory contains comprehensive visual regression tests for the design system components using Playwright.

## Overview

The visual regression tests in `components.spec.ts` provide comprehensive coverage of:

### Components Tested
- **Button Component**: All variants (primary, secondary, outline, ghost, destructive) in light/dark themes
- **Input Component**: Various states (normal, error, disabled, success, warning) in light/dark themes
- **Card Component**: Different variants and configurations with headers, content, and footers

### Test Coverage
- **Theme Testing**: Both light and dark themes
- **Responsive Testing**: Mobile (375px), Tablet (768px), Desktop (1200px) viewports
- **Interactive States**: Hover, focus, active states
- **Component Integration**: How components work together in complex layouts
- **Theme Switching**: Testing the theme toggle functionality

## Running Visual Tests

### Basic Commands

```bash
# Run all visual regression tests
npm run test:visual

# Run with UI mode (interactive)
npm run test:visual:ui

# Run in headed mode (visible browser)
npm run test:visual:headed

# Debug tests
npm run test:visual:debug

# Update snapshots when designs change
npm run test:visual:update
```

### Browser-Specific Testing

```bash
# Test only in Chromium
npm run test:visual:chromium

# Test only in Firefox
npm run test:visual:firefox

# Test only in WebKit (Safari)
npm run test:visual:webkit

# Test only mobile viewports
npm run test:visual:mobile
```

## Test Structure

### Test Groups

1. **Button Component Visual Regression**
   - Button variants across themes and viewports
   - Button sizes and states
   - Icon integration
   - Loading states
   - Full width variants

2. **Input Component Visual Regression**
   - Input sizes and states
   - Icon integration
   - Interactive features
   - Form integration

3. **Card Component Visual Regression**
   - Card variants and sizes
   - Structured cards (header/content/footer)
   - Interactive cards
   - Complex layouts

4. **Theme System Visual Regression**
   - Theme-aware components
   - Transition effects
   - Design system overview

5. **Interactive States Testing**
   - Hover states
   - Focus states
   - Active states

6. **Responsive Layout Testing**
   - Mobile layouts
   - Tablet layouts
   - Desktop layouts

### Helper Functions

- `setTheme(page, theme)`: Switch between light and dark themes
- `waitForPageStability(page)`: Wait for animations and loading to complete
- `takeComponentScreenshot()`: Capture component screenshots with consistent naming

## Snapshot Management

### Updating Snapshots

When component designs change, you'll need to update the visual snapshots:

```bash
# Update all snapshots
npm run test:visual:update

# Update specific test group
npx playwright test "Button Component" --update-snapshots

# Update snapshots for specific browser
npm run test:visual:chromium --update-snapshots
```

### Snapshot Naming Convention

Snapshots follow the pattern: `{component-name}-{theme}-{viewport}.png`

Examples:
- `button-variants-light-desktop.png`
- `input-states-dark-mobile.png`
- `card-variants-light-tablet.png`

## Configuration

The tests are configured in `playwright.config.ts` with:

- **Visual Comparison Settings**: 0.2 pixel threshold for differences
- **Animation Handling**: Animations disabled for consistent screenshots
- **Multi-browser Support**: Chromium, Firefox, WebKit, and mobile variants
- **Local Development Server**: Automatically starts Next.js dev server

## Best Practices

### Writing Visual Tests

1. **Consistent Setup**: Always call `waitForPageStability()` before screenshots
2. **Theme Testing**: Test both light and dark themes for all components
3. **Responsive Testing**: Include mobile, tablet, and desktop viewports
4. **Stable Selectors**: Use reliable CSS selectors or test IDs
5. **Animation Control**: Disable animations for consistent results

### Debugging Failed Tests

1. **Use UI Mode**: `npm run test:visual:ui` for interactive debugging
2. **Check Diffs**: Playwright shows visual differences between expected and actual
3. **Update When Valid**: Use `--update-snapshots` when changes are intentional
4. **Test in Isolation**: Run single test files to isolate issues

### Performance Tips

1. **Parallel Execution**: Tests run in parallel by default
2. **Browser Optimization**: Use `--project` flag to test specific browsers
3. **Selective Testing**: Focus on changed components during development
4. **CI Optimization**: Use `CI` environment variable for stable CI runs

## Troubleshooting

### Common Issues

1. **Flaky Tests**: Usually caused by animations or loading states
   - Solution: Increase wait times or disable animations

2. **Font Rendering Differences**: Different OS/browsers render fonts differently
   - Solution: Use web fonts and consistent font settings

3. **Viewport Issues**: Components not rendering correctly at different sizes
   - Solution: Check responsive CSS and viewport meta tags

### Development Workflow

1. **Make Component Changes**: Modify components in `src/components/ui/`
2. **Run Visual Tests**: `npm run test:visual`
3. **Review Differences**: Check if changes are expected
4. **Update Snapshots**: `npm run test:visual:update` if changes are correct
5. **Commit Changes**: Include both code and snapshot updates

## Integration with CI/CD

The visual tests are designed to work in CI environments:

- **Deterministic Results**: Consistent rendering across environments
- **Snapshot Storage**: Snapshots are version controlled
- **Failure Reporting**: Clear diff reports for failed tests
- **Performance Optimized**: Minimal resource usage in CI

For more information about Playwright, visit: https://playwright.dev/