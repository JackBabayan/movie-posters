'use client';

import React from 'react';
import { MovieGrid } from '@/components/home/MovieGrid';
import { SearchBar } from '@/components/home/SearchBar';
import { Sidebar } from '@/components/common/Sidebar';
import { useRouter, useSearchParams } from 'next/navigation';

import styles from '@/styles/Home.module.scss'

export default function HomePage() {
  const router = useRouter();
  const params = useSearchParams();

  const searchQuery = params.get('q') || '';
  const selectedGenres = params.get('genres')
    ? params.get('genres')!.split(',').map(Number)
    : [];

  const handleGenreSelect = (genreId: number) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];

    const newParams = new URLSearchParams(params.toString());
    if (newGenres.length > 0) {
      newParams.set('genres', newGenres.join(','));
    } else {
      newParams.delete('genres');
    }

    router.push(`/?${newParams.toString()}`);
  };

  const handleClearGenres = () => {
    const newParams = new URLSearchParams(params.toString());
    newParams.delete('genres');
    router.push(`/?${newParams.toString()}`);
  };

  return (
    <div className={styles.container}>
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
            onGenreSelect={handleGenreSelect}
            onClearGenres={handleClearGenres}
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