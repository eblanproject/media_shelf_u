"use client";

import { useCallback, useMemo, useState } from "react";
import type { Genre, GenreFilter } from "@/types/movie";
import { ALL_GENRES_OPTION, getGenreOptions } from "./genres";

type UseGenreFilterOptions = {
    initialGenre?: GenreFilter;
    /** Жанры конкретного фильма — тогда список сузится только до них */
    availableGenres?: Genre[];
};

export function useGenreFilter({
                                   initialGenre = ALL_GENRES_OPTION,
                                   availableGenres,
                               }: UseGenreFilterOptions = {}) {
    const [selectedGenre, setSelectedGenre] = useState<GenreFilter>(initialGenre);

    const genres = useMemo(
        () => getGenreOptions(availableGenres),
        [availableGenres],
    );

    const resetGenre = useCallback(
        () => setSelectedGenre(ALL_GENRES_OPTION),
        [],
    );

    return { genres, selectedGenre, setSelectedGenre, resetGenre };
}