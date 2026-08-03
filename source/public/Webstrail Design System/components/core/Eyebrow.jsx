import React from "react";

const CSS = `
.ws-eyebrow{
  display:inline-flex; align-items:center; gap:.6em;
  font:var(--text-eyebrow); letter-spacing:var(--track-eyebrow);
  text-transform:uppercase; color:var(--coral-deep);
}
.ws-eyebrow--azure{ color:var(--azure-deep); }
.ws-eyebrow--muted{ color:var(--muted); }
.ws-eyebrow--onDark{ color:var(--amber); }
.ws-eyebrow__line{ width:1.8em; height:1px; background:currentColor; opacity:.6; }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-eyebrow-css")) {
    const el = document.createElement("style");
    el.id = "ws-eyebrow-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Eyebrow({ children, tone = "coral", line = false, className = "", ...rest }) {
  inject();
  const cls = ["ws-eyebrow", tone !== "coral" && `ws-eyebrow--${tone}`, className].filter(Boolean).join(" ");
  return (
    <span className={cls} {...rest}>
      {line && <span className="ws-eyebrow__line" aria-hidden="true" />}
      {children}
    </span>
  );
}
