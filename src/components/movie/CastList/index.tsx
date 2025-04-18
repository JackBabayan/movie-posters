'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { tmdbApi, SWR_KEYS, getImageUrl } from '@/lib/api/tmdb';
import { Credits } from '@/types';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from '../../common/ErrorMessage';
import { UI } from '@/lib/utils/constants';

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
    return <ErrorMessage message="Неверный ID фильма" />;
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
      <div className="cast-list__loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Не удалось загрузить информацию об актерах" />;
  }

  if (!filteredCast.length) {
    return <div className="cast-list__empty">Информация об актерах отсутствует</div>;
  }

  return (
    <div className="cast-list">
      <h2 className="cast-list__title">В ролях</h2>

      <motion.div
        className="cast-list__grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {displayedCast.map((actor) => (
            <motion.div
              key={actor.id}
              className="cast-list__item"
              variants={itemVariants}
              layout
            >
              <div className="cast-list__photo">
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
              <div className="cast-list__info">
                <h3 className="cast-list__actor-name">{actor.name}</h3>
                <p className="cast-list__character">{actor.character}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredCast.length > initialCastToShow && (
        <button
          className="cast-list__toggle-button"
          onClick={toggleShowAllCast}
        >
          {showAllCast ? 'Показать меньше' : `Показать всех (${filteredCast.length})`}
          <svg
            className={`cast-list__toggle-icon ${showAllCast ? 'cast-list__toggle-icon--up' : ''}`}
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