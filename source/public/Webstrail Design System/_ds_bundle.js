/* @ds-bundle: {"format":3,"namespace":"WebstrailDesignSystem_74bd7c","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"SignatureCard","sourcePath":"components/surfaces/SignatureCard.jsx"},{"name":"Stat","sourcePath":"components/surfaces/Stat.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"76bc5ab76d26","components/core/Badge.jsx":"5318635b3d1c","components/core/Button.jsx":"ccf9e41e9c5a","components/core/Eyebrow.jsx":"b0945f2a1e40","components/core/Tag.jsx":"678414e7ede1","components/forms/Input.jsx":"4f0bad6774d1","components/surfaces/Card.jsx":"a224caebba88","components/surfaces/SignatureCard.jsx":"12ee932c5639","components/surfaces/Stat.jsx":"2094d292d0f2","ui_kits/website/app.js":"10ba4642dff3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.WebstrailDesignSystem_74bd7c = window.WebstrailDesignSystem_74bd7c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
const SIZES = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72
};
function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-avatar-css")) {
    const el = document.createElement("style");
    el.id = "ws-avatar-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}
function Avatar({
  name = "",
  src = "",
  size = "md",
  tone = "warm",
  ring = false,
  className = "",
  ...rest
}) {
  inject();
  const px = SIZES[size] || SIZES.md;
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const cls = ["ws-avatar", tone !== "warm" && `ws-avatar--${tone}`, ring && "ws-avatar--ring", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      width: px,
      height: px,
      fontSize: px * 0.4
    },
    "aria-label": name || undefined
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : initials || null);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Badge({
  children,
  tone = "neutral",
  dot = false,
  outline = false,
  className = "",
  ...rest
}) {
  inject();
  const cls = ["ws-badge", tone !== "neutral" && `ws-badge--${tone}`, dot && "ws-badge--dot", outline && "ws-badge--outline", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Button({
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
  const cls = ["ws-btn", variant !== "primary" && `ws-btn--${variant}`, size !== "md" && `ws-btn--${size}`, block && "ws-btn--block", onDark && variant === "secondary" && "ws-btn--onDark", className].filter(Boolean).join(" ");
  const content = /*#__PURE__*/React.createElement(React.Fragment, null, iconLeft, children && /*#__PURE__*/React.createElement("span", null, children), iconRight);
  if (href && !disabled) {
    return /*#__PURE__*/React.createElement("a", _extends({
      className: cls,
      href: href
    }, rest), content);
  }
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    "aria-disabled": disabled || undefined,
    disabled: disabled
  }, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Eyebrow({
  children,
  tone = "coral",
  line = false,
  className = "",
  ...rest
}) {
  inject();
  const cls = ["ws-eyebrow", tone !== "coral" && `ws-eyebrow--${tone}`, className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), line && /*#__PURE__*/React.createElement("span", {
    className: "ws-eyebrow__line",
    "aria-hidden": "true"
  }), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Tag({
  children,
  active = false,
  as = "span",
  className = "",
  ...rest
}) {
  inject();
  const Comp = as;
  const cls = ["ws-tag", active && "ws-tag--active", (as === "button" || rest.onClick) && "ws-tag--button", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CSS = `
.ws-field{ display:flex; flex-direction:column; gap:.4rem; }
.ws-field__label{ font:var(--text-label); color:var(--ink-soft); }
.ws-field__hint{ font:var(--text-caption); color:var(--muted); }
.ws-field__error{ font:var(--text-caption); color:var(--danger); }
.ws-input-wrap{ position:relative; display:flex; align-items:center; }
.ws-input{
  width:100%; font:var(--text-body-md); color:var(--ink);
  background:var(--canvas); border:var(--border-thin) solid var(--hairline-strong);
  border-radius:var(--radius-md); padding:.7rem .9rem; line-height:1.4;
  transition:var(--t-colors), box-shadow var(--dur-fast) var(--ease-standard);
}
.ws-input::placeholder{ color:var(--faint); }
.ws-input:hover{ border-color:var(--muted); }
.ws-input:focus{ outline:none; border-color:var(--azure); box-shadow:var(--focus-ring); }
.ws-input--withIcon{ padding-left:2.4rem; }
.ws-input__icon{ position:absolute; left:.8rem; display:flex; color:var(--muted); pointer-events:none; }
.ws-input__icon svg{ width:1.05rem; height:1.05rem; }
.ws-field--error .ws-input{ border-color:var(--danger); }
.ws-field--error .ws-input:focus{ box-shadow:0 0 0 3px var(--danger-soft); }
textarea.ws-input{ resize:vertical; min-height:7rem; }
`;
function inject() {
  if (typeof document !== "undefined" && !document.getElementById("ws-input-css")) {
    const el = document.createElement("style");
    el.id = "ws-input-css";
    el.textContent = CSS;
    document.head.appendChild(el);
  }
}
function Input({
  label,
  hint,
  error,
  icon = null,
  id,
  multiline = false,
  className = "",
  ...rest
}) {
  inject();
  const fieldId = id || (label ? `ws-${String(label).toLowerCase().replace(/\s+/g, "-")}` : undefined);
  const Field = multiline ? "textarea" : "input";
  const inputCls = ["ws-input", icon && !multiline && "ws-input--withIcon", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", {
    className: ["ws-field", error && "ws-field--error"].filter(Boolean).join(" ")
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "ws-field__label",
    htmlFor: fieldId
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "ws-input-wrap"
  }, icon && !multiline && /*#__PURE__*/React.createElement("span", {
    className: "ws-input__icon"
  }, icon), /*#__PURE__*/React.createElement(Field, _extends({
    id: fieldId,
    className: inputCls,
    "aria-invalid": !!error || undefined
  }, rest))), error ? /*#__PURE__*/React.createElement("span", {
    className: "ws-field__error"
  }, error) : hint && /*#__PURE__*/React.createElement("span", {
    className: "ws-field__hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Card({
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
  const cls = ["ws-card", surface !== "white" && `ws-card--${surface}`, padding === "lg" && "ws-card--pad-lg", interactive && "ws-card--interactive", accent && "ws-card--accent", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement(Comp, _extends({
    className: cls
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/SignatureCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function SignatureCard({
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
  const cls = ["ws-sig", `ws-sig--${variant}`, interactive && "ws-sig--hover", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    className: "ws-sig__eyebrow"
  }, eyebrow), title && /*#__PURE__*/React.createElement("h3", {
    className: "ws-sig__title"
  }, title), children && /*#__PURE__*/React.createElement("p", {
    className: "ws-sig__body"
  }, children)), footer && /*#__PURE__*/React.createElement("div", {
    className: "ws-sig__foot"
  }, footer));
}
Object.assign(__ds_scope, { SignatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/SignatureCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Stat({
  value,
  unit = "",
  label,
  accent = false,
  onDark = false,
  className = "",
  ...rest
}) {
  inject();
  const cls = ["ws-stat", accent && "ws-stat--grad", onDark && "ws-stat--onDark", className].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "ws-stat__value"
  }, value, unit && /*#__PURE__*/React.createElement("span", {
    className: "ws-stat__unit"
  }, unit)), /*#__PURE__*/React.createElement("div", {
    className: "ws-stat__label"
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Stat.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/app.js
try { (() => {
/* Webstrail marketing site — interactions
   Vanilla JS: sticky nav, mobile menu, reveal-on-scroll, work filter, form. */
(function () {
  "use strict";

  /* ---- sticky nav state ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add("is-stuck");else nav.classList.remove("is-stuck");
  }
  window.addEventListener("scroll", onScroll, {
    passive: true
  });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  if (burger) {
    burger.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") menu.classList.remove("is-open");
    });
  }

  /* ---- reveal on scroll ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---- work filter ---- */
  var filters = document.getElementById("filters");
  var grid = document.getElementById("workGrid");
  if (filters && grid) {
    var cases = Array.prototype.slice.call(grid.querySelectorAll(".case"));
    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      filters.querySelectorAll(".chip").forEach(function (c) {
        c.classList.remove("is-active");
      });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      cases.forEach(function (card) {
        var seg = card.getAttribute("data-seg");
        var show = f === "all" || seg === f || f === "dso" && seg === "product";
        // map: DSOs & groups loosely includes platform products
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---- discovery-call form (fake submit) ---- */
  var form = document.getElementById("ccForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector("#f-name").value || "there").split(" ")[0];
      form.innerHTML = '<div class="form__ok">' + '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' + "<h3>Thanks, " + name + ".</h3>" + '<p style="font:var(--text-body-md);color:var(--body);margin-top:8px">We\'ll be in touch within one business day to set up your discovery call.</p>' + "</div>";
    });
  }

  /* ---- smooth anchor scroll with nav offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: y,
        behavior: reduce ? "auto" : "smooth"
      });
    });
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/app.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SignatureCard = __ds_scope.SignatureCard;

__ds_ns.Stat = __ds_scope.Stat;

})();
