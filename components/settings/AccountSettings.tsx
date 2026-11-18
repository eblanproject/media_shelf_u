"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { deleteAccount, isNotSupported } from "@/lib/api/auth";
import { notify } from "@/lib/toast";
import type { UserProfile } from "@/types/user";
import { Field, FormMessage, SettingsSection, dangerButton, secondaryButton } from "./ui";

export default function AccountSettings({ user }: { user: UserProfile }) {
  return (
    <>
      <SettingsSection id="account" title="Session" description="You’re signed in on this device.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            Signed in as <span className="font-semibold text-white">{user.username}</span>
          </p>
          <LogoutButton className={secondaryButton} />
        </div>
      </SettingsSection>

      <DeleteAccount username={user.username} />
    </>
  );
}

function DeleteAccount({ username }: { username: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "info" } | null>(null);

  const ready = confirmName === username && password.length > 0;

  function close() {
    setOpen(false);
    setConfirmName("");
    setPassword("");
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    setPending(true);
    setMessage(null);
    try {
      await deleteAccount(password);
      notify("Your account has been deleted");
      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage(
        isNotSupported(error)
          ? { text: "Deleting an account isn’t available yet — the server doesn’t support it.", tone: "info" }
          : { text: error instanceof Error ? error.message : "Could not delete your account", tone: "error" },
      );
      setPending(false);
    }
  }

  return (
    <SettingsSection
      id="danger"
      title="Delete account"
      description="Permanently removes your account, watchlist and comments. This can’t be undone."
      danger
    >
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={dangerButton}>
          Delete account…
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="delete-confirm"
              label={`Type “${username}” to confirm`}
              autoComplete="off"
              spellCheck={false}
              value={confirmName}
              onChange={(event) => setConfirmName(event.target.value)}
            />
            <Field
              id="delete-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <FormMessage message={message} />

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={!ready || pending} className={dangerButton}>
              {pending ? "Deleting…" : "Delete my account"}
            </button>
            <button type="button" onClick={close} disabled={pending} className={secondaryButton}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </SettingsSection>
  );
}
