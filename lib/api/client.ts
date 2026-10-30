type ApiFetchOptions = RequestInit;

/** Адрес бэкенда. Задаётся в .env.local (локально) и в настройках Vercel. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

const isServer = typeof window === "undefined";

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  // На сервере ходим на бэкенд напрямую, в браузере — через свой домен (rewrites в next.config.ts)
  if (isServer && !API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set (.env.local / Vercel Environment Variables)");
  }

  const url = isServer ? `${API_URL}${path}` : path;
  let response: Response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(`Backend is not reachable: ${url} — is the server running?`);
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Backend returned ${response.status} for ${url}${body ? `: ${body.slice(0, 300)}` : ""}`);
  }

  return response.json() as Promise<T>;
}

/** Текст ошибки для страницы: в разработке — с причиной, на проде — общий. */
export function errorMessage(error: unknown, fallback: string): string {
  console.error("[api]", error);
  if (process.env.NODE_ENV !== "production" && error instanceof Error) {
    return `${fallback} (${error.message})`;
  }
  return fallback;
}
