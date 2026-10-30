import type { Genre, GenreFilter } from "@/types/movie";

export const ALL_GENRES_OPTION = "All" as const;

export const ALL_GENRES: Genre[] = [
    "Horror",
    "Fantasy",
    "Action",
    "Comedy",
    "Drama",
    "Romance",
    "Thriller",
    "Sci-Fi",
    "Documentary",
];

/**
 * Если передан список жанров конкретного фильма — вернём только их.
 * Если нет (главная страница) — вернём все жанры.
 */
export function getGenreOptions(availableGenres?: Genre[]): GenreFilter[] {
    const source =
        availableGenres && availableGenres.length > 0 ? availableGenres : ALL_GENRES;

    return [ALL_GENRES_OPTION, ...source];
}