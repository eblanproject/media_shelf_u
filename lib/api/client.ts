type ApiFetchOptions = RequestInit;

/** Адрес бэкенда. Задаётся в .env.local (локально) и в настройках Vercel. */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set (.env.local / Vercel Environment Variables)");
  }

  const url = `${API_URL}${path}`;
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
