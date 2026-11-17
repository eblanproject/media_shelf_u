"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { BookmarkApiError, addBookmark, deleteBookmark, getBookmarks } from "@/lib/api/bookmarks";
import { setSessionUser } from "@/lib/auth/clientSession";
import { notify, notifyAuthRequired } from "@/lib/toast";
import type { Bookmark } from "@/types/bookmark";

// Избранное хранится на бэкенде (/bookmarks) и привязано к аккаунту.
// Без входа в аккаунт ничего не сохраняется — показываем уведомление «войдите или зарегистрируйтесь».

type State = {
  /** Чьи закладки сейчас в памяти */
  userId: number | null;
  items: Bookmark[];
  loaded: boolean;
};

const INITIAL: State = { userId: null, items: [], loaded: false };
let state: State = INITIAL;
let loadingFor: number | null = null;
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
      if (loadingFor === userId) setState({ userId, items, loaded: true });
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

  useEffect(() => {
    if (user) ensureLoaded(user.id);
    else if (user === null) reset();
  }, [user]);

  const ownItems = user && current.userId === user.id ? current.items : INITIAL.items;

  const favoriteIds = useMemo(
    () => ownItems.filter((item) => item.media_type === "movie").map((item) => item.tmdb_id),
    [ownItems],
  );

  const toggleFavorite = useCallback(
    (movieId: number) => {
      if (user === undefined) return; // сессия ещё проверяется
      if (user === null) {
        notifyAuthRequired();
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
    /** Закладки загружены (для вошедшего пользователя) */
    loaded: Boolean(user) && current.userId === user?.id && current.loaded,
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
}
