"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SearchFormProps = {
  initialQuery?: string;
};

/** Поле поиска на странице /search: Enter или кнопка — новый поиск */
export default function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const q = query.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="mx-auto flex w-full max-w-xl gap-2 px-4"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies and TV series..."
        aria-label="Search movies and TV series"
        className="flex-1 rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-white outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-yellow-300"
      />
      <button
        type="submit"
        className="cursor-pointer rounded-xl bg-yellow-300 px-5 py-3 text-sm text-black transition hover:bg-yellow-200"
      >
        Search
      </button>
    </form>
  );
}
