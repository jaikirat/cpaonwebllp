# Quickstart Guide: Global Layout and Navigation Shell

**Feature**: 003-build-a-global
**Date**: 2025-09-13
**Prerequisites**: Next.js 14.x project with TypeScript, Tailwind CSS, and shadcn/ui configured

## Quick Setup (5 minutes)

### 1. Navigation Configuration
Create the navigation structure configuration:

```typescript
// src/config/navigation.ts
export const navigationConfig = {
  primary: [
    { id: 'home', label: 'Home', href: '/', order: 1, visibility: 'public' },
    { id: 'services', label: 'Services', href: '/services', order: 2, visibility: 'public' },
    { id: 'pricing', label: 'Pricing', href: '/pricing', order: 3, visibility: 'public' },
    { id: 'about', label: 'About', href: '/about', order: 4, visibility: 'public' },
    { id: 'contact', label: 'Contact', href: '/contact', order: 5, visibility: 'public' },
    { id: 'portal', label: 'Client Portal', href: '/portal', order: 6, visibility: 'authenticated' }
  ],
  secondary: [
    { id: 'faq', label: 'FAQs', href: '/faq', order: 1, visibility: 'public' },
    { id: 'resources', label: 'Resources', href: '/resources', order: 2, visibility: 'public' },
    { id: 'legal', label: 'Legal', href: '/legal', order: 3, visibility: 'public' }
  ]
};
```

### 2. Core Components
Install and create the layout components:

```bash
# Install required dependencies (if not already installed)
npm install @radix-ui/react-navigation-menu @radix-ui/react-dialog

# Add shadcn/ui components
npx shadcn-ui@latest add navigation-menu dialog button sheet
```

### 3. Root Layout Update
Update your `src/app/layout.tsx`:

```typescript
// src/app/layout.tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { LayoutContainer } from '@/components/layout/LayoutContainer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main id="main-content">
          <Breadcrumbs />
          <LayoutContainer>
            {children}
          </LayoutContainer>
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

## Feature Validation (10 minutes)

### Test Desktop Navigation
1. **Start development server**: `npm run dev`
2. **Open browser**: Visit `http://localhost:3000`
3. **Verify header**: Check that primary navigation items are visible
4. **Test active links**: Navigate between pages, verify active highlighting
5. **Check footer**: Confirm secondary navigation links are present
6. **Test breadcrumbs**: Visit nested pages, confirm breadcrumb trail appears

**Expected Results**:
- ✅ Header displays with primary navigation
- ✅ Footer displays with secondary navigation
- ✅ Active page is highlighted in navigation
- ✅ Breadcrumbs appear on subpages (not homepage)

### Test Mobile Navigation
1. **Resize browser**: Make window width < 768px
2. **Verify mobile menu**: Header should show hamburger menu button
3. **Open mobile menu**: Click hamburger, drawer should slide in
4. **Test navigation**: Click menu item, should navigate and close drawer
5. **Test keyboard**: Tab through navigation, ensure focus is trapped
6. **Close menu**: Press Escape or click outside, menu should close

**Expected Results**:
- ✅ Mobile hamburger menu appears on small screens
- ✅ Mobile drawer opens/closes smoothly
- ✅ Navigation items work in mobile menu
- ✅ Keyboard navigation functions properly

### Test Responsive Layout
1. **Desktop view** (>1024px): Content should be centered with max-width
2. **Tablet view** (768-1023px): Content should have appropriate padding
3. **Mobile view** (<768px): Content should be full-width with mobile padding
4. **Resize smoothly**: Layout should adapt without breaking

**Expected Results**:
- ✅ Layout adapts to different screen sizes
- ✅ Content maintains proper spacing and alignment
- ✅ No horizontal scrollbars appear
- ✅ Text remains readable at all sizes

### Test Accessibility
1. **Keyboard navigation**: Tab through all interactive elements
2. **Screen reader**: Use browser accessibility tools or screen reader
3. **Focus indicators**: Ensure visible focus outlines
4. **ARIA attributes**: Check that navigation has proper labels
5. **Skip link**: Verify skip to main content link works

**Expected Results**:
- ✅ All navigation items are keyboard accessible
- ✅ Focus indicators are visible and clear
- ✅ Screen reader announces navigation properly
- ✅ Skip link allows bypassing navigation

## Authentication Integration (Optional)

### Basic Authentication State
```typescript
// Add authentication context
const isAuthenticated = false; // Replace with your auth logic

// Filter navigation based on authentication
const visibleNavItems = navigationConfig.primary.filter(item =>
  item.visibility === 'public' ||
  (item.visibility === 'authenticated' && isAuthenticated)
);
```

### Client Portal Example
```typescript
// Conditional rendering for authenticated users
{isAuthenticated && (
  <NavigationItem href="/portal" active={pathname === '/portal'}>
    Client Portal
  </NavigationItem>
)}
```

## SEO and Structured Data

### Breadcrumb Schema
The breadcrumbs component automatically generates JSON-LD structured data:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://example.com/services"
    }
  ]
}
```

## Performance Monitoring

### Key Metrics to Track
- **Navigation response**: Should be <100ms
- **Mobile menu toggle**: Should be <200ms
- **Layout shift**: Should be minimal (CLS <0.1)
- **Bundle size**: Layout components should add <50KB

### Testing Performance
```bash
# Build and analyze bundle
npm run build
npm run start

# Test with Lighthouse
# Check for:
# - Performance score >90
# - Accessibility score >95
# - No layout shift issues
```

## Troubleshooting

### Common Issues

**Mobile menu not appearing**:
- Check Tailwind CSS responsive classes
- Verify JavaScript is enabled
- Check for CSS conflicts

**Active links not highlighting**:
- Verify `usePathname()` is working
- Check route matching logic
- Ensure CSS classes are applied

**Breadcrumbs not showing**:
- Check if on homepage (breadcrumbs hide on home)
- Verify route structure
- Check navigation configuration

**Layout breaking on resize**:
- Review Tailwind responsive utilities
- Check for fixed widths
- Test across breakpoints

### Debug Commands
```bash
# Check component rendering
npm run dev -- --debug

# Test responsive design
# Use browser dev tools device toolbar

# Validate accessibility
# Use axe-core browser extension or
npx @axe-core/cli http://localhost:3000
```

## Next Steps

1. **Customize styling**: Update Tailwind config for brand colors
2. **Add animations**: Enhance mobile menu with smooth transitions
3. **Extend navigation**: Add dropdown menus for complex hierarchies
4. **Add breadcrumb customization**: Allow custom labels per route
5. **Integrate analytics**: Track navigation usage patterns

## Support

- **Documentation**: See `/specs/003-build-a-global/` for detailed specs
- **Component contracts**: Review `/contracts/layout-components.yaml`
- **Data models**: Reference `data-model.md` for type definitions
- **Testing**: Check test files in `/tests/` directory