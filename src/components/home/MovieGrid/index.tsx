'use client';

import React, { useEffect, useState, useCallback, memo } from 'react';
import { MovieCard } from '../MovieCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { tmdbApi } from '@/lib/api/tmdb';
import { Movie } from '@/types';

import styles from "./styles.module.scss"

interface MovieGridProps {
  searchQuery: string;
  selectedGenres: number[];
}

const MemoizedMovieCard = memo(MovieCard);


const useFilteredMovies = (movies: Movie[], selectedGenres: number[]) => {
  return useCallback(() => {
    if (!selectedGenres.length) return movies;
    return movies.filter(movie =>
      selectedGenres.some(genreId => movie.genre_ids.includes(genreId))
    );
  }, [movies, selectedGenres]);
};

export const MovieGrid: React.FC<MovieGridProps> = ({
  searchQuery,
  selectedGenres
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = searchQuery
          ? await tmdbApi.searchMovies(searchQuery, 1)
          : await tmdbApi.getPopularMovies(1);

        setMovies(response.results);
      } catch (err) {
        console.error('Ошибка загрузки фильмов:', err);
        setError('Не удалось загрузить фильмы');
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery]);

  const loadMoreMovies = useCallback(async (page: number) => {
    try {
      setIsLoading(true);

      const response = searchQuery
        ? await tmdbApi.searchMovies(searchQuery, page)
        : await tmdbApi.getPopularMovies(page);

      if (response.page >= response.total_pages) {
        setHasMore(false);
        return;
      }

      const newMovies = response.results.filter(
        newMovie => !movies.some(existingMovie => existingMovie.id === newMovie.id)
      );

      if (newMovies.length > 0) {
        setMovies(prevMovies => [...prevMovies, ...newMovies]);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Ошибка загрузки дополнительных фильмов:', err);
      setError('Не удалось загрузить дополнительные фильмы');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, movies]);

  const { loaderRef, hasMore, setHasMore } = useInfiniteScroll(loadMoreMovies, {
    initialPage: 2
  });

  useEffect(() => {
    setHasMore(true);
  }, [searchQuery, setHasMore]);

  const filteredMovies = useFilteredMovies(movies, selectedGenres)();

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className={'flex alignCenter flexAuto'}>
      {isLoading && movies.length === 0 ?
        <LoadingSpinner />
        :
        filteredMovies.length === 0 ?
          <ErrorMessage message={'Фильмы не найдены. Попробуйте другой запрос или фильтр.'} />
          :
          <div>
            <div className={styles.MovieCardWrapper}>
              {filteredMovies.map(movie => (
                <MemoizedMovieCard key={movie.id} movie={movie} />
              ))}
            </div>
              {hasMore && (
                <div ref={loaderRef}>
                  {isLoading && <LoadingSpinner />}
                </div>
              )}
          </div>
      }
    </div>
  );
};