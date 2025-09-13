import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type {
  NavigationItem,
  BreadcrumbPath,
  BreadcrumbSegment,
  BreadcrumbJsonLd,
  LayoutVariant,
  ResponsivePadding,
  BreakpointConfig,
} from '@/types/layout';

/**
 * Utility function to merge class names with Tailwind CSS
 * Combines clsx and tailwind-merge for optimal className handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get layout container classes based on variant
 * @param variant - Container width variant
 * @param className - Additional CSS classes
 * @returns Combined CSS classes
 */
export function getContainerClasses(
  variant: LayoutVariant = 'default',
  className?: string
): string {
  const baseClasses = 'mx-auto px-4 sm:px-6 lg:px-8';

  const variantClasses: Record<LayoutVariant, string> = {
    default: 'max-w-7xl',
    wide: 'max-w-full',
    narrow: 'max-w-4xl',
  };

  return cn(baseClasses, variantClasses[variant], className);
}

/**
 * Generate responsive padding classes
 * @param padding - Responsive padding configuration
 * @returns CSS classes for responsive padding
 */
export function getResponsivePadding(padding: ResponsivePadding): string {
  return cn(
    `p-${padding.mobile}`,
    `sm:p-${padding.tablet}`,
    `lg:p-${padding.desktop}`
  );
}

/**
 * Check if navigation item is active based on current path
 * @param item - Navigation item to check
 * @param currentPath - Current route path
 * @returns Whether the item is active
 */
export function isNavigationItemActive(
  item: NavigationItem,
  currentPath: string
): boolean {
  // Exact match
  if (item.href === currentPath) {
    return true;
  }

  // Check if current path starts with item href (for parent items)
  if (currentPath.startsWith(item.href) && item.href !== '/') {
    return true;
  }

  // Check children for active state
  if (item.children) {
    return item.children.some((child: NavigationItem) =>
      isNavigationItemActive(child, currentPath)
    );
  }

  return false;
}

/**
 * Get navigation item classes based on active state
 * @param item - Navigation item
 * @param currentPath - Current route path
 * @param baseClasses - Base CSS classes
 * @param activeClasses - Active state CSS classes
 * @returns Combined CSS classes
 */
export function getNavigationItemClasses(
  item: NavigationItem,
  currentPath: string,
  baseClasses: string = 'transition-colors hover:text-foreground/80',
  activeClasses: string = 'text-foreground'
): string {
  const isActive = isNavigationItemActive(item, currentPath);
  return cn(
    baseClasses,
    isActive ? activeClasses : 'text-foreground/60'
  );
}

/**
 * Generate breadcrumb path from current route
 * @param pathname - Current pathname from router
 * @param navigationItems - All navigation items for label lookup
 * @returns Complete breadcrumb path data
 */
export function generateBreadcrumbPath(
  pathname: string,
  navigationItems: NavigationItem[]
): BreadcrumbPath {
  // Check if homepage
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return {
      segments: [],
      currentPage: 'Home',
      fullPath: pathname,
      isHomePage: true,
      jsonLdData: generateBreadcrumbJsonLd([]),
    };
  }

  const segments: BreadcrumbSegment[] = [];

  // Always start with home
  segments.push({
    label: 'Home',
    href: '/',
    isActive: false,
  });

  // Split path and build segments
  const pathParts = pathname.split('/').filter(Boolean);
  let currentPath = '';

  for (let i = 0; i < pathParts.length; i++) {
    currentPath += `/${pathParts[i]}`;
    const isCurrentPage = i === pathParts.length - 1;

    // Find navigation item for this path
    const navItem = findNavigationItemByPath(navigationItems, currentPath);
    const label = navItem?.label || formatPathSegment(pathParts[i]);

    segments.push({
      label,
      href: isCurrentPage ? '' : currentPath,
      isActive: isCurrentPage,
    });
  }

  const currentPage = segments[segments.length - 1]?.label || 'Page';

  return {
    segments,
    currentPage,
    fullPath: pathname,
    isHomePage: false,
    jsonLdData: generateBreadcrumbJsonLd(segments),
  };
}

