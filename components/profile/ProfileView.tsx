"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import MovieCard from "@/components/movies/MovieCard";
import MovieCardSkeleton from "@/components/movies/MovieCardSkeleton";
import ProfileInfo from "@/components/profile/ProfileInfo";
import Skeleton from "@/components/ui/Skeleton";
import { useFavoriteMovies } from "@/hooks/useFavoriteMovies";
import { useFavorites } from "@/hooks/useFavorites";
import type { MovieDetails } from "@/types/media";
import type { UserProfile } from "@/types/user";

const PREVIEW_COUNT = 8;

type ProfileViewProps = {
  user: UserProfile;
};

export default function ProfileView({ user }: ProfileViewProps) {
  const { loaded, favoriteIds } = useFavorites();
  const { movies, settled } = useFavoriteMovies(favoriteIds);

  const ready = loaded && settled;
  // Порядок favoriteIds — от последних добавленных к первым
  const saved = useMemo(
    () => favoriteIds.map((id) => movies[id]).filter((movie): movie is MovieDetails => Boolean(movie)),
    [favoriteIds, movies],
  );
  const stats = useMemo(() => computeStats(saved), [saved]);

  return (
    <>
      <ProfileInfo user={user} backdrop={saved[0]?.thumbnail} />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10">
        {/* Статистика */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Saved movies" value={ready ? String(favoriteIds.length) : null} />
          <StatCard
            label="Hours of cinema"
            value={ready ? (stats.minutes ? `${Math.round(stats.minutes / 6) / 10} h` : "—") : null}
          />
          <StatCard
            label="Average rating"
            value={ready ? (stats.avgRating ? `★ ${stats.avgRating.toFixed(1)}` : "—") : null}
            accent
          />
          <StatCard label="Favorite genre" value={ready ? (stats.genres[0]?.name ?? "—") : null} />
        </section>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* Watchlist */}
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h6 className="text-xs font-bold text-yellow-200">Recently saved</h6>
                <h2 className="text-2xl font-bold">Your watchlist</h2>
              </div>
              {ready && favoriteIds.length > 0 && (
                <Link href="/favorites" className="text-sm text-gray-400 transition hover:text-yellow-200">
                  Manage all ({favoriteIds.length}) →
                </Link>
              )}
            </div>

            {!ready ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <MovieCardSkeleton key={i} />
                ))}
              </div>
            ) : saved.length === 0 ? (
              <EmptyWatchlist />
            ) : (
              <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
                {saved.slice(0, PREVIEW_COUNT).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </section>

          {/* Боковая колонка */}
          <aside className="flex flex-col gap-6">
            <Panel label="Your taste" title="Top genres">
              {!ready ? (
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : stats.genres.length === 0 ? (
                <p className="text-sm text-gray-400">Save a few movies and your favorite genres will show up here.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {stats.genres.slice(0, 5).map((genre) => (
                    <li key={genre.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-200">{genre.name}</span>
                        <span className="text-gray-500">{genre.count}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-gray-800">
                        <div
                          className="h-full rounded-full bg-yellow-300"
                          style={{ width: `${(genre.count / stats.genres[0].count) * 100}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel label="Best of your list" title="Highest rated">
              {!ready ? (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="aspect-[2/3] w-10 shrink-0 rounded" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              ) : stats.topRated.length === 0 ? (
                <p className="text-sm text-gray-400">Nothing here yet.</p>
              ) : (
                <ol className="flex flex-col gap-1">
                  {stats.topRated.map((movie, i) => (
                    <li key={movie.id}>
                      <Link
                        href={`/movies/${movie.id}`}
                        className="-mx-2 flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/10"
                      >
                        <span className="w-4 text-sm font-bold text-gray-600">{i + 1}</span>
                        <div
                          className="aspect-[2/3] w-10 shrink-0 rounded bg-gray-700 bg-cover bg-center"
                          style={movie.thumbnail ? { backgroundImage: `url(${movie.thumbnail})` } : undefined}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-100">{movie.title}</span>
                        <span className="text-sm text-yellow-300">★ {movie.rating?.toFixed(1)}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </>
  );
}

function computeStats(saved: MovieDetails[]) {
  const minutes = saved.reduce((sum, movie) => sum + (movie.runtime ?? 0), 0);

  const rated = saved.filter((movie) => movie.rating);
  const avgRating = rated.length ? rated.reduce((sum, movie) => sum + (movie.rating ?? 0), 0) / rated.length : null;

  const genreCounts = new Map<string, number>();
  saved.forEach((movie) =>
    movie.genres.forEach((genre) => genreCounts.set(genre.name, (genreCounts.get(genre.name) ?? 0) + 1)),
  );
  const genres = [...genreCounts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const topRated = [...rated].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 3);

  return { minutes, avgRating, genres, topRated };
}

function StatCard({ label, value, accent }: { label: string; value: string | null; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">{label}</span>
      {value === null ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <span className={`truncate text-2xl font-bold sm:text-3xl ${accent ? "text-yellow-300" : "text-white"}`}>
          {value}
        </span>
      )}
    </div>
  );
}

function Panel({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <h6 className="text-xs font-bold text-yellow-200">{label}</h6>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function EmptyWatchlist() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-700 px-6 py-14 text-center">
      <p className="text-lg font-bold">Your watchlist is empty</p>
      <p className="max-w-sm text-sm text-gray-400">
        Press <span className="text-yellow-200">Save</span> on any movie and it will appear here.
      </p>
      <Link
        href="/movies"
        className="rounded-xl bg-yellow-300 px-5 py-3 text-sm text-black transition hover:scale-105 hover:bg-yellow-200"
      >
        Browse movies
      </Link>
    </div>
  );
}
