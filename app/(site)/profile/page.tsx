import { redirect } from "next/navigation";
import ProfileView from "@/components/profile/ProfileView";
import { getCurrentUser } from "@/lib/auth/session";

// Профиль доступен только после входа: пользователь берётся с бэкенда (GET /auth/me)
export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  return <ProfileView user={user} />;
}
