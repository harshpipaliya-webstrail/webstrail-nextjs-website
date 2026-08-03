import React from "react";

/* Inject component CSS once. Uses the design-system tokens from styles.css. */
const CSS = `
.ws-btn{
  --_bg: var(--ink); --_fg: var(--on-dark); --_bd: transparent; --_bgh: #000;
  display:inline-flex; align-items:center; justify-content:center; gap:.55em;
  font:var(--text-button); letter-spacing:.005em; white-space:nowrap;
  border:var(--border-thin) solid var(--_bd); border-radius:var(--radius-pill);
  background:var(--_bg); color:var(--_fg); cursor:pointer;
  padding:.85em 1.4em; text-decoration:none; user-select:none;
  transition:var(--t-colors), transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out);
}
.ws-btn:hover{ background:var(--_bgh); }
.ws-btn:active{ transform:translateY(1px) scale(.99); }
.ws-btn:focus-visible{ outline:none; box-shadow:var(--focus-ring); }
.ws-btn--brand{ --_bg:var(--coral); --_fg:#fff; --_bgh:var(--coral-deep); }
.ws-btn--brand:hover{ box-shadow:var(--glow-coral); }
.ws-btn--secondary{ --_bg:var(--canvas); --_fg:var(--ink); --_bd:var(--hairline-strong); --_bgh:var(--surface-1); }
.ws-btn--ghost{ --_bg:transparent; --_fg:var(--ink); --_bgh:color-mix(in srgb, var(--ink) 7%, transparent); }
.ws-btn--azure{ --_bg:var(--azure); --_fg:#fff; --_bgh:var(--azure-deep); }
.ws-btn--azure:hover{ box-shadow:var(--glow-azure); }
.ws-btn--onDark{ --_bg:var(--canvas); --_fg:var(--ink); --_bgh:#fff; }
.ws-btn--sm{ padding:.6em 1.05em; font-size:.875rem; }
.ws-btn--lg{ padding:1.02em 1.7em; font-size:1rem; }
.ws-btn--block{ display:flex; width:100%; }
.ws-btn[aria-disabled="true"]{ opacity:.45; pointer-events:none; }
.ws-btn svg{ width:1.1em; height:1.1em; }
`;

function useInjectedCSS(id, css) {
  if (typeof document !== "undefined" && !document.getElementById(id)) {
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  iconLeft = null,
  iconRight = null,
  href,
  disabled = false,
  onDark = false,
  className = "",
  ...rest
}) {
  useInjectedCSS("ws-btn-css", CSS);
  const cls = [
    "ws-btn",
    variant !== "primary" && `ws-btn--${variant}`,
    size !== "md" && `ws-btn--${size}`,
    block && "ws-btn--block",
    onDark && variant === "secondary" && "ws-btn--onDark",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {iconLeft}
      {children && <span>{children}</span>}
      {iconRight}
    </>
  );

  if (href && !disabled) {
    return (
      <a className={cls} href={href} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button className={cls} aria-disabled={disabled || undefined} disabled={disabled} {...rest}>
      {content}
    </button>
  );
}
