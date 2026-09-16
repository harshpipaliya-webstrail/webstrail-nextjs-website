# Webstrail Design System

The brand, foundations, components, and UI kit for **Webstrail** — the product and engineering partner for dental companies. Use it to build on-brand interfaces, marketing pages, decks, and prototypes that look and sound like Webstrail.

> **Tagline (locked):** Here for the build, and everything after.
> **Positioning (dental):** Product and engineering, for dentistry and nothing else.
> **Elevator:** We're the product team for dental companies that don't have one.

---

## 1. Company & product context

Webstrail designs, builds, **and runs** custom software for the dental industry across North America. The sharp ICP is **multi-location dental operators and dental-enablement companies** — DSOs and groups, membership-plan / benefits platforms, practice-management & coaching firms, and pre-team dental-tech founders — who need software built and operated but have no engineering team of their own.

The wedge is a quadrant no competitor owns: **dental-native AND build-and-run accountability.** Dev shops ship code and leave; off-the-shelf platforms can't customize. Webstrail builds it right once and stays to run it.

**Named proof (use these, don't over-claim):** Tooth Teller (2-yr build + run), Fortune Management (practice-management & coaching), TruBlu Plan for Health (membership/wellness plans), Smile Wizard (dental product & brand). A ~20-person MERN / Python team with design and product capability. 100% of clients chose to stay on retainer.

**On AI:** a capability embedded *inside* dental products (patient/member messaging, scheduling, intake, revenue cycle) — "AI where it actually pays." Never the headline, never a standalone pillar.

### Primary product surface
A **marketing website** — the dental product-engineering landing experience. This is the centerpiece UI kit in `ui_kits/website/`.

### Source materials (provided — reader may not have access; recorded for traceability)
- `uploads/Webstrail Logo V.1.png` — primary logo (colors sampled into the palette).
- `uploads/brand-voice-guidelines.md` — canonical voice & messaging (HIGH confidence).
- `uploads/webstrail-positioning-strategy.pdf` — positioning & ICP.
- `uploads/webstrail-gtm-playbook.pdf` — go-to-market & sales engine.
- `uploads/webstrail-competitive-brief.pdf` — North America competitive landscape.
- `uploads/DESIGN-airtable.md` — an *editorial-light* structural reference (white canvas, signature color cards, modest type weights). Borrowed as **structure only**; recolored to Webstrail's warm palette, plus the gradients and motion the brand's gradient-ribbon mark invites.

---

## 2. Content fundamentals (how Webstrail writes)

The voice is **a senior dental-software expert who talks like a friendly, straight-talking colleague — confident and warm, never hype-y or stiff.** Four traits: deeply expert, warm & human, confident, approachable.

- **Person & tone:** Second person ("you," "your dental company"). Confident but friendly — we warm the edges. We have a point of view and state it without hedging.
- **Casing:** Sentence case for everything — headings, buttons, labels. Never Title Case, never ALL CAPS in prose. (The mono **eyebrow** overline is the one place we uppercase, as a typographic device.)
- **Contractions:** Yes — we're, you'd, don't. They keep us human.
- **Sentence rhythm:** Vary length. Short punches next to longer lines. Uniform medium sentences read like a machine.
- **Specificity is the #1 rule:** Name real things — Tooth Teller, Open Dental, Dentrix, membership billing, RCM, discovery sprint, build-and-run. Vagueness is the biggest "AI wrote this" tell.
- **Em dashes:** Fine, but sparingly. **Oxford comma:** yes.
- **Emoji:** none. Not part of the brand.

**Words we use:** build and run · product team · dental companies · ship · here for the build, and everything after · for dentistry and nothing else · DSO · membership plan · integrations · Open Dental / Dentrix / Eaglesoft · discovery sprint · partner.

**Words we never use (hype / AI-tells / filler):** unlock · elevate · seamless · robust · leverage · cutting-edge · revolutionize · game-changer · empower · "solutions" (as a noun for what we sell) · best-in-class · world-class · synergy · "in today's fast-paced world" · delve · tapestry · realm · bustling · "we are passionate about."

**Voice in action**
- ❌ "We leverage cutting-edge solutions to elevate your dental practice."
- ✅ "We build the software your dental company runs on — and we stay to run it with you."
- ❌ "Our robust, seamless platform empowers DSOs to unlock growth."
- ✅ "We build the custom tools off-the-shelf software won't, so your locations actually run the way you want."

See the **Voice — say this, not that** card in the Design System tab (`guidelines/brand-voice.card.html`).

---

## 3. Visual foundations

**Overall feeling:** light, editorial, warm, and confident. White / warm-paper canvas, dark warm ink, generous whitespace — punctuated by full-bleed **solid-color signature cards** (one per logo color) that carry the brand's voltage. The logo is a clean four-color mark (orange · amber · sky · azure), so the brand reads as **crisp solid color blocks, never gradients**.

### Color
Sampled straight from the four-color logo mark. Two brand families plus warm neutrals:
- **Warm:** orange `#F0611F` (+ deep `#DC4A18`, soft `#FCE6DB`) and amber/gold `#E0A82E`.
- **Cool:** sky `#34BFF0`, azure `#1280D4` (also the link color), navy `#0F5090`.
- **Neutrals are warm-tinted, never cool gray:** canvas `#FFFFFF`, warm paper `#FAF7F2`, sand `#F3EEE4`, ink `#1E1D1B`, body `#4C4A43`, muted `#6F6B61`, warm hairline `#ECE5D9`.
- **Signature surfaces (solid):** `--sig-coral-bg`, `--sig-amber-bg`, `--sig-sky-bg`, `--sig-azure-bg`, `--sig-navy-bg`, `--sig-ink-bg` — each paired with an `--sig-*-fg` text color (light surfaces take ink text; dark blues take white). These solid blocks replace all gradients. The one remaining soft effect is `--wash-warm`, a faint single-hue radial behind the hero (not a rainbow).
- **Primary action is confident near-black ink** (`--action`); the solid signature surfaces do the brand-shouting. Orange is the warm energetic CTA (`brand`), azure the cool one.

Tokens: `tokens/colors.css`. Cards: Colors group + `guidelines/brand-solids.card.html`.

### Typography
- **Display / headlines:** **Inter Tight** — a tight, confident grotesque. The documented open-source substitute for **Haas Groot Disp** (the brand's licensed display type). Emphasis comes from **size and color, not heavy weight** (display runs ~500, hero ~600), tracked tight (`--track-display` −0.022em).
- **Body / UI / labels / eyebrows:** **Inter** — substitute for **Haas Grotesk**. Eyebrows are uppercase, tracked sans (not mono).
- **Mono (incidental only):** **JetBrains Mono** — code specimens. Not used for UI chrome.
- Scale is generous: hero display clamps up to ~76px; body 16–19px. Minimums respected.
- ⚠️ **Font substitution:** the brand type is **Haas Grotesk / Haas Groot Disp** (per the design analysis); no binaries were supplied, so we load the documented open-source substitute **Inter / Inter Tight** in `tokens/fonts.css`. **Upload the licensed Haas fonts** and we'll swap the `@import` + `--font-*` declarations.

Tokens: `tokens/typography.css`. Cards: Type group.

### Spacing, radii & layout
- 4px base grid; **96px** vertical rhythm between major bands (`--section-y`). Content max width ~1200px; prose column ~760px.
- Radii read **soft and approachable**: inputs/cards 12–16px, signature cards 24–32px, **pill** for all buttons. Not pill-everywhere — pill is buttons, badges, chips.
- Tokens: `tokens/spacing.css`. Cards: Spacing group.

### Backgrounds & surfaces
White canvas is the floor. Warm-paper (`--surface-1`) and sand (`--surface-2`) bands alternate the rhythm. One **ink** dark band (the "How we work" section) and the **solid-color signature surfaces** provide contrast. No photography is shipped (none provided) — depth comes from solid color blocks and a CSS-built product mock, not stock imagery. Hero carries a faint single-hue `--wash-warm`.

### Elevation, borders & cards
Color-block first, shadow second. Shadows are **soft and warm-tinted** (a brown-black base, never cold), low opacity, lifting on hover. Default card = white surface + 1px warm hairline ring (`--ring-hairline`) + `--shadow-sm`, radius `lg`. On hover it rises 4px to `--shadow-lg`. Solid signature cards carry a barely-there top light bloom and a colored glow on hover. Tokens: `tokens/elevation.css`.

### Motion
Calm, confident, human. The signature move is **fade-and-rise on scroll** (opacity + 18–20px up, ~480–720ms, gentle `--ease-out` `cubic-bezier(0.22,1,0.36,1)`), staggered across siblings. Hover = a subtle spring lift; press = slight shrink. **Always gated on `prefers-reduced-motion`.** Tokens & the `.ws-reveal` utility: `tokens/motion.css`; card: `guidelines/motion.card.html`.

### Hover / press states
- Buttons: primary darkens to `#000`; brand → orange-deep + orange glow; azure → azure-deep + azure glow; secondary → warm paper fill. Press shrinks ~1%.
- Cards: lift 4–5px + deeper shadow.
- Links: azure → azure-deep.

---

## 4. Iconography

- **System:** a **Lucide-style** line-icon set — 2px stroke, round caps and joins, no fill, on a 24px grid. It matches the plain, precise, engineering tone (and renders crisp on warm light surfaces).
- **How it's used:** icons are inlined as SVG directly in markup (see `ui_kits/website/index.html` and the component cards). They appear in pillar badges (on solid color chips), checklist ticks (in `--success` green), the product mock sidebar, and form fields.
- ⚠️ **Substitution:** no brand icon set was provided, so we use **Lucide** (MIT, `lucide.dev`) as the closest match. If you have an official set, drop the SVGs into `assets/icons/` and swap them in. For production React, pull `lucide-react` or load from CDN.
- **Emoji / unicode glyphs:** not used as icons, anywhere. Status uses the `Badge` dot, not an emoji.
- **Logo:** `assets/webstrail-logo.png` (four-color interlocking mark + near-black wordmark). Keep clearspace ≥ the mark's height. The art has **no light/reversed variant** — on dark/footer surfaces we currently invert it via CSS `filter`; please supply a proper white wordmark.

---

## 5. What's in here (index / manifest)

**Root**
- `styles.css` — the single entry point consumers link (`@import` lines only).
- `readme.md` — this guide. · `SKILL.md` — Agent-Skills-compatible entry.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `elevation.css`, `motion.css`, `base.css` (element defaults + `.ws-*` helpers).

**`components/`** (React primitives — `Name.jsx` + `Name.d.ts` + `Name.prompt.md`, one `@dsCard` per dir)
- `core/` — **Button**, **Badge**, **Tag**, **Avatar**, **Eyebrow**
- `surfaces/` — **Card**, **Stat**, **SignatureCard**
- `forms/` — **Input**
- Mount from the compiled bundle: `const { Button } = window.WebstrailDesignSystem_74bd7c` (see any `*.card.html`).

**`guidelines/`** — foundation specimen cards for the Design System tab: Colors (warm / cool / neutrals / semantic), Type (display / body / mono / pairing), Spacing (scale / radii / elevation / motion), Brand (gradients / logo / voice).

**`ui_kits/website/`** — the marketing-site UI kit (`README.md`, `index.html` homepage, `case-study.html`, `site.css`, `app.js`). Token-driven, fully self-contained, mirrors the component class contracts.

**`assets/`** — `webstrail-logo.png` (current four-color mark) and `webstrail-logo-v1.png` (earlier gradient-ribbon mark, archived).

---

## 6. Caveats & open items
- **Fonts are substitutes** — brand type is **Haas Grotesk / Haas Groot Disp**; we load the documented open-source stand-in **Inter / Inter Tight** via Google Fonts. Upload the licensed Haas fonts to finalize.
- **Icons are Lucide** (closest match). Swap if an official set exists.
- **No photography or illustrations** were supplied; the kit uses solid color blocks + a CSS product mock instead of stock imagery.
- **Logo has no reversed/white variant**; dark surfaces use a CSS filter as a stopgap.
- Proof numbers come straight from the strategy docs — keep every claim to something Webstrail can stand behind.
