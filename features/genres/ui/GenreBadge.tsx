import type { GenreFilter } from "@/types/movie";

type GenreBadgeProps = {
    genre: GenreFilter;
    isActive?: boolean;
    onSelect?: (genre: GenreFilter) => void;
};

export default function GenreBadge({
                                       genre,
                                       isActive = false,
                                       onSelect,
                                   }: GenreBadgeProps) {
    return (
        <button
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect?.(genre)}
            className={`shrink-0 cursor-pointer rounded-md px-3 py-2 transition hover:scale-105 hover:bg-yellow-300 hover:text-black ${
                isActive
                    ? "bg-yellow-300 text-black"
                    : "bg-black/50 text-gray-200"
            }`}
        >
            {genre}
        </button>
    );
}