'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MovieDetail } from '@/types';
import { getImageUrl } from '@/lib/api/tmdb';
import { formatDate, formatRuntime, formatNumber } from '@/lib/utils/formatDate';
import { FavoriteButton } from '@/components/common/FavoriteButton';

interface MovieDetailsProps {
  movie: MovieDetail;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  
  const {
    title,
    poster_path,
    release_date,
    genres,
    vote_average,
    vote_count,
    runtime,
    overview,
    tagline,
    budget,
    revenue,
    status
  } = movie;

  // Вычисляем процент рейтинга для визуализации
  const ratingPercent = Math.round((vote_average || 0) * 10);
  const releaseYear = release_date ? new Date(release_date).getFullYear() : null;

  // Анимации для элементов
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

  return (
    <motion.div 
      className="movie-details"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      role="article"
      aria-label={`Информация о фильме ${title}`}
    >
      <div className="movie-details__container">
        <motion.div 
          className="movie-details__poster"
          variants={itemVariants}
        >
          {!imageError && poster_path ? (
            <Image
              src={getImageUrl(poster_path, 'w500')}
              alt={`Постер фильма ${title}`}
              width={500}
              height={750}
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
              onError={() => setImageError(true)}
            />
          ) : (
            <div 
              className="movie-details__poster-placeholder"
              role="img"
              aria-label="Постер отсутствует"
            >
              <span>Нет постера</span>
            </div>
          )}
          <div className="movie-details__favorite">
            <FavoriteButton movie={movie} size="large" />
          </div>
        </motion.div>

        <div className="movie-details__info">
          <motion.h1 
            className="movie-details__title"
            variants={itemVariants}
          >
            {title} {releaseYear && <span className="movie-details__year">({releaseYear})</span>}
          </motion.h1>

          {tagline && (
            <motion.p 
              className="movie-details__tagline"
              variants={itemVariants}
            >
              {tagline}
            </motion.p>
          )}

          <motion.div 
            className="movie-details__meta"
            variants={itemVariants}
          >
            {release_date && (
              <div className="movie-details__release-date">
                <span className="movie-details__label">Дата выхода:</span>
                <span>{formatDate(release_date)}</span>
              </div>
            )}

            {runtime > 0 && (
              <div className="movie-details__runtime">
                <span className="movie-details__label">Продолжительность:</span>
                <span>{formatRuntime(runtime)}</span>
              </div>
            )}

            {status && (
              <div className="movie-details__status">
                <span className="movie-details__label">Статус:</span>
                <span>{status}</span>
              </div>
            )}
          </motion.div>

          <motion.div 
            className="movie-details__rating"
            variants={itemVariants}
            role="group"
            aria-label="Рейтинг фильма"
          >
            <div className="movie-details__rating-circle">
              <svg 
                viewBox="0 0 36 36" 
                className="movie-details__rating-svg"
                aria-hidden="true"
              >
                <path
                  className="movie-details__rating-circle-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="movie-details__rating-circle-fill"
                  strokeDasharray={`${ratingPercent}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <text x="18" y="20.35" className="movie-details__rating-text">
                  {ratingPercent}%
                </text>
              </svg>
            </div>
            <div className="movie-details__votes">
              <span className="movie-details__votes-count">{vote_count?.toLocaleString()}</span>
              <span className="movie-details__votes-text">голосов</span>
            </div>
          </motion.div>

          {genres && genres.length > 0 && (
            <motion.div 
              className="movie-details__genres"
              variants={itemVariants}
            >
              <span className="movie-details__label">Жанры:</span>
              <div 
                className="movie-details__genres-list"
                role="list"
                aria-label="Список жанров"
              >
                {genres.map(genre => (
                  <span 
                    key={genre.id} 
                    className="movie-details__genre-item"
                    role="listitem"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {overview && (
            <motion.div 
              className="movie-details__overview"
              variants={itemVariants}
            >
              <h3 className="movie-details__overview-title">Описание</h3>
              <p className="movie-details__overview-text">{overview}</p>
            </motion.div>
          )}

          <motion.div 
            className="movie-details__finances"
            variants={itemVariants}
          >
            {budget > 0 && (
              <div className="movie-details__budget">
                <span className="movie-details__label">Бюджет:</span>
                <span>${formatNumber(budget)}</span>
              </div>
            )}

            {revenue > 0 && (
              <div className="movie-details__revenue">
                <span className="movie-details__label">Сборы:</span>
                <span>${formatNumber(revenue)}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};