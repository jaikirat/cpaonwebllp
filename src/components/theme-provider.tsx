'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

import {
  type Theme,
  type ResolvedTheme,
  type SystemThemePreference,
  type ThemeState,
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  removeStoredTheme,
  applyTheme,
  resolveTheme,
  watchSystemTheme,
  watchReducedMotion,
  isValidTheme,
  isBrowser,
  prefersReducedMotion,
  createThemeError,
  safeThemeOperation,
  debugThemeState,
  validateDesignSystem,
} from '@/lib/utils';

// ================================
// TYPE DEFINITIONS
// ================================

/**
 * Context value interface for theme management.
 *
 * Provides comprehensive theme state and controls including current theme,
 * resolved values, system preferences, and utility functions for theme
 * manipulation. Used by useTheme hook and theme-aware components.
 *
 * @example
 * ```tsx
 * const {
 *   theme,
 *   resolvedTheme,
 *   setTheme,
 *   toggleTheme,
 *   isLoading
 * } = useTheme();
 * ```
 *
 * @since 1.0.0
 */
export interface ThemeContextValue {
  /**
   * Current theme setting (may be 'system').
   *
   * The user's selected theme preference, which can include
   * 'system' for automatic light/dark switching.
   *
   * @example 'light' | 'dark' | 'system' | 'high-contrast'
   */
  theme: Theme;
  /**
   * Resolved theme value (never 'system').
   *
   * The actual theme being applied to the UI. When theme is 'system',
   * this reflects the current system preference (light/dark).
   *
   * @example 'light' | 'dark' | 'high-contrast'
   */
  resolvedTheme: ResolvedTheme;
  /** Current system theme preference */
  systemTheme: SystemThemePreference;
  /** Whether theme is currently being initialized */
  isLoading: boolean;
  /** Whether theme system failed to initialize */
  hasError: boolean;
  /** Error details if theme system failed */
  error: Error | null;
  /**
   * Available themes in the system.
   *
   * List of all theme options that can be selected. Configured
   * via ThemeProvider props, defaults to all supported themes.
   *
   * @default ['light', 'dark', 'system', 'high-contrast']
   */
  availableThemes: Theme[];
  /**
   * Function to set the active theme.
   *
   * Updates theme preference, applies styling, and persists to storage.
   * Validates theme against availableThemes list.
   *
   * @param theme - Theme to activate
   * @throws {Error} If theme is invalid or not available
   * @example
   * ```tsx
   * setTheme('dark'); // Switch to dark theme
   * setTheme('system'); // Use system preference
   * ```
   */
  setTheme: (theme: Theme) => void;
  /**
   * Function to toggle between light and dark themes.
   *
   * Smart toggle that switches between light/dark based on current
   * resolved theme. If using 'system', toggles to opposite of current
   * system preference.
   *
   * @example
   * ```tsx
   * <Button onClick={toggleTheme}>Toggle Theme</Button>
   * ```
   */
  toggleTheme: () => void;
  /**
   * Function to cycle through all available themes.
   *
   * Advances to the next theme in the availableThemes array,
   * wrapping back to the first theme after the last.
   *
   * @example
   * ```tsx
   * // Cycles: light → dark → system → high-contrast → light
   * <Button onClick={cycleTheme}>Next Theme</Button>
   * ```
   */
  cycleTheme: () => void;
  /** Function to reset theme to system preference */
  resetToSystem: () => void;
  /** Function to clear stored theme preference */
  clearStoredTheme: () => void;
  /**
   * Development utilities for debugging theme system.
   *
   * Only available in development mode. Provides tools for
   * diagnosing theme issues and validating system setup.
   *
   * @example
   * ```tsx
   * // Log current theme state to console
   * debug.logState();
   *
   * // Validate design system integrity
   * const validation = debug.validateSystem();
   * if (!validation.isValid) {
   *   console.warn('Theme issues:', validation.errors);
   * }
   * ```
   */
  debug: {
    logState: () => void;
    validateSystem: () => { isValid: boolean; errors: string[]; warnings: string[] };
  };
}

