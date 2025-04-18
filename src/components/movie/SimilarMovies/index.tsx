'use client';

import React from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { MovieCard } from '../../home/MovieCard';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from '../../common/ErrorMessage';
import { tmdbApi, SWR_KEYS } from '@/lib/api/tmdb';
import { MovieListResponse } from '@/types';
import { UI } from '@/lib/utils/constants';

interface SimilarMoviesProps {
  movieId: number;
}

// Функция загрузки данных для SWR
const fetcher = (key: string, movieId: number) => tmdbApi.getSimilarMovies(movieId);

export const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movieId }) => {
  const { data, error, isLoading } = useSWR<MovieListResponse>(
    [SWR_KEYS.similarMovies(movieId), movieId],
    fetcher
  );

  // Ограничиваем количество показываемых похожих фильмов
  const similarMovies = data?.results
    ? data.results
        .filter(movie => movie.poster_path) // Отфильтровываем фильмы без постеров
        .slice(0, UI.MAX_SIMILAR_MOVIES)
    : [];

  // Анимации для контейнера и элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="similar-movies__loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Не удалось загрузить похожие фильмы" />;
  }

  if (!similarMovies.length) {
    return null; // Не показываем блок, если нет похожих фильмов
  }

  return (
    <div className="similar-movies">
      <h2 className="similar-movies__title">Похожие фильмы</h2>

      <motion.div
        className="similar-movies__grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {similarMovies.map(movie => (
          <motion.div
            key={movie.id}
            className="similar-movies__item"
            variants={itemVariants}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};