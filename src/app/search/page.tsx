'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MovieGrid } from '@/components/home/MovieGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { Sidebar } from '@/components/common/Sidebar';
import { useFilters } from '@/lib/hooks/useFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

import styles from '@/styles/Home.module.scss'

function SearchContent() {
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

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchContent />
    </Suspense>
  );
}