import { CoverParallax, Reveal } from "@/components/motion";
import { Container, Label, Section, SectionTitle } from "@/components/ui";
import { certificates, education } from "@/content/education";
import { site } from "@/content/site";
import { isTodo, text } from "@/lib/utils";
import { CertificateGallery } from "./CertificateGallery";

/** Education: a quiet two-row record. Row one is the degree, row two the certificates. */
export function Education() {
  const meta = site.sections.find((s) => s.id === "education");
  if (!meta) return null;

  return (
    <Section id={meta.id} theme={meta.theme} tone={meta.tone} aria-labelledby="education-title">
      <CoverParallax coveredBy="contact">
        <Container grid className="gap-y-8 md:gap-y-10">
          <Reveal as="header" className="col-span-12 lg:col-span-4">
            <SectionTitle id="education-title">{meta.label}</SectionTitle>
          </Reveal>

          <div className="col-span-12 space-y-8 md:space-y-10 lg:col-span-8 lg:col-start-5 lg:pt-16">
            {/* Degree */}
            <Reveal className="space-y-3">
              <h3>
                <Label>Degree</Label>
              </h3>
              <ul className="space-y-4 md:space-y-8">
                {education.map((e) => (
                  <li key={e.id} className="space-y-2.5">
                    <p className="text-[length:var(--text-title)] leading-snug font-medium">
                      {text(e.qualification)}
                    </p>
                    <p>{text(e.institution)}</p>
                    <p className="flex flex-wrap gap-x-5 gap-y-1">
                      <Label accent>
                        {e.status === "in-progress" ? "In progress" : "Completed"}
                      </Label>
                      {e.stage && <Label>{e.stage}</Label>}
                      {e.expectedGraduation && !isTodo(e.expectedGraduation) && (
                        <Label>Expected {e.expectedGraduation}</Label>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Certificates */}
            <Reveal className="space-y-3">
              <h3>
                <Label>Certificates</Label>
              </h3>
              <CertificateGallery items={certificates} />
            </Reveal>
          </div>
        </Container>
      </CoverParallax>
    </Section>
  );
}
