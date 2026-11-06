"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/api/auth";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await logout().catch(() => null);
        router.push("/");
        router.refresh();
      }}
      className={className}
    >
      {pending ? "Logging out…" : "Logout"}
    </button>
  );
}
