import { MovieListResponse } from '@/types/movie';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovies(
  page: number = 1,
  searchQuery?: string,
  genres?: number[]
): Promise<MovieListResponse> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY || '',
    language: 'ru-RU',
    page: page.toString(),
  });

  if (searchQuery) {
    params.append('query', searchQuery);
  }

  if (genres && genres.length > 0) {
    params.append('with_genres', genres.join(','));
  }

  const endpoint = searchQuery
    ? `${TMDB_BASE_URL}/search/movie`
    : `${TMDB_BASE_URL}/movie/popular`;

  const response = await fetch(`${endpoint}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch movies');
  }

  return response.json();
} 