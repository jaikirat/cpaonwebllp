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
 * Theme provider context value interface
 */
export interface ThemeContextValue {
  /** Current theme setting (may be 'system') */
  theme: Theme;
  /** Resolved theme value (never 'system') */
  resolvedTheme: ResolvedTheme;
  /** Current system theme preference */
  systemTheme: SystemThemePreference;
  /** Whether theme is currently being initialized */
  isLoading: boolean;
  /** Whether theme system failed to initialize */
  hasError: boolean;
  /** Error details if theme system failed */
  error: Error | null;
  /** Available themes in the system */
  availableThemes: Theme[];
  /** Function to set theme */
  setTheme: (theme: Theme) => void;
  /** Function to toggle between light/dark themes */
  toggleTheme: () => void;
  /** Function to cycle through all available themes */
  cycleTheme: () => void;
  /** Function to reset theme to system preference */
  resetToSystem: () => void;
  /** Function to clear stored theme preference */
  clearStoredTheme: () => void;
  /** Development utilities */
  debug: {
    logState: () => void;
    validateSystem: () => { isValid: boolean; errors: string[]; warnings: string[] };
  };
}

/**
 * Theme provider props interface
 */
export interface ThemeProviderProps {
  /** Child components */
  children: ReactNode;
  /** Default theme to use */
  defaultTheme?: Theme;
  /** HTML attribute to use for theme */
  attribute?: string;
  /** Storage key for theme preference */
  storageKey?: string;
  /** Whether to enable CSS transitions during theme changes */
  enableTransitions?: boolean;
  /** Whether to enable system theme detection */
  enableSystem?: boolean;
  /** Available themes (defaults to all themes) */
  availableThemes?: Theme[];
  /** Callback when theme changes */
  onThemeChange?: (theme: Theme, resolvedTheme: ResolvedTheme) => void;
  /** Callback when theme system encounters an error */
  onError?: (error: Error) => void;
  /** Whether to force a specific theme for testing */
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
 * Error boundary for theme-related errors
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
 * Theme provider component that manages global theme state
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
 * Hook to access theme context
 * @throws {Error} When used outside ThemeProvider
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
 * Hook for theme-aware conditional values
 * @param values Object with theme-specific values
 * @returns Value for current theme
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
 * Hook to detect if current theme is dark
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
 * Hook to detect if current theme is high contrast
 */
export function useIsHighContrastTheme(): boolean {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'high-contrast';
}

/**
 * Hook for theme-aware CSS class names
 * @param lightClass Class for light theme
 * @param darkClass Class for dark theme
 * @param highContrastClass Optional class for high contrast theme
 * @returns Current theme's class name
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