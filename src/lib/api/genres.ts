interface Genre {
  id: number;
  name: string;
}

interface GenreResponse {
  genres: Genre[];
}

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchGenres(): Promise<Genre[]> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY || '',
    language: 'ru-RU',
  });

  const response = await fetch(
    `${TMDB_BASE_URL}/genre/movie/list?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch genres');
  }

  const data: GenreResponse = await response.json();
  return data.genres;
} 