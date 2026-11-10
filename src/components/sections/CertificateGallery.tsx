import Image from "next/image";
import { Label } from "@/components/ui";
import type { Certificate } from "@/lib/types";

/** Reusable gallery. A preview image appears only when a genuine imageUrl is supplied. */
export function CertificateGallery({ items }: { items: Certificate[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((c) => (
        <li key={c.id} className="space-y-4">
          <div className="relative aspect-[4/3] border border-line bg-surface">
            {c.imageUrl ? (
              <Image
                src={c.imageUrl}
                alt={`${c.title} certificate from ${c.issuer}`}
                fill
                unoptimized
                sizes="(min-width: 1280px) 22vw, (min-width: 640px) 40vw, 100vw"
                className="object-contain"
              />
            ) : (
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center p-6"
              >
                <Label accent>{c.issuer}</Label>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">{c.title}</h4>
            <p className="text-sm text-muted">
              {c.issuer}
              {c.issued ? ` · ${c.issued}` : ""}
            </p>
            {c.credential && <Label as="p">{c.credential}</Label>}
            {c.verifyUrl && (
              <a
                href={c.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center text-sm underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
              >
                Verify
                <span className="sr-only"> {c.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
