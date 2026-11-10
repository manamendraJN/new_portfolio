"use client";

import { AlertCircle, Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Label } from "@/components/ui";
import {
  LIMITS,
  validateContact,
  type ContactField,
  type ContactResponse,
  type FieldErrors,
} from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";

const FIELDS: ContactField[] = ["name", "email", "message"];

const inputClass =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base text-fg transition-[border-color,box-shadow] duration-200 placeholder:text-muted focus:border-fg focus:shadow-[0_1px_0_0_var(--fg)] focus-visible:outline-offset-4";

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} className="mt-2 flex min-h-5 items-start gap-2 text-sm text-accent-text">
      {message && (
        <>
          <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </>
      )}
    </p>
  );
}

/** Contact form with client validation, a server round trip, and clear success/error states. */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "", website: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  function setValue(field: ContactField | "website", v: string) {
    setValues((prev) => ({ ...prev, [field]: v }));
    // Clear a field's error as soon as the user edits it.
    if (field !== "website" && errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function focusFirstInvalid(next: FieldErrors) {
    const first = FIELDS.find((f) => next[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const local = validateContact(values);
    if (!local.ok) {
      setErrors(local.errors);
      focusFirstInvalid(local.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as ContactResponse;
      if (data.ok) {
        setStatus("success");
      } else if (data.error === "validation") {
        // The server is the source of truth: show its field errors.
        setErrors(data.fields);
        setStatus("idle");
        focusFirstInvalid(data.fields);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="space-y-3 border-t border-line pt-8">
        <h3
          ref={successRef}
          tabIndex={-1}
          className="flex items-center gap-3 text-[length:var(--text-title)] font-medium outline-none"
        >
          <Check aria-hidden="true" size={22} className="text-accent-text" />
          Message sent
        </h3>
        <p className="max-w-[var(--measure)] text-muted">
          Thanks for getting in touch. Your message has been delivered.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={sending} className="space-y-6">
      {status === "error" && (
        <div
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="flex items-start gap-3 border-l-2 border-accent py-1 pl-4 outline-none"
        >
          <AlertCircle aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-accent-text" />
          <p>
            Your message could not be sent. Please try again in a moment, or reach me on GitHub or
            LinkedIn. What you typed has been kept.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="cf-name" className="block">
          <Label>Name</Label>
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name}
          value={values.name}
          onChange={(e) => setValue("name", e.target.value)}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby="cf-name-error"
          className={inputClass}
        />
        <FieldError id="cf-name-error" message={errors.name} />
      </div>

      <div>
        <label htmlFor="cf-email" className="block">
          <Label>Email</Label>
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          value={values.email}
          onChange={(e) => setValue("email", e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby="cf-email-error"
          className={inputClass}
        />
        <FieldError id="cf-email-error" message={errors.email} />
      </div>

      <div>
        <label htmlFor="cf-message" className="block">
          <Label>Message</Label>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={(e) => setValue("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby="cf-message-error"
          className={`${inputClass} resize-y`}
        />
        <FieldError id="cf-message-error" message={errors.message} />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={values.website}
            onChange={(e) => setValue("website", e.target.value)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-fg px-8 text-[0.9375rem] font-medium text-bg transition-colors hover:bg-accent disabled:cursor-wait disabled:opacity-70"
      >
        {sending ? "Sending…" : status === "error" ? "Try again" : "Send message"}
      </button>
    </form>
  );
}
