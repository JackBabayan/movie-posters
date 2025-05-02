'use client';

import React, { Suspense } from 'react';
import { MovieGrid } from '@/components/home/MovieGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { Sidebar } from '@/components/common/Sidebar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useFilterParams } from '@/lib/hooks/useFilterParams';

import styles from '@/styles/Home.module.scss';

function HomeContent() {
  const {
    searchQuery,
    selectedGenres,
    toggleGenre,
    clearGenres,
  } = useFilterParams();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>
        Популярные фильмы
      </h1>

      <div>
        <div className='flex alignRight'>
          <SearchBar />
        </div>

        <div className={styles.wrapperContent}>
          <Sidebar
            selectedGenres={selectedGenres}
            onGenreSelect={toggleGenre}
            onClearGenres={clearGenres}
          />

          <MovieGrid
            searchQuery={searchQuery}
            selectedGenres={selectedGenres}
          />
        </div>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomeContent />
    </Suspense>
  );
}
