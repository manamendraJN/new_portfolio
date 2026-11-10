import { validateContact, type ContactResponse } from "@/lib/contact";

/**
 * POST /api/contact
 *
 * Delivery uses a Resend-compatible HTTP API, configured by environment
 * variables (see .env.example). With no configuration the route answers 503
 * and the form shows its error state; nothing is ever sent to a made-up address.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

/** Best-effort, per-instance rate limit. Not a substitute for a shared store. */
function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const reply = (body: ContactResponse, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

/** Remove line breaks so user input can never inject into a header-like field. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return reply({ ok: false, error: "rate_limited" }, 429);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (typeof parsed !== "object" || parsed === null) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "bad_request" }, 400);
  }

  // Honeypot: real visitors never fill this field. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply({ ok: true }, 200);
  }

  const result = validateContact(body);
  if (!result.ok) return reply({ ok: false, error: "validation", fields: result.errors }, 422);

  const apiKey = process.env.CONTACT_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  const endpoint = process.env.CONTACT_API_URL || "https://api.resend.com/emails";
  if (!apiKey || !to || !from) return reply({ ok: false, error: "not_configured" }, 503);

  const { name, email, message } = result.data;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio message from ${oneLine(name)}`,
        text: `Name: ${oneLine(name)}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return reply({ ok: false, error: "send_failed" }, 502);
  } catch {
    return reply({ ok: false, error: "send_failed" }, 502);
  }

  return reply({ ok: true }, 200);
}
