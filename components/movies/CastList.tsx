import Link from "next/link";
import type { CastMember } from "@/types/media";

type CastListProps = {
  cast: CastMember[];
};

/** Актёры с фотографиями — горизонтальная лента. Если фото нет, показываем инициалы. */
export default function CastList({ cast }: CastListProps) {
  if (cast.length === 0) return null;

  return (
    <section className="mt-12">
      <h6 className="text-xs font-bold text-yellow-200">Starring</h6>
      <h2 className="mb-4 text-xl font-bold">Cast</h2>

      <ul className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-3">
        {cast.map((person) => (
          <li key={person.id} className="w-28 shrink-0 snap-start">
            <Link href={`/people/${person.id}`} className="group flex flex-col gap-2">
            {person.profile ? (
              <div
                className="aspect-[2/3] w-full rounded-md bg-gray-800 bg-cover bg-center transition group-hover:brightness-75"
                style={{ backgroundImage: `url(${person.profile})` }}
                role="img"
                aria-label={person.name}
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-md bg-gray-800 text-2xl font-black text-gray-600">
                {initials(person.name)}
              </div>
            )}
            <div className="flex flex-col">
              <span className="line-clamp-2 text-sm font-semibold text-gray-100 transition group-hover:text-yellow-200">{person.name}</span>
              {person.character && <span className="line-clamp-2 text-xs text-gray-500">{person.character}</span>}
            </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
