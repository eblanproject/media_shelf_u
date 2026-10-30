"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getMovieById } from "@/lib/api/movies";
import type { MovieDetails } from "@/types/media";

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [movies, setMovies] = useState<Record<number, MovieDetails>>({});
  const [failed, setFailed] = useState<number[]>([]);

  // Догружаем данные для фильмов из избранного, которых ещё нет
  useEffect(() => {
    const missing = favoriteIds.filter((id) => !movies[id] && !failed.includes(id));
    if (missing.length === 0) return;

    let cancelled = false;
    Promise.allSettled(missing.map((id) => getMovieById(id))).then((results) => {
      if (cancelled) return;
      const loaded: Record<number, MovieDetails> = {};
      const errors: number[] = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled") loaded[missing[i]] = result.value;
        else errors.push(missing[i]);
      });
      setMovies((prev) => ({ ...prev, ...loaded }));
      if (errors.length) setFailed((prev) => [...prev, ...errors]);
    });

    return () => {
      cancelled = true;
    };
  }, [favoriteIds, movies, failed]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold text-center">Watchlist</h1>

      {favoriteIds.length === 0 ? (
        <p className="mt-6 text-center text-gray-400">
          Your watchlist is empty. Press <span className="text-yellow-200">Save</span> on any movie to add it here.
        </p>
      ) : (
        <div className="mt-6 flex w-full flex-col gap-4 rounded-lg border border-gray-700 bg-gray-900 p-6">
          {favoriteIds.map((id) => {
            const movie = movies[id];

            if (!movie) {
              return (
                <div key={id} className="flex h-30 items-center text-sm text-gray-500">
                  {failed.includes(id) ? "Could not load this movie." : "Loading…"}
                </div>
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
