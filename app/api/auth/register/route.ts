import { NextResponse } from "next/server";
import {
  TOKEN_COOKIE,
  backendAuthFetch,
  backendError,
  tokenCookieOptions,
} from "@/lib/auth/session";
import type { UserProfile } from "@/types/user";

// POST /api/auth/register  { username, email, password }  →  бэкенд POST /auth/register
// После успешной регистрации сразу входим, чтобы пользователю не вводить пароль второй раз.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payload = {
    username: body?.username ?? "",
    email: body?.email ?? "",
    password: body?.password ?? "",
  };

  try {
    const response = await backendAuthFetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const message = await backendError(response, "Could not create an account");
      return NextResponse.json({ message }, { status: response.status });
    }

    const user = (await response.json()) as UserProfile;
    const result = NextResponse.json(user, { status: 201 });

    const loginResponse = await backendAuthFetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: payload.username, password: payload.password }),
    });
    if (loginResponse.ok) {
      const { access_token } = (await loginResponse.json()) as { access_token: string };
      result.cookies.set(TOKEN_COOKIE, access_token, tokenCookieOptions);
    }

    return result;
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
