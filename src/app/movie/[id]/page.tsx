'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { MovieDetail } from '@/types';
import { tmdbApi, SWR_KEYS, getImageUrl } from '@/lib/api/tmdb';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { CastList } from '@/components/movie/CastList';
import { TrailerCarousel } from '@/components/movie/TrailerCarousel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

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
      <div className="loading-container">
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
    <div className="movie-page">
      <div
        className="movie-page__backdrop"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
        }}
      >
        <div className="movie-page__backdrop-overlay"></div>
      </div>

      <div className="container">
        <div className="movie-page__content">

          <MovieDetails movie={movie} />


          <section className="movie-page__section">
            <CastList movieId={movieId} />
          </section>

          <section className="movie-page__section">
            <TrailerCarousel movieId={movieId} />
          </section>
        </div>
      </div>
    </div>
  );
}