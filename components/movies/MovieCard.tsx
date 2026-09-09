import Link from "next/link";
import type { Movie } from "@/types/movie";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <article>
      <Link href={`/movies/${movie.id}`}>
        {movie.posterUrl ? <img src={movie.posterUrl} alt={movie.title} /> : <div />}
        <h2>{movie.title}</h2>
      </Link>
    </article>
  );
}
