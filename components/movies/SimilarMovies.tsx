import MovieCard from "@/components/movies/MovieCard";
import type { Movie } from "@/types/movie";

type SimilarMoviesProps = {
  movies: Movie[];
};

export default function SimilarMovies({ movies }: SimilarMoviesProps) {
  return (
    <section>
      <h2>Similar movies</h2>
      <div>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
