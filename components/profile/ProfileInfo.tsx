import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import type { UserProfile } from "@/types/user";

type ProfileInfoProps = {
  user: UserProfile;
  /** Постер последнего сохранённого фильма — размытым фоном шапки */
  backdrop?: string | null;
};

const FALLBACK_BACKGROUND =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80";

export default function ProfileInfo({ user, backdrop }: ProfileInfoProps) {
  return (
    <section className="relative flex min-h-[320px] w-full overflow-hidden">
      {/* Фон: размытый постер (или заглушка) с затемнением к низу */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${backdrop ? "scale-110 blur-2xl" : ""}`}
        style={{ backgroundImage: `url(${backdrop ?? FALLBACK_BACKGROUND})` }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-black/30" />

      <div className="relative z-10 mx-auto mt-auto flex w-full max-w-7xl flex-col gap-6 px-6 pb-8 sm:flex-row sm:items-end">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-4xl font-black text-black shadow-2xl ring-4 ring-black/60">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h6 className="text-xs font-bold text-yellow-200">Your profile</h6>
          <h1 className="truncate text-4xl font-bold">{user.username}</h1>
          <p className="truncate text-gray-300">{user.email}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-sm">
          <Link
            href="/settings"
            className="rounded-xl border border-gray-500 bg-black/30 px-5 py-3 transition hover:scale-105 hover:bg-white/10"
          >
            Settings
          </Link>
          <LogoutButton className="cursor-pointer rounded-xl bg-yellow-300 px-5 py-3 text-black transition hover:scale-105 hover:bg-yellow-200 disabled:opacity-60" />
        </div>
      </div>
    </section>
  );
}
