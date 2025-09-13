import { NavigationItem } from '@/types/layout';

/**
 * Primary Navigation Configuration
 * Used in header navigation and mobile navigation
 */
export const primaryNavigation: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    visibility: 'public',
    position: 'primary',
    order: 1,
  },
  {
    id: 'services',
    label: 'Services',
    href: '/services',
    visibility: 'public',
    position: 'primary',
    order: 2,
    children: [
      {
        id: 'tax-services',
        label: 'Tax Services',
        href: '/services/tax',
        visibility: 'public',
        position: 'primary',
        order: 1,
      },
      {
        id: 'accounting',
        label: 'Accounting',
        href: '/services/accounting',
        visibility: 'public',
        position: 'primary',
        order: 2,
      },
      {
        id: 'advisory',
        label: 'Advisory',
        href: '/services/advisory',
        visibility: 'public',
        position: 'primary',
        order: 3,
      },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing',
    href: '/pricing',
    visibility: 'public',
    position: 'primary',
    order: 3,
  },
  {
    id: 'industries',
    label: 'Industries',
    href: '/industries',
    visibility: 'public',
    position: 'primary',
    order: 4,
  },
  {
    id: 'about',
    label: 'About',
    href: '/about',
    visibility: 'public',
    position: 'primary',
    order: 5,
  },
  {
    id: 'resources',
    label: 'Resources',
    href: '/resources',
    visibility: 'public',
    position: 'primary',
    order: 6,
    children: [
      {
        id: 'blog',
        label: 'Blog',
        href: '/resources/blog',
        visibility: 'public',
        position: 'primary',
        order: 1,
      },
      {
        id: 'guides',
        label: 'Guides',
        href: '/resources/guides',
        visibility: 'public',
        position: 'primary',
        order: 2,
      },
      {
        id: 'calculators',
        label: 'Calculators',
        href: '/resources/calculators',
        visibility: 'public',
        position: 'primary',
        order: 3,
      },
    ],
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    visibility: 'public',
    position: 'primary',
    order: 7,
  },
  {
    id: 'client-portal',
    label: 'Client Portal',
    href: '/portal',
    visibility: 'authenticated',
    position: 'primary',
    order: 8,
  },
];

/**
 * Secondary Navigation Configuration
 * Used in footer navigation
 */
export const secondaryNavigation: NavigationItem[] = [
  {
    id: 'faqs',
    label: 'FAQs',
    href: '/faqs',
    visibility: 'public',
    position: 'secondary',
    order: 1,
  },
  {
    id: 'privacy-policy',
    label: 'Privacy Policy',
    href: '/legal/privacy',
    visibility: 'public',
    position: 'secondary',
    order: 2,
  },
  {
    id: 'terms-of-service',
    label: 'Terms of Service',
    href: '/legal/terms',
    visibility: 'public',
    position: 'secondary',
    order: 3,
  },
  {
    id: 'sitemap',
    label: 'Sitemap',
    href: '/sitemap',
    visibility: 'public',
    position: 'secondary',
    order: 4,
  },
];

/**
 * Get filtered navigation items based on user authentication status
 * @param items - Array of navigation items to filter
 * @param isAuthenticated - Current user authentication status
 * @returns Filtered navigation items
 */
export function getFilteredNavigation(
  items: NavigationItem[],
  isAuthenticated: boolean = false
): NavigationItem[] {
  return items
    .filter(item => {
      if (item.visibility === 'authenticated' && !isAuthenticated) {
        return false;
      }
      return true;
    })
    .map(item => {
      const filteredItem: NavigationItem = {
        ...item,
      };
      if (item.children) {
        filteredItem.children = getFilteredNavigation(item.children, isAuthenticated);
      }
      return filteredItem;
    })
    .sort((a, b) => a.order - b.order);
}

/**
 * Find navigation item by href
 * @param items - Array of navigation items to search
 * @param href - URL path to match
 * @returns Found navigation item or null
 */
export function findNavigationItemByHref(
  items: NavigationItem[],
  href: string
): NavigationItem | null {
  for (const item of items) {
    if (item.href === href) {
      return item;
    }
    if (item.children) {
      const found = findNavigationItemByHref(item.children, href);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Get breadcrumb trail for a given path
 * @param href - Current page path
 * @returns Array of breadcrumb segments
 */
export function getBreadcrumbTrail(href: string): Array<{
  label: string;
  href: string;
  isActive: boolean;
}> {
  const allNavigation = [...primaryNavigation, ...secondaryNavigation];
  const segments: Array<{ label: string; href: string; isActive: boolean }> = [];

  // Always start with Home (except when on home page)
  if (href !== '/') {
    segments.push({
      label: 'Home',
      href: '/',
      isActive: false,
    });
  }

  // Find the current item and build trail
  const currentItem = findNavigationItemByHref(allNavigation, href);
  if (currentItem) {
    // Build parent trail for nested items
    const pathParts = href.split('/').filter(Boolean);

    for (let i = 1; i < pathParts.length; i++) {
      const partialPath = '/' + pathParts.slice(0, i).join('/');
      const parentItem = findNavigationItemByHref(allNavigation, partialPath);

      if (parentItem && parentItem.href !== href) {
        segments.push({
          label: parentItem.label,
          href: parentItem.href,
          isActive: false,
        });
      }
    }

    // Add current page as active (non-clickable)
    segments.push({
      label: currentItem.label,
      href: href,
      isActive: true,
    });
  }

  return segments;
}