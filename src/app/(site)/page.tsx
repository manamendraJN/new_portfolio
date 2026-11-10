import {
  About,
  Contact,
  Education,
  Experience,
  Expertise,
  Hero,
  Projects,
  Research,
} from "@/components/sections";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <Experience />
      <Research />
      <Education />
      <Contact />
    </main>
  );
}
