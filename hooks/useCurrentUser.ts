"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getSessionUser, refreshSession, subscribeSession } from "@/lib/auth/clientSession";

/** undefined — ещё грузится, null — не вошёл */
export function useCurrentUser() {
  const user = useSyncExternalStore(subscribeSession, getSessionUser, () => undefined);

  useEffect(() => {
    if (getSessionUser() === undefined) void refreshSession();
  }, []);

  return user;
}
