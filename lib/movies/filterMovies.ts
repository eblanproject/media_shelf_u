import type { GenreFilter, Movie } from "@/types/movie";
import { ALL_GENRES_OPTION } from "@/features/genres";

type FilterParams = {
    genre: GenreFilter;
    query: string;
};

export function filterMovies(
    movies: Movie[],
    { genre, query }: FilterParams,
): Movie[] {
    const normalizedQuery = query.trim().toLowerCase();

    return movies.filter((movie) => {
        const matchesGenre =
            genre === ALL_GENRES_OPTION || movie.genres.includes(genre);

        const matchesQuery =
            normalizedQuery.length === 0 ||
            movie.title.toLowerCase().includes(normalizedQuery) ||
            movie.director.toLowerCase().includes(normalizedQuery);

        return matchesGenre && matchesQuery;
    });
}