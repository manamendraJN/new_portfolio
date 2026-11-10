import Link from "next/link";
import { Container, Label, Rule } from "@/components/ui";
import { site } from "@/content/site";
import { isTodo } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center text-sm underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]";

/** Quiet closing band. Shares the charcoal theme with the Contact section. */
export function Footer() {
  const links = site.social.flatMap((s) =>
    isTodo(s.href) ? [] : [{ label: s.label, href: s.href }],
  );

  return (
    <footer data-theme="dark" className="bg-bg pb-10 text-fg">
      <Container>
        <Rule />
        <div className="flex flex-col gap-8 pt-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="font-medium">{site.name}</p>
            <Label>{site.roles.join(" / ")}</Label>
          </div>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <Link href="/#hero" className={linkClass}>
                Back to top
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
