import type { Comment } from "@/types/comment";

// Вызовы из браузера к своим /api/comments (route handlers берут токен из cookie сессии)

export class CommentApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/comments${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = (data as { message?: string } | null)?.message ?? "Something went wrong";
    throw new CommentApiError(message, response.status);
  }
  return data as T;
}

export function getComments(tmdbId: number, mediaType: Comment["media_type"] = "movie") {
  return request<Comment[]>(`?tmdb_id=${tmdbId}&media_type=${mediaType}`);
}

export function addComment(tmdbId: number, text: string, mediaType: Comment["media_type"] = "movie") {
  return request<Comment>("", {
    method: "POST",
    body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType, text }),
  });
}

export function deleteComment(commentId: number) {
  return request<{ ok: true }>(`/${commentId}`, { method: "DELETE" });
}
