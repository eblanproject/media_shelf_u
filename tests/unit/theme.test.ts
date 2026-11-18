import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  getThemePreference,
  resolveTheme,
  setThemePreference,
  subscribeTheme,
} from "@/lib/theme";

function mockSystemTheme(light: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: light && query.includes("light") }));
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
  mockSystemTheme(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("theme", () => {
  it("по умолчанию тёмная", () => {
    expect(DEFAULT_THEME).toBe("dark");
    expect(getThemePreference()).toBe("dark");
  });

  it("игнорирует мусор в localStorage", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple");
    expect(getThemePreference()).toBe(DEFAULT_THEME);
  });

  it("system берёт тему из ОС", () => {
    mockSystemTheme(true);
    expect(resolveTheme("system")).toBe("light");
    mockSystemTheme(false);
    expect(resolveTheme("system")).toBe("dark");
  });

  it("setThemePreference сохраняет выбор, ставит data-theme и оповещает подписчиков", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeTheme(listener);

    setThemePreference("light");

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(listener).toHaveBeenCalled();
    unsubscribe();
  });
});
