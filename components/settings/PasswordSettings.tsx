"use client";

import { useState, type FormEvent } from "react";
import { changePassword, isNotSupported } from "@/lib/api/auth";
import { notify } from "@/lib/toast";
import { isValidPassword } from "@/lib/validations/auth";
import { Field, FormMessage, SettingsSection, primaryButton } from "./ui";

export default function PasswordSettings() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "info" } | null>(null);

  const nextError =
    submitted && !isValidPassword(next)
      ? "At least 8 characters"
      : submitted && next === current
        ? "The new password must differ from the current one"
        : null;
  const confirmError = (submitted || confirm.length >= next.length) && confirm && confirm !== next ? "Passwords don’t match" : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setMessage(null);
    if (!current || !isValidPassword(next) || next === current || next !== confirm) return;

    setPending(true);
    try {
      await changePassword(current, next);
      setCurrent("");
      setNext("");
      setConfirm("");
      setSubmitted(false);
      notify("Password changed");
    } catch (error) {
      setMessage(
        isNotSupported(error)
          ? { text: "Changing the password isn’t available yet — the server doesn’t support it.", tone: "info" }
          : { text: error instanceof Error ? error.message : "Could not change the password", tone: "error" },
      );
    } finally {
      setPending(false);
    }
  }

  const type = visible ? "text" : "password";

  return (
    <SettingsSection id="security" title="Password" description="Use at least 8 characters. You stay signed in after the change.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <Field
          id="current-password"
          label="Current password"
          type={type}
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          error={submitted && !current ? "Enter your current password" : null}
          className="sm:max-w-sm"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="new-password"
            label="New password"
            type={type}
            autoComplete="new-password"
            value={next}
            onChange={(event) => setNext(event.target.value)}
            error={nextError}
          />
          <Field
            id="confirm-password"
            label="Repeat new password"
            type={type}
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            error={confirmError ?? (submitted && !confirm ? "Repeat the new password" : null)}
          />
        </div>

        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-300">
          <input
            type="checkbox"
            checked={visible}
            onChange={(event) => setVisible(event.target.checked)}
            className="h-4 w-4 accent-yellow-300"
          />
          Show passwords
        </label>

        <FormMessage message={message} />

        <div>
          <button type="submit" disabled={pending || !current || !next || !confirm} className={primaryButton}>
            {pending ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </SettingsSection>
  );
}
