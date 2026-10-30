import type { Genre } from "@/types/movie";
import {useEffect, useRef, useState} from "react";

type GenreBadgeProps = {
  genre: Genre;
};

export default function GenreBadge({ genre }: GenreBadgeProps) {

    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    useEffect(() => {
        if (isMobileSearchOpen) {
            mobileSearchInputRef.current?.focus();
        }
    }, [isMobileSearchOpen]);

    const genres = [
        "All",
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


    return <span>
        <div className="mt-auto">
                        <div
                            className={`${isMobileSearchOpen ? "hidden sm:flex" : "flex"} items-center gap-3 sm:justify-between sm:gap-5`}
                        >
                            <div className="flex min-w-0 flex-1 flex-nowrap gap-2 overflow-x-auto pb-1 text-xs sm:flex-wrap sm:overflow-visible sm:pb-0">
                                {genres.map((genre) => (
                                    <button
                                        key={genre}
                                        className="shrink-0 rounded-md cursor-pointer bg-black/50 px-3 py-2 text-gray-200 transition hover:scale-105 hover:bg-yellow-300 hover:text-black"
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                        </div>
        </div>
    </span>;
}
