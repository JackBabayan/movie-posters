'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FavoritesState, MovieDetail } from '@/types';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (movie: MovieDetail) => {
        set((state) => {
          if (state.favorites.some(fav => fav.id === movie.id)) {
            return state;
          }
          return { favorites: [...state.favorites, movie] };
        });
      },
      
      removeFavorite: (movieId: number) => {
        set((state) => ({
          favorites: state.favorites.filter(movie => movie.id !== movieId)
        }));
      },
      
      isFavorite: (movieId: number) => {
        return get().favorites.some(movie => movie.id === movieId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'favorites-storage',
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
          }
        },
        removeItem: (name) => {
          try {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(name);
            }
          } catch {
          }
        },
      },
    }
  )
);

export const useFavorites = () => {
  const { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites } = useFavoritesStore();
  return { favorites, addFavorite, removeFavorite, isFavorite, clearFavorites };
};