import { ArrowUp, ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Container, Label, Section, SectionTitle } from "@/components/ui";
import { site } from "@/content/site";
import { cn, isTodo, lkDisplay, lkIntl } from "@/lib/utils";
import { CopyButton } from "./CopyButton";

/** Contact: direct, clickable ways to reach me. No form. Charcoal, closing the page. */
export function Contact() {
  const meta = site.sections.find((s) => s.id === "contact");
  if (!meta) return null;
  const { headline, note } = site.contactContent;

  const channels = [
    ...(isTodo(site.email)
      ? []
      : [
          {
            id: "email",
            label: "Email",
            Icon: Mail,
            value: site.email,
            href: `mailto:${site.email}`,
            copy: site.email,
            external: false,
          },
        ]),
    {
      id: "whatsapp",
      label: "WhatsApp",
      Icon: MessageCircle,
      value: lkDisplay(site.whatsapp),
      href: `https://wa.me/${lkIntl(site.whatsapp)}`,
      copy: `+${lkIntl(site.whatsapp)}`,
      external: true,
    },
    {
      id: "mobile",
      label: "Mobile",
      Icon: Phone,
      value: lkDisplay(site.mobile),
      href: `tel:+${lkIntl(site.mobile)}`,
      copy: `+${lkIntl(site.mobile)}`,
      external: false,
    },
  ];
  const links = site.social.flatMap((s) =>
    isTodo(s.href) ? [] : [{ label: s.label, href: s.href }],
  );

  return (
    <Section
      id={meta.id}
      theme={meta.theme}
      tone={meta.tone}
      aria-labelledby="contact-title"
      className="rounded-t-[1.75rem] pt-8! pb-6! md:rounded-t-[2.5rem] md:pt-[var(--section-y)]!"
    >
      <Container grid className="gap-y-8 md:gap-y-8">
        <Reveal className="col-span-12 space-y-4 md:space-y-6 lg:col-span-4">
          <SectionTitle id="contact-title">{headline}</SectionTitle>
          <p className="max-w-[30ch] text-sm text-muted md:text-base">{note}</p>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-8 lg:col-start-5 lg:pt-16">
          <ul>
            {channels.map(({ id, label, Icon, value, href, copy, external }) => (
              <li key={id} className="flex items-center gap-3">
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-w-0 flex-1 items-center gap-3 py-3.5 sm:gap-5 md:py-5"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-colors group-hover:border-accent md:size-12">
                    <Icon aria-hidden="true" size={20} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Label as="span" className="block">
                      {label}
                    </Label>
                    <span
                      className={cn(
                        "mt-0.5 block text-[0.9375rem] leading-tight font-medium [overflow-wrap:anywhere] transition-colors group-hover:text-link sm:text-[length:clamp(1.0625rem,0.85rem+1vw,1.625rem)]",
                        id === "email" && "max-sm:text-[0.8125rem]",
                      )}
                    >
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={20}
                    className="hidden shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-link sm:block"
                  />
                  {external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
                <CopyButton value={copy} label={label} />
              </li>
            ))}
          </ul>

          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-1 md:mt-6">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
                >
                  {l.label}
                  <ArrowUpRight aria-hidden="true" size={14} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <Container className="mt-4 flex justify-center md:mt-10">
        <Link
          href="/#hero"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-link"
        >
          <ArrowUp aria-hidden="true" size={16} />
          Back to top
        </Link>
      </Container>
    </Section>
  );
}
