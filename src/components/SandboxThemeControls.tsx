'use client';

import React from 'react';

import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Theme control icons
 */
const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={5} />
    <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const ComputerIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <rect width={20} height={14} x={2} y={3} rx={2} />
    <line x1={8} x2={16} y1={21} y2={21} />
    <line x1={12} x2={12} y1={17} y2={21} />
  </svg>
);

const HighContrastIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={9} />
    <path d="M12 3v18M12 12l9-9" />
  </svg>
);

const SwapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
  </svg>
);

const CycleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);

/**
 * Theme status indicator component
 */
interface ThemeStatusProps {
  theme: string;
  resolvedTheme: string;
  systemTheme: string;
  isLoading: boolean;
}

function ThemeStatus({ theme, resolvedTheme, systemTheme, isLoading }: ThemeStatusProps) {
  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return <SunIcon />;
      case 'dark':
        return <MoonIcon />;
      case 'high-contrast':
        return <HighContrastIcon />;
      case 'system':
        return <ComputerIcon />;
      default:
        return <SunIcon />;
    }
  };

  const getThemeLabel = (themeName: string) => {
    switch (themeName) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'high-contrast':
        return 'High Contrast';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-600 dark:text-gray-400">Current:</span>
        <div className="flex items-center gap-1.5 font-medium">
          {getThemeIcon(theme)}
          {getThemeLabel(theme)}
        </div>
      </div>

      {theme === 'system' && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">→</span>
          <div className="flex items-center gap-1.5 font-medium">
            {getThemeIcon(systemTheme)}
            {getThemeLabel(systemTheme)}
          </div>
        </div>
      )}

      {theme !== resolvedTheme && theme !== 'system' && (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">→</span>
          <div className="flex items-center gap-1.5 font-medium">
            {getThemeIcon(resolvedTheme)}
            {getThemeLabel(resolvedTheme)}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      )}
    </div>
  );
}

/**
 * Sandbox theme controls component
 * Provides comprehensive theme switching controls for the sandbox page
 */
export function SandboxThemeControls() {
  const {
    theme,
    resolvedTheme,
    systemTheme,
    isLoading,
    hasError,
    error,
    availableThemes,
    setTheme,
    toggleTheme,
    cycleTheme,
    resetToSystem,
    clearStoredTheme,
  } = useTheme();

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Theme Controls</CardTitle>
            <CardDescription>
              Switch between themes to see how all components respond to different color schemes
            </CardDescription>
          </div>
          {hasError && (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-sm">
              <span>⚠️</span>
              <span>Theme Error</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Theme Status */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <ThemeStatus
            theme={theme}
            resolvedTheme={resolvedTheme}
            systemTheme={systemTheme}
            isLoading={isLoading}
          />
        </div>

        {/* Primary Theme Controls */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Primary Controls</h4>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              startIcon={<SunIcon />}
              onClick={() => setTheme('light')}
              className={cn(
                'transition-all',
                theme === 'light' && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
              )}
            >
              Light
            </Button>

            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              startIcon={<MoonIcon />}
              onClick={() => setTheme('dark')}
              className={cn(
                'transition-all',
                theme === 'dark' && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
              )}
            >
              Dark
            </Button>

            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              startIcon={<ComputerIcon />}
              onClick={() => setTheme('system')}
              className={cn(
                'transition-all',
                theme === 'system' && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
              )}
            >
              System
            </Button>

            {availableThemes.includes('high-contrast') && (
              <Button
                variant={theme === 'high-contrast' ? 'default' : 'outline'}
                size="sm"
                startIcon={<HighContrastIcon />}
                onClick={() => setTheme('high-contrast')}
                className={cn(
                  'transition-all',
                  theme === 'high-contrast' && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900',
                )}
              >
                High Contrast
              </Button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Quick Actions</h4>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="sm"
              startIcon={<SwapIcon />}
              onClick={toggleTheme}
            >
              Toggle Light/Dark
            </Button>

            <Button
              variant="secondary"
              size="sm"
              startIcon={<CycleIcon />}
              onClick={cycleTheme}
            >
              Cycle All Themes
            </Button>

            <Button
              variant="outline"
              size="sm"
              startIcon={<ResetIcon />}
              onClick={resetToSystem}
            >
              Reset to System
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearStoredTheme}
            >
              Clear Preferences
            </Button>
          </div>
        </div>

        {/* Theme Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="font-medium text-gray-700 dark:text-gray-300">Theme Details</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400">
              <div>Selected Theme: <span className="font-mono">{theme}</span></div>
              <div>Resolved Theme: <span className="font-mono">{resolvedTheme}</span></div>
              <div>System Preference: <span className="font-mono">{systemTheme}</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-700 dark:text-gray-300">Available Themes</div>
            <div className="flex flex-wrap gap-1">
              {availableThemes.map((themeOption) => (
                <span
                  key={themeOption}
                  className={cn(
                    'px-2 py-1 rounded text-xs font-mono',
                    themeOption === theme
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
                  )}
                >
                  {themeOption}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {hasError && error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-500 mt-0.5">⚠️</span>
              <div>
                <div className="font-medium text-red-800 dark:text-red-200">Theme System Error</div>
                <div className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {error.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 mt-0.5">💡</span>
            <div>
              <div className="font-medium text-blue-800 dark:text-blue-200">Usage Tips</div>
              <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Try switching themes while scrolling through the component showcase below.
                All components will immediately reflect the new theme settings with smooth transitions.
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SandboxThemeControls;