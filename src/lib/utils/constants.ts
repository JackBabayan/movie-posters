// Константы для API
export const API_ENDPOINTS = {
  POPULAR_MOVIES: '/movie/popular',
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  MOVIE_CREDITS: (id: number) => `/movie/${id}/credits`,
  MOVIE_VIDEOS: (id: number) => `/movie/${id}/videos`,
  GENRES: '/genre/movie/list',
  SEARCH_MOVIES: '/search/movie',
};

// Базовые URL для API и изображений
export const BASE_URLS = {
  API: 'https://api.themoviedb.org/3',
  IMAGES: 'https://image.tmdb.org/t/p',
  YOUTUBE: 'https://www.youtube.com/embed',
};

// Размеры изображений
export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w154',
    MEDIUM: 'w342',
    LARGE: 'w500',
  },
  BACKDROP: {
    MEDIUM: 'w780',
    LARGE: 'w1280',
  },
};

// Константы для интерфейса
export const UI = {
  MOVIES_PER_PAGE: 20,
  CAST_TO_SHOW: 10,
  MAX_VISIBLE_GENRES: 5,
  MAX_TRAILERS: 5,
};

// Типы видео
export const VIDEO_TYPES = {
  TRAILER: 'Trailer',
  TEASER: 'Teaser',
};

// Платформы видео
export const VIDEO_SITES = {
  YOUTUBE: 'YouTube',
};

// Названия для localStorage
export const STORAGE_KEYS = {
  FAVORITES: 'movieflix-favorites',
};

// Интервал дебаунсинга для поиска (в мс)
export const SEARCH_DEBOUNCE_INTERVAL = 400;

// Пути для роутинга
export const ROUTES = {
  HOME: '/',
  MOVIE: (id: number | string) => `/movie/${id}`,
  SEARCH: '/search',
  FAVORITES: '/favorites',
};