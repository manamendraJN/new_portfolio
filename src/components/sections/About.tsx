import { Reveal } from "@/components/motion";
import { Button, Container, Heading, Label, Rule, Section } from "@/components/ui";
import { about, site } from "@/content/site";
import { isTodo } from "@/lib/utils";

/** About: asymmetric editorial layout. Narrow heading column, wide text column. */
export function About() {
  const meta = site.sections.find((s) => s.id === "about");
  if (!meta) return null;
  const [lead, ...rest] = about;
  const cv = isTodo(site.cvUrl) ? null : site.cvUrl;
  const links = site.social.flatMap((s) =>
    isTodo(s.href) ? [] : [{ label: s.label, href: s.href }],
  );

  return (
    <Section edge id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="about-title">
      <Container grid className="gap-y-12">
        <Reveal className="col-span-12 lg:col-span-4">
          <Label accent>{meta.number}</Label>
          <Rule accent className="mt-4 mb-8 w-12!" />
          <Heading level={2} id="about-title">
            {meta.label}
          </Heading>
        </Reveal>

        <Reveal className="col-span-12 lg:col-span-7 lg:col-start-6">
          <p className="max-w-[34em] text-[length:clamp(1.25rem,1rem+1vw,1.75rem)] leading-[1.4] tracking-[-0.01em] text-balance">
            {lead}
          </p>
          <div className="mt-10 max-w-[var(--measure)] space-y-6 text-muted">
            {rest.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <Rule className="mt-12" />
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-1">
            {links.map((l) => (
              <li key={l.label}>
                <Button href={l.href} variant="link" external>
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </Button>
              </li>
            ))}
            {cv && (
              <li>
                <Button href={cv} variant="link" external>
                  Résumé
                </Button>
              </li>
            )}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
