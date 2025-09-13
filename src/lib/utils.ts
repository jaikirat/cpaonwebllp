/**
 * Utility functions for theme management - Unified Design System
 *
 * This module provides comprehensive theme management utilities including:
 * - Theme switching (light/dark/system)
 * - System theme preference detection
 * - Document theme class application
 * - Design token access helpers
 * - Type-safe theme utilities
 *
 * Compatible with the design token system defined in src/styles/tokens.css
 * and Tailwind CSS integration.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ================================
// TYPE DEFINITIONS
// ================================

/**
 * Available theme modes in the design system
 */
export type Theme = 'light' | 'dark' | 'system' | 'high-contrast';

/**
 * Resolved theme mode (without 'system')
 */
export type ResolvedTheme = Exclude<Theme, 'system'>;

/**
 * Theme preference from system
 */
export type SystemThemePreference = 'light' | 'dark';

/**
 * Theme configuration options
 */
export interface ThemeConfig {
  defaultTheme?: Theme;
  enableTransitions?: boolean;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
}

/**
 * Theme context state
 */
export interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: SystemThemePreference;
  isLoading: boolean;
}

/**
 * Design token categories available in the system
 */
export type TokenCategory =
  | 'color'
  | 'spacing'
  | 'typography'
  | 'border'
  | 'shadow'
  | 'motion'
  | 'breakpoint';

/**
 * Color token names from the design system
 */
export type ColorToken =
  | 'primary'
  | 'primary-hover'
  | 'primary-active'
  | 'primary-disabled'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-hover'
  | 'secondary-active'
  | 'secondary-disabled'
  | 'secondary-foreground'
  | 'accent'
  | 'accent-hover'
  | 'accent-active'
  | 'accent-disabled'
  | 'accent-foreground'
  | 'success'
  | 'success-hover'
  | 'success-foreground'
  | 'warning'
  | 'warning-hover'
  | 'warning-foreground'
  | 'error'
  | 'error-hover'
  | 'error-foreground'
  | 'info'
  | 'info-hover'
  | 'info-foreground'
  | 'background'
  | 'surface'
  | 'surface-secondary'
  | 'surface-tertiary'
  | 'surface-hover'
  | 'surface-active'
  | 'text'
  | 'text-secondary'
  | 'text-tertiary'
  | 'text-disabled'
  | 'text-on-primary'
  | 'text-on-secondary'
  | 'text-on-surface'
  | 'border'
  | 'border-secondary'
  | 'border-tertiary'
  | 'border-focus'
  | 'border-error'
  | 'border-success'
  | 'focus-ring'
  | 'focus-ring-offset';

/**
 * Media query event listener callback
 */
export type MediaQueryCallback = (matches: boolean) => void;

// ================================
// UTILITY FUNCTIONS
// ================================

/**
 * Combines class names using clsx and tailwind-merge
 * Handles conditional classes and removes Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ================================
// THEME DETECTION UTILITIES
// ================================

/**
 * Checks if code is running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Detects system theme preference using media queries
 * @returns 'dark' if user prefers dark mode, 'light' otherwise
 */
export function getSystemTheme(): SystemThemePreference {
  if (!isBrowser()) return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Checks if user prefers reduced motion
 * @returns true if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if user prefers high contrast
 * @returns true if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (!isBrowser()) return false;

  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Creates a media query listener for system theme changes
 * @param callback Function to call when system theme changes
 * @returns Cleanup function to remove the listener
 */
export function watchSystemTheme(callback: MediaQueryCallback): () => void {
  if (!isBrowser()) return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Handle older browsers that don't support addEventListener
  const handleChange = (e: MediaQueryListEvent) => callback(e.matches);

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }
}

/**
 * Creates a media query listener for reduced motion preference changes
 * @param callback Function to call when motion preference changes
 * @returns Cleanup function to remove the listener
 */
export function watchReducedMotion(callback: MediaQueryCallback): () => void {
  if (!isBrowser()) return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const handleChange = (e: MediaQueryListEvent) => callback(e.matches);

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  } else {
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }
}

// ================================
// THEME STORAGE UTILITIES
// ================================

const DEFAULT_STORAGE_KEY = 'theme';

/**
 * Gets theme from localStorage
 * @param storageKey Storage key for theme preference
 * @returns Stored theme or null if not found
 */
export function getStoredTheme(storageKey: string = DEFAULT_STORAGE_KEY): Theme | null {
  if (!isBrowser()) return null;

  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && ['light', 'dark', 'system', 'high-contrast'].includes(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return null;
}

/**
 * Stores theme in localStorage
 * @param theme Theme to store
 * @param storageKey Storage key for theme preference
 */
export function setStoredTheme(theme: Theme, storageKey: string = DEFAULT_STORAGE_KEY): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn('Failed to store theme in localStorage:', error);
  }
}

/**
 * Removes theme from localStorage
 * @param storageKey Storage key for theme preference
 */
