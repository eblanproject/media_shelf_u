// Типы ответов бэкенда (FastAPI, ветка feat/backend).
// Если бэкенд поменяет формат ответа — править здесь.

/** Элемент списка: GET /api/movies, /api/movies/{id}/similar, /api/tv */
export type MediaListItem = {
    id: number;
    title: string;
    thumbnail: string | null;
};

export type MediaGenre = {
    id: number;
    name: string;
};

export type CastMember = {
    id: number;
    name: string;
    character: string | null;
    profile?: string | null;
};

/** GET /api/movies/{id} */
export type MovieDetails = {
    id: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    rating: number | null;
    release_date: string | null;
    genres: MediaGenre[];
    runtime: number | null;
    cast: CastMember[];
    age_rating: string | null;
};

/** GET /api/tv/{id} */
export type TvDetails = {
    id: number;
    title: string;
    description: string | null;
    thumbnail: string | null;
    rating: number | null;
    first_air_date: string | null;
    genres: MediaGenre[];
    seasons_count: number | null;
    episodes_count: number | null;
    cast: CastMember[];
    age_rating: string | null;
};

/** GET /api/search?query=... */
export type SearchResult = MediaListItem & {
    type: "movie" | "tv";
};

/** Категории TMDB, которые принимает параметр ?category= */
export type MovieCategory = "popular" | "top_rated" | "now_playing" | "upcoming";
export type TvCategory = "popular" | "top_rated" | "on_the_air" | "airing_today";
