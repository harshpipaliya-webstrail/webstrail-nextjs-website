import React from "react";

const CSS = `
.ws-avatar{
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:var(--radius-full); overflow:hidden; flex:0 0 auto;
  font-family:var(--font-sans); font-weight:var(--w-semibold); color:#fff;
  background:var(--coral); line-height:1; user-select:none;
}
.ws-avatar img{ width:100%; height:100%; object-fit:cover; }
.ws-avatar--ring{ box-shadow:0 0 0 2px var(--canvas), 0 0 0 3.5px var(--hairline-strong); }
.ws-avatar--sky{ background:var(--sky); color:var(--ink); }
.ws-avatar--azure{ background:var(--azure); }
.ws-avatar--amber{ background:var(--amber); color:var(--ink); }
`;

const SIZES = { sm: 28, md: 40, lg: 56, xl: 72 };

function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-avatar-css")) {
    const el = document.createElement("style");
    el.id = "ws-avatar-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}

export function Avatar({ name = "", src = "", size = "md", tone = "warm", ring = false, className = "", ...rest }) {
  inject();
  const px = SIZES[size] || SIZES.md;
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const cls = ["ws-avatar", tone !== "warm" && `ws-avatar--${tone}`, ring && "ws-avatar--ring", className]
    .filter(Boolean)
    .join(" ");
  return (
    <span
      className={cls}
      style={{ width: px, height: px, fontSize: px * 0.4 }}
      aria-label={name || undefined}
      {...rest}
    >
      {src ? <img src={src} alt={name} /> : initials || null}
    </span>
  );
}
