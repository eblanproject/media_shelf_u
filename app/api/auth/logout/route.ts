import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/session";

// POST /api/auth/logout — на бэкенде выхода нет (JWT), просто удаляем cookie
export async function POST() {
  const result = NextResponse.json({ ok: true });
  result.cookies.delete(TOKEN_COOKIE);
  return result;
}
