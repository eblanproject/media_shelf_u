import { movies } from "@/data/movies";

// Для статического экспорта (GitHub Pages) страницы фильмов создаются заранее
// по списку из data/movies.ts. Пока список пуст — генерируется одна заглушка.
export function generateStaticParams() {
  const params = movies.map((movie) => ({ id: movie.id }));
  return params.length > 0 ? params : [{ id: "placeholder" }];
}

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <p className="text-sm text-yellow-200">Movie ID: {id}</p>
      <h1 className="mt-2 text-3xl font-bold">Movie details</h1>
      <p className="mt-2 text-gray-400">
        The description, cast and similar movies will be rendered here.
      </p>
    </section>
  );
}
