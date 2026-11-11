import type { ReactNode } from "react";
import { Nav, SkipLink } from "@/components/layout";

/** Shell for all public pages: skip link and navigation. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Nav />
      {children}
    </>
  );
}
