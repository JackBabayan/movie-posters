'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeState } from '@/types';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark',
      toggleTheme: () => 
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          
          if (typeof window !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(newTheme);
          }
          
          return { theme: newTheme };
        }),
    }),
    {
      name: 'theme-storage',
      skipHydration: true, 
    }
  )
);

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  return { theme, toggleTheme };
};

export const applyTheme = () => {
  if (typeof window !== 'undefined') {
    const theme = useThemeStore.getState().theme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }
};