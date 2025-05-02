import axios from 'axios';
import { MovieListResponse, MovieDetail, Credits, Genre, VideosResponse } from '@/types';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const tmdbAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
  },
  params: {
    language: 'ru-RU',
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/images/placeholder-poster.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const tmdbApi = {
  getPopularMovies: async (page: number = 1): Promise<MovieListResponse> => {
    const response = await tmdbAxios.get<MovieListResponse>('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  getMovieDetails: async (id: number): Promise<MovieDetail> => {
    const response = await tmdbAxios.get<MovieDetail>(`/movie/${id}`);
    return response.data;
  },

  getMovieCredits: async (id: number): Promise<Credits> => {
    const response = await tmdbAxios.get<Credits>(`/movie/${id}/credits`);
    return response.data;
  },

  getMovieVideos: async (id: number): Promise<VideosResponse> => {
    const response = await tmdbAxios.get<VideosResponse>(`/movie/${id}/videos`);
    return response.data;
  },

  getSimilarMovies: async (id: number, page: number = 1): Promise<MovieListResponse> => {
    const response = await tmdbAxios.get<MovieListResponse>(`/movie/${id}/similar`, {
      params: { page },
    });
    return response.data;
  },

  getGenres: async (): Promise<{ genres: Genre[] }> => {
    const response = await tmdbAxios.get<{ genres: Genre[] }>('/genre/movie/list');
    return response.data;
  },

  searchMovies: async (query: string, page: number = 1): Promise<MovieListResponse> => {
    const response = await tmdbAxios.get<MovieListResponse>('/search/movie', {
      params: {
        query,
        page,
      },
    });
    return response.data;
  },
};

export const SWR_KEYS = {
  popularMovies: (page: number) => `popular-movies-${page}`,
  movieDetails: (id: number) => `movie-details-${id}`,
  movieCredits: (id: number) => `movie-credits-${id}`,
  movieVideos: (id: number) => `movie-videos-${id}`,
  similarMovies: (id: number, page: number) => `similar-movies-${id}-${page}`,
  genres: 'genres',
  searchMovies: (query: string, page: number) => `search-movies-${query}-${page}`,
};
