"use client";

import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  /** Сколько символов показывать в свёрнутом виде */
  limit?: number;
};

/** Длинный текст (биография) с кнопкой «Read more» */
export default function ExpandableText({ text, limit = 600 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const long = text.length > limit;
  const shown = !long || expanded ? text : `${text.slice(0, limit).replace(/\s+\S*$/, "")}…`;

  return (
    <div className="flex max-w-3xl flex-col items-start gap-2">
      <p className="whitespace-pre-line text-gray-300">{shown}</p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="cursor-pointer text-sm text-yellow-200 transition hover:text-yellow-300"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
