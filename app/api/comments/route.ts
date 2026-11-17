import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api/client";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getToken } from "@/lib/auth/session";

// Прокси к бэкенду /comments/ (контракт: docs/backend/comments.md).
// Читать комментарии может кто угодно, писать — только вошедший пользователь (токен из httpOnly-cookie).

const OFFLINE = { message: "Server is not responding. Try again later." };
const MAX_LENGTH = 1000;

function isMediaType(value: unknown): value is "movie" | "tv" {
  return value === "movie" || value === "tv";
}

// GET /api/comments?tmdb_id=550&media_type=movie — без авторизации
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tmdbId = searchParams.get("tmdb_id") ?? "";
  const mediaType = searchParams.get("media_type") ?? "movie";

  if (!/^\d+$/.test(tmdbId) || !isMediaType(mediaType)) {
    return NextResponse.json({ message: "Invalid tmdb_id or media_type" }, { status: 400 });
  }
  if (!API_URL) return NextResponse.json(OFFLINE, { status: 502 });

  try {
    const response = await fetch(`${API_URL}/comments/?tmdb_id=${tmdbId}&media_type=${mediaType}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      const message = await backendError(response, "Could not load comments");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json(await response.json());
  } catch {
    return NextResponse.json(OFFLINE, { status: 502 });
  }
}

// POST /api/comments  { tmdb_id, media_type, text } — только после входа
export async function POST(request: Request) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in or create an account to leave a comment" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const tmdbId = Number(body?.tmdb_id);
  const mediaType = body?.media_type ?? "movie";

  if (!Number.isInteger(tmdbId) || tmdbId <= 0 || !isMediaType(mediaType)) {
    return NextResponse.json({ message: "Invalid tmdb_id or media_type" }, { status: 400 });
  }
  if (!text || text.length > MAX_LENGTH) {
    return NextResponse.json({ message: `Comment must be 1–${MAX_LENGTH} characters` }, { status: 400 });
  }

  try {
    const response = await backendFetchWithToken("/comments/", token, {
      method: "POST",
      body: JSON.stringify({ tmdb_id: tmdbId, media_type: mediaType, text }),
    });
    if (response.status === 401) {
      const result = NextResponse.json({ message: "Session expired. Sign in again." }, { status: 401 });
      result.cookies.delete(TOKEN_COOKIE);
      return result;
    }
    if (!response.ok) {
      const message = await backendError(response, "Could not post the comment");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json(await response.json(), { status: 201 });
  } catch {
    return NextResponse.json(OFFLINE, { status: 502 });
  }
}
