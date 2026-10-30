import type { GenreFilter } from "@/types/movie";
import { MovieToolbar } from "@/widgets/movie-toolbar";

type TeaserMovieProps = {
    title: string;
    director: string;
    year: number;
    durationMin: number;
    description: string;
    posterUrl: string;
    genres: GenreFilter[];
    selectedGenre: GenreFilter;
    onSelectGenre: (genre: GenreFilter) => void;
    query: string;
    onQueryChange: (value: string) => void;
};

export default function TeaserMovie({
                                        title,
                                        director,
                                        year,
                                        durationMin,
                                        description,
                                        posterUrl,
                                        genres,
                                        selectedGenre,
                                        onSelectGenre,
                                        query,
                                        onQueryChange,
                                    }: TeaserMovieProps) {
    return (
        <div className="flex w-full flex-col">
            <div
                className="relative flex min-h-[480px] w-full overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${posterUrl})` }}
            >
                <div className="absolute inset-0 bg-black/65" />

                <div className="relative z-10 flex w-full flex-col gap-5 p-7 text-white">
                    <h6 className="text-xs font-bold text-yellow-200">Featured Movie</h6>

                    <h1 className="pb-3 text-4xl font-bold">{title}</h1>

                    <p className="text-gray-300">
                        dir. {director} · {year} · {durationMin} min
                    </p>

                    <p className="max-w-xl text-gray-300">{description}</p>

                    <div className="mt-10 flex items-center gap-3 text-sm">
                        <button className="cursor-pointer rounded-xl bg-yellow-300 px-5 py-4 text-black transition hover:scale-105 hover:bg-yellow-200">
                            View details
                        </button>

                        <button className="cursor-pointer rounded-xl border border-gray-500 bg-black/30 px-6 py-4 transition hover:scale-105 hover:bg-white/10">
                            Save
                        </button>
                    </div>

                    <MovieToolbar
                        genres={genres}
                        selectedGenre={selectedGenre}
                        onSelectGenre={onSelectGenre}
                        query={query}
                        onQueryChange={onQueryChange}
                    />
                </div>
            </div>
        </div>
    );
}