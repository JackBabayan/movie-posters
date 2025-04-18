'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Movie, MovieDetail } from '@/types';
import { getImageUrl } from '@/lib/api/tmdb';
import { FavoriteButton } from '@/components/common/FavoriteButton';
import { formatDate } from '@/lib/utils/formatDate';
import { ROUTES } from '@/lib/utils/constants';

interface MovieCardProps {
  movie: Movie | MovieDetail;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  const truncateOverview = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <motion.div 
      className="movie-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="movie-card__poster">
        <Link href={ROUTES.MOVIE(movie.id)}>
          <div className="movie-card__poster-container">
            <Image 
              src={getImageUrl(movie.poster_path, 'w342')}
              alt={`Постер ${movie.title}`}
              width={342}
              height={513}
              className="movie-card__poster-image"
              loading="lazy"
              placeholder="empty"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        <div className="movie-card__rating">
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
        <div className="movie-card__favorite">
          <FavoriteButton movie={movie} />
        </div>
      </div>
      <div className="movie-card__content">
        <h3 className="movie-card__title">
          <Link href={ROUTES.MOVIE(movie.id)}>{movie.title}</Link>
        </h3>
        <p className="movie-card__release-date">{formatDate(movie.release_date)}</p>
        {movie.overview && (
          <p className="movie-card__overview">{truncateOverview(movie.overview)}</p>
        )}
      </div>
    </motion.div>
  );
};