'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Genre } from '@/types';

interface GenresState {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
  setGenres: (genres: Genre[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGenresStore = create<GenresState>()(
  persist(
    (set) => ({
      genres: [],
      isLoading: false,
      error: null,
      lastUpdate: null,

      setGenres: (genres) => {
        set({
          genres,
          lastUpdate: Date.now(),
          error: null,
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'genres-storage',
    },
  ),
);

export const useGenres = () => {
  return useGenresStore();
};
