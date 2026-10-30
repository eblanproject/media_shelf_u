import MovieCard from "@/components/movies/MovieCard";
import type { MediaListItem } from "@/types/media";

type SimilarMoviesProps = {
  movies: MediaListItem[];
};

export default function SimilarMovies({ movies }: SimilarMoviesProps) {
  if (movies.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold">Similar movies</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
