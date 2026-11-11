"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useRef } from "react";

interface CertificateImageProps {
  src: string;
  title: string;
  issuer: string;
}

/**
 * A small certificate thumbnail that opens the full image in a modal dialog. Uses the native
 * <dialog>: Escape closes it, focus stays inside while it is open and returns to the
 * thumbnail afterwards. Clicking outside the image also closes it.
 */
export function CertificateImage({ src, title, issuer }: CertificateImageProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const label = `${title} certificate from ${issuer}`;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-haspopup="dialog"
        aria-label={`View ${label} larger`}
        className="relative block aspect-[4/3] w-14 shrink-0 cursor-zoom-in overflow-hidden border border-line bg-surface transition-[border-color] duration-200 hover:border-accent"
      >
        <Image src={src} alt="" fill unoptimized sizes="56px" className="object-contain" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={label}
        onClick={(e) => {
          // A click on the backdrop targets the dialog itself, not its contents.
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto max-h-none max-w-none overflow-visible border-0 bg-transparent p-0 backdrop:bg-[#1c1b19]/90"
      >
        <div data-theme="dark" className="flex max-w-[94vw] flex-col gap-3 text-fg">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">
              {title} <span className="text-muted">· {issuer}</span>
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-fg/40 transition-[border-color] duration-200 hover:border-fg"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </div>
          <Image
            src={src}
            alt={label}
            width={1600}
            height={1200}
            unoptimized
            sizes="94vw"
            className="h-auto max-h-[80svh] w-auto max-w-[94vw] object-contain"
          />
        </div>
      </dialog>
    </>
  );
}
