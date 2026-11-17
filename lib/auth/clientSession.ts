// Только для браузера.
import type { UserProfile } from "@/types/user";

// Сессия на стороне браузера: одно общее состояние «кто вошёл» для всех компонентов
// (шапка, кнопка Save, страница Watchlist). Сам токен лежит в httpOnly-cookie,
// здесь только данные пользователя. undefined — ещё не проверили, null — не вошёл.

type SessionUser = UserProfile | null | undefined;

let current: SessionUser = undefined;
let pending: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function getSessionUser(): SessionUser {
  return current;
}

export function setSessionUser(user: UserProfile | null) {
  current = user;
  listeners.forEach((listener) => listener());
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Спросить у сервера текущего пользователя (один запрос на всех, кто вызвал одновременно) */
export function refreshSession(): Promise<void> {
  pending ??= fetch("/api/auth/me", { cache: "no-store" })
    .then((response) => (response.ok ? (response.json() as Promise<UserProfile | null>) : null))
    .catch(() => null)
    .then((user) => setSessionUser(user))
    .finally(() => {
      pending = null;
    });
  return pending;
}
