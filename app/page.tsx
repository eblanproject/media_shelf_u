import { Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TeaserMovie from "@/components/movies/TeaserMovie";
import TeaserMovieSkeleton from "@/components/movies/TeaserMovieSkeleton";
import MovieGrid, { MovieGridSkeleton } from "@/components/movies/MovieGrid";
import { getMovieById, getMovies } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { MediaListItem, MovieDetails } from "@/types/media";

// Данные берутся с бэкенда при каждом запросе, а не при сборке
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Header/>

        {/* Пока бэкенд отвечает — показываем скелетоны баннера и сетки */}
        <Suspense
            fallback={
                <>
                    <TeaserMovieSkeleton />
                    <main className="flex w-full flex-1">
                        <MovieGridSkeleton />
                    </main>
                </>
            }
        >
            <HomeContent />
        </Suspense>

        <Footer />
    </div>
  );
}

async function HomeContent() {
    let movies: MediaListItem[] = [];
    let error: string | null = null;

    try {
        movies = await getMovies("popular", 20);
    } catch (e) {
        error = errorMessage(e, "Could not load movies. Try again later.");
    }

    // Баннер: самый популярный сейчас фильм (первый в списке popular) с подробностями
    let featured: MovieDetails | null = null;

    if (movies.length > 0) {
        try {
            featured = await getMovieById(movies[0].id);
        } catch (e) {
            errorMessage(e, "Could not load featured movie");
        }
    }

    return (
        <>
            <TeaserMovie movie={featured} />

            <main className="flex w-full flex-1">
                <MovieGrid movies={movies} error={error} />
            </main>
        </>
    );
}
