"use client";

import { useFavorites } from "@/hooks/useFavorites";

type FavoriteButtonProps = {
  movieId: number;
  className?: string;
};

export default function FavoriteButton({ movieId, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(movieId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(movieId)}
      aria-pressed={saved}
      className={`rounded-xl border px-6 py-4 cursor-pointer transition hover:scale-105 ${
        saved
          ? "border-yellow-300 bg-yellow-300/10 text-yellow-200 hover:bg-yellow-300/20"
          : "border-gray-500 bg-black/30 hover:bg-white/10"
      } ${className}`}
    >
      {saved ? "★ Saved" : "Save"}
    </button>
  );
}
