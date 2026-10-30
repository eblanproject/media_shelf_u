import type { ReactNode } from "react";
import Header from "@/components/layout/Header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