/**
 * Find navigation item by path (recursive)
 * @param items - Navigation items to search
 * @param path - Path to match
 * @returns Found navigation item or null
 */
function findNavigationItemByPath(
  items: NavigationItem[],
  path: string
): NavigationItem | null {
  for (const item of items) {
    if (item.href === path) {
      return item;
    }

    if (item.children) {
      const found = findNavigationItemByPath(item.children, path);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

/**
 * Format path segment into human-readable label
 * @param segment - Path segment to format
 * @returns Formatted label
 */
function formatPathSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 * @param segments - Breadcrumb segments
 * @returns JSON-LD breadcrumb data
 */
function generateBreadcrumbJsonLd(segments: BreadcrumbSegment[]): BreadcrumbJsonLd {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cpaonweb.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.label,
      ...(segment.href && { item: `${baseUrl}${segment.href}` }),
    })),
  };
}

/**
 * Get current breakpoint based on window width
 * @param width - Window width in pixels
 * @param breakpoints - Breakpoint configuration
 * @returns Current breakpoint name
 */
export function getCurrentBreakpoint(
  width: number,
  breakpoints: BreakpointConfig = {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
  }
): 'mobile' | 'tablet' | 'desktop' {
  if (width < breakpoints.mobile) {
    return 'mobile';
  }
  if (width < breakpoints.desktop) {
    return 'tablet';
  }
  return 'desktop';
}

/**
 * Debounce function for performance optimization
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

/**
 * Check if element is in viewport (for performance optimization)
 * @param element - DOM element to check
 * @returns Whether element is visible
 */
export function isElementInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Generate skip link for accessibility
 * @param targetId - ID of the main content element
 * @returns Skip link component props
 */
export function getSkipLinkProps(targetId: string = 'main-content') {
  return {
    href: `#${targetId}`,
    className: cn(
      'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
      'z-50 bg-background border border-border rounded px-4 py-2',
      'text-foreground underline transition-all'
    ),
    children: 'Skip to main content',
  };
}

/**
 * Get ARIA attributes for navigation elements
 * @param label - ARIA label for the navigation
 * @param current - Whether this is the current page
 * @returns ARIA attributes object
 */
export function getNavigationAriaAttributes(
  label: string,
  current: boolean = false
) {
  return {
    'aria-label': label,
    ...(current && { 'aria-current': 'page' as const }),
  };
}

/**
 * Generate unique ID for accessibility
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'layout'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate navigation structure (for development)
 * @param items - Navigation items to validate
 * @returns Validation errors (empty array if valid)
 */
export function validateNavigationStructure(
  items: NavigationItem[]
): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenHrefs = new Set<string>();

  function validateItem(item: NavigationItem, depth: number = 0) {
    // Check maximum depth (2 levels)
    if (depth > 1) {
      errors.push(`Navigation item "${item.id}" exceeds maximum depth of 2 levels`);
    }

    // Check unique IDs
    if (seenIds.has(item.id)) {
      errors.push(`Duplicate navigation ID: "${item.id}"`);
    }
    seenIds.add(item.id);

    // Check unique hrefs
    if (seenHrefs.has(item.href)) {
      errors.push(`Duplicate navigation href: "${item.href}"`);
    }
    seenHrefs.add(item.href);

    // Validate required fields
    if (!item.label.trim()) {
      errors.push(`Navigation item "${item.id}" has empty label`);
    }

    if (!item.href.trim()) {
      errors.push(`Navigation item "${item.id}" has empty href`);
    }

    // Validate label length
    if (item.label.length > 50) {
      errors.push(`Navigation item "${item.id}" label exceeds 50 characters`);
    }

    // Validate children
    if (item.children) {
      item.children.forEach((child: NavigationItem) => validateItem(child, depth + 1));
    }
  }

  items.forEach(item => validateItem(item));
  return errors;
}