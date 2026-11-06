import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

// GET /api/auth/me — текущий пользователь или null, если не вошёл.
// «Не вошёл» — нормальная ситуация, поэтому отвечаем 200, а не 401:
// иначе браузер пишет красную ошибку в консоль при каждом открытии сайта.
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json(user);
}
