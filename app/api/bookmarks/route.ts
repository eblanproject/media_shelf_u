import { NextResponse } from "next/server";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getToken } from "@/lib/auth/session";

// Прокси к бэкенду /bookmarks/. Токен берём из httpOnly-cookie сессии,
// поэтому без входа в аккаунт сохранить или получить закладки нельзя.

const UNAUTHORIZED = { message: "Sign in or create an account to save movies" };

function unauthorized() {
  const result = NextResponse.json(UNAUTHORIZED, { status: 401 });
  // токен истёк или недействителен — сессию закрываем
  result.cookies.delete(TOKEN_COOKIE);
  return result;
}

async function proxy(response: Response, fallback: string) {
  if (response.status === 401) return unauthorized();
  if (!response.ok) {
    return NextResponse.json({ message: await backendError(response, fallback) }, { status: response.status });
  }
  return NextResponse.json(await response.json(), { status: response.status });
}

// GET /api/bookmarks — закладки текущего пользователя
export async function GET() {
  const token = await getToken();
  if (!token) return NextResponse.json(UNAUTHORIZED, { status: 401 });

  try {
    return await proxy(await backendFetchWithToken("/bookmarks/", token), "Could not load your watchlist");
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}

// POST /api/bookmarks  { tmdb_id, media_type }
export async function POST(request: Request) {
  const token = await getToken();
  if (!token) return NextResponse.json(UNAUTHORIZED, { status: 401 });

  const body = await request.json().catch(() => null);
  try {
    const response = await backendFetchWithToken("/bookmarks/", token, {
      method: "POST",
      body: JSON.stringify({ tmdb_id: body?.tmdb_id, media_type: body?.media_type ?? "movie" }),
    });
    return await proxy(response, "Could not save the movie");
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
