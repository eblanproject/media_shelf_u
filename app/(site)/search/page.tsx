import type { Metadata } from "next";
import MovieCard from "@/components/movies/MovieCard";
import SearchForm from "@/components/search/SearchForm";
import { searchMedia } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { SearchResult } from "@/types/media";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 200);

  let results: SearchResult[] = [];
  let error: string | null = null;

  if (query) {
    try {
      results = await searchMedia(query);
    } catch (e) {
      error = errorMessage(e, "Search is unavailable right now. Try again later.");
    }
  }

  const movies = results.filter((item) => item.type === "movie");
  const series = results.filter((item) => item.type === "tv");

  return (
    <section className="mx-auto w-full max-w-7xl py-10">
      <SearchForm key={query} initialQuery={query} />

      <div className="px-4 sm:px-6">
        {!query ? (
          <p className="mt-10 text-center text-gray-400">Type a movie or series title to start searching.</p>
        ) : error ? (
          <p className="mt-10 text-center text-sm text-red-400">{error}</p>
        ) : results.length === 0 ? (
          <p className="mt-10 text-center text-gray-400">
            Nothing found for <span className="text-white">“{query}”</span>.
          </p>
        ) : (
          <>
            <h1 className="mt-10 text-center text-lg font-bold text-gray-400">
              Results for <span className="text-white">“{query}”</span> · {results.length}
            </h1>

            {movies.length > 0 && <ResultSection title="Movies" items={movies} />}
            {series.length > 0 && <ResultSection title="TV series" items={series} />}
          </>
        )}
      </div>
    </section>
  );
}

function ResultSection({ title, items }: { title: string; items: SearchResult[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {items.map((item) => (
          <MovieCard
            key={`${item.type}-${item.id}`}
            movie={item}
            href={item.type === "tv" ? `/tv/${item.id}` : `/movies/${item.id}`}
            badge={item.type === "tv" ? "TV" : undefined}
          />
        ))}
      </div>
    </section>
  );
}
