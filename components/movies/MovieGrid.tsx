import MovieCard from "@/components/movies/MovieCard";
import MovieCardSkeleton from "@/components/movies/MovieCardSkeleton";
import type { MediaListItem } from "@/types/media";

type MovieGridProps = {
    movies: MediaListItem[];
    title?: string;
    error?: string | null;
};

const GRID_CLASS =
    "grid w-full max-w-screen-2xl self-center grid-cols-2 justify-items-center gap-x-4 gap-y-6 mt-4 mb-40 " +
    "sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7";

export default function MovieGrid({ movies, title = "Catalog", error }: MovieGridProps) {
    return (
        <div className="flex w-full flex-col px-4 sm:px-6">
            <h2 className="mt-10 text-center text-lg font-bold text-gray-400">{title}</h2>

            {error ? (
                <p className="mt-6 mb-40 text-center text-sm text-red-400">{error}</p>
            ) : movies.length === 0 ? (
                <p className="mt-6 mb-40 text-center text-sm text-gray-500">No movies found.</p>
            ) : (
                <div className={GRID_CLASS}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
}

/** Заглушка сетки, пока фильмы грузятся */
export function MovieGridSkeleton({ title = "Catalog", count = 14 }: { title?: string; count?: number }) {
    return (
        <div className="flex w-full flex-col px-4 sm:px-6" role="status" aria-label="Loading movies">
            <h2 className="mt-10 text-center text-lg font-bold text-gray-400">{title}</h2>
            <div className={GRID_CLASS}>
                {Array.from({ length: count }, (_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
