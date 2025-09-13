'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/layout-utils';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';
import type { BreadcrumbsProps } from '@/types/layout';

/**
 * Breadcrumbs - Breadcrumb navigation component
 *
 * Provides breadcrumb trail navigation with SEO-friendly structured data,
 * accessibility compliance, and responsive design. Automatically hides
 * on homepage and handles long path truncation. Uses BreadcrumbProvider
 * for automatic breadcrumb generation.
 *
 * Features:
 * - Semantic HTML structure with nav > ol > li
 * - JSON-LD structured data for SEO
 * - Active page highlighting with aria-current
 * - Responsive design with truncation for long paths
 * - Accessibility compliance (WCAG AA)
 * - Automatic homepage hiding
 * - Automatic breadcrumb generation via BreadcrumbProvider
 *
 * @param className - Additional CSS classes
 */
export function Breadcrumbs({ className }: Omit<BreadcrumbsProps, 'path'>) {
  const { breadcrumbPath } = useBreadcrumb();

  // Hide breadcrumbs on homepage
  if (breadcrumbPath.isHomePage) {
    return null;
  }

  // Handle malformed path data
  const safeSegments = (breadcrumbPath.segments || []).filter(
    (segment) => segment && segment.label && (segment.href || segment.isActive),
  );

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {breadcrumbPath.jsonLdData?.itemListElement?.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbPath.jsonLdData),
          }}
        />
      )}

      <nav
        aria-label="Breadcrumb"
        className={cn(
          'flex items-center space-x-1 text-sm text-muted-foreground overflow-hidden truncate',
          className,
        )}
      >
        <ol className="flex items-center space-x-1 truncate">
          {safeSegments.map((segment, index) => (
            <li
              key={`${segment.href}-${index}`}
              className="flex items-center"
            >
              {index > 0 && (
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground/60 mx-1 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {segment.isActive ? (
                // Current page - not clickable
                <span
                  className="font-medium text-foreground truncate"
                  aria-current="page"
                >
                  {segment.label}
                </span>
              ) : segment.href ? (
                // Non-current segment - clickable link
                <Link
                  href={segment.href}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {segment.label}
                </Link>
              ) : (
                // Fallback for malformed segment without href
                <span className="text-muted-foreground truncate">
                  {segment.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumbs;