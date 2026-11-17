import { NextResponse } from "next/server";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getToken } from "@/lib/auth/session";

// DELETE /api/bookmarks/:id — удалить закладку текущего пользователя
export async function DELETE(_request: Request, ctx: RouteContext<"/api/bookmarks/[id]">) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in or create an account to save movies" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ message: "Invalid bookmark id" }, { status: 400 });

  try {
    const response = await backendFetchWithToken(`/bookmarks/${id}`, token, { method: "DELETE" });
    if (response.status === 401) {
      const result = NextResponse.json({ message: "Session expired. Sign in again." }, { status: 401 });
      result.cookies.delete(TOKEN_COOKIE);
      return result;
    }
    if (!response.ok) {
      const message = await backendError(response, "Could not remove the movie");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
