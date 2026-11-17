"use client";

import { useEffect, useState } from "react";
import { getMovieById } from "@/lib/api/movies";
import type { MovieDetails } from "@/types/media";

/** Догружает подробности фильмов из избранного. Уже загруженные и упавшие повторно не запрашиваются. */
export function useFavoriteMovies(favoriteIds: number[]) {
  const [movies, setMovies] = useState<Record<number, MovieDetails>>({});
  const [failed, setFailed] = useState<number[]>([]);

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

  /** Все фильмы либо загружены, либо не смогли загрузиться */
  const settled = favoriteIds.every((id) => movies[id] || failed.includes(id));

  return { movies, failed, settled };
}
