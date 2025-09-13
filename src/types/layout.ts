/**
 * Layout Type Definitions
 * Global Layout and Navigation Shell Feature
 */

/**
 * Navigation item structure for hierarchical navigation
 */
export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display text for the navigation item */
  label: string;
  /** Destination URL or route path */
  href: string;
  /** Optional icon identifier for future enhancement */
  icon?: string;
  /** Optional sub-navigation items (max 2 levels deep) */
  children?: NavigationItem[];
  /** Controls visibility based on user authentication */
  visibility: 'public' | 'authenticated';
  /** Placement in primary (header) or secondary (footer) navigation */
  position: 'primary' | 'secondary';
  /** Sort order within navigation group */
  order: number;
}

/**
 * Individual breadcrumb segment
 */
export interface BreadcrumbSegment {
  /** Human-readable segment name */
  label: string;
  /** URL for the segment (empty for current page) */
  href: string;
  /** True for current page (non-clickable) */
  isActive: boolean;
}

/**
 * Complete breadcrumb path data
 */
export interface BreadcrumbPath {
  /** Ordered array of path segments */
  segments: BreadcrumbSegment[];
  /** Human-readable current page title */
  currentPage: string;
  /** Complete URL path for SEO markup */
  fullPath: string;
  /** Flag to hide breadcrumbs on homepage */
  isHomePage: boolean;
  /** Structured data for SEO (JSON-LD) */
  jsonLdData: BreadcrumbJsonLd;
}

/**
 * JSON-LD structured data for breadcrumbs
 */
export interface BreadcrumbJsonLd {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbListItem[];
}

/**
 * Individual item in breadcrumb JSON-LD list
 */
export interface BreadcrumbListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string; // URL, omitted for current page
}

/**
 * Responsive padding configuration
 */
export interface ResponsivePadding {
  /** Padding for mobile screens */
  mobile: string;
  /** Padding for tablet screens */
  tablet: string;
  /** Padding for desktop screens */
  desktop: string;
}

/**
 * Breakpoint configuration for responsive behavior
 */
export interface BreakpointConfig {
  /** Mobile breakpoint in pixels (default: 640) */
  mobile: number;
  /** Tablet breakpoint in pixels (default: 768) */
  tablet: number;
  /** Desktop breakpoint in pixels (default: 1024) */
  desktop: number;
}

/**
 * Layout container configuration
 */
export interface LayoutContainer {
  /** CSS max-width value (e.g., '1200px', 'full') */
  maxWidth: string;
  /** Padding values per breakpoint */
  padding: ResponsivePadding;
  /** Optional CSS Grid column count */
  gridColumns?: number;
  /** Responsive behavior configuration */
  breakpoints: BreakpointConfig;
}

/**
 * Layout container variant types
 */
export type LayoutVariant = 'default' | 'wide' | 'narrow';

/**
 * Navigation position types
 */
export type NavigationPosition = 'header' | 'footer' | 'mobile';

/**
 * Mobile navigation state
 */
export interface MobileNavigationState {
  /** Whether mobile navigation is open */
  isOpen: boolean;
  /** Toggle function for mobile navigation */
  toggle: () => void;
  /** Close function for mobile navigation */
  close: () => void;
}

/**
 * Layout component props - Header
 */
export interface HeaderProps {
  /** Primary navigation items */
  navigation: NavigationItem[];
  /** Current route path for active link highlighting */
  currentPath: string;
  /** User authentication state */
  isAuthenticated?: boolean;
}

/**
 * Layout component props - Footer
 */
export interface FooterProps {
  /** Secondary navigation items */
  navigation: NavigationItem[];
  /** Current route path for active link highlighting */
  currentPath: string;
}

/**
 * Layout component props - Mobile Navigation
 */
export interface MobileNavigationProps {
  /** Navigation items to display */
  navigation: NavigationItem[];
  /** Controls drawer visibility */
  isOpen: boolean;
  /** Callback to toggle drawer */
  onToggle: () => void;
  /** Current route for active highlighting */
  currentPath: string;
}

/**
 * Layout component props - Breadcrumbs
 */
export interface BreadcrumbsProps {
  /** Breadcrumb path data */
  path: BreadcrumbPath;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Layout component props - Layout Container
 */
export interface LayoutContainerProps {
  /** Page content to wrap */
  children: React.ReactNode;
  /** Container width variant */
  variant?: LayoutVariant;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Navigation event data
 */
export interface NavigationEvent {
  /** Navigation item that was clicked */
  item: NavigationItem;
  /** Source of the navigation event */
  source: NavigationPosition;
}

/**
 * Route change event data
 */
export interface RouteChangeEvent {
  /** New path after navigation */
  newPath: string;
  /** Previous path before navigation */
  previousPath: string;
}

/**
 * Layout theme configuration
 */
export interface LayoutTheme {
  /** Header background color */
  headerBg: string;
  /** Footer background color */
  footerBg: string;
  /** Navigation active item color */
  activeColor: string;
  /** Navigation hover color */
  hoverColor: string;
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /** Skip link target ID */
  skipLinkTarget: string;
  /** Main content landmark ID */
  mainContentId: string;
  /** Enable keyboard navigation */
  keyboardNavigation: boolean;
  /** Enable screen reader announcements */
  screenReaderAnnouncements: boolean;
}

/**
 * SEO configuration for layout
 */
export interface SEOConfig {
  /** Enable breadcrumb structured data */
  enableBreadcrumbJsonLd: boolean;
  /** Enable navigation structured data */
  enableNavigationJsonLd: boolean;
  /** Default page title suffix */
  titleSuffix: string;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Enable navigation virtualization for large menus */
  enableVirtualization: boolean;
  /** Debounce delay for responsive updates (ms) */
  debounceDelay: number;
  /** Enable preloading of navigation targets */
  enablePreload: boolean;
}

/**
 * Complete layout configuration
 */
export interface LayoutConfig {
  /** Container configuration */
  container: LayoutContainer;
  /** Theme configuration */
  theme: LayoutTheme;
  /** Accessibility configuration */
  accessibility: AccessibilityConfig;
  /** SEO configuration */
  seo: SEOConfig;
  /** Performance configuration */
  performance: PerformanceConfig;
}