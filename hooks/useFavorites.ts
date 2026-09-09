"use client";

import { useCallback, useState } from "react";

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const toggleFavorite = useCallback((movieId: string) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(movieId)
        ? currentIds.filter((id) => id !== movieId)
        : [...currentIds, movieId],
    );
  }, []);

  const isFavorite = useCallback(
    (movieId: string) => favoriteIds.includes(movieId),
    [favoriteIds],
  );

  return { favoriteIds, isFavorite, toggleFavorite };
}
