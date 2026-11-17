import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MovieCard from "@/components/movies/MovieCard";
import ExpandableText from "@/components/people/ExpandableText";
import Filmography from "@/components/people/Filmography";
import { ApiError, errorMessage } from "@/lib/api/client";
import { getPerson } from "@/lib/api/movies";
import type { PersonCredit, PersonDetails } from "@/types/media";

type PersonPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    return { title: (await getPerson(id)).name };
  } catch {
    return { title: "Person" };
  }
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  let person: PersonDetails;
  try {
    person = await getPerson(id);
  } catch (e) {
    // 404 — бэкенд ещё не умеет отдавать людей (или такого человека нет в TMDB)
    const missing = e instanceof ApiError && e.status === 404;
    if (!missing) errorMessage(e, "Could not load the person");
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10">
        <h1 className="text-2xl font-bold">{missing ? "Coming soon" : "Could not load this page"}</h1>
        <p className="mt-2 text-gray-400">
          {missing
            ? "Pages about actors and directors will appear here soon."
            : "The server is not responding. Try again later."}
        </p>
      </section>
    );
  }

  const isDirector = person.known_for_department === "Directing";
  const knownFor = topCredits(isDirector ? person.credits.crew.filter((c) => c.job === "Director") : person.credits.cast);

  const facts = [
    person.known_for_department && { label: "Known for", value: person.known_for_department },
    person.birthday && {
      label: "Born",
      value: `${formatDate(person.birthday)}${person.deathday ? "" : ` (age ${age(person.birthday)})`}`,
    },
    person.place_of_birth && { label: "Place of birth", value: person.place_of_birth },
    person.deathday && {
      label: "Died",
      value: `${formatDate(person.deathday)}${person.birthday ? ` (aged ${age(person.birthday, person.deathday)})` : ""}`,
    },
    { label: "Credits", value: String(person.credits.cast.length + person.credits.crew.length) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <article className="flex flex-col gap-8 md:flex-row">
        {person.profile ? (
          <div
            className="aspect-[2/3] w-full max-w-xs shrink-0 rounded-md bg-gray-800 bg-cover bg-center"
            style={{ backgroundImage: `url(${person.profile})` }}
            role="img"
            aria-label={person.name}
          />
        ) : (
          <div className="flex aspect-[2/3] w-full max-w-xs shrink-0 items-center justify-center rounded-md bg-gray-800 text-6xl font-black text-gray-600">
            {person.name.charAt(0)}
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-5">
          <div>
            <h6 className="text-xs font-bold text-yellow-200">{isDirector ? "Director" : "Actor"}</h6>
            <h1 className="text-4xl font-bold">{person.name}</h1>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-gray-800 bg-gray-900/60 px-4 py-3">
                <dt className="text-xs font-bold tracking-wide text-gray-500 uppercase">{fact.label}</dt>
                <dd className="mt-1 text-sm text-gray-100">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h2 className="mb-2 text-lg font-bold">Biography</h2>
            {person.biography ? (
              <ExpandableText text={person.biography} />
            ) : (
              <p className="text-gray-500">No biography yet.</p>
            )}
          </div>
        </div>
      </article>

      {knownFor.length > 0 && (
        <section className="mt-12">
          <h6 className="text-xs font-bold text-yellow-200">Best rated</h6>
          <h2 className="mb-4 text-xl font-bold">Known for</h2>
          <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {knownFor.map((credit) => (
              <MovieCard
                key={`${credit.type}-${credit.id}`}
                movie={credit}
                href={credit.type === "tv" ? `/tv/${credit.id}` : `/movies/${credit.id}`}
                badge={credit.type === "tv" ? "TV" : undefined}
              />
            ))}
          </div>
        </section>
      )}

      <Filmography credits={person.credits} initialTab={isDirector ? "directing" : "acting"} />
    </section>
  );
}

/** 6 лучших по рейтингу работ с постером, без повторов */
function topCredits(credits: PersonCredit[]) {
  const seen = new Set<string>();
  return [...credits]
    .filter((credit) => credit.thumbnail && credit.rating)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .filter((credit) => {
      const key = `${credit.type}-${credit.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function age(birthday: string, until?: string) {
  const from = new Date(birthday);
  const to = until ? new Date(until) : new Date();
  let years = to.getUTCFullYear() - from.getUTCFullYear();
  const beforeBirthday =
    to.getUTCMonth() < from.getUTCMonth() ||
    (to.getUTCMonth() === from.getUTCMonth() && to.getUTCDate() < from.getUTCDate());
  if (beforeBirthday) years -= 1;
  return years;
}
