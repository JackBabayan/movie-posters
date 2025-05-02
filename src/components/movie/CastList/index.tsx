'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, SWR_KEYS, getImageUrl } from '@/lib/api/tmdb';
import { Credits } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { InfoMessage } from '@/components/common/InfoMessage';
import { UI } from '@/lib/utils/constants';
import styles from './styles.module.scss';

interface CastListProps {
  movieId: number;
}

// Функция загрузки данных для SWR
const fetcher = ([, movieId]: [string, number]) => tmdbApi.getMovieCredits(movieId);

export const CastList: React.FC<CastListProps> = ({ movieId }) => {
  const [showAllCast, setShowAllCast] = useState(false);

  const { data, error, isLoading } = useSWR<Credits>(
    [SWR_KEYS.movieCredits(movieId), movieId],
    fetcher,
    {
      // Отключаем запрос, если ID невалидный
      isPaused: () => isNaN(movieId) || movieId <= 0
    }
  );

  // Проверяем валидность ID фильма
  if (isNaN(movieId) || movieId <= 0) {
    return <InfoMessage message="Неверный ID фильма" />;
  }

  // Определяем, сколько актеров показывать изначально
  const initialCastToShow = UI.CAST_TO_SHOW;

  // Фильтруем каст (только актеры с фото и именем персонажа)
  const filteredCast = data?.cast
    ? data.cast.filter(actor => actor.profile_path && actor.character)
    : [];

  // Отображаемые актеры (все или ограниченное количество)
  const displayedCast = showAllCast
    ? filteredCast
    : filteredCast.slice(0, initialCastToShow);

  // Обработчик переключения отображения всех актеров
  const toggleShowAllCast = () => {
    setShowAllCast(prev => !prev);
  };

  // Анимация для списка
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <InfoMessage message="Не удалось загрузить информацию об актерах" />;
  }

  if (!filteredCast.length) {
    return <div className={styles.empty}>Информация об актерах отсутствует</div>;
  }

  return (
    <div className={styles.castList}>
      <h2 className={styles.title}>В ролях</h2>

      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {displayedCast.map((actor) => (
            <motion.div
              key={actor.id}
              className={styles.item}
              variants={itemVariants}
              layout
            >
              <div className={styles.photo}>
                <Image
                  src={getImageUrl(actor.profile_path, 'w185')}
                  alt={actor.name}
                  width={185}
                  height={278}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                />
              </div>
              <div className={styles.info}>
                <h3 className={styles.actorName}>{actor.name}</h3>
                <p className={styles.character}>{actor.character}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCast.length > initialCastToShow && (
        <button
          className={styles.toggleButton}
          onClick={toggleShowAllCast}
        >
          {showAllCast ? 'Показать меньше' : `Показать всех (${filteredCast.length})`}
          <svg
            className={`${styles.toggleIcon} ${showAllCast ? styles.toggleIconUp : ''}`}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points={showAllCast ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
          </svg>
        </button>
      )}
    </div>
  );
};


// Назначение: Отображение списка актеров фильма.
// Технологии:
// Framer Motion для анимаций
// CSS Grid для сетки
// Ленивая загрузка изображений
// Принцип работы:
// Загружает информацию об актерах
// Фильтрует актеров с фото
// Показывает ограниченное количество изначально
// Поддерживает раскрытие полного списка
// Анимирует появление элементов