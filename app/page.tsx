import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TeaserMovie from "@/components/movies/TeaserMovie";
import MovieGrid from "@/components/movies/MovieGrid";
import { getMovies } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";
import type { MediaListItem } from "@/types/media";

// Данные берутся с бэкенда при каждом запросе, а не при сборке
export const dynamic = "force-dynamic";



export default async function Home() {
    let movies: MediaListItem[] = [];
    let error: string | null = null;

    try {
        movies = await getMovies("popular", 20);
    } catch (e) {
        error = errorMessage(e, "Could not load movies. Try again later.");
    }

    //
    // const { genres, selectedGenre, setSelectedGenre } = useGenreFilter();
    // const { query, setQuery, debouncedQuery } = useSearch();
    //
    // const featured = MOCK_MOVIES[0];
    // const visibleMovies = filterMovies(MOCK_MOVIES, {
    //     genre: selectedGenre,
    //     query: debouncedQuery,
    // });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">


        <Header/>

        <TeaserMovie
            // title={featured.title}
            // director={featured.director}
            // year={featured.year}
            // durationMin={featured.durationMin}
            // description={featured.description}
            // posterUrl={featured.posterUrl}
            // genres={genres}
            // selectedGenre={selectedGenre}
            // onSelectGenre={setSelectedGenre}
            // query={query}
            // onQueryChange={setQuery}

        />

        {/*<section className="p-7">*/}
        {/*    {visibleMovies.map((movie) => (*/}
        {/*        <p key={movie.id}>{movie.title}</p>*/}
        {/*    ))}*/}
        {/*</section>*/}

        <main className="flex w-full flex-1">

            <MovieGrid movies={movies} error={error} />

      </main>
        <Footer />
    </div>
  );
}
