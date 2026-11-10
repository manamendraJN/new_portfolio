import { Container, Heading, Label, Section } from "@/components/ui";
import { site } from "@/content/site";

/** Phase 1 holding page. Sections are built in Phases 2-5. */
export default function Home() {
  return (
    <main id="main">
      <Section theme="dark" className="flex min-h-svh items-center">
        <Container>
          <Label accent>Portfolio, in progress</Label>
          <Heading level={1} variant="hero" className="mt-6">
            {site.name}
          </Heading>
          <p className="mt-6 max-w-[var(--measure)] text-muted">{site.title}</p>
        </Container>
      </Section>
    </main>
  );
}
