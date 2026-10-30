import MovieGrid from "@/components/movies/MovieGrid";
import { getMovies } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { MediaListItem } from "@/types/media";

// Данные берутся с бэкенда при каждом запросе, а не при сборке
export const dynamic = "force-dynamic";

export default async function MoviesPage() {
  let movies: MediaListItem[] = [];
  let error: string | null = null;

  try {
    movies = await getMovies("popular", 20);
  } catch (e) {
    error = errorMessage(e, "Could not load movies. Try again later.");
  }

  return (
    <section className="mx-auto w-full max-w-7xl py-10">
      <MovieGrid title="Popular movies" movies={movies} error={error} />
    </section>
  );
}
