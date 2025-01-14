import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '../types';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        updateThemeClass(theme);
      },
    }),
    {
      name: 'theme-store',
    }
  )
);

function updateThemeClass(theme: Theme) {
  const root = window.document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);
  
  root.classList.remove('light', 'dark');
  root.classList.add(isDark ? 'dark' : 'light');
}

// Initialize theme on load
if (typeof window !== 'undefined') {
  const theme = useThemeStore.getState().theme;
  updateThemeClass(theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') {
      updateThemeClass('system');
    }
  });
}