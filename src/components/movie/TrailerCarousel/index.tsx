'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, VideosResponse } from '@/types';
import { tmdbApi, SWR_KEYS } from '@/lib/api/tmdb';
import { ErrorMessage } from '../../common/ErrorMessage';
import { VIDEO_TYPES, VIDEO_SITES, UI } from '@/lib/utils/constants';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import styles from './styles.module.scss';

interface TrailerCarouselProps {
  movieId: number;
}

const fetcher = ([, movieId]: [string, number]) => tmdbApi.getMovieVideos(movieId);

export default function TrailerCarousel({ movieId }: TrailerCarouselProps) {
  const [trailers, setTrailers] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const { data, error, isLoading } = useSWR<VideosResponse>(
    [SWR_KEYS.movieVideos(movieId), movieId],
    fetcher,
    {
      isPaused: () => isNaN(movieId) || movieId <= 0
    }
  );

  useEffect(() => {
    if (data?.results) {
      const filteredTrailers = data.results
        .filter(video => 
          video.site === VIDEO_SITES.YOUTUBE && 
          (video.type === VIDEO_TYPES.TRAILER || video.type === VIDEO_TYPES.TEASER)
        )
        .slice(0, UI.MAX_TRAILERS);
      
      setTrailers(filteredTrailers);
    }
  }, [data]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? trailers.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === trailers.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoplay = () => {
    setIsAutoplay(!isAutoplay);
  };

  useEffect(() => {
    if (trailers.length > 0 && currentIndex >= trailers.length) {
      setCurrentIndex(0);
    }
  }, [trailers, currentIndex]);

  if (isNaN(movieId) || movieId <= 0) {
    return <ErrorMessage message="Неверный ID фильма" />;
  }

  if (!isLoading && (!trailers || trailers.length === 0)) {
    return (
      <div className={styles.empty}>
        Трейлеры не найдены
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Не удалось загрузить трейлеры" />;
  }

  return (
    <div className={styles.trailerCarousel}>
      <h2 className={styles.title}>Трейлеры</h2>
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className={styles.item}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.videoWrapper}>
              {trailers[currentIndex] ? (
                <iframe
                  className={styles.iframe}
                  src={`https://www.youtube.com/embed/${trailers[currentIndex].key}?autoplay=${isAutoplay ? 1 : 0}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className={styles.empty}>Трейлер не найден</div>
              )}
            </div>
            <div className={styles.info}>
              <h3 className={styles.videoTitle}>{trailers[currentIndex]?.name || 'Трейлер'}</h3>
              <p className={styles.videoType}>{trailers[currentIndex]?.type || 'Трейлер'}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className={styles.controls}>
          <button className={styles.arrow} onClick={handlePrev}>
            <ChevronLeft />
          </button>
          <div className={styles.dots}>
            {trailers.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
          <button className={styles.arrow} onClick={handleNext}>
            <ChevronRight />
          </button>
        </div>
      </div>

      <button
        className={`btnGlobal ${styles.autoplay} ${isAutoplay ? styles.autoplayActive : ''}`}
        onClick={toggleAutoplay}
      >
        {isAutoplay ? <Pause size={16} /> : <Play size={16} />} Автовоспроизведение
      </button>
    </div>
  );
}