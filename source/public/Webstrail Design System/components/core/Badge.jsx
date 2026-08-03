import React from "react";

const CSS = `
.ws-badge{
  --_bg: var(--surface-2); --_fg: var(--ink-soft); --_dot: var(--muted);
  display:inline-flex; align-items:center; gap:.5em;
  font:var(--text-caption); border-radius:var(--radius-pill);
  padding:.32em .72em; line-height:1; white-space:nowrap;
  background:var(--_bg); color:var(--_fg);
}
.ws-badge--dot::before{ content:""; width:.45em; height:.45em; border-radius:50%; background:var(--_dot); }
.ws-badge--coral{ --_bg:var(--coral-soft); --_fg:var(--coral-deep); --_dot:var(--coral); }
.ws-badge--azure{ --_bg:var(--azure-soft); --_fg:var(--azure-deep); --_dot:var(--azure); }
.ws-badge--amber{ --_bg:var(--amber-soft); --_fg:var(--amber-deep); --_dot:var(--amber); }
.ws-badge--success{ --_bg:var(--success-soft); --_fg:var(--success); --_dot:var(--success); }
.ws-badge--danger{ --_bg:var(--danger-soft); --_fg:var(--danger); --_dot:var(--danger); }
.ws-badge--outline{ --_bg:transparent; box-shadow:inset 0 0 0 1px var(--hairline-strong); }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-badge-css")) {
    const el = document.createElement("style");
    el.id = "ws-badge-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Badge({ children, tone = "neutral", dot = false, outline = false, className = "", ...rest }) {
  inject();
  const cls = [
    "ws-badge",
    tone !== "neutral" && `ws-badge--${tone}`,
    dot && "ws-badge--dot",
    outline && "ws-badge--outline",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} {...rest}>
      {children}
    </span>
  );
}
