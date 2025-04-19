'use client';

import React, {useEffect} from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { MovieDetail } from '@/types';
import { tmdbApi, SWR_KEYS, getImageUrl } from '@/lib/api/tmdb';
import { MovieDetails } from '@/components/movie/MovieDetails';
import { CastList } from '@/components/movie/CastList';
import TrailerCarousel from '@/components/movie/TrailerCarousel';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

import styles from './styles.module.scss';


const fetcher = ([, id]: [string, number]) => tmdbApi.getMovieDetails(id);

export default function MoviePage() {
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  
  const { data: movie, error, isLoading } = useSWR<MovieDetail>(
    [SWR_KEYS.movieDetails(movieId), movieId],
    fetcher,
    {
      isPaused: () => isNaN(movieId) || movieId <= 0
    }
  );

  
  if (isNaN(movieId) || movieId <= 0) {
    return (
      <ErrorMessage
        message="Неверный ID фильма. Пожалуйста, вернитесь на главную страницу."
      />
    );
  }

  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  
  if (error || !movie) {
    return (
      <ErrorMessage
        message="Не удалось загрузить информацию о фильме. Пожалуйста, попробуйте позже."
      />
    );
  }

  return (
    <div className={styles.moviePage}>
      <div
        className={styles.backdrop}
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'w1280')})`
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <MovieDetails movie={movie} />

          <section className={styles.section}>
            <CastList movieId={movieId} />
          </section>

          <section className={styles.section}>
            <TrailerCarousel movieId={movieId} />
          </section>
        </div>
      </div>
    </div>
  );
}