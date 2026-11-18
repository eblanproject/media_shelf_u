"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BookmarkApiError, addBookmark, deleteBookmark, getBookmarks } from "@/lib/api/bookmarks";
import { setSessionUser } from "@/lib/auth/clientSession";
import {
  getGuestFavorites,
  getServerGuestFavorites,
  removeGuestFavorites,
  subscribeGuestFavorites,
  toggleGuestFavorite,
} from "@/lib/favorites/guestFavorites";
import { notify, notifyAuthRequired } from "@/lib/toast";
import type { Bookmark } from "@/types/bookmark";

// Избранное вошедшего пользователя хранится на бэкенде (/bookmarks) и привязано к аккаунту.
// У гостя — в localStorage (lib/favorites/guestFavorites.ts); после входа оно переносится в аккаунт.

type State = {
  /** Чьи закладки сейчас в памяти */
  userId: number | null;
  items: Bookmark[];
  loaded: boolean;
};

const INITIAL: State = { userId: null, items: [], loaded: false };
let state: State = INITIAL;
let loadingFor: number | null = null;
let migratingFor: number | null = null;
/** Фильмы, по которым сейчас идёт запрос — чтобы двойной клик не отправил два запроса */
const inFlight = new Set<number>();
const listeners = new Set<() => void>();

function setState(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getState = () => state;
const getServerState = () => INITIAL;

/** Сессия истекла на сервере — разлогиниваем и в браузере */
function handleError(error: unknown, fallback: string) {
  if (error instanceof BookmarkApiError && error.status === 401) {
    setSessionUser(null);
    notifyAuthRequired("Your session has expired. Sign in again to manage your watchlist.");
    return;
  }
  notify(error instanceof Error ? error.message : fallback, { tone: "error" });
}

function ensureLoaded(userId: number) {
  if (state.userId === userId && (state.loaded || loadingFor === userId)) return;

  loadingFor = userId;
  setState({ userId, items: [], loaded: false });

  getBookmarks()
    .then((items) => {
      if (loadingFor !== userId) return;
      setState({ userId, items, loaded: true });
      void migrateGuestFavorites(userId);
    })
    .catch((error) => {
      if (loadingFor !== userId) return;
      setState({ userId, items: [], loaded: true });
      handleError(error, "Could not load your watchlist");
    })
    .finally(() => {
      if (loadingFor === userId) loadingFor = null;
    });
}

/** Переносит избранное гостя в закладки аккаунта (по одному, чтобы сохранить порядок) */
async function migrateGuestFavorites(userId: number) {
  const guestIds = getGuestFavorites();
  if (guestIds.length === 0 || migratingFor === userId) return;
  migratingFor = userId;

  const saved = new Set(state.items.filter((item) => item.media_type === "movie").map((item) => item.tmdb_id));
  const done = guestIds.filter((id) => saved.has(id));
  let moved = 0;

  try {
    // список гостя — новые первыми; добавляем со старых, чтобы новые оказались наверху
    for (const movieId of guestIds.filter((id) => !saved.has(id)).reverse()) {
      if (state.userId !== userId) return;
      const created = await addBookmark(movieId, "movie");
      if (state.userId === userId) setState({ ...state, items: [created, ...state.items] });
      done.push(movieId);
      moved++;
    }
  } catch (error) {
    // что не перенеслось — останется на устройстве и перенесётся при следующей загрузке
    handleError(error, "Could not move saved movies to your watchlist");
  } finally {
    removeGuestFavorites(done);
    migratingFor = null;
  }

  if (moved > 0) {
    notify(`Moved ${moved} saved ${moved === 1 ? "movie" : "movies"} from this device to your watchlist.`);
  }
}

function reset() {
  loadingFor = null;
  if (state !== INITIAL) setState(INITIAL);
}

async function toggle(userId: number, movieId: number) {
  if (inFlight.has(movieId)) return;
  inFlight.add(movieId);

  const existing = state.items.find((item) => item.media_type === "movie" && item.tmdb_id === movieId);

  try {
    if (existing) {
      // оптимистично убираем сразу, при ошибке возвращаем
      setState({ ...state, items: state.items.filter((item) => item.id !== existing.id) });
      try {
        await deleteBookmark(existing.id);
      } catch (error) {
        if (state.userId === userId) setState({ ...state, items: [existing, ...state.items] });
        throw error;
      }
    } else {
      const created = await addBookmark(movieId, "movie");
      if (state.userId === userId) setState({ ...state, items: [created, ...state.items] });
    }
  } catch (error) {
    handleError(error, "Could not update your watchlist");
  } finally {
    inFlight.delete(movieId);
  }
}

export function useFavorites() {
  const user = useCurrentUser();
  const current = useSyncExternalStore(subscribe, getState, getServerState);
  const guestIds = useSyncExternalStore(subscribeGuestFavorites, getGuestFavorites, getServerGuestFavorites);

  useEffect(() => {
    if (user) ensureLoaded(user.id);
    else if (user === null) reset();
  }, [user]);

  const ownItems = user && current.userId === user.id ? current.items : INITIAL.items;

  const accountIds = useMemo(
    () => ownItems.filter((item) => item.media_type === "movie").map((item) => item.tmdb_id),
    [ownItems],
  );
  const favoriteIds = user === null ? guestIds : accountIds;

  const toggleFavorite = useCallback(
    (movieId: number) => {
      if (user === undefined) return; // сессия ещё проверяется
      if (user === null) {
        const adding = !getGuestFavorites().includes(movieId);
        toggleGuestFavorite(movieId);
        if (adding) {
          notifyAuthRequired("Saved on this device. Sign in or create an account to keep your watchlist everywhere.");
        }
        return;
      }
      void toggle(user.id, movieId);
    },
    [user],
  );

  const isFavorite = useCallback((movieId: number) => favoriteIds.includes(movieId), [favoriteIds]);

  return {
    /** undefined — сессия ещё проверяется, null — не вошёл */
    user,
    /** Список готов: у гостя — сразу, у вошедшего — когда закладки загрузились */
    loaded: user === null || (Boolean(user) && current.userId === user?.id && current.loaded),
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
}
