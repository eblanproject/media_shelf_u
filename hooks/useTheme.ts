"use client";

import { useSyncExternalStore } from "react";
import {
  getServerThemePreference,
  getThemePreference,
  setThemePreference,
  subscribeTheme,
} from "@/lib/theme";

export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getThemePreference, getServerThemePreference);
  return { theme, setTheme: setThemePreference };
}
