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
  setMovies: (response: MovieListResponse) => void;
  addMovies: (response: MovieListResponse) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearMovies: () => void;
}

export const useMoviesStore = create<MoviesState>()(
  persist(
    (set) => ({
      movies: [],
      totalPages: 0,
      currentPage: 1,
      isLoading: false,
      error: null,

      setMovies: (response) => {
        set({
          movies: response.results,
          totalPages: response.total_pages,
          currentPage: response.page,
          error: null
        });
      },

      addMovies: (response) => {
        set((state) => ({
          movies: [...state.movies, ...response.results],
          totalPages: response.total_pages,
          currentPage: response.page,
          error: null
        }));
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      clearMovies: () => {
        set({
          movies: [],
          totalPages: 0,
          currentPage: 1,
          error: null
        });
      }
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
    }
  )
);

// Хук для работы с фильмами
export const useMovies = () => {
  const { 
    movies, 
    totalPages, 
    currentPage, 
    isLoading, 
    error,
    setMovies, 
    addMovies, 
    setLoading, 
    setError, 
    clearMovies 
  } = useMoviesStore();

  return {
    movies,
    totalPages,
    currentPage,
    isLoading,
    error,
    setMovies,
    addMovies,
    setLoading,
    setError,
    clearMovies
  };
}; 