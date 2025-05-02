'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie, MovieListResponse } from '@/types';

interface MoviesState {
  movies: Movie[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  lastQuery: string;
  setMovies: (response: MovieListResponse, query: string) => void;
  addMovies: (response: MovieListResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  hasMore: boolean;
  lastUpdate: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useMoviesStore = create<MoviesState>()(
  persist(
    (set) => ({
      movies: [],
      totalPages: 0,
      currentPage: 1,
      isLoading: false,
      error: null,
      lastQuery: '',
      hasMore: true,
      lastUpdate: 0,

      setMovies: (response, query = '') => {
        set({
          movies: response.results,
          totalPages: response.total_pages,
          currentPage: response.page,
          error: null,
          lastQuery: query,
          hasMore: response.page < response.total_pages,
          lastUpdate: Date.now(),
        });
      },

      addMovies: (response) => {
        set((state) => {
          const newMovies = response.results.filter(
            (newMovie) => !state.movies.some((existingMovie) => existingMovie.id === newMovie.id),
          );

          return {
            movies: [...state.movies, ...newMovies],
            totalPages: response.total_pages,
            currentPage: response.page,
            error: null,
            hasMore: response.page < response.total_pages,
            lastUpdate: Date.now(),
          };
        });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      setHasMore: (hasMore) => {
        set({ hasMore });
      },
    }),
    {
      name: 'movies-storage',
      storage: {
        getItem: (name) => {
          try {
            const str = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
            return str ? JSON.parse(str) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem(name, JSON.stringify(value));
            }
          } catch {
            // Игнорируем ошибки при сохранении
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(name);
            }
          } catch {
            // Игнорируем ошибки при удалении
          }
        },
      },
    },
  ),
);

export const useMovies = () => {
  const store = useMoviesStore();

  const isCacheValid = () => {
    return store.movies.length > 0 && Date.now() - store.lastUpdate < CACHE_DURATION;
  };

  return {
    ...store,
    isCacheValid,
  };
};
