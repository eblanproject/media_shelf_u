"use client";

import { useLayoutEffect } from "react";
import { applyTheme, getThemePreference } from "@/lib/theme";

/**
 * Держит data-theme на <html> в актуальном состоянии:
 * - в dev React Strict Mode при повторном монтировании сбрасывает атрибуты <html> — возвращаем тему;
 * - при выборе «System» следим за сменой темы в ОС.
 */
export default function ThemeSync() {
  useLayoutEffect(() => {
    applyTheme();

    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      if (getThemePreference() === "system") applyTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return null;
}
