import Link from "next/link";
import type { MediaListItem } from "@/types/media";

type MovieCardProps = {
  movie: MediaListItem;
  /** По умолчанию — страница фильма. Для сериалов передать `/tv/{id}` */
  href?: string;
  /** Подпись над названием, например «TV» */
  badge?: string;
};

export default function MovieCard({ movie, href = `/movies/${movie.id}`, badge }: MovieCardProps) {
  return (
    <Link
      href={href}
      className="flex w-full max-w-[11rem] flex-col items-center gap-2 transition hover:scale-105"
    >
      <div
        className="relative w-full aspect-[2/3] rounded-md bg-gray-700 bg-cover bg-center transition hover:brightness-75"
        style={movie.thumbnail ? { backgroundImage: `url(${movie.thumbnail})` } : undefined}
        role="img"
        aria-label={movie.title}
      >
        {badge && (
          <span className="absolute top-2 left-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-yellow-200">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-center text-sm text-gray-400">{movie.title}</h3>
    </Link>
  );
}
