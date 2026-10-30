"use client";

import { useCallback, useSyncExternalStore } from "react";

// Избранное хранится в браузере (localStorage), пока на бэкенде нет пользователей.
// Когда появится авторизация — заменить read/write на запросы к API.

const STORAGE_KEY = "ms2:favorites";
const EMPTY: number[] = [];
const listeners = new Set<() => void>();
let cache: number[] | null = null;

function read(): number[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: number[]) {
  cache = ids;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // приватный режим / хранилище недоступно — избранное живёт до перезагрузки
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // синхронизация между вкладками
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useFavorites() {
  const favoriteIds = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggleFavorite = useCallback((movieId: number) => {
    const current = read();
    write(current.includes(movieId) ? current.filter((id) => id !== movieId) : [...current, movieId]);
  }, []);

  const isFavorite = useCallback((movieId: number) => favoriteIds.includes(movieId), [favoriteIds]);

  return { favoriteIds, isFavorite, toggleFavorite };
}
