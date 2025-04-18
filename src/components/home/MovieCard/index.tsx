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
import { NoImageIcon } from '@/styles/icon'

import styles from "./styles.module.scss"


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
      className={styles.cardContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.poster}>
        <Link href={ROUTES.MOVIE(movie.id)} className={styles.container}>
          <motion.div
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.09 }}
          >
            {
              movie.poster_path ?
                <Image
                  src={getImageUrl(movie.poster_path, 'w342')}
                  alt={`Постер ${movie.title}`}
                  width={342}
                  height={455}
                  className={styles.image}
                  loading="lazy"
                  placeholder="empty"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                :
                <NoImageIcon />
            }
          </motion.div>
          <div className={styles.rating}>
            <span>{movie.vote_average.toFixed(1)}</span>
          </div>
          <div className={styles.favorite}>
            <FavoriteButton movie={movie} />
          </div>
          <div className={styles.date}>{formatDate(movie.release_date)}</div>
        </Link>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          {movie.title}
        </h3>
        {movie.overview && (
          <p className={styles.overview}>{truncateOverview(movie.overview)}</p>
        )}
      </div>
    </motion.div>
  );
};