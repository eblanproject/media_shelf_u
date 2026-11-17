import { NextResponse } from "next/server";
import { TOKEN_COOKIE, backendError, backendFetchWithToken, getToken } from "@/lib/auth/session";

// DELETE /api/comments/:id — удалить свой комментарий
export async function DELETE(_request: Request, ctx: RouteContext<"/api/comments/[id]">) {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ message: "Sign in to manage your comments" }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ message: "Invalid comment id" }, { status: 400 });

  try {
    const response = await backendFetchWithToken(`/comments/${id}`, token, { method: "DELETE" });
    if (response.status === 401) {
      const result = NextResponse.json({ message: "Session expired. Sign in again." }, { status: 401 });
      result.cookies.delete(TOKEN_COOKIE);
      return result;
    }
    if (!response.ok) {
      const message = await backendError(response, "Could not delete the comment");
      return NextResponse.json({ message }, { status: response.status });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Server is not responding. Try again later." }, { status: 502 });
  }
}
