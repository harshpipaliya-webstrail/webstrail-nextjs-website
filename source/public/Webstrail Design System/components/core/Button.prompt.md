The pill-shaped Webstrail button — use for every call-to-action and form submit.

```jsx
<Button variant="primary">Book a discovery call</Button>
<Button variant="brand" iconRight={<ArrowRight/>}>See our work</Button>
<Button variant="azure">Start a discovery sprint</Button>
<Button variant="secondary">How we work</Button>
<Button variant="ghost" size="sm">Read the case study</Button>
```

Variants: `primary` (near-black, confident — one per viewport), `brand` (solid orange, energetic — the warm logo color), `azure` (solid blue — the cool logo color), `secondary` (white + hairline outline, natural pair with primary), `ghost` (quiet inline action). Sizes `sm | md | lg`. Pass `onDark` with `variant="secondary"` over dark or signature-color surfaces. Renders an `<a>` when `href` is set.
