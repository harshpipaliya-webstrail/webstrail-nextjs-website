import React from "react";

const CSS = `
.ws-card{
  position:relative; display:flex; flex-direction:column;
  background:var(--canvas); border-radius:var(--radius-lg);
  box-shadow:var(--ring-hairline), var(--shadow-sm);
  padding:var(--card-pad); overflow:hidden;
  transition:var(--t-lift), border-color var(--dur-fast) var(--ease-standard);
}
.ws-card--soft{ background:var(--surface-1); }
.ws-card--sand{ background:var(--surface-2); box-shadow:var(--ring-hairline); }
.ws-card--pad-lg{ padding:var(--card-pad-lg); }
.ws-card--interactive{ cursor:pointer; }
.ws-card--interactive:hover{ transform:translateY(-4px); box-shadow:var(--ring-hairline), var(--shadow-lg); }
.ws-card--accent::before{
  content:""; position:absolute; inset:0 0 auto 0; height:4px;
  background:var(--coral);
}
.ws-card--accent{ padding-top:calc(var(--card-pad) + 4px); }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-card-css")) {
    const el = document.createElement("style");
    el.id = "ws-card-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Card({
  children,
  surface = "white",
  padding = "md",
  interactive = false,
  accent = false,
  as = "div",
  className = "",
  ...rest
}) {
  inject();
  const Comp = as;
  const cls = [
    "ws-card",
    surface !== "white" && `ws-card--${surface}`,
    padding === "lg" && "ws-card--pad-lg",
    interactive && "ws-card--interactive",
    accent && "ws-card--accent",
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
