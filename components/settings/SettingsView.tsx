"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { UserProfile } from "@/types/user";
import AccountSettings from "./AccountSettings";
import AppearanceSettings from "./AppearanceSettings";
import PasswordSettings from "./PasswordSettings";
import ProfileSettings from "./ProfileSettings";

const NAV = [
  { href: "#profile", label: "Profile" },
  { href: "#security", label: "Password" },
  { href: "#appearance", label: "Appearance" },
  { href: "#account", label: "Account" },
];

export default function SettingsView({ user: initialUser }: { user: UserProfile }) {
  // после сохранения профиля клиентская сессия обновляется раньше, чем серверные данные
  const user = useCurrentUser() ?? initialUser;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-1">
        <Link href="/profile" className="w-fit text-sm text-gray-400 transition hover:text-yellow-200">
          ← Back to profile
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your profile, password and how the site looks.</p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <nav
          aria-label="Settings sections"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:sticky lg:top-6 lg:mx-0 lg:w-48 lg:shrink-0 lg:flex-col lg:gap-1 lg:px-0"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white lg:border-transparent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {/* key: после смены имени/почты форма начинает с новых значений */}
          <ProfileSettings key={`${user.username}|${user.email}`} user={user} />
          <PasswordSettings />
          <AppearanceSettings />
          <AccountSettings user={user} />
        </div>
      </div>
    </div>
  );
}
