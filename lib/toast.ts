// Простые всплывающие уведомления: notify() из любого места, <Toaster /> показывает их.

export type ToastAction = { label: string; href: string };

export type Toast = {
  id: number;
  message: string;
  tone: "info" | "error";
  actions?: ToastAction[];
};

const DURATION = 6000;
const EMPTY: Toast[] = [];
let toasts: Toast[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();

function emit(next: Toast[]) {
  toasts = next;
  listeners.forEach((listener) => listener());
}

export function getToasts() {
  return toasts;
}

export function getServerToasts() {
  return EMPTY;
}

export function subscribeToasts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function dismissToast(id: number) {
  emit(toasts.filter((toast) => toast.id !== id));
}

export function notify(message: string, options: { tone?: Toast["tone"]; actions?: ToastAction[] } = {}) {
  // одно и то же сообщение не дублируем, если пользователь жмёт кнопку несколько раз
  const existing = toasts.find((toast) => toast.message === message);
  if (existing) dismissToast(existing.id);

  const toast: Toast = { id: nextId++, message, tone: options.tone ?? "info", actions: options.actions };
  emit([...toasts, toast]);
  setTimeout(() => dismissToast(toast.id), DURATION);
}

/** Уведомление «нужно войти», с кнопками входа и регистрации */
export function notifyAuthRequired(message = "Sign in or create an account to save movies to your watchlist.") {
  notify(message, {
    actions: [
      { label: "Sign in", href: "/auth/signin" },
      { label: "Create account", href: "/auth/registration" },
    ],
  });
}
