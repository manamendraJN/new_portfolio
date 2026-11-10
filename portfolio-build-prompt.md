# Build prompt: Navodya Manamendra portfolio (phased)

Paste everything below into your coding assistant, with the original specification file attached.

---

## Your role

You are a senior design engineer building my personal portfolio website. The attached specification describes the full project. This prompt tells you how to build it and where to depart from the specification. Where the two conflict, this prompt wins.

## How to work

1. Build in the nine phases listed below, in order, one phase per turn.
2. Start with Phase 1 only. Do not write code for any later phase.
3. At the end of each phase, stop and report: what you built, how you verified it, anything you could not verify, and what you need from me. Wait for my approval before the next phase.
4. Later phases add to earlier work. Do not rewrite or restyle components that already work unless I ask or a bug requires it.
5. Build every section static first. Motion is added in Phase 6, so the site must work fully without animation or WebGL.
6. Before reporting a phase as done, run the build and linter, and check the result at 375px, 768px, 1280px and 1920px widths with no horizontal overflow and no console errors.
7. Never invent content. Use only facts from the specification or from me. Where something is missing (employment dates, project details, links, screenshots), add a clearly marked `TODO` placeholder in the content files and list it in your report.

## Design direction (overrides specification section 2)

The specification's all-black palette is replaced. The site moves from dark to light and back to dark: a charcoal cinematic hero, ivory editorial content sections, and a charcoal close.

### Colour tokens

| Token | Dark theme | Light theme |
|---|---|---|
| Background | `#1C1B19` | `#F4F1EA` |
| Surface | `#262522` | `#EAE5DA` |
| Raised | `#302E2A` | `#FFFFFF` |
| Text | `#F0ECE3` | `#1A1917` |
| Secondary text | `#A8A49B` | `#6B675F` |
| Border | `#3A3833` | `#D9D3C6` |
| Accent | `#C9B37E` (gold) | `#8C6D3F` (bronze) |
| Interactive | `#8FA3C8` | `#3D5A8A` |

- Define these as CSS variables and switch them with a `data-theme` attribute on each section, so every component works on both themes without changes.
- Accent is for hairlines, numerals and one highlight per section. Interactive is for focus rings and link hover only.
- Check every text and background pair against WCAG AA. Use the bronze accent for rules and large text; darken it if you need it for small text.
- No pure black, no gradients as decoration, no glows, no glassmorphism.

### Section themes

| Section | Theme | Composition |
|---|---|---|
| Hero | Dark | Full-bleed scroll-driven frame sequence with serif display type |
| About | Light (ivory) | Asymmetric two-column editorial layout |
| Expertise | Light (sand `#EAE5DA`) | Typographic index with hairline rules, no cards, no icons |
| Projects | Light (ivory) | Large alternating case-study panels |
| Experience | Light (sand) | Vertical ledger with monospace date labels |
| Research | Dark band | Single publication plate, styled like a journal citation |
| Education | Light (ivory) | Quiet two-row academic record |
| Contact and footer | Dark | One large headline with a minimal form |

Each section must have its own layout. Do not repeat the same grid or card pattern.

### Typography

- Display: Instrument Serif, used only in the hero and section openers.
- Body and interface: Geist.
- Technical labels, dates, metadata: Geist Mono, small, uppercase, with wide letter spacing.
- Body text 16–17px with a line height around 1.6 and a maximum line length of about 68 characters.
- Section headings 28–44px. Only the hero name may go larger, up to about 96px on desktop.
- Use fluid sizes with `clamp()` and load fonts through `next/font`.

### Spacing and layout

- A 4px base spacing scale and a 12-column grid with a maximum content width of about 1280px.
- Generous vertical rhythm: section padding of roughly 96–160px on desktop and 64–96px on mobile.
- Favour whitespace and hairline rules over boxes, shadows and borders.

## Hero: scroll-driven frame sequence (overrides specification section 3, Section 01)

The hero does not use an autoplaying background video. The video is cut into frames, and scrolling plays them forward and backward.

- Extract about 100–150 frames with ffmpeg and export WebP in two sets: about 1920px wide for desktop and about 960px for mobile. Store them in `public/media/hero/desktop/` and `public/media/hero/mobile/` as `frame-0001.webp` onward.
- Example: `ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-2" -c:v libwebp -quality 72 public/media/hero/desktop/frame-%04d.webp`
- Draw frames to a single `<canvas>` sized with cover behaviour and device pixel ratio capped at 2.
- Drive the frame index with GSAP ScrollTrigger using `scrub`, with the hero pinned for about 2.5 viewport heights. This is the only pinned section on the site.
- Load the first frame immediately as the poster and preload it for a fast first paint. Preload the rest in the background, and while loading, draw the nearest frame that is ready.
- Text choreography: name, title, intro line and both buttons are visible on the first frame; they fade out around 40% progress; the last frames darken and hand off into the ivory About section.
- With `prefers-reduced-motion`, on slow connections, or if frames fail to load, show the single poster frame with no pin.
- Keep frame count, paths and dimensions in the site configuration file, so swapping the video means replacing frames and changing one config entry.
- Until I supply the video, build a polished static fallback composition and keep the sequence component ready to activate once frames exist.

