import { apiFetch } from "@/lib/api/client";
import type {
  MediaGenre,
  MediaListItem,
  MovieCategory,
  MovieDetails,
  PersonDetails,
  SearchResult,
  TvCategory,
  TvDetails,
} from "@/types/media";

// Фильмы
export type MoviesQuery = {
  category?: MovieCategory;
  count?: number;
  /** Номер страницы с 1. Контракт: docs/backend/catalog.md */
  page?: number;
  /** id жанра TMDB */
  genre?: number | null;
};

export function moviesUrl({ category = "popular", count = 20, page = 1, genre }: MoviesQuery = {}) {
  const params = new URLSearchParams({ category, count: String(count) });
  if (page > 1) params.set("page", String(page));
  if (genre) params.set("genre", String(genre));
  return `/api/movies?${params}`;
}

export function getMovies(category: MovieCategory = "popular", count = 20, options: Omit<MoviesQuery, "category" | "count"> = {}) {
  return apiFetch<MediaListItem[]>(moviesUrl({ category, count, ...options }));
}

/** Список жанров фильмов. Контракт: docs/backend/catalog.md */
export function getMovieGenres() {
  return apiFetch<MediaGenre[]>("/api/genres/movie");
}

export function getMovieById(id: string | number) {
  return apiFetch<MovieDetails>(`/api/movies/${id}`);
}

export function getSimilarMovies(id: string | number, count = 10) {
  return apiFetch<MediaListItem[]>(`/api/movies/${id}/similar?count=${count}`);
}

// Сериалы (бэкенд отдаёт не больше 20)
export function getTvSeries(category: TvCategory = "popular", count = 20) {
  return apiFetch<MediaListItem[]>(`/api/tv?category=${category}&count=${count}`);
}

export function getTvById(id: string | number) {
  return apiFetch<TvDetails>(`/api/tv/${id}`);
}

// Поиск по фильмам и сериалам
export function searchMedia(query: string) {
  return apiFetch<SearchResult[]>(`/api/search?query=${encodeURIComponent(query)}`);
}

// Люди: актёры, режиссёры (контракт: docs/backend/people.md)
export function getPerson(id: string | number) {
  return apiFetch<PersonDetails>(`/api/people/${id}`);
}
