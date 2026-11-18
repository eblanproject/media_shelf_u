import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SettingsView from "@/components/settings/SettingsView";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Settings",
};

// Настройки доступны только после входа
export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/signin");

  return <SettingsView user={user} />;
}
