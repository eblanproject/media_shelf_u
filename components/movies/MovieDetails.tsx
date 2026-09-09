import GenreBadge from "@/components/movies/GenreBadge";
import type { Movie } from "@/types/movie";

type MovieDetailsProps = {
  movie: Movie;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  return (
    <article>
      <h1>{movie.title}</h1>
      <p>{movie.overview}</p>
      <div>
        {movie.genres.map((genre) => (
          <GenreBadge key={genre} genre={genre} />
        ))}
      </div>
    </article>
  );
}
