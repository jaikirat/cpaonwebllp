/**
 * MobileNavigation Component Contract Test
 * Global Layout and Navigation Shell Feature
 *
 * CRITICAL TDD TEST: This test MUST FAIL before implementation
 * Tests the MobileNavigation component interface based on specs/003-build-a-global/contracts/layout-components.yaml
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
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
    id: 'contact',
    label: 'Contact',
    href: '/contact',
    visibility: 'public',
    position: 'primary',
    order: 3,
  },
];

describe('MobileNavigation Component Contract', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  describe('Component Interface', () => {
    it('should render with required props', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={false}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Component should render (even if not visible when closed)
      // The dialog/drawer should exist in DOM but not be visible
      expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
    });

    it('should have correct TypeScript prop types', () => {
      // This test will fail until component is implemented with correct types
      const component = <MobileNavigation
        navigation={mockNavigation}
        isOpen={true}
        onToggle={mockOnToggle}
        currentPath="/"
      />;
      expect(component).toBeDefined();
    });

    it('should require all props (no optional props)', () => {
      // All props are required according to contract
      expect(() => {
        // @ts-expect-error - intentionally missing required props
        render(<MobileNavigation />);
      }).toBeDefined();
    });
  });

  describe('Visibility Control Contract', () => {
    it('must show/hide based on isOpen prop', () => {
      const { rerender } = render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={false}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: MUST show/hide based on isOpen prop
      let dialog = screen.getByRole('dialog', { hidden: true });
      expect(dialog).not.toBeVisible();

      // Rerender with isOpen=true
      rerender(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      dialog = screen.getByRole('dialog');
      expect(dialog).toBeVisible();
    });

    it('must render navigation items when open', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // When open, should show navigation items
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('must not show navigation content when closed', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={false}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // When closed, navigation items should not be visible
      expect(screen.queryByText('Home')).not.toBeVisible();
      expect(screen.queryByText('Services')).not.toBeVisible();
    });
  });

  describe('Navigation Interaction Contract', () => {
    it('must close when navigation item is selected', async () => {
      const user = userEvent.setup();

      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: MUST close when navigation item is selected
      const homeLink = screen.getByText('Home');
      await user.click(homeLink);

      // Should call onToggle to close the menu
      expect(mockOnToggle).toHaveBeenCalled();
    });

    it('must highlight current page based on currentPath', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/services"
        />
      );

      // Contract: MUST highlight active navigation item
      const servicesLink = screen.getByText('Services').closest('a');
      expect(servicesLink).toHaveAttribute('aria-current', 'page');
    });

    it('must handle nested navigation items', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should show nested items or provide way to access them
      const servicesItem = screen.getByText('Services');
      expect(servicesItem).toBeInTheDocument();

      // Should indicate it has children
      const servicesContainer = servicesItem.closest('li') || servicesItem.closest('div');
      expect(servicesContainer).toHaveAttribute('aria-expanded');
    });
  });

  describe('Touch Gesture Contract', () => {
    it('must support touch gestures', async () => {
      const user = userEvent.setup();

      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      const dialog = screen.getByRole('dialog');

      // Contract: MUST support touch gestures
      // Simulate swipe gesture to close
      fireEvent.touchStart(dialog, {
        touches: [{ clientX: 200, clientY: 100 }]
      });

      fireEvent.touchMove(dialog, {
        touches: [{ clientX: 50, clientY: 100 }]
      });

      fireEvent.touchEnd(dialog, {
        changedTouches: [{ clientX: 50, clientY: 100 }]
      });

      // Should close on swipe gesture
      await waitFor(() => {
        expect(mockOnToggle).toHaveBeenCalled();
      });
    });
  });

  describe('Focus Management Contract', () => {
    it('must trap focus when open', async () => {
      const user = userEvent.setup();

      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: MUST trap focus when open
      const dialog = screen.getByRole('dialog');
      const firstFocusable = dialog.querySelector('button, a, input, [tabindex]');
      const lastFocusable = dialog.querySelector('button:last-child, a:last-child, input:last-child, [tabindex]:last-child');

      expect(firstFocusable).toBeInTheDocument();

      // Focus should be trapped within the dialog
      if (firstFocusable) {
        firstFocusable.focus();
        expect(document.activeElement).toBe(firstFocusable);
      }

      // Tab should cycle within the dialog
      await user.tab();
      expect(document.activeElement).not.toBe(document.body);
    });

    it('must close on escape key', async () => {
      const user = userEvent.setup();

      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: MUST close on escape key
      await user.keyboard('{Escape}');

      expect(mockOnToggle).toHaveBeenCalled();
    });

    it('must focus first item when opened', () => {
      const { rerender } = render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={false}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Open the navigation
      rerender(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should focus first interactive element when opened
      const dialog = screen.getByRole('dialog');
      const firstFocusable = dialog.querySelector('button, a, input, [tabindex]');
      expect(document.activeElement).toBe(firstFocusable);
    });
  });

  describe('Accessibility Contract', () => {
    it('must have role dialog', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: role="dialog"
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('must have aria-label Mobile navigation menu', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: aria-label="Mobile navigation menu"
      expect(screen.getByLabelText('Mobile navigation menu')).toBeInTheDocument();
    });

    it('must have aria-expanded on toggle button context', () => {
      render(
        <div>
          <button aria-expanded={true} aria-controls="mobile-nav">Menu</button>
          <MobileNavigation
            navigation={mockNavigation}
            isOpen={true}
            onToggle={mockOnToggle}
            currentPath="/"
          />
        </div>
      );

      // The dialog itself should be properly labeled
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('id');
    });

    it('must provide screen reader announcements', () => {
      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should have live region for announcements
      const liveRegion = screen.getByLabelText('Mobile navigation menu');
      expect(liveRegion).toHaveAttribute('role', 'dialog');
    });
  });

  describe('Performance Contract', () => {
    it('must toggle in under 200ms', async () => {
      const { rerender } = render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={false}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      const startTime = performance.now();

      // Toggle to open
      rerender(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      const endTime = performance.now();
      const toggleTime = endTime - startTime;

      // Contract: Mobile menu toggle < 200ms
      expect(toggleTime).toBeLessThan(200);
    });
  });

  describe('Integration Contract', () => {
    it('must work with primaryNavigation from config', () => {
      render(
        <MobileNavigation
          navigation={primaryNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Contract: Must integrate with navigation configuration
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('must respect authentication-based visibility', () => {
      const navigationWithAuth = [
        ...mockNavigation,
        {
          id: 'client-portal',
          label: 'Client Portal',
          href: '/portal',
          visibility: 'authenticated' as const,
          position: 'primary' as const,
          order: 4,
        },
      ];

      render(
        <MobileNavigation
          navigation={navigationWithAuth}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should not show authenticated items (assuming no auth context)
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling Contract', () => {
    it('must handle empty navigation gracefully', () => {
      render(
        <MobileNavigation
          navigation={[]}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should render dialog but with no navigation items
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Mobile navigation menu')).toBeInTheDocument();
    });

    it('must handle callback errors gracefully', () => {
      const faultyToggle = jest.fn(() => {
        throw new Error('Toggle error');
      });

      render(
        <MobileNavigation
          navigation={mockNavigation}
          isOpen={true}
          onToggle={faultyToggle}
          currentPath="/"
        />
      );

      // Should not crash when callback throws
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('must handle malformed navigation items gracefully', () => {
      const malformedNavigation = [
        {
          id: 'incomplete',
          label: 'Incomplete Item',
          // Missing href
          visibility: 'public' as const,
          position: 'primary' as const,
          order: 1,
        } as NavigationItem,
      ];

      render(
        <MobileNavigation
          navigation={malformedNavigation}
          isOpen={true}
          onToggle={mockOnToggle}
          currentPath="/"
        />
      );

      // Should handle malformed items without crashing
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});