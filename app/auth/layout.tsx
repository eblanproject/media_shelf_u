import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-black text-white">
      <main className="flex flex-1">{children}</main>
    </div>
  );
}
