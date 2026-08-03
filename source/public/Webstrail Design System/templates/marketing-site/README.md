# Webstrail marketing-site template

A ready-to-copy starting point for a Webstrail dental product-engineering homepage. Built on the design-system tokens — no build step.

## Use
1. Copy this folder into your project.
2. Open `index.html`. It loads the design system via `./ds-base.js`, which links `styles.css` (and can optionally load the React component bundle — see the commented block).
3. In a consuming project, edit the single `base` line in `ds-base.js` to point at the bound `_ds/<folder>` tree relative to this page.

## Files
- `index.html` — the homepage (nav, hero, pillars, signature band, filterable work, approach, discovery-call form, footer).
- `site.css` — section + layout styling (token-driven).
- `app.js` — sticky nav, mobile menu, reveal-on-scroll, work filter, form.
- `ds-base.js` — the one-line design-system loader.

## Edit points
- Swap copy in `index.html` (keep the brand voice: sentence case, second person, specific, no hype words).
- Replace the `.mock` dashboard / `.case__cover` solid-color panels with real product screenshots when available.
- Logo lives at `../../assets/webstrail-logo.png` (repoint if your bind path differs).
