'use client';

import { forwardRef } from 'react';

import { cn, getContainerClasses } from '@/lib/layout-utils';
import type { LayoutContainerProps } from '@/types/layout';

/**
 * LayoutContainer - Responsive container wrapper for page content
 *
 * Provides consistent spacing, max-width constraints, and responsive behavior
 * across all pages. Serves as the main content landmark for accessibility.
 *
 * Features:
 * - Responsive padding and max-width based on variant
 * - Semantic HTML5 main element
 * - Accessibility skip link target
 * - Consistent horizontal centering
 *
 * @param children - Page content to wrap
 * @param variant - Container width variant ('default' | 'wide' | 'narrow')
 * @param className - Additional CSS classes
 */
export const LayoutContainer = forwardRef<HTMLElement, LayoutContainerProps>(
  ({ children, variant = 'default', className }, ref) => {
    return (
      <main
        ref={ref}
        id="main-content"
        className={cn(
          getContainerClasses(variant),
          'py-6 sm:py-8 lg:py-12 space-y-6',
          className,
        )}
      >
        {children}
      </main>
    );
  },
);

LayoutContainer.displayName = 'LayoutContainer';

export default LayoutContainer;