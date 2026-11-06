"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/auth";
import type { UserProfile } from "@/types/user";

/** undefined — ещё грузится, null — не вошёл */
export function useCurrentUser() {
  const [user, setUser] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getMe()
      .then((me) => !cancelled && setUser(me))
      .catch(() => !cancelled && setUser(null));
    return () => {
      cancelled = true;
    };
  }, []);

  return user;
}
