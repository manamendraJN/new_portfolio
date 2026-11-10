import type { Todo } from "./types";

/** Join class names, skipping falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function isTodo(v: unknown): v is Todo {
  return typeof v === "object" && v !== null && "todo" in v;
}

/** Resolve a content value to display text. TODOs render as a visible marker. */
export function text(v: string | Todo): string {
  return isTodo(v) ? `[TODO: ${v.todo}]` : v;
}
