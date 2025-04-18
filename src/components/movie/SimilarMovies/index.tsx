'use client';

import React from 'react';
import useSWR from 'swr';
import { motion } from 'framer-motion';
import { MovieCard } from '@/components/home/MovieCard';
import { ErrorMessage } from '../../common/ErrorMessage';
import { tmdbApi } from '@/lib/api/tmdb';
import { UI } from '@/lib/utils/constants';
import styles from './SimilarMovies.module.scss';

interface SimilarMoviesProps {
  movieId: number;
}

// Функция загрузки данных для SWR
const fetcher = ([, movieId]: [string, number]) => tmdbApi.getSimilarMovies(movieId);

export const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movieId }) => {
  const { data: similarMovies, error } = useSWR(
    ['similarMovies', movieId],
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  // Ограничиваем количество показываемых похожих фильмов
  const similarMoviesData = similarMovies?.results
    ? similarMovies.results
        .filter(movie => movie.poster_path) // Отфильтровываем фильмы без постеров
        .slice(0, UI.MOVIES_PER_PAGE)
    : [];

  if (similarMovies === undefined) {
    return (
      <div className={styles.loading}>
        <span>Загрузка похожих фильмов...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Не удалось загрузить похожие фильмы" />;
  }

  if (!similarMoviesData.length) {
    return null; // Не показываем блок, если нет похожих фильмов
  }

  return (
    <section className={styles.similarMovies}>
      <h2 className={styles.title}>Похожие фильмы</h2>
      <motion.div
        className={styles.grid}
        initial="hidden"
        animate="visible"
      >
        {similarMoviesData.map(movie => (
          <motion.div
            key={movie.id}
            className={styles.card}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};