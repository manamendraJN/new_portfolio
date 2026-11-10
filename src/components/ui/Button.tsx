import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "link";

interface Common {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type AnchorProps = Common & { href: string; external?: boolean };
type NativeProps = Common & { href?: undefined } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className" | "children"
  >;

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 font-sans text-[0.9375rem] font-medium transition-[color,background-color,border-color,transform,text-decoration-color,text-underline-offset] duration-200";

const variants: Record<Variant, string> = {
  primary: "rounded-full bg-fg px-6 text-bg hover:bg-accent active:translate-y-px",
  secondary:
    "rounded-full border border-fg/40 px-6 text-fg hover:border-fg hover:bg-fg/5 active:translate-y-px",
  link: "px-0 text-fg underline decoration-line decoration-1 underline-offset-[0.25em] hover:text-link hover:decoration-link hover:underline-offset-[0.4em]",
};

/** Renders a link for hrefs and a native button otherwise. */
export function Button(props: AnchorProps | NativeProps) {
  if (props.href !== undefined) {
    const { variant = "primary", className, children, href, external } = props;
    const cls = cn(base, variants[variant], className);
    if (external || /^(https?:|mailto:)/.test(href)) {
      return (
        <a
          href={href}
          className={cls}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", className, children, ...rest } = props;
  return (
    <button type="button" className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
