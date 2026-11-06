import type { UserProfile } from "@/types/user";

// Вызовы из браузера. Идут на свои же /api/auth/* (route handlers Next.js),
// а те уже обращаются к бэкенду и хранят токен в httpOnly-cookie.

export type LoginPayload = {
  /** Email или имя пользователя — бэкенд принимает оба */
  login: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/auth${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((data as { message?: string } | null)?.message ?? "Something went wrong");
  }
  return data as T;
}

export function login(payload: LoginPayload) {
  return authRequest<UserProfile>("/login", { method: "POST", body: JSON.stringify(payload) });
}

export function register(payload: RegisterPayload) {
  return authRequest<UserProfile>("/register", { method: "POST", body: JSON.stringify(payload) });
}

export function logout() {
  return authRequest<{ ok: true }>("/logout", { method: "POST" });
}

/** null — пользователь не вошёл */
export async function getMe(): Promise<UserProfile | null> {
  const response = await fetch("/api/auth/me");
  if (!response.ok) return null;
  return (await response.json()) as UserProfile | null;
}