export function removeStoredTheme(storageKey: string = DEFAULT_STORAGE_KEY): void {
  if (!isBrowser()) return;

  try {
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.warn('Failed to remove theme from localStorage:', error);
  }
}

// ================================
// THEME APPLICATION UTILITIES
// ================================

const DEFAULT_ATTRIBUTE = 'data-theme';

/**
 * Resolves a theme to its actual value (handles 'system' theme)
 * @param theme Theme to resolve
 * @returns Resolved theme (without 'system')
 */
export function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme as ResolvedTheme;
}

/**
 * Applies theme to the document element
 * @param theme Theme to apply
 * @param attribute HTML attribute to use for theme
 * @param enableTransitions Whether to enable CSS transitions during theme change
 */
export function applyTheme(
  theme: ResolvedTheme,
  attribute: string = DEFAULT_ATTRIBUTE,
  enableTransitions: boolean = true,
): void {
  if (!isBrowser()) return;

  const root = document.documentElement;

  // Temporarily disable transitions to prevent flash
  if (!enableTransitions && !prefersReducedMotion()) {
    root.style.transition = 'none';
  }

  // Apply theme attribute
  root.setAttribute(attribute, theme);

  // Add theme class for additional styling if needed
  root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
  root.classList.add(`theme-${theme}`);

  // Re-enable transitions after a frame
  if (!enableTransitions && !prefersReducedMotion()) {
    requestAnimationFrame(() => {
      root.style.transition = '';
    });
  }
}

/**
 * Gets the current theme from the document
 * @param attribute HTML attribute to read theme from
 * @returns Current resolved theme or null if not set
 */
export function getCurrentTheme(attribute: string = DEFAULT_ATTRIBUTE): ResolvedTheme | null {
  if (!isBrowser()) return null;

  const current = document.documentElement.getAttribute(attribute);
  if (current && ['light', 'dark', 'high-contrast'].includes(current)) {
    return current as ResolvedTheme;
  }

  return null;
}

/**
 * Sets up the initial theme on page load
 * @param config Theme configuration options
 * @returns Initial theme state
 */
export function initializeTheme(config: ThemeConfig = {}): ThemeState {
  const {
    defaultTheme = 'system',
    attribute = DEFAULT_ATTRIBUTE,
    storageKey = DEFAULT_STORAGE_KEY,
    enableTransitions = true,
  } = config;

  if (!isBrowser()) {
    return {
      theme: defaultTheme,
      resolvedTheme: 'light',
      systemTheme: 'light',
      isLoading: true,
    };
  }

  // Get stored theme or use default
  const storedTheme = getStoredTheme(storageKey);
  const theme = storedTheme || defaultTheme;

  // Resolve theme and apply it
  const systemTheme = getSystemTheme();
  const resolvedTheme = resolveTheme(theme);

  applyTheme(resolvedTheme, attribute, enableTransitions);

  return {
    theme,
    resolvedTheme,
    systemTheme,
    isLoading: false,
  };
}

// ================================
// DESIGN TOKEN ACCESS UTILITIES
// ================================

/**
 * Gets a CSS custom property value from the document
 * @param property CSS custom property name (with or without --)
 * @param fallback Fallback value if property is not found
 * @returns Property value or fallback
 */
export function getCSSCustomProperty(property: string, fallback: string = ''): string {
  if (!isBrowser()) return fallback;

  const propertyName = property.startsWith('--') ? property : `--${property}`;
  const value = getComputedStyle(document.documentElement).getPropertyValue(propertyName).trim();

  return value || fallback;
}

/**
 * Sets a CSS custom property on the document root
 * @param property CSS custom property name (with or without --)
 * @param value Property value to set
 */
export function setCSSCustomProperty(property: string, value: string): void {
  if (!isBrowser()) return;

  const propertyName = property.startsWith('--') ? property : `--${property}`;
  document.documentElement.style.setProperty(propertyName, value);
}

/**
 * Gets a color token value from the design system
 * @param tokenName Color token name
 * @param fallback Fallback color if token is not found
 * @returns Color value or fallback
 */
export function getColorToken(tokenName: ColorToken, fallback: string = ''): string {
  return getCSSCustomProperty(`color-${tokenName}`, fallback);
}

/**
 * Gets a spacing token value from the design system
 * @param size Spacing size (e.g., '4', '8', 'lg')
 * @param fallback Fallback value if token is not found
 * @returns Spacing value or fallback
 */
export function getSpacingToken(size: string, fallback: string = '0'): string {
  return getCSSCustomProperty(`spacing-${size}`, fallback);
}

/**
 * Gets a typography token value from the design system
 * @param property Typography property (e.g., 'font-size-lg', 'line-height-normal')
 * @param fallback Fallback value if token is not found
 * @returns Typography value or fallback
 */
export function getTypographyToken(property: string, fallback: string = ''): string {
  return getCSSCustomProperty(property, fallback);
}

