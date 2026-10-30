"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { searchMedia } from "@/lib/api/movies";
import type { SearchResult } from "@/types/media";

type SearchResultsProps = {
  /** Запрос после debounce */
  query: string;
  onSelect?: () => void;
  className?: string;
};

/** Ответ на конкретный запрос: пока он не пришёл для текущего query — показываем «Searching…» */
type Response =
  | { query: string; results: SearchResult[] }
  | { query: string; error: true };

export default function SearchResults({ query, onSelect, className = "" }: SearchResultsProps) {
  const [response, setResponse] = useState<Response | null>(null);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;

    searchMedia(query)
      .then((results) => !cancelled && setResponse({ query, results }))
      .catch(() => !cancelled && setResponse({ query, error: true }));

    return () => {
      cancelled = true;
    };
  }, [query]);

  if (!query) return null;

  const current = response?.query === query ? response : null;
  const results = current && "results" in current ? current.results : null;

  return (
    <div
      className={`absolute top-full right-0 z-30 mt-2 max-h-96 w-full min-w-72 overflow-y-auto rounded-xl border border-gray-700 bg-black/95 p-2 text-sm shadow-2xl ${className}`}
    >
      {!current && <p className="p-3 text-gray-400">Searching…</p>}
      {current && !results && <p className="p-3 text-red-400">Search is unavailable right now.</p>}
      {results && results.length === 0 && (
        <p className="p-3 text-gray-400">Nothing found for “{query}”.</p>
      )}
      {results &&
        results.slice(0, 10).map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={item.type === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`}
            onClick={onSelect}
            onMouseDown={(event) => event.preventDefault()}
            className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/10"
          >
            <div
              className="aspect-[2/3] w-9 shrink-0 rounded bg-gray-700 bg-cover bg-center"
              style={item.thumbnail ? { backgroundImage: `url(${item.thumbnail})` } : undefined}
            />
            <span className="flex-1 text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500">{item.type === "tv" ? "TV" : "Movie"}</span>
          </Link>
        ))}
    </div>
  );
}
