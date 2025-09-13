/**
 * Authentication-Based Navigation Visibility Integration Test
 * T012: Authentication-based visibility integration test
 *
 * Purpose: Test navigation visibility changes based on user authentication state
 * Focus: Cross-component authentication state integration and dynamic navigation
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { primaryNavigation, secondaryNavigation, getFilteredNavigation } from '@/config/navigation';
import type { NavigationItem } from '@/types/layout';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/services',
}));

// Mock authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: string } | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children, initialAuth = false }: {
  children: React.ReactNode;
  initialAuth?: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(initialAuth);
  const [user, setUser] = React.useState<{ name: string; role: string } | null>(
    initialAuth ? { name: 'John Doe', role: 'client' } : null
  );

  const login = async (credentials: { email: string; password: string }) => {
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsAuthenticated(true);
    setUser({ name: 'John Doe', role: 'client' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

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
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, ...props }: any) => (
    <button onClick={onClick} className={className} data-variant={variant} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

// Navigation wrapper with authentication integration
function AuthenticatedNavigationWrapper() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const currentPath = '/services';

  const filteredPrimaryNav = getFilteredNavigation(primaryNavigation, isAuthenticated);
  const filteredSecondaryNav = getFilteredNavigation(secondaryNavigation, isAuthenticated);

  return (
    <div data-testid="navigation-wrapper" data-authenticated={isAuthenticated}>
      <Header
        navigation={filteredPrimaryNav}
        currentPath={currentPath}
        isAuthenticated={isAuthenticated}
      />
      <MobileNavigation
        navigation={filteredPrimaryNav}
        isOpen={mobileNavOpen}
        onToggle={() => setMobileNavOpen(!mobileNavOpen)}
        currentPath={currentPath}
      />
      <main>
        {isAuthenticated && user && (
          <div data-testid="user-info">
            Welcome, {user.name}
            <button onClick={logout} data-testid="logout-button">Logout</button>
          </div>
        )}
        <h1>Main Content</h1>
      </main>
      <Footer
        navigation={filteredSecondaryNav}
        currentPath={currentPath}
      />
    </div>
  );
}

describe('Authentication-Based Navigation Visibility Integration', () => {
  describe('Unauthenticated State', () => {
    it('should hide authenticated-only navigation items in all components', () => {
      render(
        <AuthProvider initialAuth={false}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      const wrapper = screen.getByTestId('navigation-wrapper');
      expect(wrapper).toHaveAttribute('data-authenticated', 'false');

      // Client Portal should not be visible in any navigation component
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: 'Client Portal' })).not.toBeInTheDocument();

      // Public navigation items should be visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should show login/signup options when not authenticated', () => {
      render(
        <AuthProvider initialAuth={false}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Should show authentication CTA buttons
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();

      // Should not show user-specific UI
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('should maintain consistent navigation filtering across mobile and desktop', () => {
      render(
        <AuthProvider initialAuth={false}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      // Both desktop and mobile should have the same filtered navigation
      const allNavigationLinks = screen.getAllByRole('link');
      const clientPortalLinks = allNavigationLinks.filter(link =>
        link.textContent?.includes('Client Portal')
      );

      expect(clientPortalLinks).toHaveLength(0);
    });
  });

  describe('Authenticated State', () => {
    it('should show authenticated-only navigation items in all components', () => {
      render(
        <AuthProvider initialAuth={true}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      const wrapper = screen.getByTestId('navigation-wrapper');
      expect(wrapper).toHaveAttribute('data-authenticated', 'true');

      // Client Portal should be visible
      expect(screen.getByText('Client Portal')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Client Portal' })).toBeInTheDocument();

      // All public navigation items should still be visible
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('should show user-specific UI elements when authenticated', () => {
      render(
        <AuthProvider initialAuth={true}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Should show user info
      expect(screen.getByTestId('user-info')).toBeInTheDocument();
      expect(screen.getByText('Welcome, John Doe')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();

      // Should show user dropdown in header
      expect(screen.getByRole('button', { name: /john doe/i })).toBeInTheDocument();

      // Should not show login/signup buttons
      expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /get started/i })).not.toBeInTheDocument();
    });

    it('should show user navigation dropdown with account options', async () => {
      render(
        <AuthProvider initialAuth={true}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Click user dropdown trigger
      const userDropdownTrigger = screen.getByRole('button', { name: /john doe/i });
      fireEvent.click(userDropdownTrigger);

      // Should show dropdown menu with user options
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Account Settings')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });
  });

  describe('Authentication State Transitions', () => {
    it('should update navigation visibility when logging in', async () => {
      function LoginTestWrapper() {
        const { isAuthenticated, login } = useAuth();

        const handleLogin = () => {
          login({ email: 'test@example.com', password: 'password' });
        };

        return (
          <div>
            <AuthenticatedNavigationWrapper />
            {!isAuthenticated && (
              <button onClick={handleLogin} data-testid="test-login">
                Test Login
              </button>
            )}
          </div>
        );
      }

      render(
        <AuthProvider initialAuth={false}>
          <LoginTestWrapper />
        </AuthProvider>
      );

      // Initially not authenticated
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();
      expect(screen.getByTestId('test-login')).toBeInTheDocument();

      // Trigger login
      const loginButton = screen.getByTestId('test-login');
      fireEvent.click(loginButton);

      // Wait for login to complete and navigation to update
      await waitFor(() => {
        expect(screen.getByText('Client Portal')).toBeInTheDocument();
        expect(screen.getByTestId('user-info')).toBeInTheDocument();
        expect(screen.queryByTestId('test-login')).not.toBeInTheDocument();
      });
    });

    it('should update navigation visibility when logging out', async () => {
      render(
        <AuthProvider initialAuth={true}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Initially authenticated
      expect(screen.getByText('Client Portal')).toBeInTheDocument();
      expect(screen.getByTestId('user-info')).toBeInTheDocument();

      // Trigger logout
      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      // Wait for logout to complete and navigation to update
      await waitFor(() => {
        expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();
        expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
      });
    });

    it('should close mobile navigation when authentication state changes', async () => {
      render(
        <AuthProvider initialAuth={false}>
          <AuthenticatedNavigationWrapper />
        </AuthProvider>
      );

      // Open mobile navigation
      const mobileMenuTrigger = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(mobileMenuTrigger);

      await waitFor(() => {
        expect(screen.getByTestId('mobile-sheet')).toBeInTheDocument();
      });

      // Change authentication state (simulate login)
      act(() => {
        const { login } = useAuth();
        login({ email: 'test@example.com', password: 'password' });
      });

      // Mobile navigation should close
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-sheet')).not.toBeInTheDocument();
      });
    });
  });

  describe('Navigation Item Filtering Logic', () => {
    it('should correctly filter navigation items based on visibility property', () => {
      // Test the filtering function directly
      const testNavigation: NavigationItem[] = [
        {
          id: 'public-item',
          label: 'Public',
          href: '/public',
          visibility: 'public',
          position: 'primary',
          order: 1,
        },
        {
          id: 'auth-item',
          label: 'Authenticated',
          href: '/auth',
          visibility: 'authenticated',
          position: 'primary',
          order: 2,
        },
      ];

      // Unauthenticated user should only see public items
      const unauthenticatedNav = getFilteredNavigation(testNavigation, false);
      expect(unauthenticatedNav).toHaveLength(1);
      expect(unauthenticatedNav[0].id).toBe('public-item');

      // Authenticated user should see all items
      const authenticatedNav = getFilteredNavigation(testNavigation, true);
      expect(authenticatedNav).toHaveLength(2);
      expect(authenticatedNav.map(item => item.id)).toEqual(['public-item', 'auth-item']);
    });

    it('should handle nested navigation items with different visibility', () => {
      const nestedNavigation: NavigationItem[] = [
        {
          id: 'parent',
          label: 'Parent',
          href: '/parent',
          visibility: 'public',
          position: 'primary',
          order: 1,
          children: [
            {
              id: 'public-child',
              label: 'Public Child',
              href: '/parent/public',
              visibility: 'public',
              position: 'primary',
              order: 1,
            },
            {
              id: 'auth-child',
              label: 'Auth Child',
              href: '/parent/auth',
              visibility: 'authenticated',
              position: 'primary',
              order: 2,
            },
          ],
        },
      ];

      // Unauthenticated user should see parent with only public child
      const unauthenticatedNav = getFilteredNavigation(nestedNavigation, false);
      expect(unauthenticatedNav[0].children).toHaveLength(1);
      expect(unauthenticatedNav[0].children![0].id).toBe('public-child');

      // Authenticated user should see parent with both children
      const authenticatedNav = getFilteredNavigation(nestedNavigation, true);
      expect(authenticatedNav[0].children).toHaveLength(2);
    });
  });

  describe('Role-Based Navigation Access', () => {
    it('should handle different user roles and permissions', () => {
      function RoleBasedWrapper({ userRole }: { userRole: string }) {
        const { isAuthenticated } = useAuth();

        // Simulate role-based navigation filtering
        const roleBasedNavigation = primaryNavigation.filter(item => {
          if (item.id === 'client-portal') {
            return isAuthenticated && ['client', 'admin'].includes(userRole);
          }
          if (item.id === 'admin-panel') {
            return isAuthenticated && userRole === 'admin';
          }
          return true;
        });

        return (
          <div data-testid="role-navigation" data-role={userRole}>
            <Header
              navigation={roleBasedNavigation}
              currentPath="/test"
              isAuthenticated={isAuthenticated}
            />
          </div>
        );
      }

      // Test client role
      const { rerender } = render(
        <AuthProvider initialAuth={true}>
          <RoleBasedWrapper userRole="client" />
        </AuthProvider>
      );

      expect(screen.getByTestId('role-navigation')).toHaveAttribute('data-role', 'client');

      // Test admin role
      rerender(
        <AuthProvider initialAuth={true}>
          <RoleBasedWrapper userRole="admin" />
        </AuthProvider>
      );

      expect(screen.getByTestId('role-navigation')).toHaveAttribute('data-role', 'admin');
    });
  });

  describe('Authentication Error Handling', () => {
    it('should gracefully handle authentication errors', async () => {
      function ErrorHandlingWrapper() {
        const [authError, setAuthError] = React.useState<string | null>(null);

        const handleFailedAuth = () => {
          setAuthError('Authentication failed');
        };

        return (
          <div>
            <AuthenticatedNavigationWrapper />
            {authError && (
              <div data-testid="auth-error" role="alert">
                {authError}
              </div>
            )}
            <button onClick={handleFailedAuth} data-testid="trigger-error">
              Trigger Auth Error
            </button>
          </div>
        );
      }

      render(
        <AuthProvider initialAuth={false}>
          <ErrorHandlingWrapper />
        </AuthProvider>
      );

      // Trigger authentication error
      const errorButton = screen.getByTestId('trigger-error');
      fireEvent.click(errorButton);

      // Should show error message
      expect(screen.getByTestId('auth-error')).toBeInTheDocument();
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();

      // Navigation should remain in unauthenticated state
      expect(screen.queryByText('Client Portal')).not.toBeInTheDocument();
    });
  });
});