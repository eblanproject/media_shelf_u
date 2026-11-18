"use client";

import { useState } from "react";
import MovieGrid from "@/components/movies/MovieGrid";
import { apiFetch, errorMessage } from "@/lib/api/client";
import { moviesUrl, type MoviesQuery } from "@/lib/api/movies";
import type { MediaListItem } from "@/types/media";

type PaginatedMovieGridProps = {
  title: string;
  initialMovies: MediaListItem[];
  error: string | null;
  query: Omit<MoviesQuery, "page">;
};

/**
 * Сетка каталога с кнопкой «Show more»: догружает следующие страницы с бэкенда.
 * Конец списка — когда страница пришла неполной или в ней нет новых фильмов
 * (так же ведёт себя бэкенд, который ещё не понимает ?page= и отдаёт первую страницу).
 */
export default function PaginatedMovieGrid({ title, initialMovies, error, query }: PaginatedMovieGridProps) {
  const pageSize = query.count ?? 20;
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [done, setDone] = useState(initialMovies.length < pageSize);

  async function loadMore() {
    setLoading(true);
    setLoadError(null);
    try {
      const next = await apiFetch<MediaListItem[]>(moviesUrl({ ...query, page: page + 1 }));
      const known = new Set(movies.map((m) => m.id));
      const fresh = next.filter((m) => !known.has(m.id));
      setMovies([...movies, ...fresh]);
      setPage(page + 1);
      if (fresh.length === 0 || next.length < pageSize) setDone(true);
    } catch (e) {
      setLoadError(errorMessage(e, "Could not load more movies."));
    } finally {
      setLoading(false);
    }
  }

  const footer =
    error || movies.length === 0 ? null : (
      <div className="mt-10 flex flex-col items-center gap-3">
        {loadError && <p className="text-center text-sm text-red-400">{loadError}</p>}
        {done ? (
          <p className="text-sm text-gray-500">That&apos;s all for now.</p>
        ) : (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="cursor-pointer rounded-xl border border-gray-600 px-6 py-3 text-sm font-semibold transition hover:scale-105 hover:bg-white/10 disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Loading…" : "Show more"}
          </button>
        )}
      </div>
    );

  return <MovieGrid title={title} movies={movies} error={error} footer={footer} />;
}
