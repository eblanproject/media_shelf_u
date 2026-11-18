import type { InputHTMLAttributes, ReactNode } from "react";

/** Карточка-раздел страницы настроек; id нужен для навигации по якорям */
export function SettingsSection({
  id,
  title,
  description,
  children,
  danger,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-24 rounded-xl border bg-gray-900/60 p-5 sm:p-6 ${danger ? "border-red-900/70" : "border-gray-800"}`}
    >
      <h2 id={`${id}-title`} className={`text-xl font-bold ${danger ? "text-red-400" : ""}`}>
        {title}
      </h2>
      <p className="mt-1 mb-6 text-sm text-gray-400">{description}</p>
      {children}
    </section>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
};

export function Field({ id, label, hint, error, className = "", ...props }: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="text-xs font-semibold text-gray-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded border bg-gray-900 px-3 py-2 text-white outline-none placeholder:text-gray-500 focus:ring-1 ${
          error
            ? "border-red-700 focus:border-red-500 focus:ring-red-500"
            : "border-gray-700 focus:border-yellow-300 focus:ring-yellow-300"
        }`}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Сообщение под формой: ошибка сервера или «пока недоступно» */
export function FormMessage({ message }: { message: { text: string; tone: "error" | "info" } | null }) {
  if (!message) return null;
  return (
    <p
      role={message.tone === "error" ? "alert" : "status"}
      className={`rounded-lg border px-3 py-2 text-sm ${
        message.tone === "error" ? "border-red-900 bg-red-950/40 text-red-300" : "border-gray-700 bg-gray-800/60 text-gray-300"
      }`}
    >
      {message.text}
    </p>
  );
}

export const primaryButton =
  "cursor-pointer rounded-xl bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButton =
  "cursor-pointer rounded-xl border border-gray-600 px-5 py-2.5 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButton =
  "cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-[#fff] transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50";
