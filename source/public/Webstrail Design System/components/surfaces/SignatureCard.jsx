import React from "react";

const CSS = `
.ws-sig{
  position:relative; display:flex; flex-direction:column; justify-content:space-between;
  gap:var(--space-5); border-radius:var(--radius-xl); padding:var(--card-pad-lg);
  overflow:hidden; min-height:240px;
  --_bg:var(--sig-azure-bg); --_fg:var(--sig-azure-fg);
  background:var(--_bg); color:var(--_fg);
}
.ws-sig--coral{ --_bg:var(--sig-coral-bg); --_fg:var(--sig-coral-fg); }
.ws-sig--amber{ --_bg:var(--sig-amber-bg); --_fg:var(--sig-amber-fg); }
.ws-sig--sky{ --_bg:var(--sig-sky-bg); --_fg:var(--sig-sky-fg); }
.ws-sig--azure{ --_bg:var(--sig-azure-bg); --_fg:var(--sig-azure-fg); }
.ws-sig--navy{ --_bg:var(--sig-navy-bg); --_fg:var(--sig-navy-fg); }
.ws-sig--ink{ --_bg:var(--sig-ink-bg); --_fg:var(--sig-ink-fg); }
.ws-sig__eyebrow{ font:var(--text-eyebrow); letter-spacing:var(--track-eyebrow); text-transform:uppercase; color:var(--_fg); opacity:.74; }
.ws-sig__title{ font:var(--text-display-md); color:var(--_fg); letter-spacing:var(--track-display); max-width:18ch; }
.ws-sig__body{ font:var(--text-body-md); color:var(--_fg); opacity:.92; max-width:42ch; }
.ws-sig__foot{ display:flex; align-items:center; gap:var(--space-4); flex-wrap:wrap; }
.ws-sig--hover{ transition:var(--t-lift); cursor:pointer; }
.ws-sig--hover:hover{ transform:translateY(-4px); box-shadow:var(--shadow-xl); }
`;

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-sig-css")) {
    const el = document.createElement("style");
    el.id = "ws-sig-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function SignatureCard({
  eyebrow,
  title,
  children,
  footer,
  variant = "azure",
  interactive = false,
  className = "",
  ...rest
}) {
  inject();
  const cls = ["ws-sig", `ws-sig--${variant}`, interactive && "ws-sig--hover", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} {...rest}>
      <div>
        {eyebrow && <div className="ws-sig__eyebrow">{eyebrow}</div>}
        {title && <h3 className="ws-sig__title">{title}</h3>}
        {children && <p className="ws-sig__body">{children}</p>}
      </div>
      {footer && <div className="ws-sig__foot">{footer}</div>}
    </div>
  );
}
