import Link from "next/link";
import { Suspense } from "react";
import { MovieGridSkeleton } from "@/components/movies/MovieGrid";
import PaginatedMovieGrid from "@/components/movies/PaginatedMovieGrid";
import { getMovieGenres, getMovies } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { MediaGenre, MediaListItem, MovieCategory } from "@/types/media";

// Данные берутся с бэкенда при каждом запросе, а не при сборке
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

const CATEGORIES: { value: MovieCategory; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "now_playing", label: "Now playing" },
  { value: "top_rated", label: "Top rated" },
  { value: "upcoming", label: "Upcoming" },
];

type MoviesPageProps = {
  searchParams: Promise<{ category?: string; genre?: string }>;
};

function catalogHref(category: MovieCategory, genre: number | null) {
  return `/movies?category=${category}${genre ? `&genre=${genre}` : ""}`;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const { category: rawCategory, genre: rawGenre } = await searchParams;
  const current = CATEGORIES.find((c) => c.value === rawCategory) ?? CATEGORIES[0];

  // Пока бэкенд не отдаёт список жанров — фильтр просто не показываем
  let genres: MediaGenre[] = [];
  try {
    genres = await getMovieGenres();
  } catch {
    genres = [];
  }
  const genre = genres.find((g) => String(g.id) === rawGenre) ?? null;
  const genreId = genre?.id ?? null;
  const title = `${genre ? `${genre.name} · ` : ""}${current.label} movies`;

  return (
    <section className="mx-auto w-full max-w-7xl py-10">
      <nav className="flex flex-wrap justify-center gap-2 px-4 text-sm" aria-label="Category">
        {CATEGORIES.map((category) => (
          <Link
            key={category.value}
            href={catalogHref(category.value, genreId)}
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

      {genres.length > 0 && (
        <nav
          aria-label="Genre"
          className="mt-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-1 text-xs sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          {[{ id: 0, name: "All genres" }, ...genres].map((g) => {
            const active = (g.id || null) === genreId;
            return (
              <Link
                key={g.id}
                href={catalogHref(current.value, g.id || null)}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-full border px-3 py-1.5 transition ${
                  active
                    ? "border-yellow-300 text-yellow-200"
                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
              >
                {g.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* key — чтобы при смене категории или жанра снова показывался скелетон и сбрасывалась подгрузка */}
      <Suspense key={`${current.value}-${genreId}`} fallback={<MovieGridSkeleton title={title} />}>
        <CategoryMovies category={current.value} genre={genreId} title={title} />
      </Suspense>
    </section>
  );
}

async function CategoryMovies({ category, genre, title }: { category: MovieCategory; genre: number | null; title: string }) {
  let movies: MediaListItem[] = [];
  let error: string | null = null;

  try {
    movies = await getMovies(category, PAGE_SIZE, { genre });
  } catch (e) {
    error = errorMessage(e, "Could not load movies. Try again later.");
  }

  return (
    <PaginatedMovieGrid
      title={title}
      initialMovies={movies}
      error={error}
      query={{ category, count: PAGE_SIZE, genre }}
    />
  );
}
