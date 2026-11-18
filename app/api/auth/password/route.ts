import { NextResponse } from "next/server";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getToken } from "@/lib/auth/session";
import { isValidPassword } from "@/lib/validations/auth";

// POST /api/auth/password  { current_password, new_password }  →  бэкенд POST /auth/change-password
// Контракт: docs/backend/account.md
export async function POST(request: Request) {
  const token = await getToken();
  if (!token) {
    const result = NextResponse.json({ message: "Your session has expired. Sign in again." }, { status: 401 });
    result.cookies.delete(TOKEN_COOKIE);
    return result;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const currentPassword = typeof body?.current_password === "string" ? body.current_password : "";
  const newPassword = typeof body?.new_password === "string" ? body.new_password : "";

  if (!currentPassword) return NextResponse.json({ message: "Enter your current password" }, { status: 422 });
  if (!isValidPassword(newPassword)) {
    return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 422 });
  }

  try {
    const response = await backendFetchWithToken("/auth/change-password", token, {
      method: "POST",
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });
    if (!response.ok) {
      // 400/401 — неверный текущий пароль; сессию не закрываем
      const message = await backendError(response, "Could not change the password");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
