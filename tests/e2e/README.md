# End-to-End Navigation Tests

This directory contains comprehensive end-to-end tests for the global navigation system implemented in Phase 3.6 of the project.

## Test Files

### 1. Desktop Navigation Tests (`desktop-navigation.spec.ts`)
Tests the complete desktop navigation experience including:

- **Header Navigation**: All primary navigation links visibility and functionality
- **Dropdown Menus**: Services and Resources hover dropdowns with proper timing
- **Active States**: Current page highlighting in navigation
- **Breadcrumbs**: Navigation breadcrumb trails on nested pages
- **Footer Navigation**: Secondary navigation links in footer
- **Performance**: Navigation timing requirements (<2s page loads, <200ms dropdowns)
- **Browser Compatibility**: Back/forward button navigation
- **External Links**: Security attributes for external links

**Key Test Scenarios:**
- Navigation through all primary pages (Home, Services, Pricing, Industries, About, Resources, Contact)
- Dropdown interaction with mouse hover and click
- Breadcrumb generation for nested routes like `/services/tax`
- Navigation state persistence across page loads
- Performance benchmarks for user experience

### 2. Mobile Navigation Tests (`mobile-navigation.spec.ts`)
Tests the mobile navigation experience across different device sizes:

- **Mobile Menu Toggle**: Hamburger menu button functionality
- **Touch Interactions**: Tap gestures for menu and navigation items
- **Responsive Behavior**: Adaptation to different screen sizes (320px to 768px)
- **Submenu Handling**: Accordion-style dropdowns in mobile menu
- **Menu State Management**: Proper open/close behavior with outside taps
- **Orientation Changes**: Portrait to landscape transitions
- **Performance**: Mobile-specific timing requirements (<200ms menu animations)

**Device Testing:**
- iPhone SE (375x667)
- iPhone Plus (414x736)
- iPad (768x1024)
- Very small screens (320x568)

**Key Features Tested:**
- Mobile menu toggle with proper ARIA attributes
- Focus trapping within open mobile menu
- Submenu expand/collapse for Services and Resources
- Menu closure on navigation link selection
- Touch gesture support

### 3. Accessibility Tests (`accessibility.spec.ts`)
Comprehensive WCAG AA compliance testing:

- **Keyboard Navigation**: Full keyboard-only navigation through all interactive elements
- **Focus Management**: Visible focus indicators meeting contrast requirements
- **Screen Reader Support**: ARIA landmarks, labels, and live regions
- **Skip Links**: Direct navigation to main content
- **Dropdown Navigation**: Arrow key navigation within dropdown menus
- **High Contrast Mode**: Forced colors and visual accessibility
- **Reduced Motion**: Respecting user motion preferences
- **Error Handling**: Accessible 404 and error page navigation

**Accessibility Standards:**
- WCAG 2.1 AA compliance
- Keyboard-only navigation support
- Screen reader compatibility
- Focus indicators with proper contrast ratios
- Semantic HTML structure with ARIA landmarks

## Test Configuration

### Playwright E2E Configuration (`playwright.e2e.config.ts`)
- **Base URL**: `http://localhost:3000`
- **Test Directory**: `./tests/e2e`
- **Browsers**: Chrome, Firefox, Safari (Desktop), Mobile Chrome/Safari
- **Reports**: HTML reports in `test-results/e2e-html-report`
- **Screenshots**: On failure
- **Video**: On failure
- **Tracing**: On retry

### Test Projects
1. **Desktop Chrome/Firefox/Safari**: Desktop navigation and accessibility tests
2. **Mobile Chrome/Safari**: Mobile navigation tests
3. **Tablet**: Mobile navigation on larger touch screens
4. **Accessibility**: Specialized accessibility testing with enhanced settings

## Running the Tests

### All E2E Tests
```bash
npm run test:e2e
```

### Specific Test Categories
```bash
# Desktop navigation only
npm run test:e2e:desktop

# Mobile navigation only
npm run test:e2e:mobile

# Accessibility tests only
npm run test:e2e:accessibility
```

### Interactive Test Running
```bash
# UI mode for test development
npm run test:e2e:ui

# Headed mode to see browser actions
npm run test:e2e:headed

# Debug mode for step-by-step debugging
npm run test:e2e:debug
```

## Test Coverage

### Navigation Components Tested
- **Header**: Primary navigation with logo and main menu
- **Footer**: Secondary navigation and legal links
- **MobileNavigation**: Mobile hamburger menu with touch interactions
- **Breadcrumbs**: Hierarchical navigation breadcrumbs
- **LayoutContainer**: Overall page layout and navigation integration

### User Flows Covered
1. **New Visitor Flow**: Landing → Browse Services → Contact
2. **Service Discovery**: Home → Services → Specific Service (Tax/Accounting/Advisory)
3. **Resource Access**: Home → Resources → Blog/Guides/Calculators
4. **Mobile User Journey**: Mobile menu → Service selection → Page navigation
5. **Accessibility User**: Keyboard-only navigation through entire site

### Performance Requirements Tested
- Page navigation: < 2 seconds
- Desktop dropdown display: < 200ms
- Mobile menu animation: < 200ms
- Focus transitions: Immediate (< 100ms)

## Integration with Navigation System

These E2E tests validate the complete navigation implementation from Phase 3:

### Phase 3.1-3.4: Component Implementation
- ✅ Navigation configuration (`src/config/navigation.ts`)
- ✅ Layout components (`src/components/layout/`)
- ✅ Type definitions (`src/types/layout.ts`)
- ✅ Utility functions (`src/lib/layout-utils.ts`)

### Phase 3.5: Integration
- ✅ Root layout integration (`src/app/layout.tsx`)
- ✅ Navigation state management
- ✅ Breadcrumb generation
- ✅ Responsive breakpoint behavior

### Phase 3.6: E2E Validation (This Phase)
- ✅ Complete user experience testing
- ✅ Cross-browser compatibility
- ✅ Mobile and desktop responsive behavior
- ✅ Accessibility compliance validation
- ✅ Performance requirement verification

## Expected Test Results

When the development server is running and navigation components are properly implemented:

- **Desktop Navigation**: ~15 tests covering header, dropdowns, breadcrumbs, footer
- **Mobile Navigation**: ~14 tests covering mobile menu, touch interactions, responsiveness
- **Accessibility**: ~15 tests covering keyboard navigation, ARIA, screen reader support

**Total**: ~44 comprehensive E2E tests ensuring complete navigation system validation

## Next Steps

After running these tests:

1. **Identify Issues**: Any failing tests indicate navigation implementation gaps
2. **Performance Optimization**: Tests will highlight timing issues needing optimization
3. **Accessibility Improvements**: Accessibility tests will reveal WCAG compliance gaps
4. **Cross-Browser Issues**: Browser-specific navigation problems will be detected

This E2E test suite provides the final validation that the global navigation system meets all functional, performance, and accessibility requirements for production deployment.