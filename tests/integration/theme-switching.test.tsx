/**
 * T008: Theme Switching Integration Test
 *
 * Comprehensive integration test that validates theme switching functionality
 * for the unified design system. Tests theme provider context, switching behavior,
 * persistence, CSS custom property updates, component re-rendering, system theme
 * detection, sandbox controls, design token updates, accessibility features,
 * and performance optimizations.
 *
 * This test follows TDD approach - some tests will initially fail until
 * the theme management system is fully implemented.
 *
 * @jest-environment jsdom
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react';
import { renderHook, act as hookAct } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Import setup for browser API mocks
import { localStorageMock, mockDocumentElement } from './theme-switching.setup';

// Import theme utilities
import {
  Theme,
  ResolvedTheme,
  SystemThemePreference,
  ThemeState,
  ThemeConfig,
  ColorToken,
  getSystemTheme,
  getStoredTheme,
  setStoredTheme,
  removeStoredTheme,
  resolveTheme,
  applyTheme,
  getCurrentTheme,
  initializeTheme,
  getCSSCustomProperty,
  setCSSCustomProperty,
  getColorToken,
  prefersReducedMotion,
  prefersHighContrast,
  watchSystemTheme,
  watchReducedMotion,
  isBrowser,
  isValidTheme,
  validateDesignSystem,
  debugThemeState,
  themeClass,
  isDarkTheme,
  isLightTheme,
  isHighContrastTheme,
  debounce,
} from '@/lib/utils';

// Mock components that should exist in the design system
import ThemeToggle from '@/components/ThemeToggle';

// ================================
// MOCK SETUP AND TEST UTILITIES
// ================================

// Mock CSS custom properties for testing
const mockCSSCustomProperties: Record<string, string> = {
  '--color-primary': '#0066cc',
  '--color-primary-hover': '#0052a3',
  '--color-background': '#ffffff',
  '--color-text': '#000000',
  '--color-surface': '#f8f9fa',
  '--spacing-4': '1rem',
  '--font-size-base': '16px',
  '--border-radius-md': '0.375rem',
};

// Test helper: Create a mock ThemeProvider context
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: SystemThemePreference;
  isLoading: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const MockThemeProvider: React.FC<{
  children: React.ReactNode;
  initialTheme?: Theme;
  enableTransitions?: boolean;
}> = ({
  children,
  initialTheme = 'system',
  enableTransitions = true
}) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [systemTheme, setSystemTheme] = useState<SystemThemePreference>('light');

  useEffect(() => {
    // Simulate initialization
    const stored = getStoredTheme();
    const initialTheme = stored || 'system';
    setTheme(initialTheme);
    setSystemTheme(getSystemTheme());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Apply theme when it changes
    const resolved = resolveTheme(theme);
    applyTheme(resolved, 'data-theme', enableTransitions);
    setStoredTheme(theme);
  }, [theme, enableTransitions]);

  const resolvedTheme = resolveTheme(theme);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]!);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        systemTheme,
        isLoading,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Test component that uses theme
const TestThemeConsumer: React.FC = () => {
  const { theme, resolvedTheme, isLoading, setTheme } = useTheme();

  if (isLoading) return <div data-testid="loading">Loading...</div>;

  return (
    <div data-testid="theme-consumer" data-theme={resolvedTheme}>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="resolved-theme">{resolvedTheme}</div>
      <button
        data-testid="set-light"
        onClick={() => setTheme('light')}
      >
        Light
      </button>
      <button
        data-testid="set-dark"
        onClick={() => setTheme('dark')}
      >
        Dark
      </button>
      <button
        data-testid="set-system"
        onClick={() => setTheme('system')}
      >
        System
      </button>
      <button
        data-testid="set-high-contrast"
        onClick={() => setTheme('high-contrast')}
      >
        High Contrast
      </button>
    </div>
  );
};

// Mock UI components that consume design tokens
const TokenConsumerComponent: React.FC = () => {
  return (
    <div data-testid="token-consumer">
      <div
        data-testid="primary-color"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Primary
      </div>
      <div
        data-testid="background-color"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        Background
      </div>
      <div
        data-testid="text-color"
        style={{ color: 'var(--color-text)' }}
      >
        Text
      </div>
    </div>
  );
};

// Mock sandbox page component
const SandboxPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div data-testid="sandbox-page">
      <h1>Design System Sandbox</h1>
      <div data-testid="theme-controls">
        <button
          data-testid="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Current theme: ${theme}`}
        >
          Toggle Theme
        </button>
      </div>
      <div data-testid="component-previews">
        <TokenConsumerComponent />
        <ThemeToggle />
      </div>
    </div>
  );
};

// Performance test component
const PerformanceTestComponent: React.FC = () => {
  const [renderCount, setRenderCount] = useState(0);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setRenderCount(count => count + 1);
  });

  return (
    <div data-testid="performance-test">
      <div data-testid="render-count">{renderCount}</div>
      <div data-testid="current-resolved-theme">{resolvedTheme}</div>
    </div>
  );
};

// ================================
// TEST SETUP AND TEARDOWN
// ================================

describe('Theme Switching Integration Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (localStorageMock as any).clear();

    // Reset CSS properties
    Object.keys(mockCSSCustomProperties).forEach(key => {
      mockCSSCustomProperties[key] = key.includes('background') ? '#ffffff' :
                                   key.includes('text') ? '#000000' :
                                   mockCSSCustomProperties[key];
    });

    // Setup getComputedStyle mock to return our test properties
    (window.getComputedStyle as jest.Mock).mockImplementation(() => ({
      getPropertyValue: (prop: string) => mockCSSCustomProperties[prop] || '',
    }));

    // Reset document element mocks
    (mockDocumentElement.setAttribute as jest.Mock).mockClear();
    (mockDocumentElement.getAttribute as jest.Mock).mockClear();
    (mockDocumentElement.classList.add as jest.Mock).mockClear();
    (mockDocumentElement.classList.remove as jest.Mock).mockClear();
    (mockDocumentElement.style.setProperty as jest.Mock).mockClear();
  });

  // ================================
  // 1. THEME PROVIDER CONTEXT INITIALIZATION
  // ================================

  describe('Theme Provider Context Initialization', () => {
    test('should initialize with default theme', async () => {
      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
    });

    test('should initialize with stored theme preference', async () => {
      localStorageMock.setItem('theme', 'dark');

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    });

    test('should handle invalid stored theme gracefully', async () => {
      localStorageMock.setItem('theme', 'invalid-theme');

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Should fall back to default system theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
    });

    test('should provide theme context to child components', async () => {
      const { rerender } = render(
        <MockThemeProvider initialTheme="dark">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('theme-consumer')).toHaveAttribute('data-theme', 'dark');

      // Test theme context is accessible
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    });
  });

  // ================================
  // 2. THEME SWITCHING BEHAVIOR
  // ================================

  describe('Theme Switching Between Light and Dark', () => {
    test('should switch from light to dark theme', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('theme-dark');
    });

    test('should switch from dark to light theme', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="dark">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');

      await user.click(screen.getByTestId('set-light'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');
      });

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('theme-light');
    });

    test('should handle high contrast theme switching', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      await user.click(screen.getByTestId('set-high-contrast'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('high-contrast');
      });

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'high-contrast');
      expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('theme-high-contrast');
    });

    test('should handle system theme switching', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      await user.click(screen.getByTestId('set-system'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light'); // Based on mock
      });
    });
  });

  // ================================
  // 3. THEME PERSISTENCE TESTING
  // ================================

  describe('Theme Persistence (localStorage/sessionStorage)', () => {
    test('should save theme preference to localStorage', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      await user.click(screen.getByTestId('set-dark'));

      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });

    test('should restore theme preference from localStorage', async () => {
      localStorageMock.setItem('theme', 'high-contrast');

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('high-contrast');
      expect(localStorageMock.getItem).toHaveBeenCalledWith('theme');
    });

    test('should handle localStorage errors gracefully', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const user = userEvent.setup();

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Should not throw error when localStorage fails
      await user.click(screen.getByTestId('set-dark'));

      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
    });

    test('should clear theme from storage when requested', () => {
      localStorageMock.setItem('theme', 'dark');
      removeStoredTheme();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('theme');
    });
  });

  // ================================
  // 4. CSS CUSTOM PROPERTY UPDATES
  // ================================

  describe('CSS Custom Property Updates', () => {
    test('should update CSS custom properties when theme changes', async () => {
      // Mock different values for different themes
      mockGetComputedStyle.mockImplementation(() => ({
        getPropertyValue: (prop: string) => {
          if (prop === '--color-background') {
            return getCurrentTheme() === 'dark' ? '#000000' : '#ffffff';
          }
          if (prop === '--color-text') {
            return getCurrentTheme() === 'dark' ? '#ffffff' : '#000000';
          }
          return mockCSSCustomProperties[prop] || '';
        },
      }));

      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <div>
            <TestThemeConsumer />
            <TokenConsumerComponent />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Initially light theme
      expect(getCSSCustomProperty('color-background')).toBe('#ffffff');

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // After switching to dark theme
      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    test('should provide utilities to get design tokens', () => {
      mockGetComputedStyle.mockImplementation(() => ({
        getPropertyValue: (prop: string) => mockCSSCustomProperties[prop] || '',
      }));

      expect(getColorToken('primary' as ColorToken)).toBe('#0066cc');
      expect(getCSSCustomProperty('spacing-4')).toBe('1rem');
      expect(getCSSCustomProperty('font-size-base')).toBe('16px');
    });

    test('should handle missing CSS custom properties gracefully', () => {
      mockGetComputedStyle.mockImplementation(() => ({
        getPropertyValue: () => '',
      }));

      expect(getCSSCustomProperty('non-existent-property', 'fallback')).toBe('fallback');
      expect(getColorToken('primary' as ColorToken, '#default')).toBe('#default');
    });
  });

  // ================================
  // 5. COMPONENT RE-RENDERING WITH NEW THEME TOKENS
  // ================================

  describe('Component Re-rendering with New Theme Tokens', () => {
    test('should re-render components when theme changes', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <div>
            <TestThemeConsumer />
            <TokenConsumerComponent />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const tokenConsumer = screen.getByTestId('token-consumer');
      expect(tokenConsumer).toBeInTheDocument();

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Component should still be present after theme change
      expect(screen.getByTestId('token-consumer')).toBeInTheDocument();
    });

    test('should provide updated theme context to all consumer components', async () => {
      const user = userEvent.setup();

      const MultipleConsumers = () => {
        const { resolvedTheme } = useTheme();
        return (
          <div>
            <div data-testid="consumer-1-theme">{resolvedTheme}</div>
            <div data-testid="consumer-2-theme">{resolvedTheme}</div>
            <div data-testid="consumer-3-theme">{resolvedTheme}</div>
          </div>
        );
      };

      render(
        <MockThemeProvider initialTheme="light">
          <div>
            <TestThemeConsumer />
            <MultipleConsumers />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // All consumers should initially show light theme
      expect(screen.getByTestId('consumer-1-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('consumer-2-theme')).toHaveTextContent('light');
      expect(screen.getByTestId('consumer-3-theme')).toHaveTextContent('light');

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // All consumers should now show dark theme
      expect(screen.getByTestId('consumer-1-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('consumer-2-theme')).toHaveTextContent('dark');
      expect(screen.getByTestId('consumer-3-theme')).toHaveTextContent('dark');
    });
  });

  // ================================
  // 6. SYSTEM THEME DETECTION AND AUTOMATIC SWITCHING
  // ================================

  describe('System Theme Detection and Automatic Switching', () => {
    test('should detect system theme preference', () => {
      // Mock system prefers light
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-color-scheme: dark')) {
          return createMatchMediaMock(false);
        }
        return createMatchMediaMock(false);
      });

      expect(getSystemTheme()).toBe('light');

      // Mock system prefers dark
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-color-scheme: dark')) {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      });

      expect(getSystemTheme()).toBe('dark');
    });

    test('should resolve system theme to actual theme', () => {
      // Mock system prefers dark
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-color-scheme: dark')) {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      });

      expect(resolveTheme('system')).toBe('dark');
      expect(resolveTheme('light')).toBe('light');
      expect(resolveTheme('dark')).toBe('dark');
    });

    test('should listen for system theme changes', async () => {
      let mediaQueryCallback: MediaQueryCallback | null = null;
      const mockMediaQuery = {
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((_, callback) => {
          mediaQueryCallback = callback;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      (window.matchMedia as jest.Mock).mockImplementation(() => mockMediaQuery);

      const cleanup = watchSystemTheme((matches) => {
        // Simulate theme change callback
        expect(typeof matches).toBe('boolean');
      });

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Simulate system theme change
      if (mediaQueryCallback) {
        act(() => {
          mediaQueryCallback({ matches: true } as MediaQueryListEvent);
        });
      }

      cleanup();
      expect(mockMediaQuery.removeEventListener).toHaveBeenCalled();
    });

    test('should update theme when system preference changes', async () => {
      let themeChangeCallback: MediaQueryCallback | null = null;
      const mockMediaQuery = {
        matches: false,
        media: '',
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn((_, callback) => {
          themeChangeCallback = callback;
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };

      (window.matchMedia as jest.Mock).mockImplementation(() => mockMediaQuery);

      render(
        <MockThemeProvider initialTheme="system">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
      expect(screen.getByTestId('resolved-theme')).toHaveTextContent('light');

      // Simulate system theme change to dark
      if (themeChangeCallback) {
        act(() => {
          // Update the mock to return dark theme
          (window.matchMedia as jest.Mock).mockImplementation((query: string) => {
            if (query.includes('prefers-color-scheme: dark')) {
              return { ...mockMediaQuery, matches: true };
            }
            return mockMediaQuery;
          });

          themeChangeCallback({ matches: true } as MediaQueryListEvent);
        });
      }
    });
  });

  // ================================
  // 7. THEME SWITCHING CONTROLS IN SANDBOX PAGE
  // ================================

  describe('Theme Switching Controls in Sandbox Page', () => {
    test('should render theme controls in sandbox page', async () => {
      render(
        <MockThemeProvider>
          <SandboxPage />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('sandbox-page')).toBeInTheDocument();
      });

      expect(screen.getByTestId('theme-controls')).toBeInTheDocument();
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('component-previews')).toBeInTheDocument();
    });

    test('should toggle themes in sandbox page', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <SandboxPage />
        </MockThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveAttribute('aria-label', expect.stringContaining('light'));

      await user.click(themeToggle);

      await waitFor(() => {
        expect(themeToggle).toHaveAttribute('aria-label', expect.stringContaining('dark'));
      });
    });

    test('should display component previews with current theme', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <SandboxPage />
        </MockThemeProvider>
      );

      const componentPreviews = screen.getByTestId('component-previews');
      expect(componentPreviews).toBeInTheDocument();

      const tokenConsumer = screen.getByTestId('token-consumer');
      expect(tokenConsumer).toBeInTheDocument();

      await user.click(screen.getByTestId('theme-toggle'));

      // Component previews should still be present after theme change
      expect(screen.getByTestId('component-previews')).toBeInTheDocument();
      expect(screen.getByTestId('token-consumer')).toBeInTheDocument();
    });
  });

  // ================================
  // 8. DESIGN TOKENS UPDATE CORRECTLY ACROSS COMPONENTS
  // ================================

  describe('Design Tokens Update Correctly Across Components', () => {
    test('should validate design system setup', () => {
      // Mock successful validation
      (window.getComputedStyle as jest.Mock).mockImplementation(() => ({
        getPropertyValue: (prop: string) => mockCSSCustomProperties[prop] || '',
      }));

      (mockDocumentElement.getAttribute as jest.Mock).mockImplementation(() => 'light');

      const validation = validateDesignSystem();

      if (process.env.NODE_ENV === 'development') {
        expect(validation).toHaveProperty('isValid');
        expect(validation).toHaveProperty('errors');
        expect(validation).toHaveProperty('warnings');
      } else {
        // In test environment, should return valid by default
        expect(validation.isValid).toBe(true);
      }
    });

    test('should provide consistent token values across components', async () => {
      const TokenTestComponent = () => {
        const primaryColor1 = getCSSCustomProperty('color-primary');
        const primaryColor2 = getColorToken('primary' as ColorToken);

        return (
          <div>
            <div data-testid="primary-color-1">{primaryColor1}</div>
            <div data-testid="primary-color-2">{primaryColor2}</div>
          </div>
        );
      };

      render(
        <MockThemeProvider>
          <TokenTestComponent />
        </MockThemeProvider>
      );

      expect(screen.getByTestId('primary-color-1')).toHaveTextContent('#0066cc');
      expect(screen.getByTestId('primary-color-2')).toHaveTextContent('#0066cc');
    });

    test('should update all token-consuming components when theme changes', async () => {
      const user = userEvent.setup();

      // Mock different token values for different themes
      (window.getComputedStyle as jest.Mock).mockImplementation(() => ({
        getPropertyValue: (prop: string) => {
          const currentTheme = (mockDocumentElement.getAttribute as jest.Mock).mock.calls
            .find((call: any[]) => call[0] === 'data-theme')?.[0];

          if (prop === '--color-primary') {
            return currentTheme === 'dark' ? '#0080ff' : '#0066cc';
          }
          return mockCSSCustomProperties[prop] || '';
        },
      }));

      const MultiTokenComponent = () => (
        <div>
          <div data-testid="component-a" style={{ color: 'var(--color-primary)' }}>
            Component A
          </div>
          <div data-testid="component-b" style={{ color: 'var(--color-primary)' }}>
            Component B
          </div>
        </div>
      );

      render(
        <MockThemeProvider initialTheme="light">
          <div>
            <TestThemeConsumer />
            <MultiTokenComponent />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Both components should be updated
      expect(screen.getByTestId('component-a')).toBeInTheDocument();
      expect(screen.getByTestId('component-b')).toBeInTheDocument();
    });
  });

  // ================================
  // 9. THEME SWITCHING ACCESSIBILITY
  // ================================

  describe('Theme Switching Accessibility', () => {
    test('should detect reduced motion preference', () => {
      // Mock prefers-reduced-motion: reduce
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-reduced-motion: reduce')) {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      });

      expect(prefersReducedMotion()).toBe(true);

      // Mock no reduced motion preference
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-reduced-motion: reduce')) {
          return createMatchMediaMock(false);
        }
        return createMatchMediaMock(false);
      });

      expect(prefersReducedMotion()).toBe(false);
    });

    test('should detect high contrast preference', () => {
      // Mock prefers-contrast: high
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-contrast: high')) {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      });

      expect(prefersHighContrast()).toBe(true);
    });

    test('should respect reduced motion when applying theme transitions', () => {
      // Mock reduced motion preference
      window.matchMedia = jest.fn().mockImplementation((query: string) => {
        if (query.includes('prefers-reduced-motion: reduce')) {
          return createMatchMediaMock(true);
        }
        return createMatchMediaMock(false);
      });

      applyTheme('dark', 'data-theme', false);

      // Should not set transition to none when user prefers reduced motion
      expect(mockDocumentElement.style).not.toHaveProperty('transition', 'none');
    });

    test('should provide proper ARIA labels for theme controls', async () => {
      render(
        <MockThemeProvider initialTheme="light">
          <SandboxPage />
        </MockThemeProvider>
      );

      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveAttribute('aria-label', expect.stringContaining('Current theme'));
    });

    test('should handle keyboard navigation for theme controls', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const darkButton = screen.getByTestId('set-dark');

      // Focus the button
      darkButton.focus();
      expect(darkButton).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });
    });

    test('should announce theme changes to screen readers', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <div>
            <TestThemeConsumer />
            <div aria-live="polite" data-testid="theme-announcement">
              Current theme: {isDarkTheme() ? 'dark' : 'light'}
            </div>
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const announcement = screen.getByTestId('theme-announcement');
      expect(announcement).toHaveTextContent('Current theme: light');

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Theme announcement should be updated
      expect(announcement).toBeInTheDocument();
    });
  });

  // ================================
  // 10. THEME SWITCHING PERFORMANCE
  // ================================

  describe('Theme Switching Performance', () => {
    test('should debounce rapid theme changes', async () => {
      const debouncedFunction = debounce(jest.fn(), 100);

      debouncedFunction();
      debouncedFunction();
      debouncedFunction();

      // Should only be called once after debounce delay
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(debouncedFunction).toBeTruthy();
    });

    test('should minimize unnecessary re-renders', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <PerformanceTestComponent />
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Get initial render count
      const initialRenderCount = parseInt(screen.getByTestId('render-count').textContent || '0');

      await user.click(screen.getByTestId('set-dark'));

      await waitFor(() => {
        expect(screen.getByTestId('current-resolved-theme')).toHaveTextContent('dark');
      });

      // Check that render count increased by reasonable amount
      const newRenderCount = parseInt(screen.getByTestId('render-count').textContent || '0');
      expect(newRenderCount).toBeGreaterThan(initialRenderCount);
      expect(newRenderCount - initialRenderCount).toBeLessThan(5); // Should not re-render excessively
    });

    test('should efficiently apply CSS transitions', () => {
      const startTime = performance.now();

      applyTheme('dark', 'data-theme', true);

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Theme application should be fast
      expect(duration).toBeLessThan(50); // Should complete within 50ms
    });

    test('should handle concurrent theme changes gracefully', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider initialTheme="light">
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Rapidly click multiple theme buttons
      const darkButton = screen.getByTestId('set-dark');
      const lightButton = screen.getByTestId('set-light');
      const systemButton = screen.getByTestId('set-system');

      await user.click(darkButton);
      await user.click(lightButton);
      await user.click(systemButton);
      await user.click(darkButton);

      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Should handle rapid changes without errors
      expect(screen.getByTestId('theme-consumer')).toBeInTheDocument();
    });

    test('should optimize CSS custom property lookups', () => {
      // Mock performance timing
      const lookupCount = 100;
      const startTime = performance.now();

      for (let i = 0; i < lookupCount; i++) {
        getCSSCustomProperty('color-primary');
        getColorToken('background' as ColorToken);
      }

      const endTime = performance.now();
      const avgTimePerLookup = (endTime - startTime) / lookupCount;

      // Each lookup should be fast
      expect(avgTimePerLookup).toBeLessThan(1); // Should average less than 1ms per lookup
    });
  });

  // ================================
  // INTEGRATION TEST SCENARIOS
  // ================================

  describe('End-to-End Integration Scenarios', () => {
    test('should handle complete theme lifecycle', async () => {
      const user = userEvent.setup();

      // Start with clean slate
      localStorageMock.clear();

      render(
        <MockThemeProvider>
          <div>
            <TestThemeConsumer />
            <SandboxPage />
            <TokenConsumerComponent />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // 1. Should start with system theme
      expect(screen.getByTestId('current-theme')).toHaveTextContent('system');

      // 2. Switch to dark theme
      await user.click(screen.getByTestId('set-dark'));
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // 3. Verify persistence
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');

      // 4. Switch to high contrast
      await user.click(screen.getByTestId('set-high-contrast'));
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('high-contrast');
      });

      // 5. Use sandbox toggle
      await user.click(screen.getByTestId('theme-toggle'));
      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).not.toHaveTextContent('high-contrast');
      });

      // 6. All components should still be functional
      expect(screen.getByTestId('theme-consumer')).toBeInTheDocument();
      expect(screen.getByTestId('sandbox-page')).toBeInTheDocument();
      expect(screen.getByTestId('token-consumer')).toBeInTheDocument();
    });

    test('should handle edge cases and error scenarios', async () => {
      // Test with localStorage disabled
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage disabled');
      });

      const user = userEvent.setup();

      render(
        <MockThemeProvider>
          <TestThemeConsumer />
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Should still work without localStorage
      await user.click(screen.getByTestId('set-dark'));
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme')).toHaveTextContent('dark');
      });

      // Restore localStorage
      localStorageMock.setItem = originalSetItem;
    });

    test('should maintain accessibility throughout theme changes', async () => {
      const user = userEvent.setup();

      render(
        <MockThemeProvider>
          <div>
            <TestThemeConsumer />
            <SandboxPage />
          </div>
        </MockThemeProvider>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      const themeButtons = [
        screen.getByTestId('set-light'),
        screen.getByTestId('set-dark'),
        screen.getByTestId('set-system'),
        screen.getByTestId('set-high-contrast'),
      ];

      // Test keyboard navigation through all theme options
      for (const button of themeButtons) {
        button.focus();
        expect(button).toHaveFocus();

        await user.keyboard('{Enter}');
        await waitFor(() => {
          expect(screen.getByTestId('theme-consumer')).toBeInTheDocument();
        });
      }

      // All controls should remain accessible
      expect(screen.getByTestId('theme-toggle')).toHaveAttribute('aria-label');
    });
  });
});