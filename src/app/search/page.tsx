'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieGrid } from '@/components/home/MovieGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { Sidebar } from '@/components/common/Sidebar';
import { useFilters } from '@/lib/hooks/useFilters';

import styles from '@/styles/Home.module.scss'


export default function SearchPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const {
    selectedGenres,
    searchQuery,
    handleGenreSelect,
    handleSearch,
    clearFilters
  } = useFilters({
    initialQuery: queryParam
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
      {searchQuery ? `Результаты поиска: ${searchQuery}` : 'Популярные фильмы'}
      </h1>

      <div>

        <div className='flex alignRight'>
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} autoFocus />
        </div>

        <div className={styles.wrapperContent}>

          <Sidebar
            selectedGenres={selectedGenres}
            onGenreSelect={handleGenreSelect}
            onClearGenres={clearFilters}
          />

          <MovieGrid
            searchQuery={searchQuery}
            selectedGenres={selectedGenres}
          />

        </div>
      </div>
    </div>
  );
}