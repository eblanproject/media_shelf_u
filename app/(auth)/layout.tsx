import type { ReactNode } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-dvh bg-black text-white">
      <ThemeToggle className="fixed top-3 right-4 z-30 bg-black/40 backdrop-blur" />
      {children}
    </main>
  );
}
