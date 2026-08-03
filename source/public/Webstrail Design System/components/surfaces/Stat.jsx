import React from "react";

const CSS = `
.ws-stat{ display:flex; flex-direction:column; gap:.25rem; }
.ws-stat__value{
  font:var(--text-display-md); color:var(--ink); letter-spacing:var(--track-display);
  font-variant-numeric:tabular-nums;
}
.ws-stat__value .ws-stat__unit{ font-size:.6em; color:var(--coral); margin-left:.08em; }
.ws-stat__label{ font:var(--text-caption); color:var(--muted); }
.ws-stat--grad .ws-stat__value{
  color:var(--coral);
}
.ws-stat--onDark .ws-stat__value{ color:var(--on-dark); }
.ws-stat--onDark .ws-stat__label{ color:var(--on-dark-muted); }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-stat-css")) {
    const el = document.createElement("style");
    el.id = "ws-stat-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Stat({ value, unit = "", label, accent = false, onDark = false, className = "", ...rest }) {
  inject();
  const cls = ["ws-stat", accent && "ws-stat--grad", onDark && "ws-stat--onDark", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      <div className="ws-stat__value">
        {value}
        {unit && <span className="ws-stat__unit">{unit}</span>}
      </div>
      <div className="ws-stat__label">{label}</div>
    </div>
  );
}
