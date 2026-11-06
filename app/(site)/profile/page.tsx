import { redirect } from "next/navigation";
import ProfileInfo from "@/components/profile/ProfileInfo";
import FavoritesPage from "@/app/(site)/favorites/page";
import { getCurrentUser } from "@/lib/auth/session";

// Профиль доступен только после входа: пользователь берётся с бэкенда (GET /auth/me)
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  return (
    <>
      <ProfileInfo user={user} />
      <FavoritesPage />
    </>
  );
}
