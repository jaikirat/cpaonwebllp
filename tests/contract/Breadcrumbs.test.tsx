/**
 * Breadcrumbs Component Contract Test
 * Global Layout and Navigation Shell Feature
 *
 * CRITICAL TDD TEST: This test MUST FAIL before implementation
 * Tests the Breadcrumbs component interface based on specs/003-build-a-global/contracts/layout-components.yaml
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BreadcrumbPath } from '@/types/layout';

// Mock breadcrumb path data for testing
const mockBreadcrumbPath: BreadcrumbPath = {
  segments: [
    {
      label: 'Home',
      href: '/',
      isActive: false,
    },
    {
      label: 'Services',
      href: '/services',
      isActive: false,
    },
    {
      label: 'Tax Services',
      href: '/services/tax',
      isActive: true,
    },
  ],
  currentPage: 'Tax Services',
  fullPath: '/services/tax',
  isHomePage: false,
  jsonLdData: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: '/services',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Tax Services',
      },
    ],
  },
};

const mockHomePagePath: BreadcrumbPath = {
  segments: [],
  currentPage: 'Home',
  fullPath: '/',
  isHomePage: true,
  jsonLdData: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [],
  },
};

describe('Breadcrumbs Component Contract', () => {
  describe('Component Interface', () => {
    it('should render with required props', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Should render without throwing
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('should accept optional className prop', () => {
      render(
        <Breadcrumbs
          path={mockBreadcrumbPath}
          className="custom-breadcrumbs"
        />
      );

      // Should apply custom class
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toHaveClass('custom-breadcrumbs');
    });

    it('should have correct TypeScript prop types', () => {
      // This test will fail until component is implemented with correct types
      const component = <Breadcrumbs
        path={mockBreadcrumbPath}
        className="test"
      />;
      expect(component).toBeDefined();
    });
  });

  describe('Breadcrumb Rendering Contract', () => {
    it('must render breadcrumb trail from path.segments', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: MUST render breadcrumb trail from path.segments
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Tax Services')).toBeInTheDocument();
    });

    it('must hide if path.isHomePage is true', () => {
      render(<Breadcrumbs path={mockHomePagePath} />);

      // Contract: MUST hide if path.isHomePage is true
      const breadcrumbNav = screen.queryByRole('navigation', { name: 'Breadcrumb' });
      expect(breadcrumbNav).not.toBeInTheDocument();
    });

    it('must render current page as non-clickable', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: MUST render current page as non-clickable
      const currentPageElement = screen.getByText('Tax Services');
      const currentPageLink = currentPageElement.closest('a');

      // Current page should not be a link or should be disabled
      expect(currentPageLink).toBeNull();

      // Should have aria-current="page"
      expect(currentPageElement).toHaveAttribute('aria-current', 'page');
    });

    it('must render non-current segments as clickable links', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Non-current segments should be links
      const homeLink = screen.getByText('Home').closest('a');
      const servicesLink = screen.getByText('Services').closest('a');

      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');

      expect(servicesLink).toBeInTheDocument();
      expect(servicesLink).toHaveAttribute('href', '/services');
    });
  });

  describe('Accessibility Contract', () => {
    it('must use nav element with aria-label Breadcrumb', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: nav element with aria-label="Breadcrumb"
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    });

    it('must use ol element for semantic structure', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: ol element for semantic structure
      expect(screen.getByRole('list')).toBeInTheDocument();

      // Should have list items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3); // Home, Services, Tax Services
    });

    it('must use aria-current page on current item', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: aria-current="page" on current item
      const currentItem = screen.getByText('Tax Services');
      expect(currentItem).toHaveAttribute('aria-current', 'page');
    });

    it('must provide proper list semantics', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      const list = screen.getByRole('list');
      const listItems = screen.getAllByRole('listitem');

      // All segments should be in list items
      expect(listItems).toHaveLength(3);

      // Each list item should contain the breadcrumb content
      expect(listItems[0]).toHaveTextContent('Home');
      expect(listItems[1]).toHaveTextContent('Services');
      expect(listItems[2]).toHaveTextContent('Tax Services');
    });
  });

  describe('SEO and Structured Data Contract', () => {
    it('must include JSON-LD structured data', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Contract: MUST include JSON-LD structured data
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeInTheDocument();

      if (scriptElement) {
        const jsonLd = JSON.parse(scriptElement.textContent || '{}');
        expect(jsonLd['@type']).toBe('BreadcrumbList');
        expect(jsonLd['@context']).toBe('https://schema.org');
        expect(jsonLd.itemListElement).toHaveLength(3);
      }
    });

    it('must generate correct JSON-LD structure', () => {
      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeInTheDocument();

      if (scriptElement) {
        const jsonLd = JSON.parse(scriptElement.textContent || '{}');

        // Validate structure
        expect(jsonLd.itemListElement[0]).toEqual({
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: '/',
        });

        expect(jsonLd.itemListElement[1]).toEqual({
          '@type': 'ListItem',
          position: 2,
          name: 'Services',
          item: '/services',
        });

        // Current page should not have 'item' property
        expect(jsonLd.itemListElement[2]).toEqual({
          '@type': 'ListItem',
          position: 3,
          name: 'Tax Services',
        });
      }
    });

    it('must not include JSON-LD when on home page', () => {
      render(<Breadcrumbs path={mockHomePagePath} />);

      // Should not render structured data for home page
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeNull();
    });
  });

  describe('Truncation Contract', () => {
    it('must truncate long paths appropriately', () => {
      const longPath: BreadcrumbPath = {
        segments: [
          { label: 'Home', href: '/', isActive: false },
          { label: 'Very Long Category Name', href: '/very-long-category-name', isActive: false },
          { label: 'Another Very Long Subcategory Name', href: '/very-long-category-name/subcategory', isActive: false },
          { label: 'Extremely Long Product Name That Should Be Truncated', href: '/path/to/long/product', isActive: false },
          { label: 'Current Very Long Page Title', href: '/current', isActive: true },
        ],
        currentPage: 'Current Very Long Page Title',
        fullPath: '/current',
        isHomePage: false,
        jsonLdData: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [],
        },
      };

      render(<Breadcrumbs path={longPath} />);

      // Contract: MUST truncate long paths appropriately
      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toHaveClass(/truncate|ellipsis|overflow-hidden/);
    });

    it('must handle deeply nested paths', () => {
      const deepPath: BreadcrumbPath = {
        segments: Array.from({ length: 8 }, (_, i) => ({
          label: `Level ${i + 1}`,
          href: `/level-${i + 1}`,
          isActive: i === 7,
        })),
        currentPage: 'Level 8',
        fullPath: '/level-8',
        isHomePage: false,
        jsonLdData: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [],
        },
      };

      render(<Breadcrumbs path={deepPath} />);

      // Should render but may collapse some middle items
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
      expect(screen.getByText('Level 8')).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior Contract', () => {
    it('must adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 360, // Mobile viewport
      });

      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });

      // On mobile, breadcrumbs might be more compact or scrollable
      expect(nav).toHaveClass(/flex|overflow-x-auto|whitespace-nowrap/);
    });

    it('must adapt to desktop viewport', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200, // Desktop viewport
      });

      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
      expect(nav).toBeInTheDocument();

      // On desktop, full breadcrumbs should be visible
      expect(screen.getByText('Home')).toBeVisible();
      expect(screen.getByText('Services')).toBeVisible();
      expect(screen.getByText('Tax Services')).toBeVisible();
    });
  });

  describe('Performance Contract', () => {
    it('must generate breadcrumbs quickly', () => {
      const startTime = performance.now();

      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render quickly (under 10ms as per contract)
      expect(renderTime).toBeLessThan(10);
    });

    it('must serialize JSON-LD efficiently', () => {
      const startTime = performance.now();

      render(<Breadcrumbs path={mockBreadcrumbPath} />);

      // Check that structured data was generated
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeInTheDocument();

      const endTime = performance.now();
      const serializationTime = endTime - startTime;

      // JSON-LD serialization should be fast (under 5ms as per contract)
      expect(serializationTime).toBeLessThan(5);
    });
  });

  describe('Error Handling Contract', () => {
    it('must handle empty segments gracefully', () => {
      const emptyPath: BreadcrumbPath = {
        segments: [],
        currentPage: 'Orphaned Page',
        fullPath: '/orphaned',
        isHomePage: false,
        jsonLdData: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [],
        },
      };

      render(<Breadcrumbs path={emptyPath} />);

      // Should render navigation but with no breadcrumb items
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
      const list = screen.queryByRole('list');
      expect(list).toBeInTheDocument();
    });

    it('must handle malformed path data gracefully', () => {
      const malformedPath = {
        segments: [
          {
            label: 'Valid Segment',
            href: '/valid',
            isActive: false,
          },
          {
            // Missing href
            label: 'Invalid Segment',
            isActive: false,
          } as any,
        ],
        currentPage: 'Current Page',
        fullPath: '/current',
        isHomePage: false,
        jsonLdData: {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [],
        },
      } as BreadcrumbPath;

      render(<Breadcrumbs path={malformedPath} />);

      // Should handle malformed data without crashing
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
      expect(screen.getByText('Valid Segment')).toBeInTheDocument();
    });

    it('must handle missing JSON-LD data gracefully', () => {
      const pathWithoutJsonLd = {
        ...mockBreadcrumbPath,
        jsonLdData: undefined,
      } as any;

      render(<Breadcrumbs path={pathWithoutJsonLd} />);

      // Should render breadcrumbs but not crash on missing JSON-LD
      expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();

      // Should not have structured data script
      const scriptElement = document.querySelector('script[type="application/ld+json"]');
      expect(scriptElement).toBeNull();
    });
  });
});