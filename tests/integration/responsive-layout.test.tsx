/**
 * Responsive Layout Behavior Integration Test
 * T011: Responsive behavior integration test
 *
 * Purpose: Test responsive layout behavior across different screen sizes and devices
 * Focus: Multi-component responsive integration and breakpoint behavior
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { LayoutContainer } from '@/components/layout/LayoutContainer';
import { primaryNavigation, secondaryNavigation } from '@/config/navigation';

// Mock window.matchMedia for responsive testing
const createMockMatchMedia = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/services',
}));

// Mock shadcn/ui components
jest.mock('@/components/ui/navigation-menu', () => ({
  NavigationMenu: ({ children, className }: { children: React.ReactNode; className?: string }) =>
    <nav role="navigation" className={className}>{children}</nav>,
  NavigationMenuList: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
  NavigationMenuItem: ({ children }: { children: React.ReactNode }) => <li>{children}</li>,
  NavigationMenuLink: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
  NavigationMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  NavigationMenuTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
}));

jest.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children, open }: { children: React.ReactNode; open: boolean }) =>
    open ? <div data-testid="mobile-sheet">{children}</div> : null,
  SheetContent: ({ children, side }: { children: React.ReactNode; side?: string }) =>
    <div data-testid="sheet-content" data-side={side}>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Custom hook to manage responsive state
function useResponsiveLayout() {
  const [screenSize, setScreenSize] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMobileMenuVisible, setIsMobileMenuVisible] = React.useState(false);

  React.useEffect(() => {
    const updateScreenSize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
        setIsMobileMenuVisible(true);
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
        setIsMobileMenuVisible(true);
      } else {
        setScreenSize('desktop');
        setIsMobileMenuVisible(false);
      }
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return { screenSize, isMobileMenuVisible };
}

// Full responsive layout wrapper
function ResponsiveLayoutWrapper() {
  const { screenSize, isMobileMenuVisible } = useResponsiveLayout();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const currentPath = '/services';
  const isAuthenticated = false;

  return (
    <LayoutContainer variant="default">
      <div data-testid="layout-wrapper" data-screen={screenSize}>
        <Header
          navigation={primaryNavigation}
          currentPath={currentPath}
          isAuthenticated={isAuthenticated}
        />
        {isMobileMenuVisible && (
          <MobileNavigation
            navigation={primaryNavigation}
            isOpen={mobileNavOpen}
            onToggle={() => setMobileNavOpen(!mobileNavOpen)}
            currentPath={currentPath}
          />
        )}
        <main>
          <h1>Test Content</h1>
        </main>
        <Footer
          navigation={secondaryNavigation}
          currentPath={currentPath}
        />
      </div>
    </LayoutContainer>
  );
}

describe('Responsive Layout Behavior Integration', () => {
  let originalInnerWidth: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    window.matchMedia = createMockMatchMedia(false);
  });

  describe('Mobile Breakpoint Behavior (< 640px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // iPhone size
      });
      window.matchMedia = createMockMatchMedia(true);
    });

    it('should show mobile navigation components and hide desktop navigation', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Layout should be in mobile mode
      const layoutWrapper = screen.getByTestId('layout-wrapper');
      expect(layoutWrapper).toHaveAttribute('data-screen', 'mobile');

      // Desktop navigation should be hidden (via CSS classes)
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('md:block', 'hidden'); // Tailwind responsive classes

      // Mobile menu trigger should be visible
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuTrigger).toBeVisible();
      expect(mobileMenuTrigger).toHaveClass('md:hidden', 'block');
    });

    it('should apply mobile-specific layout container padding', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('px-4'); // Mobile padding
    });

    it('should stack footer navigation vertically on mobile', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Footer navigation should use mobile layout
      const footerNav = screen.getByRole('contentinfo').querySelector('nav');
      expect(footerNav).toHaveClass('flex-col', 'md:flex-row');
    });
  });

  describe('Tablet Breakpoint Behavior (640px - 1024px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768, // iPad size
      });
      window.matchMedia = createMockMatchMedia(false);
    });

    it('should show condensed navigation with mobile menu available', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const layoutWrapper = screen.getByTestId('layout-wrapper');
      expect(layoutWrapper).toHaveAttribute('data-screen', 'tablet');

      // Should show both desktop and mobile menu options
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
    });

    it('should apply tablet-specific container constraints', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('px-6'); // Tablet padding
      expect(layoutContainer).toHaveClass('max-w-screen-lg'); // Tablet max-width
    });

    it('should show truncated navigation labels on tablet', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Some navigation items might be truncated or grouped
      const servicesLink = screen.getByRole('link', { name: /services/i });
      expect(servicesLink.parentElement).toHaveClass('lg:inline', 'hidden');
    });
  });

  describe('Desktop Breakpoint Behavior (>= 1024px)', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440, // Desktop size
      });
      window.matchMedia = createMockMatchMedia(false);
    });

    it('should show full desktop navigation and hide mobile components', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const layoutWrapper = screen.getByTestId('layout-wrapper');
      expect(layoutWrapper).toHaveAttribute('data-screen', 'desktop');

      // Desktop navigation should be fully visible
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('block');

      // Mobile menu trigger should be hidden
      const mobileMenuTrigger = screen.queryByRole('button', { name: /menu/i });
      expect(mobileMenuTrigger).toHaveClass('hidden', 'lg:hidden');
    });

    it('should apply desktop layout container with max width', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('px-8'); // Desktop padding
      expect(layoutContainer).toHaveClass('max-w-screen-xl'); // Desktop max-width
    });

    it('should show horizontal footer navigation with all links', async () => {
      render(<ResponsiveLayoutWrapper />);

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const footerNav = screen.getByRole('contentinfo').querySelector('nav');
      expect(footerNav).toHaveClass('flex-row');

      // All secondary navigation items should be visible
      expect(screen.getByText('FAQs')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
      expect(screen.getByText('Sitemap')).toBeInTheDocument();
    });
  });

  describe('Responsive Transitions and Animations', () => {
    it('should handle smooth transitions between breakpoints', async () => {
      render(<ResponsiveLayoutWrapper />);

      // Start at desktop
      Object.defineProperty(window, 'innerWidth', {
        value: 1440,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(screen.getByTestId('layout-wrapper')).toHaveAttribute('data-screen', 'desktop');

      // Transition to mobile
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(screen.getByTestId('layout-wrapper')).toHaveAttribute('data-screen', 'mobile');

      // Layout should transition smoothly
      const layoutContainer = screen.getByTestId('layout-container');
      expect(layoutContainer).toHaveClass('transition-all', 'duration-300');
    });

    it('should maintain navigation state during responsive transitions', async () => {
      render(<ResponsiveLayoutWrapper />);

      // Start at desktop, open dropdown
      Object.defineProperty(window, 'innerWidth', {
        value: 1440,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Transition to mobile - navigation state should reset
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Mobile navigation should be closed by default
      expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();
    });
  });

  describe('Container Width and Grid Behavior', () => {
    it('should apply correct grid behavior at each breakpoint', async () => {
      function GridTestWrapper({ variant }: { variant: 'default' | 'wide' | 'narrow' }) {
        return (
          <LayoutContainer variant={variant}>
            <div>Grid content</div>
          </LayoutContainer>
        );
      }

      const { rerender } = render(<GridTestWrapper variant="default" />);

      const container = screen.getByTestId('layout-container');

      // Default variant
      expect(container).toHaveClass('max-w-screen-xl');

      // Wide variant
      rerender(<GridTestWrapper variant="wide" />);
      expect(container).toHaveClass('max-w-full');

      // Narrow variant
      rerender(<GridTestWrapper variant="narrow" />);
      expect(container).toHaveClass('max-w-screen-md');
    });

    it('should handle nested responsive containers', async () => {
      function NestedContainerWrapper() {
        return (
          <LayoutContainer variant="wide">
            <Header navigation={primaryNavigation} currentPath="/test" />
            <LayoutContainer variant="narrow">
              <main>Nested content</main>
            </LayoutContainer>
            <Footer navigation={secondaryNavigation} currentPath="/test" />
          </LayoutContainer>
        );
      }

      render(<NestedContainerWrapper />);

      const containers = screen.getAllByTestId('layout-container');
      expect(containers).toHaveLength(2);

      // Outer container should be wide
      expect(containers[0]).toHaveClass('max-w-full');
      // Inner container should be narrow
      expect(containers[1]).toHaveClass('max-w-screen-md');
    });
  });

  describe('Accessibility and Responsive Behavior', () => {
    it('should maintain proper ARIA labels across screen sizes', async () => {
      render(<ResponsiveLayoutWrapper />);

      // Test mobile
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Primary navigation');

      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      expect(mobileMenuTrigger).toHaveAttribute('aria-expanded', 'false');
      expect(mobileMenuTrigger).toHaveAttribute('aria-controls');
    });

    it('should provide proper focus management during responsive changes', async () => {
      render(<ResponsiveLayoutWrapper />);

      // Focus on desktop navigation
      const servicesLink = screen.getByRole('link', { name: 'Services' });
      servicesLink.focus();
      expect(document.activeElement).toBe(servicesLink);

      // Transition to mobile
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true,
      });

      await act(async () => {
        window.dispatchEvent(new Event('resize'));
      });

      // Focus should move to mobile menu trigger
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      expect(document.activeElement).toBe(mobileMenuTrigger);
    });
  });
});