import Link from "next/link";
import type { NavItem, SectionMeta } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui";

interface MobileMenuProps {
  id: string;
  items: NavItem[];
  sections: SectionMeta[];
  activeId: string;
  onNavigate: () => void;
}

/**
 * Full-screen menu panel for small screens. Rendered only while open.
 * Open/close state, focus trap, Escape and scroll lock live in Nav.
 */
export function MobileMenu({ id, items, sections, activeId, onNavigate }: MobileMenuProps) {
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      data-theme="dark"
      className="fixed inset-0 z-40 overflow-y-auto bg-bg pt-16 text-fg md:hidden"
    >
      <nav aria-label="Sections" className="px-[var(--gutter)] py-8">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const meta = sections.find((s) => `#${s.id}` === item.href);
            const active = meta?.id === activeId;
            return (
              <li key={item.href}>
                <Link
                  href={`/${item.href}`}
                  onClick={onNavigate}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "flex min-h-14 items-baseline gap-4 py-4 text-2xl font-medium tracking-tight transition-colors hover:text-link",
                    active && "text-accent-text",
                  )}
                >
                  {meta && <Label accent>{meta.number}</Label>}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
