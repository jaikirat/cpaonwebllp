/**
 * Navigation State Management Integration Test
 * T010: Navigation state management integration test
 *
 * Purpose: Test how components share and manage navigation state across the layout system
 * Focus: Cross-component communication and shared state management
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { Footer } from '@/components/layout/Footer';
import { primaryNavigation, secondaryNavigation } from '@/config/navigation';
import type { MobileNavigationState } from '@/types/layout';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock shadcn/ui components
jest.mock('@/components/ui/navigation-menu', () => ({
  NavigationMenu: ({ children }: { children: React.ReactNode }) => <nav role="navigation">{children}</nav>,
  NavigationMenuList: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  NavigationMenuLink: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  NavigationMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavigationMenuTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="mobile-sheet">{children}</div> : null,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

// Navigation state management hook
function useNavigationState(): MobileNavigationState {
  const [isOpen, setIsOpen] = React.useState(false);

  return {
    isOpen,
    toggle: () => setIsOpen(!isOpen),
    close: () => setIsOpen(false),
  };
}

// Test wrapper component that integrates all navigation components
function NavigationIntegrationWrapper() {
  const navigationState = useNavigationState();
  const currentPath = '/services';
  const isAuthenticated = false;

  return (
    <div>
      <Header
        navigation={primaryNavigation}
        currentPath={currentPath}
        isAuthenticated={isAuthenticated}
      />
      <MobileNavigation
        navigation={primaryNavigation}
        isOpen={navigationState.isOpen}
        onToggle={navigationState.toggle}
        currentPath={currentPath}
      />
      <Footer
        navigation={secondaryNavigation}
        currentPath={currentPath}
      />
    </div>
  );
}

describe('Navigation State Management Integration', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
    });
  });

  describe('Mobile Navigation State Sharing', () => {
    it('should manage mobile navigation open/close state across components', async () => {
      render(<NavigationIntegrationWrapper />);

      // Mobile navigation should start closed
      expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();

      // Find and click mobile menu trigger (should be in Header)
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      // Mobile navigation should now be open
      await waitFor(() => {
        expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
      });

      // Test state consistency across components
      expect(screen.getByTestId('mobile-sheet')).toHaveAttribute('data-state', 'open');
    });

    it('should close mobile navigation when clicking outside or on overlay', async () => {
      render(<NavigationIntegrationWrapper />);

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
      });

      // Simulate clicking outside (overlay click)
      const overlay = screen.getByTestId('mobile-sheet');
      fireEvent.click(overlay);

      // Mobile navigation should close
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();
      });
    });

    it('should close mobile navigation when selecting a navigation item', async () => {
      render(<NavigationIntegrationWrapper />);

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
      });

      // Click on a navigation item
      const aboutLink = screen.getByRole('link', { name: 'About' });
      fireEvent.click(aboutLink);

      // Mobile navigation should close after navigation
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();
      });
    });
  });

  describe('Active Link State Synchronization', () => {
    it('should synchronize active link highlighting across Header, Mobile, and Footer', () => {
      render(<NavigationIntegrationWrapper />);

      // Check that Services link is marked as active in Header
      const headerServicesLink = screen.getAllByRole('link', { name: 'Services' })[0];
      expect(headerServicesLink).toHaveAttribute('aria-current', 'page');
      expect(headerServicesLink).toHaveClass('active');

      // Open mobile navigation and check active state there too
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      const mobileServicesLink = screen.getAllByRole('link', { name: 'Services' })[1];
      expect(mobileServicesLink).toHaveAttribute('aria-current', 'page');
      expect(mobileServicesLink).toHaveClass('active');
    });

    it('should update active states when route changes', async () => {
      const { rerender } = render(<NavigationIntegrationWrapper />);

      // Initially Services is active
      expect(screen.getAllByRole('link', { name: 'Services' })[0]).toHaveClass('active');

      // Simulate route change to About
      function UpdatedWrapper() {
        const navigationState = useNavigationState();
        const currentPath = '/about'; // Changed path
        const isAuthenticated = false;

        return (
          <div>
            <Header
              navigation={primaryNavigation}
              currentPath={currentPath}
              isAuthenticated={isAuthenticated}
            />
            <MobileNavigation
              navigation={primaryNavigation}
              isOpen={navigationState.isOpen}
              onToggle={navigationState.toggle}
              currentPath={currentPath}
            />
            <Footer
              navigation={secondaryNavigation}
              currentPath={currentPath}
            />
          </div>
        );
      }

      rerender(<UpdatedWrapper />);

      // Services should no longer be active, About should be active
      expect(screen.getAllByRole('link', { name: 'Services' })[0]).not.toHaveClass('active');
      expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveClass('active');
    });
  });

  describe('Navigation Event Propagation', () => {
    it('should propagate navigation events from mobile to desktop components', async () => {
      const navigationEventSpy = jest.fn();

      // Mock global navigation event listener
      window.addEventListener('navigation-event', navigationEventSpy);

      render(<NavigationIntegrationWrapper />);

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      // Click navigation item in mobile menu
      const mobileAboutLink = screen.getAllByRole('link', { name: 'About' })[1];
      fireEvent.click(mobileAboutLink);

      // Should trigger navigation event
      await waitFor(() => {
        expect(navigationEventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            detail: expect.objectContaining({
              source: 'mobile',
              item: expect.objectContaining({
                id: 'about',
                href: '/about'
              })
            })
          })
        );
      });

      window.removeEventListener('navigation-event', navigationEventSpy);
    });

    it('should handle nested navigation state (dropdown menus)', async () => {
      render(<NavigationIntegrationWrapper />);

      // Test Services dropdown in header
      const servicesLink = screen.getAllByRole('link', { name: 'Services' })[0];
      fireEvent.mouseEnter(servicesLink);

      // Dropdown should appear
      await waitFor(() => {
        expect(screen.getByText('Tax Services')).toBeInTheDocument();
        expect(screen.getByText('Accounting')).toBeInTheDocument();
        expect(screen.getByText('Advisory')).toBeInTheDocument();
      });

      // Test mobile dropdown behavior
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      // Mobile Services should have expandable submenu
      const mobileServicesItem = screen.getAllByText('Services')[1];
      fireEvent.click(mobileServicesItem);

      await waitFor(() => {
        // Both desktop and mobile submenus should be manageable independently
        expect(screen.getAllByText('Tax Services')).toHaveLength(2); // Desktop + Mobile
      });
    });
  });

  describe('Navigation State Persistence', () => {
    it('should maintain navigation state during route transitions', async () => {
      render(<NavigationIntegrationWrapper />);

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
      });

      // Simulate route change without closing mobile menu first
      // This tests if navigation state persists across renders
      const aboutLink = screen.getAllByRole('link', { name: 'About' })[0]; // Desktop link
      fireEvent.click(aboutLink);

      // Mobile navigation should close due to navigation
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();
      });
    });

    it('should reset navigation state on authentication changes', async () => {
      function AuthTestWrapper({ isAuthenticated }: { isAuthenticated: boolean }) {
        const navigationState = useNavigationState();
        const currentPath = '/services';

        return (
          <div>
            <Header
              navigation={primaryNavigation}
              currentPath={currentPath}
              isAuthenticated={isAuthenticated}
            />
            <MobileNavigation
              navigation={primaryNavigation}
              isOpen={navigationState.isOpen}
              onToggle={navigationState.toggle}
              currentPath={currentPath}
            />
          </div>
        );
      }

      const { rerender } = render(<AuthTestWrapper isAuthenticated={false} />);

      // Client Portal should not be visible when not authenticated
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();

      // Change to authenticated state
      rerender(<AuthTestWrapper isAuthenticated={true} />);

      // Client Portal should now be visible
      await waitFor(() => {
        expect(screen.getByText('Client Portal')).toBeInTheDocument();
      });
    });
  });
});