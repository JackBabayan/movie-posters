'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Movie, MovieDetail } from '@/types';
import { useFavorites } from '@/lib/store/favorites';

interface FavoriteButtonProps {
  movie: Movie | MovieDetail;
  size?: 'small' | 'medium' | 'large';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  movie, 
  size = 'medium' 
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); // Предотвращаем навигацию, если кнопка внутри ссылки
    e.stopPropagation(); // Останавливаем всплытие события
    
    if (isMovieFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie as MovieDetail);
    }
  };

  const sizeClass = {
    small: 'favorite-button--small',
    medium: 'favorite-button--medium',
    large: 'favorite-button--large',
  }[size];
  
  return (
    <motion.button
      className={`favorite-button ${sizeClass} ${isMovieFavorite ? 'favorite-button--active' : ''}`}
      onClick={handleToggleFavorite}
      aria-label={isMovieFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      initial={{ scale: 1 }}
      animate={isMovieFavorite ? { scale: [1, 1.2, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill={isMovieFavorite ? 'currentColor' : 'none'} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.button>
  );
};