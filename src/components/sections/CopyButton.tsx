"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/** Copies a value to the clipboard and confirms it, for visitors and screen readers alike. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the value is still a link and can be selected */
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
      >
        {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
      </button>
      <span className="sr-only" role="status">
        {copied ? `${label} copied` : ""}
      </span>
    </>
  );
}
