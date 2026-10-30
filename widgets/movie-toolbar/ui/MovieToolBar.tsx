"use client";

import type { GenreFilter } from "@/types/movie";
import { GenreList } from "@/features/genres";
import { MobileSearchBar, SearchIcon, SearchInput, useMobileSearch } from "@/features/search";

type MovieToolbarProps = {
    genres: GenreFilter[];
    selectedGenre: GenreFilter;
    onSelectGenre: (genre: GenreFilter) => void;
    query: string;
    onQueryChange: (value: string) => void;
};

export default function MovieToolBar({
                                         genres,
                                         selectedGenre,
                                         onSelectGenre,
                                         query,
                                         onQueryChange,
                                     }: MovieToolbarProps) {
    const mobileSearch = useMobileSearch();

    return (
        <div className="mt-auto">
            <div
                className={`${mobileSearch.isOpen ? "hidden sm:flex" : "flex"} items-center gap-3 sm:justify-between sm:gap-5`}
            >
                <GenreList
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onSelect={onSelectGenre}
                />

                <button
                    type="button"
                    aria-label="Open movie search"
                    onClick={mobileSearch.open}
                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/50 text-gray-300 transition hover:bg-white/10 hover:text-yellow-200 sm:hidden"
                >
                    <SearchIcon />
                </button>

                <SearchInput
                    value={query}
                    onChange={onQueryChange}
                    className="hidden sm:block"
                />
            </div>

            {mobileSearch.isOpen && (
                <MobileSearchBar
                    value={query}
                    onChange={onQueryChange}
                    onClose={mobileSearch.close}
                    inputRef={mobileSearch.inputRef}
                />
            )}
        </div>
    );
}