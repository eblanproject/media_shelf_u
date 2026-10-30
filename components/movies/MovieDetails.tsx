import type { MovieDetails as MovieDetailsData } from "@/types/media";

type MovieDetailsProps = {
  movie: MovieDetailsData;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const year = movie.release_date?.slice(0, 4);

  return (
    <article className="flex flex-col gap-8 md:flex-row">
      <div
        className="aspect-[2/3] w-full max-w-xs shrink-0 rounded-md bg-gray-700 bg-cover bg-center"
        style={movie.thumbnail ? { backgroundImage: `url(${movie.thumbnail})` } : undefined}
        role="img"
        aria-label={movie.title}
      />

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{movie.title}</h1>

        <p className="flex flex-wrap gap-x-4 text-sm text-gray-400">
          {year && <span>{year}</span>}
          {movie.runtime ? <span>{movie.runtime} min</span> : null}
          {movie.rating ? <span className="text-yellow-300">★ {movie.rating.toFixed(1)}</span> : null}
          {movie.age_rating && <span>{movie.age_rating}+</span>}
        </p>

        {movie.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="rounded-xl border border-gray-700 px-3 py-1 text-xs text-gray-300">
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {movie.description && <p className="max-w-2xl text-gray-300">{movie.description}</p>}

        {movie.cast.length > 0 && (
          <div>
            <h2 className="mb-2 text-lg font-bold">Cast</h2>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
              {movie.cast.map((person) => (
                <li key={person.id}>
                  {person.name}
                  {person.character && <span className="text-gray-600"> — {person.character}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}
