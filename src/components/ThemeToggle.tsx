'use client';

import { useEffect, useState } from 'react';

import {
  type ResolvedTheme,
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  resolveTheme,
  isValidTheme,
} from '@/lib/utils';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = getStoredTheme();
    const initialTheme: ResolvedTheme = savedTheme && isValidTheme(savedTheme)
      ? resolveTheme(savedTheme)
      : 'light';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const themes: ResolvedTheme[] = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex]!; // Safe since we're using modulo

    setTheme(nextTheme);
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 btn-base btn-primary px-4 py-2 text-sm"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'high contrast' : 'light'} theme`}
    >
      {theme === 'light' && '🌙 Dark'}
      {theme === 'dark' && '🔆 High Contrast'}
      {theme === 'high-contrast' && '☀️ Light'}
    </button>
  );
}