'use client';

import Link from 'next/link';

import { cn, getNavigationItemClasses } from '@/lib/layout-utils';
import { useNavigation } from '@/providers/NavigationProvider';
import type { FooterProps } from '@/types/layout';

/**
 * Footer - Site footer with secondary navigation
 *
 * Provides secondary navigation links, company information, and legal links
 * with responsive design and accessibility compliance. Uses NavigationProvider
 * for current path tracking.
 *
 * Features:
 * - Secondary navigation rendering
 * - Active link highlighting based on current path
 * - Responsive layout (horizontal on desktop, stacked on mobile)
 * - Accessibility compliance (WCAG AA)
 * - Company branding and copyright information
 * - Contact information
 * - Shared state management via NavigationProvider
 *
 * @param navigation - Secondary navigation items array
 */
export function Footer({ navigation }: Omit<FooterProps, 'currentPath'>) {
  const { currentPath } = useNavigation();
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-muted/50 border-t flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Information */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    CPA On Web LLP
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Professional tax and accounting services delivered with expertise and integrity.
                    Your trusted partner for financial success.
                  </p>
                </div>

                {/* Contact Information */}
                <div className="text-sm text-muted-foreground">
                  <p>
                    <Link
                      href="/contact"
                      className="hover:text-foreground transition-colors underline"
                    >
                      Contact Us
                    </Link>
                    {' · '}
                    <Link
                      href="mailto:info@cpaonweb.com"
                      className="hover:text-foreground transition-colors underline"
                    >
                      info@cpaonweb.com
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="md:col-span-2">
              <nav
                role="navigation"
                aria-label="Footer navigation"
                className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2"
              >
                {navigation
                  .filter((item) => item && item.href && item.label && item.id)
                  .map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={cn(
                        'text-sm transition-colors hover:text-foreground',
                        getNavigationItemClasses(
                          item,
                          currentPath,
                          'text-muted-foreground hover:text-foreground',
                          'text-foreground font-medium',
                        ),
                      )}
                      aria-current={currentPath === item.href ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>
            </div>
          </div>

          {/* Copyright and Legal */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                <p>© {currentYear} All rights reserved.</p>
              </div>

              {/* Additional Legal Links */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>Professional services with integrity</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;