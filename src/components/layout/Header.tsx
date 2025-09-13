'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { getFilteredNavigation } from '@/config/navigation';
import { cn, getNavigationItemClasses, getSkipLinkProps } from '@/lib/layout-utils';
import { useNavigation } from '@/providers/NavigationProvider';
import type { HeaderProps } from '@/types/layout';

/**
 * Header - Main navigation header component
 *
 * Provides primary navigation with responsive design, accessibility support,
 * and authentication-based visibility. Includes desktop navigation menu and
 * mobile hamburger menu toggle. Uses NavigationProvider for state management.
 *
 * Features:
 * - Responsive navigation with mobile hamburger menu
 * - Active link highlighting based on current path
 * - Authentication-based navigation filtering
 * - Accessibility compliance (WCAG AA)
 * - Skip link for keyboard navigation
 * - Nested navigation support with dropdowns
 * - Shared state management via NavigationProvider
 *
 * @param navigation - Primary navigation items array
 */
export function Header({ navigation }: Omit<HeaderProps, 'currentPath' | 'isAuthenticated'>) {
  const {
    currentPath,
    isAuthenticated,
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  } = useNavigation();

  // Filter navigation based on authentication state
  const filteredNavigation = getFilteredNavigation(navigation, isAuthenticated);

  const handleNavigationClick = () => {
    // Close mobile menu when navigation item is clicked
    closeMobileMenu();
  };

  return (
    <header role="banner" className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Skip Link for Accessibility */}
        <Link {...getSkipLinkProps()}>
          Skip to main content
        </Link>

        {/* Logo/Brand */}
        <div className="mr-4 flex">
          <Link
            href="/"
            className="mr-4 flex items-center space-x-2 lg:mr-6"
            onClick={handleNavigationClick}
          >
            <span className="hidden font-bold sm:inline-block">
              CPA on Web
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav
            role="navigation"
            aria-label="Main navigation"
            className="hidden md:flex"
          >
            <NavigationMenu>
              <NavigationMenuList>
                {filteredNavigation.map((item) => (
                  <NavigationMenuItem
                    key={item.id}
                    aria-haspopup={item.children && item.children.length > 0 ? 'true' : undefined}
                  >
                    {item.children && item.children.length > 0 ? (
                      // Navigation item with dropdown
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            navigationMenuTriggerStyle(),
                            getNavigationItemClasses(item, currentPath),
                          )}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center"
                            onClick={handleNavigationClick}
                            aria-current={currentPath === item.href ? 'page' : undefined}
                            tabIndex={0}
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <div className="row-span-3">
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                  onClick={handleNavigationClick}
                                  aria-current={currentPath === item.href ? 'page' : undefined}
                                  tabIndex={0}
                                >
                                  <div className="mb-2 mt-4 text-lg font-medium">
                                    {item.label}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </div>
                            <div className="flex flex-col space-y-2">
                              {item.children.map((child) => (
                                <NavigationMenuLink key={child.id} asChild>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                                      getNavigationItemClasses(child, currentPath),
                                    )}
                                    onClick={handleNavigationClick}
                                    aria-current={currentPath === child.href ? 'page' : undefined}
                                    tabIndex={0}
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {child.label}
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      // Simple navigation item
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            getNavigationItemClasses(item, currentPath),
                          )}
                          onClick={handleNavigationClick}
                          aria-current={currentPath === item.href ? 'page' : undefined}
                          tabIndex={0}
                        >
                          {item.label}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="sr-only">Toggle Menu</span>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] w-full grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden"
        >
          <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {filteredNavigation.map((item) => (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                      getNavigationItemClasses(
                        item,
                        currentPath,
                        'transition-colors hover:text-foreground/80',
                        'text-foreground',
                      ),
                    )}
                    onClick={handleNavigationClick}
                    aria-current={currentPath === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className={cn(
                            'flex w-full items-center rounded-md p-2 text-sm hover:underline',
                            getNavigationItemClasses(
                              child,
                              currentPath,
                              'transition-colors hover:text-foreground/80 text-foreground/70',
                              'text-foreground',
                            ),
                          )}
                          onClick={handleNavigationClick}
                          aria-current={currentPath === child.href ? 'page' : undefined}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;