/**
 * Gets a component-specific token value
 * @param component Component name (e.g., 'button', 'input', 'card')
 * @param property Property name (e.g., 'height-md', 'padding-lg')
 * @param fallback Fallback value if token is not found
 * @returns Token value or fallback
 */
export function getComponentToken(component: string, property: string, fallback: string = ''): string {
  return getCSSCustomProperty(`${component}-${property}`, fallback);
}

// ================================
// ADVANCED UTILITIES
// ================================

/**
 * Creates a theme-aware CSS class string
 * @param lightClass Class for light theme
 * @param darkClass Class for dark theme
 * @param highContrastClass Optional class for high contrast theme
 * @returns Conditional class string
 */
export function themeClass(
  lightClass: string,
  darkClass: string,
  highContrastClass?: string,
): string {
  const currentTheme = getCurrentTheme();

  switch (currentTheme) {
    case 'dark':
      return darkClass;
    case 'high-contrast':
      return highContrastClass || lightClass;
    case 'light':
    default:
      return lightClass;
  }
}

/**
 * Checks if the current theme is dark
 * @returns true if current theme is dark
 */
export function isDarkTheme(): boolean {
  return getCurrentTheme() === 'dark';
}

/**
 * Checks if the current theme is light
 * @returns true if current theme is light
 */
export function isLightTheme(): boolean {
  const theme = getCurrentTheme();
  return theme === 'light' || theme === null;
}

/**
 * Checks if the current theme is high contrast
 * @returns true if current theme is high contrast
 */
export function isHighContrastTheme(): boolean {
  return getCurrentTheme() === 'high-contrast';
}

/**
 * Gets theme-specific configuration
 * @param config Object with theme-specific values
 * @returns Value for current theme
 */
export function getThemeConfig<T>(config: {
  light: T;
  dark: T;
  'high-contrast'?: T;
}): T {
  const currentTheme = getCurrentTheme() || 'light';

  if (currentTheme === 'high-contrast' && config['high-contrast']) {
    return config['high-contrast'];
  }

  return config[currentTheme] || config.light;
}

/**
 * Debounces a function call
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validates if a string is a valid theme
 * @param theme String to validate
 * @returns true if string is a valid theme
 */
export function isValidTheme(theme: string): theme is Theme {
  return ['light', 'dark', 'system', 'high-contrast'].includes(theme);
}

/**
 * Gets all available themes
 * @returns Array of all available themes
 */
export function getAvailableThemes(): Theme[] {
  return ['light', 'dark', 'system', 'high-contrast'];
}

// ================================
// ERROR HANDLING UTILITIES
// ================================

/**
 * Creates a theme error with context
 * @param message Error message
 * @param context Additional error context
 * @returns Error with theme context
 */
export function createThemeError(message: string, context?: Record<string, unknown>): Error {
  const error = new Error(`Theme Error: ${message}`);
  if (context) {
    (error as Error & { context?: Record<string, unknown> }).context = context;
  }
  return error;
}

/**
 * Safely executes a theme operation with error handling
 * @param operation Function to execute
 * @param fallback Fallback value if operation fails
 * @returns Operation result or fallback
 */
export function safeThemeOperation<T>(operation: () => T, fallback: T): T {
  try {
    return operation();
  } catch (error) {
    console.warn('Theme operation failed:', error);
    return fallback;
  }
}

// ================================
// DEVELOPMENT UTILITIES
// ================================

/**
 * Logs current theme state for debugging
 * Only works in development mode
 */
export function debugThemeState(): void {
  if (process.env.NODE_ENV !== 'development') return;

  /* eslint-disable no-console */
  console.group('🎨 Theme Debug State');
  console.log('Current theme:', getCurrentTheme());
  console.log('System theme:', getSystemTheme());
  console.log('Prefers reduced motion:', prefersReducedMotion());
  console.log('Prefers high contrast:', prefersHighContrast());
  console.log('Browser support:', isBrowser());
  console.groupEnd();
  /* eslint-enable no-console */
}

/**
 * Validates the design system setup
 * Only works in development mode
 * @returns Validation results
 */
export function validateDesignSystem(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  if (process.env.NODE_ENV !== 'development' || !isBrowser()) {
    return { isValid: true, errors: [], warnings: [] };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if design tokens are loaded
  const primaryColor = getCSSCustomProperty('color-primary');
  if (!primaryColor) {
    errors.push('Design tokens not loaded: --color-primary not found');
  }

  // Check if theme attribute is set
  const currentTheme = getCurrentTheme();
  if (!currentTheme) {
    warnings.push('No theme attribute set on document element');
  }

  // Check for common token presence
  const commonTokens = [
    'color-background',
    'color-text',
    'spacing-4',
    'font-size-base',
  ];

  commonTokens.forEach(token => {
    const value = getCSSCustomProperty(token);
    if (!value) {
      warnings.push(`Common token not found: --${token}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}