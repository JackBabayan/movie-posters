'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MovieCard } from '@/components/common/MovieCard';
import { useFavorites } from '@/lib/store/favorites';
import { ROUTES } from '@/lib/utils/constants';
import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './styles.module.scss'

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [showConfirmation, setShowConfirmation] = useState(false);

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


  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };


  const handleClearFavoritesClick = () => {
    setShowConfirmation(true);
  };


  const handleCancelClear = () => {
    setShowConfirmation(false);
  };


  const handleConfirmClear = () => {
    clearFavorites();
    setShowConfirmation(false);
  };

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.favoritesHeader}>
        <h1 className={styles.title}>Избранные фильмы</h1>

        {favorites.length > 0 && (
          <div>
            <button
              className="btnGlobal"
              onClick={handleClearFavoritesClick}
            >
              Очистить все
            </button>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <ErrorMessage message={'У вас пока нет избранных фильмов'} linkText={'Перейти к каталогу фильмов'} link={ROUTES.HOME} />
      ) : (
        <motion.div
          className={styles.favoritesGrid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {favorites.map(movie => (
              <motion.div
                key={movie.id}
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

      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCancelClear}
          >
            <motion.div
              className={styles.modalContent}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <h3 className={styles.modalTitle}>Очистить избранное?</h3>
              <p className={styles.modalText}>
                Вы уверены, что хотите удалить все фильмы из избранного? Это действие нельзя отменить.
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={`btnGlobal  ${styles.cancel}`}
                  onClick={handleCancelClear}
                >
                  Отмена
                </button>
                <button
                  className={`btnGlobal  ${styles.confirm}`}
                  onClick={handleConfirmClear}
                >
                  Очистить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}