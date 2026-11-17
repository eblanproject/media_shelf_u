"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { dismissToast, getServerToasts, getToasts, subscribeToasts } from "@/lib/toast";

export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-3 sm:inset-x-auto sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          className={`pointer-events-auto flex w-full max-w-sm flex-col gap-3 rounded-xl border bg-gray-950/95 p-4 text-sm text-white shadow-2xl backdrop-blur ${
            toast.tone === "error" ? "border-red-900" : "border-yellow-300/40"
          }`}
        >
          <div className="flex items-start gap-3">
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Close notification"
              className="cursor-pointer text-gray-500 hover:text-white"
            >
              ✕
            </button>
          </div>
          {toast.actions && (
            <div className="flex gap-2">
              {toast.actions.map((action, i) => (
                <Link
                  key={action.href}
                  href={action.href}
                  onClick={() => dismissToast(toast.id)}
                  className={`rounded-md px-3 py-1.5 font-semibold transition ${
                    i === 0
                      ? "bg-yellow-300 text-black hover:bg-yellow-200"
                      : "border border-gray-600 hover:bg-white/10"
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
