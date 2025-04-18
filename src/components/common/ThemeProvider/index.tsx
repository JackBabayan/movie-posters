'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/store/theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const store = useThemeStore();

  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(store.theme);
    }
  }, [store.theme]);

  return <>{children}</>;
} 