import { NextResponse } from "next/server";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getCurrentUser, getToken } from "@/lib/auth/session";
import { isValidEmail } from "@/lib/validations/auth";
import type { UserProfile } from "@/types/user";

// Контракт PATCH/DELETE для бэкенда: docs/backend/account.md

const UNAUTHORIZED = { message: "Your session has expired. Sign in again." };
const OFFLINE = { message: "Server is not responding. Try again later." };

function unauthorized() {
  const result = NextResponse.json(UNAUTHORIZED, { status: 401 });
  result.cookies.delete(TOKEN_COOKIE);
  return result;
}

// GET /api/auth/me — текущий пользователь или null, если не вошёл.
// «Не вошёл» — нормальная ситуация, поэтому отвечаем 200, а не 401:
// иначе браузер пишет красную ошибку в консоль при каждом открытии сайта.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(user);
}

// PATCH /api/auth/me  { username?, email? }  →  бэкенд PATCH /auth/me
export async function PATCH(request: Request) {
  const token = await getToken();
  if (!token) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const payload: { username?: string; email?: string } = {};

  if (typeof body?.username === "string") {
    const username = body.username.trim();
    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ message: "Username must be 3–50 characters long" }, { status: 422 });
    }
    payload.username = username;
  }
  if (typeof body?.email === "string") {
    const email = body.email.trim();
    if (!isValidEmail(email)) return NextResponse.json({ message: "Enter a valid email" }, { status: 422 });
    payload.email = email;
  }
  if (!payload.username && !payload.email) {
    return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
  }

  try {
    const response = await backendFetchWithToken("/auth/me", token, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (response.status === 401) return unauthorized();
    if (!response.ok) {
      const message = await backendError(response, "Could not update your profile");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json((await response.json()) as UserProfile);
  } catch {
    return NextResponse.json(OFFLINE, { status: 502 });
  }
}

// DELETE /api/auth/me  { password }  →  бэкенд DELETE /auth/me. После удаления закрываем сессию.
export async function DELETE(request: Request) {
  const token = await getToken();
  if (!token) return unauthorized();

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password) return NextResponse.json({ message: "Enter your password" }, { status: 422 });

  try {
    const response = await backendFetchWithToken("/auth/me", token, {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      // 401 здесь — неверный пароль, а не истёкшая сессия, поэтому cookie не трогаем
      const message = await backendError(response, "Could not delete your account");
      return NextResponse.json({ message }, { status: response.status });
    }
    const result = NextResponse.json({ ok: true });
    result.cookies.delete(TOKEN_COOKIE);
    return result;
  } catch {
    return NextResponse.json(OFFLINE, { status: 502 });
  }
}
