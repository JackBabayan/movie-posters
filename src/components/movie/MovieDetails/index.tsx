'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarIcon, CalendarIcon, ClockIcon } from '@/styles/icon';
import { formatDate, formatRuntime, formatNumber } from '@/utils/formatters';
import { MovieDetail } from '@/types';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import styles from './styles.module.scss';

interface MovieDetailsProps {
  movie: MovieDetail;
}

export const MovieDetails = ({ movie }: MovieDetailsProps) => {
  const [isImageError, setIsImageError] = useState(false);

  const {
    title,
    release_date,
    runtime,
    vote_average,
    vote_count,
    overview,
    poster_path,
    genres,
    budget,
    revenue,
    tagline,
  } = movie;

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : null;

  const releaseYear = new Date(release_date).getFullYear();

  return (
    <motion.div
      className={styles.movieDetails}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <div className={styles.poster}>
          {posterUrl && !isImageError ? (
            <Image
              src={posterUrl}
              alt={title}
              width={300}
              height={450}
              onError={() => setIsImageError(true)}
            />
          ) : (
            <div className={styles.posterPlaceholder}>
              No poster available
            </div>
          )}
          <div className={styles.favorite}>
            <FavoriteButton movie={movie} />
          </div>
        </div>

        <div className={styles.info}>
          <h2 className={styles.title}>
            {title}
            <span className={styles.year}>
              {' '}
              ({releaseYear})
            </span>
          </h2>

          {tagline && <p className={styles.tagline}>{tagline}</p>}

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <StarIcon />
              <div className={styles.rating}>
                <span className={styles.ratingValue}>
                  {vote_average.toFixed(1)}
                </span>
                <span className={styles.ratingCount}>
                  ({formatNumber(vote_count)})
                </span>
              </div>
            </div>

            <div className={styles.metaItem}>
              <ClockIcon />
              {formatRuntime(runtime)}
            </div>

            <div className={styles.metaItem}>
              <CalendarIcon />
              {formatDate(release_date)}
            </div>
          </div>

          <div className={styles.genres}>
            {genres.map((genre) => (
              <span key={genre.id} className={styles.genre}>
                {genre.name}
              </span>
            ))}
          </div>

          <p className={styles.overview}>{overview}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Budget</span>
              <span className={styles.statValue}>
                ${formatNumber(budget)}
              </span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Revenue</span>
              <span className={styles.statValue}>
                ${formatNumber(revenue)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



// MovieDetails
// Назначение: Отображение подробной информации о фильме.
// Технологии:
// SWR для кэширования данных
// CSS Grid для layout
// Динамический фон с градиентом
// Принцип работы:
// Загружает детальную информацию о фильме
// Отображает постер, описание, метаданные
// Показывает рейтинг и статистику
// Интегрируется с системой избранного
// Адаптируется под мобильные устройства