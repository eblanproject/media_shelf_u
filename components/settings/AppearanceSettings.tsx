"use client";

import { useTheme } from "@/hooks/useTheme";
import type { ThemePreference } from "@/lib/theme";
import { SettingsSection } from "./ui";

// Цвета превью заданы явно (style), а не утилитами Tailwind — иначе в светлой теме они бы тоже перевернулись
const PALETTES = {
  dark: { bg: "#000000", card: "#111827", line: "#374151", text: "#f3f4f6", accent: "#fde047" },
  light: { bg: "#ffffff", card: "#f3f4f6", line: "#d1d5db", text: "#111827", accent: "#ca8a04" },
};

const OPTIONS: { value: ThemePreference; label: string; description: string }[] = [
  { value: "dark", label: "Dark", description: "Cinema mode, easy on the eyes" },
  { value: "light", label: "Light", description: "Bright and high-contrast" },
  { value: "system", label: "System", description: "Follows your device setting" },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <SettingsSection id="appearance" title="Appearance" description="Choose how the site looks. Saved on this device.">
      <div role="radiogroup" aria-label="Theme" className="grid gap-4 sm:grid-cols-3">
        {OPTIONS.map((option) => {
          const selected = theme === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setTheme(option.value)}
              className={`flex cursor-pointer flex-col gap-3 rounded-xl border p-3 text-left transition hover:bg-white/5 ${
                selected ? "border-yellow-300 ring-1 ring-yellow-300" : "border-gray-700"
              }`}
            >
              <ThemePreview value={option.value} />
              <div className="flex items-start justify-between gap-2 px-1">
                <div>
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    selected ? "border-yellow-300" : "border-gray-600"
                  }`}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-yellow-300" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </SettingsSection>
  );
}

function ThemePreview({ value }: { value: ThemePreference }) {
  if (value === "system") {
    // половина тёмная, половина светлая
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-gray-700">
        <MiniPage palette={PALETTES.dark} />
        <div className="absolute inset-0" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }}>
          <MiniPage palette={PALETTES.light} />
        </div>
      </div>
    );
  }
  return (
    <div className="aspect-[16/9] overflow-hidden rounded-lg border border-gray-700">
      <MiniPage palette={PALETTES[value]} />
    </div>
  );
}

function MiniPage({ palette }: { palette: (typeof PALETTES)["dark"] }) {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-2" style={{ background: palette.bg }}>
      <div className="flex items-center justify-between">
        <span className="h-1.5 w-6 rounded-full" style={{ background: palette.accent }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette.accent }} />
      </div>
      <span className="h-1 w-full" style={{ background: palette.line }} />
      <div className="grid flex-1 grid-cols-4 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="rounded-sm" style={{ background: palette.card }} />
        ))}
      </div>
      <span className="h-1.5 w-1/2 rounded-full" style={{ background: palette.text, opacity: 0.7 }} />
    </div>
  );
}
