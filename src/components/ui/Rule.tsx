import { cn } from "@/lib/utils";

interface RuleProps {
  accent?: boolean;
  className?: string;
}

/** Hairline divider. Decorative, hidden from assistive tech. */
export function Rule({ accent, className }: RuleProps) {
  return (
    <hr
      aria-hidden="true"
      className={cn("h-px w-full border-0", accent ? "bg-accent" : "bg-line", className)}
    />
  );
}
