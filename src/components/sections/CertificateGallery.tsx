import { ArrowUpRight } from "lucide-react";
import { Label } from "@/components/ui";
import type { Certificate } from "@/lib/types";
import { CertificateImage } from "./CertificateImage";

/**
 * Compact certificate list: one tight row per certificate, in two columns on wide screens.
 * A small preview thumbnail appears only when a genuine imageUrl is supplied.
 */
export function CertificateGallery({ items }: { items: Certificate[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 sm:gap-x-10">
      {items.map((c) => (
        <li
          key={c.id}
          className="flex items-center justify-between gap-2 py-3 sm:gap-4 sm:py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            {c.imageUrl && <CertificateImage src={c.imageUrl} title={c.title} issuer={c.issuer} />}
            <div className="min-w-0">
              <h4 className="text-[0.8125rem] leading-snug font-medium sm:text-[0.9375rem]">
                {c.title}
              </h4>
              <p className="text-xs leading-snug text-muted sm:text-sm">
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
              <span className="max-sm:sr-only">Verify</span>
              <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> {c.title} (opens in a new tab)</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
