export default function MoviesPage() {

    // // app/movies/[id]/page.tsx
    // const { genres, selectedGenre, setSelectedGenre } = useGenreFilter({
    //     availableGenres: movie.genres, // только жанры этого фильма
    // });

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Movies</h1>
      <p className="mt-2 text-gray-400">The complete movie catalog will appear here.</p>
    </section>
  );
}
