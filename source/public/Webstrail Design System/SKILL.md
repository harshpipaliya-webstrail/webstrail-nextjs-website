---
name: webstrail-design
description: Use this skill to generate well-branded interfaces and assets for Webstrail (the product & engineering partner for dental companies), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `readme.md` — the full design guide: context, brand voice, color/type/spacing/motion foundations, iconography, and a file index. **Start here.**
- `styles.css` — single CSS entry point. Link this one file; it `@import`s every token + the `@font-face`/Google-Fonts loads and base element defaults.
- `tokens/` — CSS custom properties: `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`, plus `base.css` helpers (`.ws-eyebrow`, `.grad-text`, `.ws-reveal`).
- `components/` — React primitives (`Button`, `Badge`, `Tag`, `Avatar`, `Eyebrow`, `Card`, `Stat`, `SignatureCard`, `Input`). Each has a `.d.ts` (props) and `.prompt.md` (usage).
- `guidelines/` — foundation specimen cards (colors, type, spacing, brand, voice).
- `ui_kits/website/` — the marketing-site recreation (`index.html`, `case-study.html`, `site.css`, `app.js`) — the best reference for how it all comes together.
- `assets/` — the logo.

## Non-negotiables when designing for Webstrail
- **Voice:** confident + warm + specific. Sentence case. Second person. Contractions. Name real things (Tooth Teller, Open Dental, DSO). **Never** use hype words (unlock, elevate, seamless, robust, leverage, cutting-edge, "solutions", "we are passionate about").
- **Look:** light editorial canvas, warm neutrals, **Inter Tight** headlines and **Inter** body (the open-source substitute for the brand's Haas Grotesk / Haas Groot Disp — emphasis from size + color, not bold), uppercase tracked-sans eyebrows. Brand voltage comes from **solid color blocks, one per logo color** (orange, amber, sky, azure) — never gradients. Primary CTA is confident near-black ink; orange is the warm CTA, azure the cool one.
- **Motion:** fade-and-rise on scroll, gentle ease-out, subtle hover lift; always gate on `prefers-reduced-motion`.
- **Icons:** Lucide-style line icons (2px stroke). No emoji.
- **Substitutions to flag:** fonts are Google-Fonts stand-ins and icons are Lucide — swap for licensed/official assets if the user has them. The logo has no white/reversed variant.
