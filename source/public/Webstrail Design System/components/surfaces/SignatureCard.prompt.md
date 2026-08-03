The brand's loud moment — a full-bleed solid-color card that breaks up a long scroll. Use sparingly (every few sections), never two in a row. Each variant is one of the four logo colors (plus navy/ink).

```jsx
<SignatureCard
  variant="ink"
  eyebrow="Here for the build"
  title="We don't ship code and disappear. We stay to run it."
  footer={<Button variant="secondary" onDark>Book a discovery call</Button>}
>
  Design, build, and run — one accountable partner for the life of the product.
</SignatureCard>
```

Variants (solid): `coral` (orange), `amber`, `sky`, `azure`, `navy`, `ink`. Text color is set automatically — light colors (amber, sky) take ink text; the rest take white. `interactive` adds a hover lift.
