/**
 * Example component demonstrating theme utility usage
 * This file showcases how to use the theme management utilities
 */

'use client';

import { useEffect, useState } from 'react';

import {
  type ResolvedTheme,
  getColorToken,
  getComponentToken,
  isDarkTheme,
  isLightTheme,
  getThemeConfig,
  getCurrentTheme,
  cn,
} from '@/lib/utils';

export function ThemeExamples() {
  const [currentTheme, setCurrentTheme] = useState<ResolvedTheme | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string>('');
  const [buttonHeight, setButtonHeight] = useState<string>('');

  useEffect(() => {
    // Get current theme
    setCurrentTheme(getCurrentTheme());

    // Get design token values
    setPrimaryColor(getColorToken('primary', '#3b82f6'));
    setButtonHeight(getComponentToken('button', 'height-md', '2.5rem'));
  }, []);

  // Theme-aware styling
  const cardClasses = cn(
    'p-6 rounded-lg border',
    getThemeConfig({
      light: 'bg-surface border-border text-text',
      dark: 'bg-surface border-border text-text',
      'high-contrast': 'bg-surface border-border text-text border-2',
    }),
  );

  const statusClasses = cn(
    'px-3 py-1 rounded-full text-sm font-medium',
    isDarkTheme() ? 'bg-primary text-primary-foreground' : 'bg-primary-hover text-primary-foreground',
  );

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-text">Theme Utilities Demo</h2>

      {/* Current Theme Display */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-2">Current Theme</h3>
        <p>Active theme: <span className="font-mono">{currentTheme || 'Loading...'}</span></p>
        <div className="flex gap-2 mt-2">
          <span className={cn('px-2 py-1 rounded text-xs', isLightTheme() ? 'bg-success text-success-foreground' : 'bg-text-secondary text-surface')}>
            Light: {isLightTheme() ? 'Active' : 'Inactive'}
          </span>
          <span className={cn('px-2 py-1 rounded text-xs', isDarkTheme() ? 'bg-success text-success-foreground' : 'bg-text-secondary text-surface')}>
            Dark: {isDarkTheme() ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Design Token Values */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-2">Design Token Values</h3>
        <div className="space-y-2 font-mono text-sm">
          <p>Primary Color: <span style={{ color: primaryColor }}>{primaryColor}</span></p>
          <p>Button Height (md): {buttonHeight}</p>
          <p>Text Color: <span style={{ color: getColorToken('text') }}>{getColorToken('text')}</span></p>
        </div>
      </div>

      {/* Theme-Aware Components */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-2">Theme-Aware Styling</h3>
        <div className="space-y-3">
          <button className="btn-height-md bg-primary hover:bg-primary-hover text-primary-foreground px-4 rounded-md transition-colors">
            Primary Button
          </button>
          <div className={statusClasses}>
            Status Badge
          </div>
          <div className="p-3 rounded border-border-focus border-2">
            Focus Border Example
          </div>
        </div>
      </div>

      {/* Responsive Token Examples */}
      <div className={cardClasses}>
        <h3 className="text-lg font-semibold mb-2">Responsive Design Tokens</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-padding-sm bg-surface-secondary rounded">
            Small padding
          </div>
          <div className="card-padding-lg bg-surface-tertiary rounded">
            Large padding
          </div>
        </div>
      </div>
    </div>
  );
}