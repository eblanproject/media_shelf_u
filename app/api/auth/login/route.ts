import { NextResponse } from "next/server";
import {
  TOKEN_COOKIE,
  backendAuthFetch,
  backendError,
  fetchUserByToken,
  tokenCookieOptions,
} from "@/lib/auth/session";

// POST /api/auth/login  { login, password }  →  бэкенд POST /auth/login
// Токен кладём в httpOnly-cookie, в браузер отдаём только данные пользователя.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  try {
    const response = await backendAuthFetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: body?.login ?? "", password: body?.password ?? "" }),
    });

    if (!response.ok) {
      const message = await backendError(response, "Invalid email or password");
      return NextResponse.json({ message }, { status: response.status });
    }

    const { access_token } = (await response.json()) as { access_token: string };
    const user = await fetchUserByToken(access_token);

    const result = NextResponse.json(user);
    result.cookies.set(TOKEN_COOKIE, access_token, tokenCookieOptions);
    return result;
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
