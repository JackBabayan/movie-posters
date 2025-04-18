'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseFiltersOptions {
  initialGenres?: number[];
  initialQuery?: string;
}

export const useFilters = (options: UseFiltersOptions = {}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedGenres, setSelectedGenres] = useState<number[]>(() => {
    const genresParam = searchParams.get('genres');
    if (genresParam) {
      return genresParam.split(',').map(Number);
    }
    return options.initialGenres || [];
  });
  
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    return searchParams.get('q') || options.initialQuery || '';
  });
  
  const updateURL = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','));
    } else {
      params.delete('genres');
    }
    
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    const newURL = `${window.location.pathname}?${params.toString()}`;
    router.push(newURL);
  }, [selectedGenres, searchQuery, router, searchParams]);
  

  const handleGenreSelect = useCallback((genreId: number) => {
    setSelectedGenres(prev => {
      if (prev.includes(genreId)) {
        return prev.filter(id => id !== genreId);
      }
      return [...prev, genreId];
    });
  }, []);
  

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  

  const clearFilters = useCallback(() => {
    setSelectedGenres([]);
    setSearchQuery('');
  }, []);
  

  useEffect(() => {
    updateURL();
  }, [selectedGenres, searchQuery, updateURL]);
  
  return {
    selectedGenres,
    searchQuery,
    handleGenreSelect,
    handleSearch,
    clearFilters
  };
}; 