'use client';

import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import { getCurrentBreakpoint, debounce } from '@/lib/layout-utils';

/**
 * Navigation Context for managing global navigation state
 */
interface NavigationContextType {
  // Mobile navigation state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // Current path and navigation state
  currentPath: string;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;

  // Responsive breakpoint state
  currentBreakpoint: 'mobile' | 'tablet' | 'desktop';
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Navigation Provider - Manages global navigation state
 *
 * Provides centralized state management for:
 * - Mobile navigation menu toggle
 * - Current route path tracking
 * - User authentication status
 * - Responsive breakpoint detection
 *
 * @param children - Child components
 */
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle window resize for responsive breakpoints
  const handleResize = useCallback(
    debounce(() => {
      if (typeof window !== 'undefined') {
        const newBreakpoint = getCurrentBreakpoint(window.innerWidth);
        setCurrentBreakpoint(newBreakpoint);

        // Close mobile menu if we're no longer on mobile
        if (newBreakpoint !== 'mobile' && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
        }
      }
    }, 100),
    [isMobileMenuOpen],
  );

  // Set up resize listener
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Set initial breakpoint
      setCurrentBreakpoint(getCurrentBreakpoint(window.innerWidth));

      // Add resize listener
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, [handleResize]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const contextValue: NavigationContextType = {
    // Mobile navigation state
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,

    // Current path and navigation state
    currentPath: pathname,
    isAuthenticated,
    setIsAuthenticated,

    // Responsive breakpoint state
    currentBreakpoint,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to use navigation context
 * @returns Navigation context value
 * @throws Error if used outside NavigationProvider
 */
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

export default NavigationProvider;