/**
 * Props interface for ThemeProvider component.
 *
 * Configures theme system behavior including default theme, storage,
 * available themes, and callback functions. All props are optional
 * with sensible defaults.
 *
 * @example
 * ```tsx
 * <ThemeProvider
 *   defaultTheme="system"
 *   enableTransitions={true}
 *   onThemeChange={(theme, resolved) => {
 *     console.log(`Theme changed: ${theme} (${resolved})`);
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @since 1.0.0
 */
export interface ThemeProviderProps {
  /**
   * Child components that will have access to theme context.
   *
   * All descendant components can use useTheme() hook to access
   * theme state and controls.
   */
  children: ReactNode;
  /**
   * Default theme to use when no stored preference exists.
   *
   * Applied on first visit or when stored theme is cleared.
   * Recommended to use 'system' for automatic light/dark switching.
   *
   * @default 'system'
   * @example
   * ```tsx
   * <ThemeProvider defaultTheme="light">
   *   // Always starts with light theme
   * </ThemeProvider>
   * ```
   */
  defaultTheme?: Theme;
  /**
   * HTML attribute to use for theme application.
   *
   * The attribute name that will be set on document root element
   * to enable CSS theme targeting. Must match CSS selectors.
   *
   * @default 'data-theme'
   * @example
   * ```tsx
   * // With attribute="data-theme"
   * // Results in: <html data-theme="dark">
   * // CSS: [data-theme="dark"] { --color-bg: black; }
   * ```
   */
  attribute?: string;
  /** Storage key for theme preference */
  storageKey?: string;
  /**
   * Whether to enable CSS transitions during theme changes.
   *
   * Provides smooth visual transitions when switching themes.
   * Respects user's motion preferences automatically.
   *
   * @default true
   * @example
   * ```tsx
   * <ThemeProvider enableTransitions={false}>
   *   // Instant theme changes, no animation
   * </ThemeProvider>
   * ```
   *
   * @accessibility
   * - Automatically disabled for users with prefers-reduced-motion
   * - Ensures smooth UX without accessibility barriers
   */
  enableTransitions?: boolean;
  /** Whether to enable system theme detection */
  enableSystem?: boolean;
  /** Available themes (defaults to all themes) */
  availableThemes?: Theme[];
  /**
   * Callback fired when theme changes.
   *
   * Useful for analytics, persistence to external systems,
   * or triggering additional theme-related logic.
   *
   * @param theme - The selected theme (may be 'system')
   * @param resolvedTheme - The actual applied theme
   * @example
   * ```tsx
   * const handleThemeChange = (theme, resolved) => {
   *   analytics.track('theme_changed', { theme, resolved });
   *   updateUserPreferences({ theme });
   * };
   *
   * <ThemeProvider onThemeChange={handleThemeChange}>
   * ```
   */
  onThemeChange?: (theme: Theme, resolvedTheme: ResolvedTheme) => void;
  /** Callback when theme system encounters an error */
  onError?: (error: Error) => void;
  /**
   * Force a specific theme (primarily for testing).
   *
   * When set, overrides all other theme logic and forces the
   * specified theme. Disables system detection and persistence.
   *
   * @example
   * ```tsx
   * // In Storybook or tests
   * <ThemeProvider forcedTheme="dark">
   *   <ComponentUnderTest />
   * </ThemeProvider>
   * ```
   *
   * @internal Primarily for testing and development tools
   */
  forcedTheme?: ResolvedTheme;
  /** Whether to disable theme persistence */
  disableStorage?: boolean;
}

/**
 * Theme error boundary state
 */
interface ThemeErrorState {
  hasError: boolean;
  error: Error | null;
}

// ================================
// CONSTANTS
// ================================

const DEFAULT_THEMES: Theme[] = ['light', 'dark', 'system', 'high-contrast'];
const DEFAULT_CONFIG: Required<Omit<ThemeProviderProps, 'children' | 'onThemeChange' | 'onError' | 'forcedTheme'>> = {
  defaultTheme: 'system',
  attribute: 'data-theme',
  storageKey: 'theme',
  enableTransitions: true,
  enableSystem: true,
  availableThemes: DEFAULT_THEMES,
  disableStorage: false,
};

// ================================
// CONTEXT CREATION
// ================================

/**
 * Theme context - provides theme state and controls
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Theme error boundary context - provides error handling
 */
const ThemeErrorContext = createContext<ThemeErrorState>({
  hasError: false,
  error: null,
});

// ================================
// ERROR BOUNDARY COMPONENT
// ================================

