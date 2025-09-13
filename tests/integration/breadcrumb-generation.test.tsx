/**
 * Breadcrumb Generation Integration Test
 * T013: Breadcrumb generation integration test
 *
 * Purpose: Test breadcrumb generation with Next.js routing and SEO integration
 * Focus: Integration with Next.js App Router, structured data, and navigation hierarchy
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { LayoutContainer } from '@/components/layout/LayoutContainer';
import { getBreadcrumbTrail, findNavigationItemByHref } from '@/config/navigation';
import type { BreadcrumbPath, BreadcrumbJsonLd } from '@/types/layout';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockPrefetch = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock Head component for SEO testing
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="head-content">{children}</div>
    ),
  };
});

// Breadcrumb utilities
function generateBreadcrumbPath(pathname: string): BreadcrumbPath {
  const segments = getBreadcrumbTrail(pathname);
  const currentPageLabel = segments[segments.length - 1]?.label || 'Page';

  const jsonLdData: BreadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: segments.map((segment, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: segment.label,
      ...(segment.href && !segment.isActive ? { item: `https://cpaonweb.com${segment.href}` } : {}),
    })),
  };

  return {
    segments,
    currentPage: currentPageLabel,
    fullPath: pathname,
    isHomePage: pathname === '/',
    jsonLdData,
  };
}

// Breadcrumb integration wrapper component
function BreadcrumbIntegrationWrapper({ pathname }: { pathname: string }) {
  const breadcrumbPath = generateBreadcrumbPath(pathname);

  return (
    <LayoutContainer variant="default">
      <div data-testid="breadcrumb-wrapper" data-pathname={pathname}>
        <header>
          <nav aria-label="Main navigation">Header Navigation</nav>
        </header>
        <Breadcrumbs path={breadcrumbPath} />
        <main>
          <h1>{breadcrumbPath.currentPage}</h1>
          <p>Page content for {pathname}</p>
        </main>
        {/* SEO structured data */}
        <script
          type="application/ld+json"
          data-testid="breadcrumb-jsonld"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbPath.jsonLdData, null, 2),
          }}
        />
      </div>
    </LayoutContainer>
  );
}

