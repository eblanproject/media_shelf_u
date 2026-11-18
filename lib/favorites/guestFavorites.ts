// Избранное гостя (без входа в аккаунт) — id фильмов в localStorage, новые первыми.
// После входа useFavorites переносит их в закладки аккаунта и очищает этот список.

export const GUEST_FAVORITES_KEY = "guest-favorites";

const EMPTY: number[] = [];
const listeners = new Set<() => void>();

// getSnapshot у useSyncExternalStore должен возвращать один и тот же массив, пока данные не поменялись
let cachedRaw: string | null = null;
let cachedIds: number[] = EMPTY;

export function parseGuestFavorites(raw: string | null): number[] {
  if (!raw) return EMPTY;
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return EMPTY;
    const ids = value.filter((id): id is number => Number.isInteger(id) && id > 0);
    return [...new Set(ids)];
  } catch {
    return EMPTY;
  }
}

export function getGuestFavorites(): number[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(GUEST_FAVORITES_KEY);
  } catch {
    // localStorage недоступен (приватный режим)
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedIds = parseGuestFavorites(raw);
  }
  return cachedIds;
}

export function getServerGuestFavorites(): number[] {
  return EMPTY;
}

function save(ids: number[]) {
  try {
    if (ids.length === 0) localStorage.removeItem(GUEST_FAVORITES_KEY);
    else localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // не сохранится — ничего страшного
  }
  listeners.forEach((listener) => listener());
}

export function toggleGuestFavorite(movieId: number) {
  const ids = getGuestFavorites();
  save(ids.includes(movieId) ? ids.filter((id) => id !== movieId) : [movieId, ...ids]);
}

export function removeGuestFavorites(movieIds: number[]) {
  save(getGuestFavorites().filter((id) => !movieIds.includes(id)));
}

export function subscribeGuestFavorites(listener: () => void) {
  listeners.add(listener);
  // изменения из другой вкладки
  const onStorage = (event: StorageEvent) => {
    if (event.key === GUEST_FAVORITES_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
