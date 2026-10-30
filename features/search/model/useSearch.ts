"use client";

import { useCallback, useEffect, useState } from "react";

type UseSearchOptions = {
    initialQuery?: string;
    /** Задержка перед тем, как значение попадёт в debouncedQuery (мс) */
    delay?: number;
};

export function useSearch({
                              initialQuery = "",
                              delay = 300,
                          }: UseSearchOptions = {}) {
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery.trim());

    useEffect(() => {
        const timeoutId = setTimeout(
            () => setDebouncedQuery(query.trim()),
            delay,
        );

        return () => clearTimeout(timeoutId);
    }, [query, delay]);

    const clearQuery = useCallback(() => setQuery(""), []);

    return { query, setQuery, debouncedQuery, clearQuery };
}