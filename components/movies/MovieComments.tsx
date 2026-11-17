"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CommentApiError, addComment, deleteComment, getComments } from "@/lib/api/comments";
import { setSessionUser } from "@/lib/auth/clientSession";
import { notify, notifyAuthRequired } from "@/lib/toast";
import type { Comment } from "@/types/comment";

const MAX_LENGTH = 1000;

type MovieCommentsProps = {
  tmdbId: number;
  mediaType?: Comment["media_type"];
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; comments: Comment[] }
  | { status: "error"; message: string };

/** Комментарии к фильму: читать могут все, писать — только вошедшие пользователи */
export default function MovieComments({ tmdbId, mediaType = "movie" }: MovieCommentsProps) {
  const user = useCurrentUser();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    getComments(tmdbId, mediaType)
      .then((comments) => !cancelled && setState({ status: "ready", comments }))
      .catch((error) => {
        if (cancelled) return;
        // 404/405 — на бэкенде ещё нет эндпоинта комментариев
        const missing = error instanceof CommentApiError && [404, 405, 501].includes(error.status);
        setState({
          status: "error",
          message: missing ? "Comments are coming soon." : "Could not load comments. Try again later.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [tmdbId, mediaType]);

  function handleError(error: unknown, fallback: string) {
    if (error instanceof CommentApiError && error.status === 401) {
      setSessionUser(null);
      notifyAuthRequired("Your session has expired. Sign in again to leave a comment.");
      return;
    }
    notify(error instanceof Error ? error.message : fallback, { tone: "error" });
  }

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const value = text.trim();
    if (!value || posting) return;

    setPosting(true);
    try {
      const created = await addComment(tmdbId, value, mediaType);
      setState((prev) => ({
        status: "ready",
        comments: [created, ...(prev.status === "ready" ? prev.comments : [])],
      }));
      setText("");
    } catch (error) {
      handleError(error, "Could not post the comment");
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(comment: Comment) {
    if (deleting !== null) return;
    setDeleting(comment.id);
    try {
      await deleteComment(comment.id);
      setState((prev) =>
        prev.status === "ready"
          ? { status: "ready", comments: prev.comments.filter((item) => item.id !== comment.id) }
          : prev,
      );
    } catch (error) {
      handleError(error, "Could not delete the comment");
    } finally {
      setDeleting(null);
    }
  }

  const count = state.status === "ready" ? state.comments.length : null;
  const unavailable = state.status === "error";

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-end gap-3">
        <div>
          <h6 className="text-xs font-bold text-yellow-200">Discussion</h6>
          <h2 className="text-xl font-bold">Comments</h2>
        </div>
        {count !== null && count > 0 && <span className="mb-0.5 text-sm text-gray-500">{count}</span>}
      </div>

      <div className="flex flex-col gap-6 rounded-xl border border-gray-800 bg-gray-900/60 p-5 sm:p-6">
        {/* Форма или приглашение войти */}
        {unavailable ? null : user === undefined ? (
          <div className="flex gap-3" aria-hidden="true">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <Skeleton className="h-24 flex-1 rounded-xl" />
          </div>
        ) : user === null ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-700 px-6 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-sm text-gray-300">Sign in or create an account to join the discussion.</p>
            <div className="flex shrink-0 gap-3 text-sm">
              <Link
                href="/auth/signin"
                className="rounded-xl bg-yellow-300 px-4 py-2 font-semibold text-black transition hover:scale-105 hover:bg-yellow-200"
              >
                Sign in
              </Link>
              <Link
                href="/auth/registration"
                className="rounded-xl border border-gray-600 px-4 py-2 font-semibold transition hover:scale-105 hover:bg-white/10"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Avatar name={user.username} />
            <div className="flex flex-1 flex-col gap-2">
              <textarea
                value={text}
                onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) void handleSubmit(event);
                }}
                placeholder="Share your thoughts about this movie…"
                rows={3}
                className="w-full resize-y rounded-xl border border-gray-700 bg-black/50 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-yellow-300 focus:ring-1 focus:ring-yellow-300"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">
                  {text.length}/{MAX_LENGTH}
                </span>
                <button
                  type="submit"
                  disabled={!text.trim() || posting}
                  className="cursor-pointer rounded-xl bg-yellow-300 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {posting ? "Posting…" : "Post comment"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Список */}
        {state.status === "loading" ? (
          <div className="flex flex-col gap-5" role="status" aria-label="Loading comments">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : state.status === "error" ? (
          <p className="py-4 text-center text-sm text-gray-400">{state.message}</p>
        ) : state.comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">No comments yet. Be the first to share your opinion.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-800">
            {state.comments.map((comment) => (
              <li key={comment.id} className="flex gap-3 py-4 first:pt-0 last:pb-0">
                <Avatar name={comment.user.username} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="truncate text-sm font-bold">{comment.user.username}</span>
                    <time dateTime={comment.created_at} title={new Date(comment.created_at).toLocaleString()} className="shrink-0 text-xs text-gray-500">
                      {timeAgo(comment.created_at)}
                    </time>
                    {user && user.id === comment.user.id && (
                      <button
                        type="button"
                        onClick={() => handleDelete(comment)}
                        disabled={deleting === comment.id}
                        className="ml-auto cursor-pointer text-xs text-gray-500 transition hover:text-red-400 disabled:opacity-50"
                      >
                        {deleting === comment.id ? "Deleting…" : "Delete"}
                      </button>
                    )}
                  </div>
                  <p className="text-sm break-words whitespace-pre-line text-gray-300">{comment.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-sm font-black text-black">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];

function timeAgo(iso: string) {
  const seconds = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!Number.isFinite(seconds)) return "";
  if (seconds < 60) return "just now";
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of UNITS) {
    if (seconds >= size) return format.format(-Math.floor(seconds / size), unit);
  }
  return "just now";
}
