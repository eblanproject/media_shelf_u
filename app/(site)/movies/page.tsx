import Link from "next/link";
import { Suspense } from "react";
import MovieGrid, { MovieGridSkeleton } from "@/components/movies/MovieGrid";
import { getMovies } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { MediaListItem, MovieCategory } from "@/types/media";

// Данные берутся с бэкенда при каждом запросе, а не при сборке
export const dynamic = "force-dynamic";

const CATEGORIES: { value: MovieCategory; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "now_playing", label: "Now playing" },
  { value: "top_rated", label: "Top rated" },
  { value: "upcoming", label: "Upcoming" },
];

type MoviesPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { category: rawCategory } = await searchParams;
  const current = CATEGORIES.find((c) => c.value === rawCategory) ?? CATEGORIES[0];

  return (
    <section className="mx-auto w-full max-w-7xl py-10">
      <nav className="flex flex-wrap justify-center gap-2 px-4 text-sm">
        {CATEGORIES.map((category) => (
          <Link
            key={category.value}
            href={`/movies?category=${category.value}`}
            className={`rounded-md px-3 py-2 transition hover:scale-105 ${
              category.value === current.value
                ? "bg-yellow-300 text-black"
                : "bg-black/50 text-gray-200 hover:bg-yellow-300 hover:text-black"
            }`}
          >
            {category.label}
          </Link>
        ))}
      </nav>

      {/* key — чтобы при смене категории снова показывался скелетон */}
      <Suspense key={current.value} fallback={<MovieGridSkeleton title={`${current.label} movies`} />}>
        <CategoryMovies category={current.value} title={`${current.label} movies`} />
      </Suspense>
    </section>
  );
}

async function CategoryMovies({ category, title }: { category: MovieCategory; title: string }) {
  let movies: MediaListItem[] = [];
  let error: string | null = null;

  try {
    movies = await getMovies(category, 20);
  } catch (e) {
    error = errorMessage(e, "Could not load movies. Try again later.");
  }

  return <MovieGrid title={title} movies={movies} error={error} />;
}
