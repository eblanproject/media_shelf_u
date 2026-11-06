/** Пользователь — ответ бэкенда GET /auth/me и POST /auth/register */
export type UserProfile = {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
};
