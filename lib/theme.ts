// Тема сайта. Выбор пользователя хранится в localStorage, на <html> ставится data-theme="dark" | "light".
// До гидрации тему выставляет инлайн-скрипт THEME_SCRIPT в app/layout.tsx — без вспышки.

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: ThemePreference = "dark";

const PREFERENCES: ThemePreference[] = ["dark", "light", "system"];

/** Скрипт для <head>: выполняется при разборе HTML, до первой отрисовки */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}")||"${DEFAULT_THEME}";var t=p==="system"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):p;document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}})()`;

const listeners = new Set<() => void>();

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null;
    return stored && PREFERENCES.includes(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function getServerThemePreference(): ThemePreference {
  return DEFAULT_THEME;
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/** Выставить data-theme на <html> по текущему выбору */
export function applyTheme(preference = getThemePreference()) {
  document.documentElement.setAttribute("data-theme", resolveTheme(preference));
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // localStorage недоступен (приватный режим) — тема просто не запомнится
  }
  applyTheme(preference);
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  // смена темы в другой вкладке
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      applyTheme();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
