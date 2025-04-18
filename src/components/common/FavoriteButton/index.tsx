'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Movie, MovieDetail } from '@/types';
import { useFavorites } from '@/lib/store/favorites';

import { FavoriteIcon } from '@/styles/icon'

interface FavoriteButtonProps {
  movie: Movie | MovieDetail;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  movie
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (isMovieFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie as MovieDetail);
    }
  };


  return (
    <motion.button
      className={`favorite-button ${isMovieFavorite ? 'favorite-button--active' : ''}`}
      onClick={handleToggleFavorite}
      aria-label={isMovieFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 1 }}
      animate={isMovieFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <FavoriteIcon/>
    </motion.button>
  );
};