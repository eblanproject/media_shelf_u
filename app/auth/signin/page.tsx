"use client";

import LoginForm from "@/components/auth/LoginForm";
import MsuLogo from "@/components/MsuLogo";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <section className="relative grid min-h-dvh w-full bg-black lg:grid-cols-2">
      <div
        onClick={() => router.push("/")}
        className="absolute top-2 left-5 z-20 cursor-pointer"
      >
        <MsuLogo />
      </div>

      <div
        className="relative min-h-[38dvh] overflow-hidden bg-cover bg-center lg:min-h-dvh"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=85)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/65 to-yellow-300/20" />

        <div className="absolute right-0 bottom-0 left-0 z-10 p-7 sm:p-10 lg:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-yellow-200">
            MSU Cinema
          </p>
          <h1 className="mt-3 max-w-md text-3xl font-black tracking-tight sm:text-5xl">
            Find your next great film.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
            Keep your favourite movies and watchlist in one place.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <LoginForm />
      </div>
    </section>
  );
}
