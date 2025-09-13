/**
 * Header Component Contract Test
 * Global Layout and Navigation Shell Feature
 *
 * CRITICAL TDD TEST: This test MUST FAIL before implementation
 * Tests the Header component interface based on specs/003-build-a-global/contracts/layout-components.yaml
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '@/components/layout/Header';
import { NavigationItem } from '@/types/layout';
import { primaryNavigation } from '@/config/navigation';

// Mock navigation data for testing
const mockNavigation: NavigationItem[] = [
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
    ],
  },
  {
    id: 'client-portal',
    label: 'Client Portal',
    href: '/portal',
    visibility: 'authenticated',
    position: 'primary',
    order: 3,
  },
];

describe('Header Component Contract', () => {
  describe('Component Interface', () => {
    it('should render with required props', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Should render without throwing
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should accept optional isAuthenticated prop', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
          isAuthenticated={true}
        />
      );

      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should have correct TypeScript prop types', () => {
      // This test will fail until component is implemented with correct types
      const component = <Header
        navigation={mockNavigation}
        currentPath="/"
        isAuthenticated={false}
      />;
      expect(component).toBeDefined();
    });
  });

  describe('Navigation Rendering Contract', () => {
    it('must render primary navigation items from navigation prop', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: MUST render primary navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
    });

    it('must highlight active navigation item based on currentPath', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/services"
        />
      );

      // Contract: MUST highlight active navigation item
      const servicesLink = screen.getByText('Services').closest('a');
      expect(servicesLink).toHaveAttribute('aria-current', 'page');
    });

    it('must show/hide items based on visibility and isAuthenticated', () => {
      // Test unauthenticated state
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
          isAuthenticated={false}
        />
      );

      // Contract: MUST hide authenticated items when not authenticated
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();

      // Re-render with authenticated state
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
          isAuthenticated={true}
        />
      );

      // Contract: MUST show authenticated items when authenticated
      expect(screen.getByText('Client Portal')).toBeInTheDocument();
    });
  });

  describe('Accessibility Contract', () => {
    it('must have role banner', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: role="banner"
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('must include nav element with aria-label Main navigation', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: nav element with aria-label="Main navigation"
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('must include skip link to main content', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: Skip link to main content
      const skipLink = screen.getByText('Skip to main content');
      expect(skipLink).toBeInTheDocument();
      expect(skipLink.closest('a')).toHaveAttribute('href', '#main-content');
    });

    it('must provide keyboard navigation support', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: Keyboard focus management
      const navigation = screen.getByRole('navigation', { name: 'Main navigation' });
      const firstLink = navigation.querySelector('a');

      expect(firstLink).toBeInTheDocument();
      expect(firstLink).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Responsive Behavior Contract', () => {
    it('must be responsive with mobile hamburger menu', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640, // Mobile breakpoint
      });

      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: MUST be responsive (mobile hamburger menu)
      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuButton).toBeInTheDocument();
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('must toggle mobile menu on button click', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });

      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      const mobileMenuButton = screen.getByRole('button', { name: /menu/i });

      // Click to open
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'true');

      // Click to close
      fireEvent.click(mobileMenuButton);
      expect(mobileMenuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Integration Contract', () => {
    it('must work with primaryNavigation from config', () => {
      render(
        <Header
          navigation={primaryNavigation}
          currentPath="/"
        />
      );

      // Contract: Must integrate with navigation configuration
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('must handle nested navigation items (children)', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      // Contract: Must handle hierarchical navigation
      const servicesItem = screen.getByText('Services');
      expect(servicesItem).toBeInTheDocument();

      // Should show dropdown or submenu indication
      const servicesContainer = servicesItem.closest('li') || servicesItem.closest('div');
      expect(servicesContainer).toHaveAttribute('aria-haspopup', 'true');
    });
  });

  describe('Performance Contract', () => {
    it('must update navigation highlight in under 50ms', async () => {
      const { rerender } = render(
        <Header
          navigation={mockNavigation}
          currentPath="/"
        />
      );

      const startTime = performance.now();

      // Change currentPath to trigger highlight update
      rerender(
        <Header
          navigation={mockNavigation}
          currentPath="/services"
        />
      );

      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Contract: Navigation highlight update < 50ms
      expect(updateTime).toBeLessThan(50);
    });
  });

  describe('Error Handling Contract', () => {
    it('must handle empty navigation gracefully', () => {
      render(
        <Header
          navigation={[]}
          currentPath="/"
        />
      );

      // Should render header but with no navigation items
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    });

    it('must handle invalid currentPath gracefully', () => {
      render(
        <Header
          navigation={mockNavigation}
          currentPath="/non-existent-path"
        />
      );

      // Should render without errors, no active highlighting
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.queryByLabelText(/current page/i)).not.toBeInTheDocument();
    });
  });
});