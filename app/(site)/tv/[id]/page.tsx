import { notFound } from "next/navigation";
import { getTvById } from "@/lib/api/movies";
import { errorMessage } from "@/lib/api/client";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let tv;
  try {
    tv = await getTvById(id);
  } catch (e) {
    errorMessage(e, "Could not load the series");
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">Could not load the series</h1>
        <p className="mt-2 text-gray-400">The server is not responding. Try again later.</p>
      </section>
    );
  }

  const year = tv.first_air_date?.slice(0, 4);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <article className="flex flex-col gap-8 md:flex-row">
        <div
          className="aspect-[2/3] w-full max-w-xs shrink-0 rounded-md bg-gray-700 bg-cover bg-center"
          style={tv.thumbnail ? { backgroundImage: `url(${tv.thumbnail})` } : undefined}
          role="img"
          aria-label={tv.title}
        />

        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-yellow-200">TV series</p>
          <h1 className="text-3xl font-bold">{tv.title}</h1>

          <p className="flex flex-wrap gap-x-4 text-sm text-gray-400">
            {year && <span>{year}</span>}
            {tv.seasons_count ? <span>{tv.seasons_count} seasons</span> : null}
            {tv.episodes_count ? <span>{tv.episodes_count} episodes</span> : null}
            {tv.rating ? <span className="text-yellow-300">★ {tv.rating.toFixed(1)}</span> : null}
            {tv.age_rating && <span>{tv.age_rating}+</span>}
          </p>

          {tv.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tv.genres.map((genre) => (
                <span key={genre.id} className="rounded-xl border border-gray-700 px-3 py-1 text-xs text-gray-300">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {tv.description && <p className="max-w-2xl text-gray-300">{tv.description}</p>}

          {tv.cast.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-bold">Cast</h2>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                {tv.cast.map((person) => (
                  <li key={person.id}>
                    {person.name}
                    {person.character && <span className="text-gray-600"> — {person.character}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
