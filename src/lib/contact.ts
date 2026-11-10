/** Shared by the form (client) and the API route (server) so the rules never drift. */

export const LIMITS = { name: 100, email: 254, messageMin: 10, message: 2000 } as const;

export type ContactField = "name" | "email" | "message";
export type FieldErrors = Partial<Record<ContactField, string>>;

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(
  raw: Partial<Record<ContactField, unknown>>,
): { ok: true; data: ContactInput } | { ok: false; errors: FieldErrors } {
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";
  const errors: FieldErrors = {};

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name)
    errors.name = `Keep your name under ${LIMITS.name} characters.`;

  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > LIMITS.email || !EMAIL.test(email))
    errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please enter a message.";
  else if (message.length < LIMITS.messageMin)
    errors.message = `Please write at least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.message)
    errors.message = `Keep your message under ${LIMITS.message} characters.`;

  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data: { name, email, message } };
}

/** Response body of POST /api/contact. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: "validation"; fields: FieldErrors }
  | { ok: false; error: "rate_limited" | "not_configured" | "send_failed" | "bad_request" };
