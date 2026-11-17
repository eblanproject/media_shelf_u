import type { Bookmark } from "@/types/bookmark";

// Вызовы из браузера к своим /api/bookmarks (route handlers берут токен из cookie сессии)

export class BookmarkApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/bookmarks${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (data as { message?: string } | null)?.message ?? "Something went wrong";
    throw new BookmarkApiError(message, response.status);
  }
  return data as T;
}

export function getBookmarks() {
  return request<Bookmark[]>("");
}

export function addBookmark(tmdbId: number, mediaType: Bookmark["media_type"] = "movie") {
  return request<Bookmark>("", { method: "POST", body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType }) });
}

export function deleteBookmark(bookmarkId: number) {
  return request<{ ok: true }>(`/${bookmarkId}`, { method: "DELETE" });
}
