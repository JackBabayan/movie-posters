'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideosResponse } from '@/types';
import { tmdbApi, SWR_KEYS } from '@/lib/api/tmdb';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ErrorMessage } from '../../common/ErrorMessage';
import { VIDEO_TYPES, VIDEO_SITES, UI } from '@/lib/utils/constants';

interface TrailerCarouselProps {
  movieId: number;
}

// Функция загрузки данных для SWR
const fetcher = ([, movieId]: [string, number]) => tmdbApi.getMovieVideos(movieId);

export const TrailerCarousel: React.FC<TrailerCarouselProps> = ({ movieId }) => {
  const [trailers, setTrailers] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const { data, error, isLoading } = useSWR<VideosResponse>(
    [SWR_KEYS.movieVideos(movieId), movieId],
    fetcher,
    {
      // Отключаем запрос, если ID невалидный
      isPaused: () => isNaN(movieId) || movieId <= 0
    }
  );

  useEffect(() => {
    if (data?.results) {
      // Фильтруем видео, чтобы получить только трейлеры с YouTube
      const filteredTrailers = data.results
        .filter(video => 
          video.site === VIDEO_SITES.YOUTUBE && 
          (video.type === VIDEO_TYPES.TRAILER || video.type === VIDEO_TYPES.TEASER)
        )
        .slice(0, UI.MAX_TRAILERS); // Ограничиваем количество трейлеров
      
      setTrailers(filteredTrailers);
    }
  }, [data]);

  // Обработчики навигации
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? trailers.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === trailers.length - 1 ? 0 : prev + 1));
  };

  const goToTrailer = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoplay = () => {
    setAutoplay(prev => !prev);
  };

  // Проверяем валидность ID фильма
  if (isNaN(movieId) || movieId <= 0) {
    return <ErrorMessage message="Неверный ID фильма" />;
  }

  // Нет трейлеров для отображения
  if (!isLoading && (!trailers || trailers.length === 0)) {
    return (
      <div className="trailer-carousel trailer-carousel--empty">
        <p>Трейлеры отсутствуют</p>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Не удалось загрузить трейлеры" />;
  }

  return (
    <div className="trailer-carousel">
      <h3 className="trailer-carousel__title">Трейлеры и тизеры</h3>
      
      {isLoading ? (
        <div className="trailer-carousel__loading">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="trailer-carousel__container">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                className="trailer-carousel__item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="trailer-carousel__video-wrapper">
                  <iframe
                    className="trailer-carousel__iframe"
                    src={`https://www.youtube.com/embed/${trailers[currentIndex]?.key}?autoplay=${autoplay ? 1 : 0}&rel=0`}
                    title={trailers[currentIndex]?.name || 'Трейлер'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="trailer-carousel__info">
                  <h4 className="trailer-carousel__video-title">
                    {trailers[currentIndex]?.name}
                  </h4>
                  <p className="trailer-carousel__video-type">
                    {trailers[currentIndex]?.type}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {trailers.length > 1 && (
              <div className="trailer-carousel__controls">
                <button 
                  className="trailer-carousel__arrow trailer-carousel__arrow--prev"
                  onClick={goToPrevious}
                  aria-label="Предыдущий трейлер"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                <div className="trailer-carousel__dots">
                  {trailers.map((_, index) => (
                    <button
                      key={index}
                      className={`trailer-carousel__dot ${index === currentIndex ? 'trailer-carousel__dot--active' : ''}`}
                      onClick={() => goToTrailer(index)}
                      aria-label={`Трейлер ${index + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  className="trailer-carousel__arrow trailer-carousel__arrow--next"
                  onClick={goToNext}
                  aria-label="Следующий трейлер"
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <button 
            className={`trailer-carousel__autoplay ${autoplay ? 'trailer-carousel__autoplay--active' : ''}`}
            onClick={toggleAutoplay}
          >
            {autoplay ? 'Отключить автовоспроизведение' : 'Включить автовоспроизведение'}
          </button>
        </>
      )}
    </div>
  );
};