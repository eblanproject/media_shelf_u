export type Genre =
    | "Horror"
    | "Fantasy"
    | "Action"
    | "Comedy"
    | "Drama"
    | "Romance"
    | "Thriller"
    | "Sci-Fi"
    | "Documentary";

/** Жанр + псевдо-значение "All" для фильтра */
export type GenreFilter = Genre | "All";

export type Movie = {
    id: string;
    title: string;
    director: string;
    year: number;
    durationMin: number;
    description: string;
    posterUrl: string;
    genres: Genre[];
};