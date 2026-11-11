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

/** "0764390987" -> "94764390987" (Sri Lanka, no plus), for wa.me and tel: links. */
export function lkIntl(local: string): string {
  const digits = local.replace(/\D/g, "");
  return digits.startsWith("0") ? `94${digits.slice(1)}` : digits;
}

/** "0764390987" -> "076 439 0987". */
export function lkDisplay(local: string): string {
  const d = local.replace(/\D/g, "");
  return d.length === 10 ? `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : local;
}
