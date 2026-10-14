'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center space-x-1.5 rounded-sm border border-neutral-700 bg-neutral-900/80 px-2.5 py-1.5 font-mono text-xs text-neutral-300 transition-colors hover:border-neutral-500 hover:text-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:text-white"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline text-[11px]">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-neutral-300" />
          <span className="hidden sm:inline text-[11px]">Dark</span>
        </>
      )}
    </button>
  );
}
