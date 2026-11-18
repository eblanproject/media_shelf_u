"use client";

import { useSyncExternalStore } from "react";
import { setThemePreference, subscribeTheme, type ResolvedTheme } from "@/lib/theme";

// Текущая применённая тема — берём с <html data-theme>, его выставляет lib/theme.ts
function getResolvedTheme(): ResolvedTheme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function getServerResolvedTheme(): ResolvedTheme {
  return "dark";
}

/** Переключатель тёмная/светлая тема в шапке — доступен и без входа (выбор хранится в localStorage) */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getResolvedTheme, getServerResolvedTheme);
  const next: ResolvedTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/10 hover:text-yellow-200 ${className}`}
    >
      {theme === "dark" ? (
        // луна
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // солнце
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
