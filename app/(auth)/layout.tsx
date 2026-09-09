import type { ReactNode } from "react";

export default function AuthGroupLayout({ children }: { children: ReactNode }) {
  return <main className="min-h-dvh bg-black text-white">{children}</main>;
}
