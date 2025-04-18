'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MovieCard } from '@/components/home/MovieCard';
import { useFavorites } from '@/lib/store/favorites';
import { ROUTES } from '@/lib/utils/constants';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Анимационные варианты для списка и элементов
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
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  // Открытие диалога подтверждения
  const handleClearFavoritesClick = () => {
    setShowConfirmation(true);
  };

  // Отмена очистки избранного
  const handleCancelClear = () => {
    setShowConfirmation(false);
  };

  // Подтверждение очистки избранного
  const handleConfirmClear = () => {
    clearFavorites();
    setShowConfirmation(false);
  };

  return (
    <div className="favorites-page">
      <div className="container">
        <div className="favorites-page__header">
          <h1 className="favorites-page__title">Избранные фильмы</h1>
          
          {favorites.length > 0 && (
            <button
              className="favorites-page__clear-button"
              onClick={handleClearFavoritesClick}
            >
              Очистить все
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-page__empty">
            <div className="favorites-page__empty-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <h2 className="favorites-page__empty-title">
              У вас пока нет избранных фильмов
            </h2>
            <p className="favorites-page__empty-text">
              Добавляйте фильмы в избранное, чтобы они отображались здесь
            </p>
            <Link href={ROUTES.HOME} className="favorites-page__empty-button">
              Перейти к каталогу фильмов
            </Link>
          </div>
        ) : (
          <motion.div
            className="favorites-page__grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {favorites.map(movie => (
                <motion.div
                  key={movie.id}
                  className="favorites-page__item"
                  variants={itemVariants}
                  layout
                  exit="exit"
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Модальное окно подтверждения */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              className="confirmation-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="confirmation-modal__content"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="confirmation-modal__title">
                  Очистить список избранного?
                </h2>
                <p className="confirmation-modal__text">
                  Вы уверены, что хотите удалить все фильмы из избранного? Это действие нельзя отменить.
                </p>
                <div className="confirmation-modal__buttons">
                  <button
                    className="confirmation-modal__button confirmation-modal__button--cancel"
                    onClick={handleCancelClear}
                  >
                    Отмена
                  </button>
                  <button
                    className="confirmation-modal__button confirmation-modal__button--confirm"
                    onClick={handleConfirmClear}
                  >
                    Подтвердить
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}