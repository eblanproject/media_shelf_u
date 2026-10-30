"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { MovieDetails } from "@/types/media";
import FavoriteButton from "@/components/movies/FavoriteButton";
import SearchResults from "@/components/search/SearchResults";
import { useSearch } from "@/features/search";

type TeaserMovieProps = {
    /** Популярный сейчас фильм с бэкенда. null — бэкенд недоступен, показываем заглушку. */
    movie: MovieDetails | null;
};

const FALLBACK_BACKGROUND =
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80";

export default function TeaserMovie({ movie }: TeaserMovieProps) {
    // Поиск по фильмам и сериалам через бэкенд (GET /api/search)
    const { query: searchQuery, setQuery: setSearchQuery, debouncedQuery, clearQuery } = useSearch();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);

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

    useEffect(() => {
        if (isMobileSearchOpen) {
            mobileSearchInputRef.current?.focus();
        }
    }, [isMobileSearchOpen]);

    return (
        <div className="flex w-screen flex-col">
            <div className="relative z-20 flex min-h-[480px] w-screen">
                {/* Фон обрезается по краям баннера, а выпадающий поиск — нет */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Фон: размытый постер фильма (или заглушка) */}
                    <div
                        className={`absolute inset-0 bg-cover bg-center ${movie?.thumbnail ? "scale-110 blur-2xl" : ""}`}
                        style={{ backgroundImage: `url(${movie?.thumbnail ?? FALLBACK_BACKGROUND})` }}
                    />

                    {/* Затемнение поверх картинки */}
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Постер справа — только на широких экранах */}
                {movie?.thumbnail && (
                    <Link
                        href={`/movies/${movie.id}`}
                        aria-label={movie.title}
                        className="absolute top-7 right-7 z-10 hidden aspect-[2/3] w-48 rounded-xl bg-cover bg-center shadow-2xl transition hover:scale-105 lg:block xl:w-56"
                        style={{ backgroundImage: `url(${movie.thumbnail})` }}
                    />
                )}

                {/* Контент поверх затемнения */}
                <div className="relative z-10 flex w-full flex-col gap-5 p-7 text-white">
                    <h6 className="text-xs font-bold text-yellow-200">Popular now</h6>

                    {movie ? (
                        <>
                            <h1 className="pb-3 text-4xl font-bold lg:max-w-[calc(100%-16rem)]">{movie.title}</h1>

                            <p className="flex flex-wrap gap-x-2 text-gray-300">
                                {[
                                    movie.release_date?.slice(0, 4),
                                    movie.runtime ? `${movie.runtime} min` : null,
                                    movie.genres.slice(0, 3).map((genre) => genre.name).join(", ") || null,
                                ]
                                    .filter(Boolean)
                                    .join(" · ")}
                                {movie.rating ? (
                                    <span className="text-yellow-300">· ★ {movie.rating.toFixed(1)}</span>
                                ) : null}
                            </p>

                            {movie.description && (
                                <p className="line-clamp-4 max-w-xl text-gray-300">{movie.description}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <h1 className="pb-3 text-4xl font-bold">Discover movies</h1>
                            <p className="max-w-xl text-gray-300">
                                Popular movies will appear here as soon as the server responds.
                            </p>
                        </>
                    )}

                    <div className="mt-10 flex items-center gap-3 text-sm">
                        {movie && (
                            <Link
                                href={`/movies/${movie.id}`}
                                className="rounded-xl bg-yellow-300 px-5 py-4 cursor-pointer text-black transition hover:scale-105 hover:bg-yellow-200"
                            >
                                View details
                            </Link>
                        )}

                        {movie && <FavoriteButton movieId={movie.id} />}
                    </div>

                    {/*Search and genres*/}

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

                            <button
                                type="button"
                                aria-label="Open movie search"
                                onClick={() => setIsMobileSearchOpen(true)}
                                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/50 text-gray-300 transition hover:bg-white/10 hover:text-yellow-200 sm:hidden"
                            >
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                >
                                    <circle cx="11" cy="11" r="6" />
                                    <path d="m16 16 4 4" />
                                </svg>
                            </button>

                            <div className="relative hidden sm:block">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                                >
                                    <circle cx="11" cy="11" r="6" />
                                    <path d="m16 16 4 4" />
                                </svg>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search..."
                                    className="rounded-xl border border-gray-700 bg-black/50 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-yellow-300"
                                />
                                {!isMobileSearchOpen && (
                                    <SearchResults query={debouncedQuery} onSelect={clearQuery} />
                                )}
                            </div>
                        </div>

                        {isMobileSearchOpen && (
                            <div className="flex items-center gap-2 sm:hidden">
                                <div className="relative flex-1">
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
                                    >
                                        <circle cx="11" cy="11" r="6" />
                                        <path d="m16 16 4 4" />
                                    </svg>
                                    <input
                                        ref={mobileSearchInputRef}
                                        type="search"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                        onBlur={() => {
                                            if (searchQuery.trim().length === 0) setIsMobileSearchOpen(false);
                                        }}
                                        placeholder="Search movies..."
                                        className="w-full rounded-xl border border-yellow-300 bg-black/70 py-2 pr-3 pl-9 text-base outline-none placeholder:text-gray-400 focus:ring-1 focus:ring-yellow-300"
                                    />
                                    <SearchResults
                                        query={debouncedQuery}
                                        onSelect={() => {
                                            clearQuery();
                                            setIsMobileSearchOpen(false);
                                        }}
                                    />
                                </div>

                                <button
                                    type="button"
                                    aria-label="Close movie search"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => {
                                        clearQuery();
                                        setIsMobileSearchOpen(false);
                                    }}
                                    className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-700 bg-black/50 text-gray-300 transition hover:bg-white/10 hover:text-yellow-200"
                                >
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path d="M6 6l12 12M18 6 6 18" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
