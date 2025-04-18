'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { MovieDetail } from '@/types';
import { tmdbApi, SWR_KEYS, getImageUrl } from '@/lib/api/tmdb';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { CastList } from '@/components/movie/CastList';
import TrailerCarousel from '@/components/movie/TrailerCarousel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './styles.module.scss';

// Функция загрузки данных для SWR
const fetcher = ([, id]: [string, number]) => tmdbApi.getMovieDetails(id);

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);

  // Загрузка деталей фильма с помощью SWR
  const { data: movie, error, isLoading } = useSWR<MovieDetail>(
    [SWR_KEYS.movieDetails(movieId), movieId],
    fetcher,
    {
      // Отключаем запрос, если ID невалидный
      isPaused: () => isNaN(movieId) || movieId <= 0
    }
  );

  // Проверяем валидность ID фильма
  if (isNaN(movieId) || movieId <= 0) {
    return (
      <ErrorMessage
        message="Неверный ID фильма. Пожалуйста, вернитесь на главную страницу."
      />
    );
  }

  // Показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // Показываем ошибку
  if (error || !movie) {
    return (
      <ErrorMessage
        message="Не удалось загрузить информацию о фильме. Пожалуйста, попробуйте позже."
      />
    );
  }

  return (
    <div className={styles.moviePage}>
      <div
        className={styles.backdrop}
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <MovieDetails movie={movie} />

          <section className={styles.section}>
            <CastList movieId={movieId} />
          </section>

          <section className={styles.section}>
            <TrailerCarousel movieId={movieId} />
          </section>
        </div>
      </div>
    </div>
  );
}