import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

// GET /api/auth/me — текущий пользователь или 401
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  return NextResponse.json(user);
}
