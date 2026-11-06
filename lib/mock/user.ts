import type { UserProfile } from "@/types/user";

/** Тестовый пользователь — для вёрстки без бэкенда. В приложении не используется. */
export const MOCKUSER: UserProfile = {
    id: 1,
    username: "test",
    email: "test@mail.com",
    avatarUrl: undefined,
};

export default MOCKUSER;
