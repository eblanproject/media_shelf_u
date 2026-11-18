"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { isNotSupported, updateProfile, type UpdateProfilePayload } from "@/lib/api/auth";
import { notify } from "@/lib/toast";
import { isValidEmail } from "@/lib/validations/auth";
import type { UserProfile } from "@/types/user";
import { Field, FormMessage, SettingsSection, primaryButton, secondaryButton } from "./ui";

const USERNAME_PATTERN = /^[A-Za-z0-9_.-]+$/;

function validateUsername(value: string) {
  if (value.length < 3) return "At least 3 characters";
  if (value.length > 50) return "At most 50 characters";
  if (!USERNAME_PATTERN.test(value)) return "Only letters, digits, “_”, “.” and “-”";
  return null;
}

export default function ProfileSettings({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [touched, setTouched] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: "error" | "info" } | null>(null);

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();
  const usernameError = touched ? validateUsername(trimmedUsername) : null;
  const emailError = touched && !isValidEmail(trimmedEmail) ? "Enter a valid email" : null;

  const changes: UpdateProfilePayload = {};
  if (trimmedUsername !== user.username) changes.username = trimmedUsername;
  if (trimmedEmail.toLowerCase() !== user.email.toLowerCase()) changes.email = trimmedEmail;
  const dirty = Object.keys(changes).length > 0;

  function reset() {
    setUsername(user.username);
    setEmail(user.email);
    setTouched(false);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setMessage(null);
    if (!dirty || validateUsername(trimmedUsername) || !isValidEmail(trimmedEmail)) return;

    setPending(true);
    try {
      const updated = await updateProfile(changes);
      setUsername(updated.username);
      setEmail(updated.email);
      setTouched(false);
      notify("Profile updated");
      router.refresh();
    } catch (error) {
      setMessage(
        isNotSupported(error)
          ? { text: "Changing your name and email isn’t available yet — the server doesn’t support it.", tone: "info" }
          : { text: error instanceof Error ? error.message : "Could not update your profile", tone: "error" },
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <SettingsSection id="profile" title="Profile" description="Your public name and the email you sign in with.">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <div
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-yellow-200 text-2xl font-black text-black"
          >
            {(trimmedUsername || user.username).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-bold">{trimmedUsername || user.username}</p>
            <p className="truncate text-sm text-gray-400">{trimmedEmail || user.email}</p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="username"
            label="Username"
            autoComplete="username"
            value={username}
            maxLength={50}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => setTouched(true)}
            error={usernameError}
            hint="You can also sign in with it."
          />
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setTouched(true)}
            error={emailError}
          />
        </div>

        <FormMessage message={message} />

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={!dirty || pending} className={primaryButton}>
            {pending ? "Saving…" : "Save changes"}
          </button>
          {dirty && (
            <button type="button" onClick={reset} disabled={pending} className={secondaryButton}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </SettingsSection>
  );
}
