Labeled text input / textarea for the discovery-call and contact forms.

```jsx
<Input label="Work email" type="email" placeholder="you@dentalcompany.com" icon={<Mail/>} />
<Input label="Tell us about your build" multiline hint="What are you trying to ship, and by when?" />
<Input label="Company" error="We need this to route your call." />
```

`hint` shows helper text; `error` turns the field red and replaces the hint. `icon` adds a leading glyph (single-line only). `multiline` renders a textarea.