## Technology (overrides specification section 6)

- Next.js with the App Router, TypeScript in strict mode, Tailwind CSS with tokens as CSS variables, GSAP with ScrollTrigger, Lucide icons. Deploy to Vercel.
- Do not add Framer Motion; GSAP covers all motion.
- Do not add Three.js or React Three Fiber. Create depth with CSS perspective and transforms only.
- Do not use torn-paper edges, a custom cursor, particles, or smooth-scroll libraries that replace native scrolling.
- Use server components by default and add `"use client"` only where interaction requires it.

### Folder structure

```
src/
  app/            layout, page, projects/[slug], api/contact, sitemap, robots, styleguide
  components/
    ui/           Button, Label, Heading, Container, Section, Rule
    layout/       Nav, Footer, MobileMenu
    sections/     Hero, About, Expertise, Projects, Experience, Research, Education, Contact
    motion/       Reveal, Parallax, FrameSequence, hooks (Phase 6)
  content/        site.ts, projects.ts, experience.ts, skills.ts, research.ts, education.ts
  lib/            types.ts, utils.ts, gsap.ts
  styles/         tokens.css, globals.css
public/           media/, og/
```

All copy and data live in `src/content/` with exported TypeScript types. Components never contain hard-coded content.

## Phases

### Phase 1: Foundation
- Scope: initialise the project, linting and formatting, colour and type tokens for both themes, fonts, global layout, typed content files filled from the specification, UI primitives, and an internal `/styleguide` page showing every token and primitive on both themes.
- Done when: the styleguide renders correctly at all four widths and the build and linter pass.

### Phase 2: Site shell
- Scope: navigation that is transparent over the hero and solid after it, adapts to dark and light sections, shows the active section, and has an accessible mobile menu; footer; skip link; empty section scaffolds with anchors and correct themes.
- Done when: every anchor link works and the menu is fully usable by keyboard and touch.

### Phase 3: Hero and About
- Scope: static hero composition with the poster or fallback and the canvas element in place but not scrubbing; both buttons; scroll indicator; the About section.
- Done when: both sections are correct at all widths and hero text is readable over the image.

### Phase 4: Expertise and Projects
- Scope: the skills index, the project gallery, and `projects/[slug]` case-study pages generated from content files.
- Done when: adding a project needs only a content-file edit, and confidential work shows anonymised descriptions with no internal screenshots.

### Phase 5: Experience, Research, Education, Contact
- Scope: the experience ledger, the publication plate with DOI link, the academic record with a certifications area, and the contact form with client and server validation, a server route, and success and error states.
- Done when: the form sends successfully and handles failure cleanly. The degree is shown as in progress and I am not described as the conference presenter.

### Phase 6: Motion system
- Scope: shared GSAP setup with cleanup on unmount; reusable Reveal and Parallax utilities; the hero frame-sequence scrub, pin and text choreography; the dark-to-light and light-to-dark section transitions; restrained micro-interactions on links, buttons, project previews and form fields; reduced-motion handling.
- Done when: scrolling feels native, there is no layout shift, and the site is fully usable with reduced motion enabled.

### Phase 7: Depth and media
- Scope: CSS 3D elevation and layered parallax on a few selected elements, mainly project panels; frame-set optimisation for count, compression and preload strategy; responsive images throughout.
- Done when: the hero and projects stay smooth on a mid-range phone.

### Phase 8: Optimisation, accessibility, SEO
- Scope: bundle and dependency audit, lazy loading, contrast and focus audit, heading hierarchy, alt text, metadata, Open Graph image, sitemap, robots.txt, favicon.
- Done when: Core Web Vitals are in the good range, there are no accessibility errors in automated checks, and no console errors remain.

### Phase 9: Quality assurance and deployment
- Scope: the full checklist in specification section 10, Phase 5; cross-browser testing; production deployment; domain setup.
- Done when: the live site passes the checklist end to end.

## Content rules

- Name: Navodya Manamendra. Title: Full-Stack Developer, Software Engineer, AI Enthusiast.
- Use the experience, research, education and skills facts exactly as written in the specification.
- Distinguish systems I built from systems I maintained or supported.
- No skill percentages, testimonials, client logos, statistics or stock photography.
- Keep copy concise and specific. Avoid generic lines such as "passionate about coding".

## Start now

Begin Phase 1. First give me a short summary of your plan for this phase and any questions that block it, then implement it and report as described above.

---

## Prompts for later turns

- Next phase: `Phase N is approved. Proceed to Phase N+1 only. Keep all existing work intact.`
- Fixes: `Before moving on, fix the following in Phase N without changing anything else: ...`
- Hero video ready: `The hero video is at <path>. Extract the desktop and mobile frame sets as described, update the site configuration, and verify the sequence.`
