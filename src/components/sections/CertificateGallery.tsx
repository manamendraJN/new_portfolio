import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Label } from "@/components/ui";
import type { Certificate } from "@/lib/types";

/**
 * Compact certificate list: one tight row per certificate, in two columns on wide screens.
 * A small preview thumbnail appears only when a genuine imageUrl is supplied.
 */
export function CertificateGallery({ items }: { items: Certificate[] }) {
  return (
    <ul className="grid sm:grid-cols-2 sm:gap-x-10">
      {items.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between gap-4 border-t border-line py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            {c.imageUrl && (
              <div className="relative aspect-[4/3] w-14 shrink-0 border border-line bg-surface">
                <Image
                  src={c.imageUrl}
                  alt={`${c.title} certificate from ${c.issuer}`}
                  fill
                  unoptimized
                  sizes="56px"
                  className="object-contain"
                />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="text-[0.9375rem] leading-snug font-medium">{c.title}</h4>
              <p className="text-sm leading-snug text-muted">
                {c.issuer}
                {c.issued ? ` · ${c.issued}` : ""}
              </p>
              {c.credential && <Label as="p">{c.credential}</Label>}
            </div>
          </div>

          {c.verifyUrl && (
            <a
              href={c.verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
            >
              Verify
              <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> {c.title} (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
