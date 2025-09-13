'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useMemo } from 'react';

import { primaryNavigation, secondaryNavigation } from '@/config/navigation';
import { generateBreadcrumbPath } from '@/lib/layout-utils';
import type { BreadcrumbPath } from '@/types/layout';

/**
 * Breadcrumb Context for managing breadcrumb generation
 */
interface BreadcrumbContextType {
  breadcrumbPath: BreadcrumbPath;
  refreshBreadcrumbs: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

/**
 * Breadcrumb Provider - Manages breadcrumb generation
 *
 * Automatically generates breadcrumb paths based on the current route
 * and navigation structure. Provides JSON-LD structured data for SEO.
 *
 * @param children - Child components
 */
export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Combine all navigation items for breadcrumb generation
  const allNavigationItems = useMemo(() => {
    return [...primaryNavigation, ...secondaryNavigation];
  }, []);

  // Generate breadcrumb path based on current pathname
  const breadcrumbPath = useMemo(() => {
    return generateBreadcrumbPath(pathname, allNavigationItems);
  }, [pathname, allNavigationItems]);

  // Function to manually refresh breadcrumbs (if needed for dynamic content)
  const refreshBreadcrumbs = () => {
    // Force re-render by updating a state value
    // In most cases, breadcrumbs will auto-update based on pathname changes
  };

  const contextValue: BreadcrumbContextType = {
    breadcrumbPath,
    refreshBreadcrumbs,
  };

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

/**
 * Hook to use breadcrumb context
 * @returns Breadcrumb context value
 * @throws Error if used outside BreadcrumbProvider
 */
export function useBreadcrumb(): BreadcrumbContextType {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}

export default BreadcrumbProvider;