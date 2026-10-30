import Link from "next/link";
import type { MediaListItem } from "@/types/media";

type MovieCardProps = {
  movie: MediaListItem;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="flex w-full max-w-[11rem] flex-col items-center gap-2 transition hover:scale-105"
    >
      <div
        className="w-full aspect-[2/3] rounded-md bg-gray-700 bg-cover bg-center transition hover:brightness-75"
        style={movie.thumbnail ? { backgroundImage: `url(${movie.thumbnail})` } : undefined}
        role="img"
        aria-label={movie.title}
      />
      <h3 className="text-center text-sm text-gray-400">{movie.title}</h3>
    </Link>
  );
}
