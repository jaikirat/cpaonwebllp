# Data Model: Global Layout and Navigation Shell

**Feature**: 003-build-a-global
**Date**: 2025-09-13
**Status**: Complete

## Entity Definitions

### NavigationStructure
**Purpose**: Represents the hierarchical organization of site navigation
**Source**: Derived from FR-009 specification

**Fields**:
- `id`: string - Unique identifier for navigation item
- `label`: string - Display text for navigation item
- `href`: string - Destination URL or route path
- `icon?`: string - Optional icon identifier (for future enhancement)
- `children?`: NavigationItem[] - Optional sub-navigation items
- `visibility`: 'public' | 'authenticated' - Controls user access
- `position`: 'primary' | 'secondary' - Header vs footer placement
- `order`: number - Sort order within navigation group

**Relationships**:
- Self-referential hierarchy (parent-child via `children` array)
- Links to application routes via `href` field
- Associated with user authentication state via `visibility`

**Validation Rules**:
- `label`: Required, max 50 characters
- `href`: Required, valid URL or Next.js route path
- `order`: Required, positive integer
- `children`: Optional, max depth of 2 levels (per UI constraints)
- `visibility`: Required, enum validation
- `position`: Required, enum validation

**State Transitions**:
- Navigation items can be dynamically shown/hidden based on authentication
- Active state determined by current route matching `href`
- Expanded state for mobile navigation (opened/closed)

### BreadcrumbPath
**Purpose**: Represents the trail of pages from root to current location
**Source**: Derived from FR-010 specification

**Fields**:
- `segments`: BreadcrumbSegment[] - Ordered array of path segments
- `currentPage`: string - Human-readable current page title
- `fullPath`: string - Complete URL path for SEO markup
- `isHomePage`: boolean - Flag to hide breadcrumbs on homepage
- `jsonLdData`: object - Structured data for SEO

**BreadcrumbSegment SubEntity**:
- `label`: string - Human-readable segment name
- `href`: string - URL for the segment (empty for current page)
- `isActive`: boolean - True for current page (non-clickable)

**Relationships**:
- Generated from current Next.js route
- Maps to NavigationStructure for human-readable labels
- Connected to SEO structured data schema

**Validation Rules**:
- `segments`: Required, max 5 segments (UI constraint)
- `label` per segment: Required, max 30 characters
- `href` per segment: Valid URL or empty for current page
- `fullPath`: Required, valid URL path
- Last segment must have `isActive: true`

**State Transitions**:
- Generated on route changes
- Updated when navigation occurs
- Hidden/shown based on homepage detection

### LayoutContainer
**Purpose**: Manages responsive grid and spacing for page content
**Source**: Derived from FR-003 specification

**Fields**:
- `maxWidth`: string - CSS max-width value (e.g., '1200px', 'full')
- `padding`: ResponsivePadding - Padding values per breakpoint
- `gridColumns`: number - CSS Grid column count
- `breakpoints`: BreakpointConfig - Responsive behavior configuration

**ResponsivePadding SubEntity**:
- `mobile`: string - Padding for mobile screens
- `tablet`: string - Padding for tablet screens
- `desktop`: string - Padding for desktop screens

**BreakpointConfig SubEntity**:
- `mobile`: number - Mobile breakpoint in pixels (default: 640)
- `tablet`: number - Tablet breakpoint in pixels (default: 768)
- `desktop`: number - Desktop breakpoint in pixels (default: 1024)

**Relationships**:
- Applied to all page layouts
- Inherits from Tailwind CSS design tokens
- Connected to header and footer spacing

**Validation Rules**:
- `maxWidth`: Required, valid CSS length or 'full'
- Padding values: Required, valid CSS padding syntax
- `gridColumns`: Optional, positive integer 1-12
- Breakpoint values: Required, positive integers in ascending order

**State Transitions**:
- Responsive changes based on viewport size
- Updates when design tokens change
- Maintains consistency across all routes

## Data Flow

### Navigation State Flow
```
Route Change → NavigationStructure → Active State Update → UI Render
     ↓
Authentication State → Visibility Filter → Available Items → UI Render
```

### Breadcrumb Generation Flow
```
Route Change → Path Analysis → NavigationStructure Lookup → BreadcrumbPath → JSON-LD → UI Render
```

### Layout Responsive Flow
```
Viewport Change → BreakpointConfig → LayoutContainer → CSS Variables → UI Update
```

## Type Definitions (TypeScript)

```typescript
interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  visibility: 'public' | 'authenticated';
  position: 'primary' | 'secondary';
  order: number;
}

interface BreadcrumbSegment {
  label: string;
  href: string;
  isActive: boolean;
}

interface BreadcrumbPath {
  segments: BreadcrumbSegment[];
  currentPage: string;
  fullPath: string;
  isHomePage: boolean;
  jsonLdData: object;
}

interface ResponsivePadding {
  mobile: string;
  tablet: string;
  desktop: string;
}

interface BreakpointConfig {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface LayoutContainer {
  maxWidth: string;
  padding: ResponsivePadding;
  gridColumns?: number;
  breakpoints: BreakpointConfig;
}
```

## Data Sources

### Static Configuration
- Navigation structure defined in configuration file
- Layout container settings from design system
- Breakpoint values from Tailwind CSS config

### Dynamic Sources
- Current route from Next.js router
- Authentication state from user session
- Viewport size from browser APIs

## Persistence

### Client-Side
- Navigation active state (session storage)
- Mobile menu open/closed state (component state)
- Viewport breakpoint detection (real-time)

### Build-Time
- Static navigation structure (configuration files)
- Layout constraints (design system tokens)
- SEO structured data templates

## Validation Strategy

### Runtime Validation
- TypeScript interfaces enforce structure
- Zod schemas for configuration validation
- React prop validation for components

### Build-Time Validation
- ESLint rules for navigation structure
- TypeScript compilation for type checking
- Test coverage for data transformations

## Performance Considerations

### Optimization
- Navigation structure cached at build time
- Breadcrumb paths generated on-demand
- Layout calculations memoized
- Responsive updates debounced

### Memory Management
- Navigation items lazily loaded for large structures
- Breadcrumb cleanup on route changes
- Layout container reused across pages
- Event listener cleanup on unmount