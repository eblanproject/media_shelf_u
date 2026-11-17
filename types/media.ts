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

/** Человек из съёмочной группы (режиссёр). Контракт: docs/backend/people.md */
export type CrewMember = {
    id: number;
    name: string;
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
    /** Пока бэкенд не отдаёт — поле необязательное */
    directors?: CrewMember[];
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

/** GET /api/search?query=... — для людей thumbnail это фото */
export type SearchResult = MediaListItem & {
    type: "movie" | "tv" | "person";
    /** Только для людей: "Acting", "Directing", ... */
    known_for_department?: string | null;
};

/** Фильм или сериал в фильмографии человека */
export type PersonCredit = {
    id: number;
    title: string;
    thumbnail: string | null;
    type: "movie" | "tv";
    /** Год выхода, null — неизвестен или ещё не вышел */
    year: number | null;
    rating: number | null;
    /** Для ролей — персонаж */
    character?: string | null;
    /** Для работы в группе — должность: "Director", "Screenplay", ... */
    job?: string | null;
};

/** GET /api/people/{id} — краткая справка о человеке */
export type PersonDetails = {
    id: number;
    name: string;
    profile: string | null;
    biography: string | null;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    known_for_department: string | null;
    credits: {
        cast: PersonCredit[];
        crew: PersonCredit[];
    };
};

/** Категории TMDB, которые принимает параметр ?category= */
export type MovieCategory = "popular" | "top_rated" | "now_playing" | "upcoming";
export type TvCategory = "popular" | "top_rated" | "on_the_air" | "airing_today";
