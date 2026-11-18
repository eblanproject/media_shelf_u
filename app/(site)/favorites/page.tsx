"use client";

import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { useFavoriteMovies } from "@/hooks/useFavoriteMovies";
import WatchlistItemSkeleton, { WatchlistSkeleton } from "@/components/movies/WatchlistItemSkeleton";

export default function FavoritesPage() {
  const { user, loaded, favoriteIds, toggleFavorite } = useFavorites();
  const { movies, failed } = useFavoriteMovies(favoriteIds);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-center">Watchlist</h1>

      {user === null && (
        <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-4 rounded-lg border border-gray-700 bg-gray-900 p-5 text-center sm:flex-row sm:text-left">
          <p className="flex-1 text-sm text-gray-300">
            Your watchlist is saved on this device only. Sign in or create an account to keep it everywhere —
            movies saved here will move to your account.
          </p>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/auth/signin"
              className="rounded-md bg-yellow-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-200"
            >
              Sign in
            </Link>
            <Link
              href="/auth/registration"
              className="rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            >
              Create account
            </Link>
          </div>
        </div>
      )}

      {!loaded ? (
        <WatchlistSkeleton />
      ) : favoriteIds.length === 0 ? (
        <p className="mt-6 text-center text-gray-400">
          Your watchlist is empty. Press <span className="text-yellow-200">Save</span> on any movie to add it here.
        </p>
      ) : (
        <div className="mt-6 flex w-full flex-col gap-4 rounded-lg border border-gray-700 bg-gray-900 p-6">
          {favoriteIds.map((id) => {
            const movie = movies[id];

            if (!movie) {
              return failed.includes(id) ? (
                <div key={id} className="flex h-30 items-center text-sm text-gray-500">
                  Could not load this movie.
                </div>
              ) : (
                <WatchlistItemSkeleton key={id} />
              );
            }

            const year = movie.release_date?.slice(0, 4);
            const genres = movie.genres.slice(0, 3).map((genre) => genre.name).join(", ");

            return (
              <div key={id} className="flex w-full items-center gap-4">
                <Link
                  href={`/movies/${movie.id}`}
                  className="h-30 w-20 shrink-0 rounded-xl bg-gray-700 bg-cover bg-center transition hover:brightness-75"
                  style={movie.thumbnail ? { backgroundImage: `url(${movie.thumbnail})` } : undefined}
                  aria-label={movie.title}
                />

                <div className="flex flex-1 flex-col gap-2">
                  <Link href={`/movies/${movie.id}`} className="text-xl font-bold hover:text-yellow-200">
                    {movie.title}
                  </Link>
                  <p className="text-gray-400">{[year, genres].filter(Boolean).join(" · ")}</p>
                </div>

                {movie.rating ? (
                  <p className="text-xl text-gray-500">{movie.rating.toFixed(1)}</p>
                ) : null}

                <button
                  type="button"
                  onClick={() => toggleFavorite(id)}
                  aria-label={`Remove ${movie.title} from watchlist`}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-700 text-gray-400 transition hover:bg-white/10 hover:text-yellow-200"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
