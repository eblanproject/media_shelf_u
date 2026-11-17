"use client";

import Link from "next/link";
import { useState } from "react";
import type { PersonCredit, PersonDetails } from "@/types/media";

type FilmographyProps = {
  credits: PersonDetails["credits"];
  /** Какая вкладка открыта сначала: для режиссёра — Directing */
  initialTab?: Tab;
};

type Tab = "acting" | "directing" | "crew";

const TAB_LABELS: Record<Tab, string> = {
  acting: "Acting",
  directing: "Directing",
  crew: "Other work",
};

/** Фильмография по вкладкам: роли, режиссура, остальная работа в группе. Новые сверху. */
export default function Filmography({ credits, initialTab }: FilmographyProps) {
  const groups: Record<Tab, PersonCredit[]> = {
    acting: sortByYear(credits.cast),
    directing: sortByYear(credits.crew.filter((credit) => credit.job === "Director")),
    crew: sortByYear(credits.crew.filter((credit) => credit.job !== "Director")),
  };
  const tabs = (Object.keys(groups) as Tab[]).filter((tab) => groups[tab].length > 0);
  const [active, setActive] = useState<Tab>(initialTab && groups[initialTab].length ? initialTab : tabs[0]);

  if (tabs.length === 0) return null;
  const items = groups[active];

  return (
    <section className="mt-12">
      <h6 className="text-xs font-bold text-yellow-200">Career</h6>
      <h2 className="mb-4 text-xl font-bold">Filmography</h2>

      {tabs.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`cursor-pointer rounded-md px-3 py-2 transition hover:scale-105 ${
                tab === active
                  ? "bg-yellow-300 text-black"
                  : "bg-black/50 text-gray-200 hover:bg-yellow-300 hover:text-black"
              }`}
            >
              {TAB_LABELS[tab]} <span className="opacity-60">{groups[tab].length}</span>
            </button>
          ))}
        </div>
      )}

      <ul className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-gray-900/60">
        {items.map((credit, i) => (
          <li key={`${credit.type}-${credit.id}-${credit.job ?? credit.character ?? i}`}>
            <Link
              href={credit.type === "tv" ? `/tv/${credit.id}` : `/movies/${credit.id}`}
              className="flex items-center gap-4 px-4 py-3 transition hover:bg-white/5"
            >
              <span className="w-10 shrink-0 text-sm text-gray-500">{credit.year ?? "—"}</span>
              <div
                className="aspect-[2/3] w-9 shrink-0 rounded bg-gray-800 bg-cover bg-center"
                style={credit.thumbnail ? { backgroundImage: `url(${credit.thumbnail})` } : undefined}
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-gray-100">
                  {credit.title}
                  {credit.type === "tv" && (
                    <span className="ml-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-yellow-200">TV</span>
                  )}
                </span>
                {(credit.character || (active === "crew" && credit.job)) && (
                  <span className="truncate text-xs text-gray-500">
                    {active === "acting" ? `as ${credit.character}` : credit.job}
                  </span>
                )}
              </div>
              {credit.rating ? <span className="shrink-0 text-sm text-yellow-300">★ {credit.rating.toFixed(1)}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Новые сверху; без года (анонсированные) — в самом верху */
function sortByYear(credits: PersonCredit[]) {
  return [...credits].sort((a, b) => (b.year ?? Infinity) - (a.year ?? Infinity));
}
