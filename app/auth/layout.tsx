import type { ReactNode } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      {/* шапки на страницах входа нет — смену темы оставляем в углу */}
      <ThemeToggle className="fixed top-3 right-4 z-30 bg-black/40 backdrop-blur" />
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
