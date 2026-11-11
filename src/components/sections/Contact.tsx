import { ContactField, Reveal } from "@/components/motion";
import { Container, Section, SectionTitle } from "@/components/ui";
import { site } from "@/content/site";
import { isTodo } from "@/lib/utils";
import { ContactForm } from "./ContactForm";

/** Contact: one large headline and a minimal form. Charcoal, closing the page. */
export function Contact() {
  const meta = site.sections.find((s) => s.id === "contact");
  if (!meta) return null;
  const { headline, note } = site.contactContent;
  const email = isTodo(site.email) ? null : site.email;
  const links = site.social.flatMap((s) =>
    isTodo(s.href) ? [] : [{ label: s.label, href: s.href }],
  );

  return (
    <Section edge id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="contact-title">
      <ContactField />
      <Container grid className="relative gap-y-12">
        <Reveal className="col-span-12 space-y-8 lg:col-span-6">
          <SectionTitle id="contact-title">{headline}</SectionTitle>
          <p className="max-w-[34ch] text-muted">{note}</p>

          <ul className="flex flex-col gap-1">
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex min-h-11 items-center underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
                >
                  {email}
                </a>
              </li>
            )}
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center underline decoration-[var(--line)] underline-offset-4 transition-colors hover:text-link hover:decoration-[var(--link)]"
                >
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="relative col-span-12 lg:col-span-5 lg:col-start-8">
          <ContactForm />
        </Reveal>
      </Container>
    </Section>
  );
}
