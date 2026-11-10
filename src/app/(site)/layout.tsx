import type { ReactNode } from "react";
import { Footer, Nav, SkipLink } from "@/components/layout";

/** Shell for all public pages: skip link, navigation, footer. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Nav />
      {children}
      <Footer />
    </>
  );
}
