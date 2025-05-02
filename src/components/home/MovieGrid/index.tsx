'use client';

import React, { useEffect, useCallback, memo } from 'react';
import { MovieCard } from '@/components/common/MovieCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { InfoMessage } from '@/components/common/InfoMessage';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { tmdbApi } from '@/lib/api/tmdb';
import { useMovies } from '@/lib/store/movies';
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
  const {
    movies,
    isLoading,
    error,
    setMovies,
    addMovies,
    setLoading,
    setError,
    totalPages,
    currentPage,
    lastQuery,
    hasMore,
    setHasMore,
    isCacheValid
  } = useMovies();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = searchQuery
          ? await tmdbApi.searchMovies(searchQuery, 1)
          : await tmdbApi.getPopularMovies(1);

        setMovies(response, searchQuery);
      } catch (err) {
        console.error('Ошибка загрузки фильмов:', err);
        setError('Не удалось загрузить фильмы');
      } finally {
        setLoading(false);
      }
    };

    const shouldLoadMovies =
      (!isCacheValid() && movies.length === 0) || // кэш устарел или пуст
      lastQuery !== searchQuery || // изменился поисковый запрос
      (lastQuery && !searchQuery); // возврат к популярным фильмам

    if (shouldLoadMovies) {
      loadMovies();
    }
  }, [searchQuery, setMovies, setLoading, setError, lastQuery, movies.length, isCacheValid]);

  const loadMoreMovies = useCallback(async (page: number) => {
    if (!hasMore || isLoading) return;

    try {
      setLoading(true);

      const response = searchQuery
        ? await tmdbApi.searchMovies(searchQuery, page)
        : await tmdbApi.getPopularMovies(page);

      addMovies(response);
    } catch (err) {
      console.error('Ошибка загрузки дополнительных фильмов:', err);
      setError('Не удалось загрузить дополнительные фильмы');
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, addMovies, setLoading, setError, hasMore, isLoading, setHasMore]);

  const { loaderRef } = useInfiniteScroll(loadMoreMovies, {
    initialPage: currentPage + 1,
    enabled: hasMore && !isLoading
  });

  const filteredMovies = useFilteredMovies(movies, selectedGenres)();

  if (error) {
    return <InfoMessage message={error} />;
  }

  return (
    <div className={'flex alignCenter flexAuto'}>
      {isLoading && movies.length === 0 ?
        <LoadingSpinner />
        :
        filteredMovies.length === 0 ?
          <InfoMessage message={'Фильмы не найдены. Попробуйте другой запрос или фильтр.'} />
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

// Назначение: Отображение сетки фильмов с поддержкой бесконечной прокрутки.
// Технологии:
// useInfiniteScroll хук для бесконечной прокрутки
// memo для оптимизации рендеринга
// CSS Grid для адаптивной сетки
// Принцип работы:
// Получает начальные фильмы через TMDB API
// Отслеживает скролл через useInfiniteScroll
// Подгружает новые фильмы при достижении конца страницы
// Фильтрует дубликаты фильмов
// Поддерживает состояния загрузки и ошибок