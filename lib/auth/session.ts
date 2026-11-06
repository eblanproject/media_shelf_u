// Только для сервера (route handlers и серверные компоненты): использует cookies() из next/headers.
import { cookies } from "next/headers";
import { API_URL } from "@/lib/api/client";
import type { UserProfile } from "@/types/user";

/** Cookie с JWT от бэкенда. httpOnly — JavaScript в браузере его не видит. */
export const TOKEN_COOKIE = "ms2_token";

/** Бэкенд выдаёт токен на 30 минут (ACCESS_TOKEN_EXPIRE_MINUTES) */
export const TOKEN_MAX_AGE = 30 * 60;

export const tokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: TOKEN_MAX_AGE,
};

/** Запрос к бэкенду авторизации (FastAPI, префикс /auth) с сервера Next.js */
export async function backendAuthFetch(path: string, init?: RequestInit) {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return fetch(`${API_URL}/auth${path}`, { ...init, cache: "no-store" });
}

/** Достаёт понятный текст ошибки из ответа FastAPI ({detail: "..."} или {detail: [{msg}]}) */
export async function backendError(response: Response, fallback: string): Promise<string> {
  try {
    const data: unknown = await response.json();
    const detail = (data as { detail?: unknown })?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { loc?: unknown[]; msg?: string };
      const field = Array.isArray(first.loc) ? first.loc[first.loc.length - 1] : null;
      return [field, first.msg].filter(Boolean).join(": ") || fallback;
    }
  } catch {
    // не JSON
  }
  return fallback;
}

export async function fetchUserByToken(token: string): Promise<UserProfile | null> {
  const response = await backendAuthFetch("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return (await response.json()) as UserProfile;
}

/** Текущий пользователь для серверных компонентов. null — не вошёл или токен истёк. */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  try {
    return await fetchUserByToken(token);
  } catch {
    return null;
  }
}