/**
 * Error boundary component for theme-related errors.
 *
 * Catches and handles errors that occur within the theme system,
 * providing graceful degradation and error reporting.
 *
 * @internal Used internally by ThemeProvider
 * @since 1.0.0
 */
class ThemeErrorBoundary extends React.Component<
  { children: ReactNode; onError?: (error: Error) => void },
  ThemeErrorState
> {
  constructor(props: { children: ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ThemeErrorState {
    return {
      hasError: true,
      error: createThemeError('Theme system encountered an error', { originalError: error }),
    };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Theme Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <ThemeErrorContext.Provider value={this.state}>
          {this.props.children}
        </ThemeErrorContext.Provider>
      );
    }

    return this.props.children;
  }
}

// ================================
// THEME PROVIDER COMPONENT
// ================================

/**
 * Theme provider component that manages global theme state.
 *
 * Root-level component that provides theme context to all child components.
 * Handles theme persistence, system preference detection, and smooth
 * transitions between themes. Must be placed at the top level of your app.
 *
 * @param props - Theme provider configuration
 * @returns Provider component with theme context
 *
 * @example Basic Setup
 * ```tsx
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Header />
 *       <Main />
 *       <Footer />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example Advanced Configuration
 * ```tsx
 * <ThemeProvider
 *   defaultTheme="system"
 *   enableTransitions={true}
 *   availableThemes={['light', 'dark', 'high-contrast']}
 *   onThemeChange={(theme, resolved) => {
 *     console.log(`Theme: ${theme} → ${resolved}`);
 *     updateAnalytics({ theme: resolved });
 *   }}
 *   onError={(error) => {
 *     console.error('Theme error:', error);
 *     reportError(error);
 *   }}
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @example With Custom Storage
 * ```tsx
 * <ThemeProvider
 *   storageKey="my-app-theme"
 *   disableStorage={false}
 *   defaultTheme="light"
 * >
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * @accessibility
 * - Respects system preferences with 'system' theme
 * - Smooth transitions respect prefers-reduced-motion
 * - High contrast theme support for accessibility needs
 * - Proper focus management during theme transitions
 *
 * @since 1.0.0
 * @see {@link useTheme} - Hook to access theme context
 * @see {@link useThemeValue} - Hook for conditional theme values
 * @see {@link useIsDarkTheme} - Hook to detect dark theme
 */
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_CONFIG.defaultTheme,
  attribute = DEFAULT_CONFIG.attribute,
  storageKey = DEFAULT_CONFIG.storageKey,
  enableTransitions = DEFAULT_CONFIG.enableTransitions,
  enableSystem = DEFAULT_CONFIG.enableSystem,
  availableThemes = DEFAULT_CONFIG.availableThemes,
  onThemeChange,
  onError,
  forcedTheme,
  disableStorage = DEFAULT_CONFIG.disableStorage,
}: ThemeProviderProps) {
  // ================================
  // STATE MANAGEMENT
  // ================================

  const [themeState, setThemeState] = useState<ThemeState>(() => {
    // Initialize theme state
    if (!isBrowser() || forcedTheme) {
      return {
        theme: forcedTheme ? 'light' : defaultTheme,
        resolvedTheme: forcedTheme || 'light',
        systemTheme: 'light',
        isLoading: !forcedTheme,
      };
    }

    const storedTheme = disableStorage ? null : getStoredTheme(storageKey);
    const initialTheme = storedTheme && isValidTheme(storedTheme) ? storedTheme : defaultTheme;
    const systemTheme = getSystemTheme();
    const resolvedTheme = resolveTheme(initialTheme);

    return {
      theme: initialTheme,
      resolvedTheme,
      systemTheme,
      isLoading: false,
    };
  });

  const [error, setError] = useState<Error | null>(null);
  const systemThemeListenerRef = useRef<(() => void) | null>(null);
  const motionListenerRef = useRef<(() => void) | null>(null);
  const isInitializedRef = useRef(false);

  // ================================
  // THEME OPERATIONS
  // ================================

  /**
   * Safely applies theme with error handling
   */
  const safeApplyTheme = useCallback(
    (theme: ResolvedTheme) => {
      return safeThemeOperation(() => {
        if (forcedTheme) return;
        applyTheme(theme, attribute, enableTransitions);
      }, undefined);
    },
    [attribute, enableTransitions, forcedTheme],
  );

  /**
   * Updates theme state and applies changes
   */
  const updateTheme = useCallback(
    (newTheme: Theme) => {
      try {
        // Validate theme
        if (!isValidTheme(newTheme)) {
          throw createThemeError(`Invalid theme: ${newTheme}`, { availableThemes });
        }

        if (!availableThemes.includes(newTheme)) {
          throw createThemeError(`Theme not available: ${newTheme}`, { availableThemes });
        }

        // Resolve theme
        const newResolvedTheme = forcedTheme || resolveTheme(newTheme);
        const currentSystemTheme = getSystemTheme();

        // Update state
        setThemeState(prev => ({
          ...prev,
          theme: newTheme,
          resolvedTheme: newResolvedTheme,
          systemTheme: currentSystemTheme,
          isLoading: false,
        }));

        // Apply theme to document
        safeApplyTheme(newResolvedTheme);

        // Store theme preference
        if (!disableStorage && !forcedTheme) {
          if (newTheme === 'system') {
            removeStoredTheme(storageKey);
          } else {
            setStoredTheme(newTheme, storageKey);
          }
        }

        // Notify listeners
        onThemeChange?.(newTheme, newResolvedTheme);

        // Clear any previous errors
        setError(null);
      } catch (err) {
        const themeError = err instanceof Error ? err : createThemeError('Unknown theme error');
        setError(themeError);
        onError?.(themeError);
        console.error('Failed to update theme:', themeError);
      }
    },
    [
      availableThemes,
      forcedTheme,
      safeApplyTheme,
      disableStorage,
      storageKey,
      onThemeChange,
      onError,
    ],
  );

  /**
   * Sets the current theme
   */
  const setTheme = useCallback(
    (theme: Theme) => {
      updateTheme(theme);
    },
    [updateTheme],
  );

  /**
   * Toggles between light and dark themes
   */
  const toggleTheme = useCallback(() => {
    const { theme: currentTheme, resolvedTheme } = themeState;

    if (currentTheme === 'system') {
      // If system, toggle to opposite of current resolved theme
      setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
    } else if (resolvedTheme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, [themeState, setTheme]);

  /**
   * Cycles through all available themes
   */
  const cycleTheme = useCallback(() => {
    const currentIndex = availableThemes.indexOf(themeState.theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    const nextTheme = availableThemes[nextIndex];

    if (nextTheme) {
      setTheme(nextTheme);
    }
  }, [availableThemes, themeState.theme, setTheme]);

  /**
   * Resets theme to system preference
   */
  const resetToSystem = useCallback(() => {
    if (enableSystem) {
      setTheme('system');
    }
  }, [enableSystem, setTheme]);

  /**
   * Clears stored theme preference
   */
  const clearStoredTheme = useCallback(() => {
    if (!disableStorage) {
      removeStoredTheme(storageKey);
      setTheme(defaultTheme);
    }
  }, [disableStorage, storageKey, defaultTheme, setTheme]);

  // ================================
  // SYSTEM THEME DETECTION
  // ================================

  /**
   * Handles system theme changes
   */
  const handleSystemThemeChange = useCallback(
    (isDark: boolean) => {
      const newSystemTheme: SystemThemePreference = isDark ? 'dark' : 'light';

      setThemeState(prev => {
        const newResolvedTheme = prev.theme === 'system'
          ? newSystemTheme
          : prev.resolvedTheme;

        // Apply theme if using system theme
        if (prev.theme === 'system') {
          safeApplyTheme(newResolvedTheme);
          onThemeChange?.(prev.theme, newResolvedTheme);
        }

        return {
          ...prev,
          systemTheme: newSystemTheme,
          resolvedTheme: newResolvedTheme,
        };
      });
    },
    [safeApplyTheme, onThemeChange],
  );

  // ================================
  // LIFECYCLE EFFECTS
  // ================================

  /**
   * Initialize theme system
   */
  useEffect(() => {
    if (!isBrowser() || isInitializedRef.current || forcedTheme) {
      return undefined;
    }

    try {
      // Apply initial theme
      safeApplyTheme(themeState.resolvedTheme);

      // Set up system theme listener if enabled
      if (enableSystem) {
        systemThemeListenerRef.current = watchSystemTheme(handleSystemThemeChange);
      }

      // Set up motion preference listener
      motionListenerRef.current = watchReducedMotion((prefersReduced) => {
        if (prefersReduced !== prefersReducedMotion()) {
          // Re-apply theme with updated motion preference
          safeApplyTheme(themeState.resolvedTheme);
        }
      });

      isInitializedRef.current = true;

      // Validate design system in development
      if (process.env.NODE_ENV === 'development') {
        setTimeout(() => {
          const validation = validateDesignSystem();
          if (!validation.isValid) {
            console.warn('Design system validation failed:', validation);
          }
        }, 100);
      }
    } catch (err) {
      const initError = err instanceof Error ? err : createThemeError('Failed to initialize theme system');
      setError(initError);
      onError?.(initError);
    }

    // Cleanup function
    return () => {
      systemThemeListenerRef.current?.();
      motionListenerRef.current?.();
      systemThemeListenerRef.current = null;
      motionListenerRef.current = null;
    };
  }, [
    enableSystem,
    handleSystemThemeChange,
    safeApplyTheme,
    themeState.resolvedTheme,
    onError,
    forcedTheme,
  ]);

  /**
   * Handle forced theme changes
   */
  useEffect(() => {
    if (forcedTheme) {
      setThemeState(prev => ({
        ...prev,
        theme: 'light', // Use light as base when forced
        resolvedTheme: forcedTheme,
        isLoading: false,
      }));
      safeApplyTheme(forcedTheme);
    }
  }, [forcedTheme, safeApplyTheme]);

  // ================================
  // DEVELOPMENT UTILITIES
  // ================================

  const debug = useMemo(
    () => ({
      logState: () => {
        debugThemeState();
        console.warn('Provider state:', themeState);
        console.warn('Provider config:', {
          defaultTheme,
          attribute,
          storageKey,
          enableTransitions,
          enableSystem,
          availableThemes,
          forcedTheme,
          disableStorage,
        });
      },
      validateSystem: () => validateDesignSystem(),
    }),
    [
      themeState,
      defaultTheme,
      attribute,
      storageKey,
      enableTransitions,
      enableSystem,
      availableThemes,
      forcedTheme,
      disableStorage,
    ],
  );

  // ================================
  // CONTEXT VALUE
  // ================================

  const contextValue: ThemeContextValue = useMemo(
    () => ({
      theme: themeState.theme,
      resolvedTheme: themeState.resolvedTheme,
      systemTheme: themeState.systemTheme,
      isLoading: themeState.isLoading,
      hasError: !!error,
      error,
      availableThemes,
      setTheme,
      toggleTheme,
      cycleTheme,
      resetToSystem,
      clearStoredTheme,
      debug,
    }),
    [
      themeState,
      error,
      availableThemes,
      setTheme,
      toggleTheme,
      cycleTheme,
      resetToSystem,
      clearStoredTheme,
      debug,
    ],
  );

  // ================================
  // RENDER
  // ================================

  return (
    <ThemeErrorBoundary {...(onError && { onError })}>
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    </ThemeErrorBoundary>
  );
}

// ================================
// HOOKS
// ================================

/**
 * Hook to access the current theme context.
 *
 * Provides access to theme state, controls, and utilities. Must be used
 * within a ThemeProvider component tree.
 *
 * @returns Theme context value with state and controls
 * @throws {Error} When used outside ThemeProvider
 *
 * @example Basic Usage
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, toggleTheme, isLoading } = useTheme();
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <button onClick={toggleTheme}>
 *       Current theme: {theme}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Theme Selection
 * ```tsx
 * function ThemeSelector() {
 *   const { theme, setTheme, availableThemes } = useTheme();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value)}>
 *       {availableThemes.map((theme) => (
 *         <option key={theme} value={theme}>
 *           {theme.charAt(0).toUpperCase() + theme.slice(1)}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link ThemeProvider} - Provider component required for this hook
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw createThemeError(
      'useTheme must be used within a ThemeProvider',
      { component: 'useTheme' },
    );
  }

  return context;
}

/**
 * Hook to access theme error state
 */
export function useThemeError(): ThemeErrorState {
  return useContext(ThemeErrorContext);
}

/**
 * Hook for theme-aware conditional values.
 *
 * Returns different values based on the current resolved theme.
 * Useful for theme-specific configurations, styles, or content.
 *
 * @param values - Object mapping themes to values
 * @returns Value corresponding to current theme
 *
 * @example Component Styling
 * ```tsx
 * function Card() {
 *   const shadowClass = useThemeValue({
 *     light: 'shadow-lg',
 *     dark: 'shadow-2xl shadow-white/10',
 *     'high-contrast': 'border-2 border-black'
 *   });
 *
 *   return <div className={`card ${shadowClass}`}>Content</div>;
 * }
 * ```
 *
 * @example Dynamic Content
 * ```tsx
 * function Logo() {
 *   const logoSrc = useThemeValue({
 *     light: '/logo-light.png',
 *     dark: '/logo-dark.png'
 *   });
 *
 *   return <img src={logoSrc} alt="Company Logo" />;
 * }
 * ```
 *
 * @since 1.0.0
 */
export function useThemeValue<T>(values: {
  light: T;
  dark: T;
  'high-contrast'?: T;
}): T {
  const { resolvedTheme } = useTheme();

  if (resolvedTheme === 'high-contrast' && values['high-contrast']) {
    return values['high-contrast'];
  }

  return values[resolvedTheme] || values.light;
}

/**
 * Hook to detect if the current theme is dark.
 *
 * Returns true when the resolved theme is 'dark', false otherwise.
 * Useful for conditional rendering based on theme darkness.
 *
 * @returns True if current theme is dark
 *
 * @example
 * ```tsx
 * function Icon() {
 *   const isDark = useIsDarkTheme();
 *   const iconColor = isDark ? 'white' : 'black';
 *
 *   return <StarIcon color={iconColor} />;
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link useIsLightTheme} - Opposite detection hook
 */
export function useIsDarkTheme(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark';
}

/**
 * Hook to detect if current theme is light
 */
export function useIsLightTheme(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light';
}

/**
 * Hook to detect if the current theme is high contrast.
 *
 * Returns true when the resolved theme is 'high-contrast'.
 * Essential for accessibility-aware components.
 *
 * @returns True if current theme is high contrast
 *
 * @example
 * ```tsx
 * function Button({ children }) {
 *   const isHighContrast = useIsHighContrastTheme();
 *   const borderClass = isHighContrast ? 'border-2 border-black' : 'border';
 *
 *   return (
 *     <button className={`btn ${borderClass}`}>
 *       {children}
 *     </button>
 *   );
 * }
 * ```
 *
 * @accessibility
 * - Essential for providing enhanced contrast modes
 * - Supports users with visual impairments
 * - Enables accessible design patterns
 *
 * @since 1.0.0
 */
export function useIsHighContrastTheme(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'high-contrast';
}

/**
 * Hook for theme-aware CSS class names.
 *
 * Convenient utility for applying different CSS classes based on
 * the current theme. Commonly used for conditional styling.
 *
 * @param lightClass - CSS class for light theme
 * @param darkClass - CSS class for dark theme
 * @param highContrastClass - Optional class for high contrast theme
 * @returns CSS class for current theme
 *
 * @example Background Styling
 * ```tsx
 * function Panel() {
 *   const bgClass = useThemeClass(
 *     'bg-white',
 *     'bg-gray-900',
 *     'bg-white border-4 border-black'
 *   );
 *
 *   return <div className={`panel ${bgClass}`}>Content</div>;
 * }
 * ```
 *
 * @example Text Colors
 * ```tsx
 * function Heading({ children }) {
 *   const textClass = useThemeClass(
 *     'text-gray-900',
 *     'text-gray-100'
 *   );
 *
 *   return <h1 className={textClass}>{children}</h1>;
 * }
 * ```
 *
 * @since 1.0.0
 * @see {@link useThemeValue} - For more complex conditional values
 */
export function useThemeClass(
  lightClass: string,
  darkClass: string,
  highContrastClass?: string,
): string {
  return useThemeValue({
    light: lightClass,
    dark: darkClass,
    'high-contrast': highContrastClass || lightClass,
  });
}

// ================================
// EXPORTS
// ================================

export default ThemeProvider;

// Re-export types for convenience
export type {
  Theme,
  ResolvedTheme,
  SystemThemePreference,
  ThemeState,
  ThemeConfig,
} from '@/lib/utils';