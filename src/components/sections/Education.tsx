import { CoverParallax, Reveal } from "@/components/motion";
import { Container, Label, Rule, Section, SectionTitle } from "@/components/ui";
import { certificates, education } from "@/content/education";
import { site } from "@/content/site";
import { isTodo, text } from "@/lib/utils";
import { CertificateGallery } from "./CertificateGallery";

/** Education: a quiet two-row record. Row one is the degree, row two the certificates. */
export function Education() {
  const meta = site.sections.find((s) => s.id === "education");
  if (!meta) return null;

  return (
    <Section
      edge
      id={meta.id}
      theme={meta.theme}
      tone={meta.tone}
      aria-labelledby="education-title"
    >
      <CoverParallax coveredBy="contact">
        <Container>
          <Reveal as="header" className="mb-6 md:mb-20">
            <SectionTitle id="education-title">{meta.label}</SectionTitle>
          </Reveal>

          <Rule accent />

          {/* Row 1: degree */}
          <Reveal className="grid grid-cols-12 gap-x-6 gap-y-2 py-4 md:gap-y-4 md:py-12">
            <h3 className="col-span-12 md:col-span-3">
              <Label>Degree</Label>
            </h3>
            <ul className="col-span-12 space-y-4 md:col-span-8 md:col-start-5 md:space-y-8">
              {education.map((e) => (
                <li key={e.id} className="space-y-2">
                  <p className="text-[length:var(--text-title)] leading-snug font-medium">
                    {text(e.qualification)}
                  </p>
                  <p>{text(e.institution)}</p>
                  <p className="flex flex-wrap gap-x-5 gap-y-1">
                    <Label accent>{e.status === "in-progress" ? "In progress" : "Completed"}</Label>
                    {e.stage && <Label>{e.stage}</Label>}
                    {e.expectedGraduation && !isTodo(e.expectedGraduation) && (
                      <Label>Expected {e.expectedGraduation}</Label>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Rule />

          {/* Row 2: certificates */}
          <Reveal className="grid grid-cols-12 gap-x-6 gap-y-3 py-4 md:gap-y-8 md:py-12">
            <h3 className="col-span-12 md:col-span-3">
              <Label>Certificates</Label>
            </h3>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <CertificateGallery items={certificates} />
            </div>
          </Reveal>
          <Rule />
        </Container>
      </CoverParallax>
    </Section>
  );
}
