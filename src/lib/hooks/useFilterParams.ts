'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useCallback } from 'react';

export function useFilterParams() {
  const router = useRouter();
  const params = useSearchParams();

  const searchQuery = params.get('q') || '';

  const selectedGenres = useMemo(() => {
    const raw = params.get('genres');
    if (!raw) return [];
    return raw
      .split(',')
      .map(id => Number(id))
      .filter(id => !isNaN(id));
  }, [params]);

  const updateGenres = useCallback((newGenres: number[]) => {
    const newParams = new URLSearchParams(params.toString());
    if (newGenres.length > 0) {
      newParams.set('genres', newGenres.join(','));
    } else {
      newParams.delete('genres');
    }
    router.push(`/?${newParams.toString()}`);
  }, [params, router]);

  const toggleGenre = useCallback((genreId: number) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    updateGenres(newGenres);
  }, [selectedGenres, updateGenres]);

  const clearGenres = useCallback(() => {
    updateGenres([]);
  }, [updateGenres]);

  return {
    searchQuery,
    selectedGenres,
    toggleGenre,
    clearGenres,
  };
}
