import { notFound } from "next/navigation";
import MovieDetails from "@/components/movies/MovieDetails";
import SimilarMovies from "@/components/movies/SimilarMovies";
import { getMovieById, getSimilarMovies } from "@/lib/api/movies";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();

  const [movieResult, similarResult] = await Promise.allSettled([
    getMovieById(id),
    getSimilarMovies(id),
  ]);

  if (movieResult.status === "rejected") {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">Could not load the movie</h1>
        <p className="mt-2 text-gray-400">The server is not responding. Try again later.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <MovieDetails movie={movieResult.value} />
      <SimilarMovies movies={similarResult.status === "fulfilled" ? similarResult.value : []} />
    </section>
  );
}
