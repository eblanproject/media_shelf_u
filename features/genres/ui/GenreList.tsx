import type { GenreFilter } from "@/types/movie";
import GenreBadge from "./GenreBadge";

type GenreListProps = {
    genres: GenreFilter[];
    selectedGenre: GenreFilter;
    onSelect: (genre: GenreFilter) => void;
    className?: string;
};

export default function GenreList({
                                      genres,
                                      selectedGenre,
                                      onSelect,
                                      className = "",
                                  }: GenreListProps) {
    return (
        <div
            className={`flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto pb-1 text-xs sm:flex-wrap sm:overflow-visible sm:pb-0 ${className}`}
        >
            {genres.map((genre) => (
                <GenreBadge
                    key={genre}
                    genre={genre}
                    isActive={genre === selectedGenre}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
}