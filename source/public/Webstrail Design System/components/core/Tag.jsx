import React from "react";

const CSS = `
.ws-tag{
  display:inline-flex; align-items:center; gap:.4em;
  font:var(--text-caption); color:var(--muted);
  padding:.36em .72em; border-radius:var(--radius-sm);
  background:var(--surface-1); box-shadow:inset 0 0 0 1px var(--hairline);
  white-space:nowrap;
}
.ws-tag--active{ color:var(--azure-deep); background:var(--azure-soft); box-shadow:inset 0 0 0 1px color-mix(in srgb, var(--azure) 30%, transparent); }
.ws-tag--button{ cursor:pointer; transition:var(--t-colors); }
.ws-tag--button:hover{ color:var(--ink); background:var(--surface-2); }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-tag-css")) {
    const el = document.createElement("style");
    el.id = "ws-tag-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Tag({ children, active = false, as = "span", className = "", ...rest }) {
  inject();
  const Comp = as;
  const cls = [
    "ws-tag",
    active && "ws-tag--active",
    (as === "button" || rest.onClick) && "ws-tag--button",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Comp className={cls} {...rest}>
      {children}
    </Comp>
  );
}
