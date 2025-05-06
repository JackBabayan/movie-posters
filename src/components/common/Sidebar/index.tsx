'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi } from '@/lib/api/tmdb';
import { useGenres } from '@/lib/store/genres';
import classNames from 'classnames';
import { InfoMessage } from '@/components/common/InfoMessage';
import { ClearIcon } from '@/styles/icon';
import styles from './styles.module.scss';

interface SidebarProps {
  selectedGenres: number[];
  onGenreSelect: (genreId: number) => void;
  onClearGenres: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedGenres,
  onGenreSelect,
  onClearGenres,
}) => {
  const {
    genres,
    isLoading,
    error,
    setGenres,
    setLoading,
    setError,
    lastUpdate
  } = useGenres();

  useEffect(() => {
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа
    const isCacheValid = lastUpdate && (Date.now() - lastUpdate < CACHE_DURATION);
    const shouldLoadGenres = !isCacheValid && !isLoading || genres.length === 0;

    const loadGenres = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.getGenres();
        setGenres(response.genres);
      } catch (err) {
        console.error('Ошибка загрузки жанров:', err);
        setError('Не удалось загрузить жанры');
      } finally {
        setLoading(false);
      }
    };

    console.log("genres", shouldLoadGenres, isCacheValid, isLoading, genres.length);


    if (shouldLoadGenres) {
      loadGenres();
    }
  }, [genres.length, isLoading, lastUpdate, setError, setGenres, setLoading]);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.sidebarWrapper}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.title}>Жанры</h3>

            {selectedGenres.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className={styles.sidebarClearBtn}
                onClick={onClearGenres}
                aria-label="Очистить выбранные жанры"
              >
                <ClearIcon />
              </motion.button>
            )}
          </div>

          {error && !isLoading ? (
            <InfoMessage message={'Не удалось загрузить жанры'} />
          ) : (
            <ul className={styles.sidebarList}>
              {genres.map((genre) => (
                <li
                  key={genre.id}
                  className={styles.sidebarItem}
                  onClick={() => onGenreSelect(genre.id)}
                >
                  <span
                    className={classNames(styles.sidebarItemContent, {
                      [styles.active]: selectedGenres.includes(genre.id),
                    })}
                  >
                    {genre.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};



// Назначение: Фильтрация фильмов по жанрам.
// Технологии:
// SWR для кэширования жанров
// CSS анимации для интерактивности
// Адаптивный дизайн
// Принцип работы:
// Загружает список жанров
// Поддерживает множественный выбор
// Синхронизирует с URL параметрами
// Анимирует выбранные жанры
// Трансформируется в горизонтальный список на мобильных