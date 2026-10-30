import { apiFetch } from "@/lib/api/client";
import type {
  MediaListItem,
  MovieCategory,
  MovieDetails,
  SearchResult,
  TvCategory,
  TvDetails,
} from "@/types/media";

// Фильмы
export function getMovies(category: MovieCategory = "popular", count = 20) {
  return apiFetch<MediaListItem[]>(`/api/movies?category=${category}&count=${count}`);
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