describe('Breadcrumb Generation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: mockPrefetch,
    });
  });

  describe('Basic Breadcrumb Generation', () => {
    it('should generate correct breadcrumbs for top-level pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/services');

      render(<BreadcrumbIntegrationWrapper pathname="/services" />);

      const wrapper = screen.getByTestId('breadcrumb-wrapper');
      expect(wrapper).toHaveAttribute('data-pathname', '/services');

      // Should show Home > Services
      expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByText('Services')).toBeInTheDocument();

      // Current page should not be a link
      const currentPage = screen.getByText('Services');
      expect(currentPage.tagName.toLowerCase()).not.toBe('a');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should generate correct breadcrumbs for nested pages', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/accounting');

      render(<BreadcrumbIntegrationWrapper pathname="/services/accounting" />);

      // Should show Home > Services > Accounting
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
      expect(screen.getByText('Accounting')).toBeInTheDocument();

      // Verify breadcrumb hierarchy
      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });
      const links = breadcrumbNav.querySelectorAll('a');
      expect(links).toHaveLength(2); // Home and Services are links

      const currentPage = screen.getByText('Accounting');
      expect(currentPage).toHaveAttribute('aria-current', 'page');
    });

    it('should handle deeply nested pages correctly', () => {
      (usePathname as jest.Mock).mockReturnValue('/resources/guides/tax-planning');

      render(<BreadcrumbIntegrationWrapper pathname="/resources/guides/tax-planning" />);

      // Should show Home > Resources > Guides > Tax Planning
      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources');
      expect(screen.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/resources/guides');
      expect(screen.getByText('Tax Planning')).toBeInTheDocument();
    });

    it('should hide breadcrumbs on homepage', () => {
      (usePathname as jest.Mock).mockReturnValue('/');

      render(<BreadcrumbIntegrationWrapper pathname="/" />);

      // Breadcrumbs should be hidden on homepage
      expect(screen.queryByRole('navigation', { name: /breadcrumb/i })).not.toBeInTheDocument();
    });
  });

  describe('SEO Structured Data Integration', () => {
    it('should generate correct JSON-LD structured data for breadcrumbs', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/accounting');

      render(<BreadcrumbIntegrationWrapper pathname="/services/accounting" />);

      const jsonLdScript = screen.getByTestId('breadcrumb-jsonld');
      const jsonData = JSON.parse(jsonLdScript.innerHTML);

      expect(jsonData).toEqual({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://cpaonweb.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://cpaonweb.com/services',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Accounting',
          },
        ],
      });
    });

    it('should include proper microdata attributes for search engines', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/tax');

      render(<BreadcrumbIntegrationWrapper pathname="/services/tax" />);

      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });

      // Should have schema.org microdata
      expect(breadcrumbNav).toHaveAttribute('itemScope');
      expect(breadcrumbNav).toHaveAttribute('itemType', 'https://schema.org/BreadcrumbList');

      // Each breadcrumb item should have microdata
      const breadcrumbItems = breadcrumbNav.querySelectorAll('[itemProp="itemListElement"]');
      expect(breadcrumbItems.length).toBeGreaterThan(0);

      breadcrumbItems.forEach((item, index) => {
        expect(item).toHaveAttribute('itemScope');
        expect(item).toHaveAttribute('itemType', 'https://schema.org/ListItem');
        expect(item.querySelector('[itemProp="position"]')).toHaveAttribute('content', String(index + 1));
      });
    });

    it('should generate valid structured data for different page types', () => {
      const testPaths = [
        '/about',
        '/contact',
        '/pricing',
        '/legal/privacy',
        '/resources/blog',
      ];

      testPaths.forEach(pathname => {
        (usePathname as jest.Mock).mockReturnValue(pathname);

        const { unmount } = render(<BreadcrumbIntegrationWrapper pathname={pathname} />);

        const jsonLdScript = screen.getByTestId('breadcrumb-jsonld');
        const jsonData = JSON.parse(jsonLdScript.innerHTML);

        // Validate JSON-LD structure
        expect(jsonData['@context']).toBe('https://schema.org');
        expect(jsonData['@type']).toBe('BreadcrumbList');
        expect(Array.isArray(jsonData.itemListElement)).toBe(true);
        expect(jsonData.itemListElement.length).toBeGreaterThan(0);

        // Validate each breadcrumb item
        jsonData.itemListElement.forEach((item: any, index: number) => {
          expect(item['@type']).toBe('ListItem');
          expect(item.position).toBe(index + 1);
          expect(typeof item.name).toBe('string');
          expect(item.name.length).toBeGreaterThan(0);
        });

        unmount();
      });
    });
  });

  describe('Navigation Integration', () => {
    it('should integrate with navigation configuration for label resolution', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/advisory');

      render(<BreadcrumbIntegrationWrapper pathname="/services/advisory" />);

      // Labels should match navigation configuration
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Advisory')).toBeInTheDocument();

      // Verify navigation item resolution
      const servicesItem = findNavigationItemByHref([], '/services');
      const advisoryItem = findNavigationItemByHref([], '/services/advisory');

      // These should match the navigation configuration
      expect(screen.getByRole('link', { name: 'Services' })).toBeInTheDocument();
    });

    it('should handle breadcrumbs for pages not in navigation', () => {
      (usePathname as jest.Mock).mockReturnValue('/blog/sample-post');

      render(<BreadcrumbIntegrationWrapper pathname="/blog/sample-post" />);

      // Should gracefully handle unknown routes
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      // Should show path-based breadcrumb for unknown routes
      expect(screen.getByText('Sample Post')).toBeInTheDocument();
    });

    it('should update breadcrumbs when route changes', async () => {
      const { rerender } = render(<BreadcrumbIntegrationWrapper pathname="/services" />);

      expect(screen.getByText('Services')).toBeInTheDocument();

      // Simulate route change
      (usePathname as jest.Mock).mockReturnValue('/about');
      rerender(<BreadcrumbIntegrationWrapper pathname="/about" />);

      await waitFor(() => {
        expect(screen.getByText('About')).toBeInTheDocument();
        expect(screen.queryByText('Services')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('should provide proper ARIA landmarks and labels', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/tax');

      render(<BreadcrumbIntegrationWrapper pathname="/services/tax" />);

      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });

      // Should have proper ARIA labels
      expect(breadcrumbNav).toHaveAttribute('aria-label');
      expect(breadcrumbNav.getAttribute('aria-label')).toMatch(/breadcrumb/i);

      // Current page should be marked properly
      const currentPage = screen.getByText('Tax Services');
      expect(currentPage).toHaveAttribute('aria-current', 'page');

      // Links should be properly labeled
      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should support keyboard navigation', () => {
      (usePathname as jest.Mock).mockReturnValue('/services/accounting');

      render(<BreadcrumbIntegrationWrapper pathname="/services/accounting" />);

      const breadcrumbLinks = screen.getAllByRole('link');

      // All breadcrumb links should be focusable
      breadcrumbLinks.forEach(link => {
        expect(link).toHaveAttribute('href');
        expect(link.tabIndex).not.toBe(-1);
      });
    });

    it('should provide screen reader friendly breadcrumb trail', () => {
      (usePathname as jest.Mock).mockReturnValue('/resources/guides');

      render(<BreadcrumbIntegrationWrapper pathname="/resources/guides" />);

      const breadcrumbNav = screen.getByRole('navigation', { name: /breadcrumb/i });

      // Should contain proper separators for screen readers
      expect(breadcrumbNav.textContent).toMatch(/Home.*Resources.*Guides/);

      // Should have proper semantic markup
      expect(breadcrumbNav.querySelector('ol') || breadcrumbNav.querySelector('ul')).toBeInTheDocument();
    });
  });

  describe('Dynamic Breadcrumb Generation', () => {
    it('should handle dynamic routes with parameters', () => {
      (usePathname as jest.Mock).mockReturnValue('/client/dashboard/reports');

      render(<BreadcrumbIntegrationWrapper pathname="/client/dashboard/reports" />);

      // Should generate breadcrumbs for dynamic routes
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByText('Reports')).toBeInTheDocument();
    });

    it('should handle query parameters in breadcrumb generation', () => {
      (usePathname as jest.Mock).mockReturnValue('/services');

      render(<BreadcrumbIntegrationWrapper pathname="/services?category=tax" />);

      // Query parameters should not affect breadcrumb structure
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('should handle fragments and special characters in URLs', () => {
      (usePathname as jest.Mock).mockReturnValue('/resources/blog/tax-tips-2024');

      render(<BreadcrumbIntegrationWrapper pathname="/resources/blog/tax-tips-2024" />);

      // Should handle URL-friendly slugs
      expect(screen.getByText('Tax Tips 2024')).toBeInTheDocument(); // Formatted title
    });
  });

  describe('Performance and Caching', () => {
    it('should not cause unnecessary re-renders when breadcrumbs are stable', () => {
      const renderSpy = jest.fn();

      function TrackedBreadcrumbs(props: any) {
        renderSpy();
        return <Breadcrumbs {...props} />;
      }

      const breadcrumbPath = generateBreadcrumbPath('/services');

      const { rerender } = render(
        <TrackedBreadcrumbs path={breadcrumbPath} />
      );

      expect(renderSpy).toHaveBeenCalledTimes(1);

      // Re-render with same props
      rerender(<TrackedBreadcrumbs path={breadcrumbPath} />);

      // Should not cause additional renders if props are stable
      expect(renderSpy).toHaveBeenCalledTimes(1);
    });

    it('should efficiently handle breadcrumb generation for large navigation trees', () => {
      const startTime = performance.now();

      // Test breadcrumb generation for multiple paths
      const testPaths = Array.from({ length: 100 }, (_, i) => `/level1/level2/level3/page${i}`);

      testPaths.forEach(pathname => {
        generateBreadcrumbPath(pathname);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete breadcrumb generation efficiently
      expect(duration).toBeLessThan(100); // Less than 100ms for 100 paths
    });
  });
});