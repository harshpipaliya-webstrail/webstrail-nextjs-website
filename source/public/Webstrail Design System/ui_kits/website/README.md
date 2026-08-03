# Website UI kit — Webstrail

A high-fidelity recreation of the Webstrail **marketing website**: the dental product-engineering landing experience. It demonstrates the design system end to end — the editorial-light layout, the warm logo palette, signature gradient cards, and the fade-and-rise scroll motion.

## Files
- `index.html` — the long-scroll **homepage**: sticky nav → hero (with a CSS product mock) → client proof → "what we do" pillars → solid-color signature band → filterable **work / case studies** → dark "how we work" steps → testimonial → discovery-call form → footer.
- `case-study.html` — an **outcome-framed case-study detail** page (solid-color header, stat bar, narrative, pull quote, CTA).
- `site.css` — all section + layout styling, built on the design-system tokens (`../../styles.css`). Class contracts mirror the React primitives (`.btn` ↔ `Button`, `.case`/`.pillar` ↔ `Card`, `.badge` ↔ `Badge`, `.sigband` ↔ `SignatureCard`).
- `app.js` — vanilla interactions: sticky-nav state, mobile menu, IntersectionObserver reveal-on-scroll, work filter, and a fake discovery-call form submit. All motion respects `prefers-reduced-motion`.

## Notes
- **Why token-driven HTML, not a React render:** the site is a static, fast, animated marketing experience. Every visual decision comes from the shared tokens in `styles.css`, so it stays 1:1 with the component library. For production, compose the React primitives in `components/` (load the compiled bundle and read `window.WebstrailDesignSystem_74bd7c`).
- **Copy** follows the brand voice exactly: sentence case, second person, contractions, specific names (Tooth Teller, Open Dental), zero hype words.
- **Imagery:** none was provided, so the hero uses a CSS-built dental dashboard mock and the case covers use solid logo colors — no stock photos invented. Drop real product screenshots into the `.mock` / `.case__cover` slots when available.
- Both screens are registered as **starting points** so consuming projects can seed from them.
