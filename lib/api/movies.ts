import { apiFetch } from "@/lib/api/client";
import type { Movie } from "@/types/movie";

export function getMovies() {
  return apiFetch<Movie[]>("/api/movies");
}

export function getMovieById(id: string) {
  return apiFetch<Movie>(`/api/movies/${id}`);
}
