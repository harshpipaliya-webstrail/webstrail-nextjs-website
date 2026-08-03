import React from "react";

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

export function Input({
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
  return (
    <div className={["ws-field", error && "ws-field--error"].filter(Boolean).join(" ")}>
      {label && (
        <label className="ws-field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="ws-input-wrap">
        {icon && !multiline && <span className="ws-input__icon">{icon}</span>}
        <Field id={fieldId} className={inputCls} aria-invalid={!!error || undefined} {...rest} />
      </div>
      {error ? (
        <span className="ws-field__error">{error}</span>
      ) : (
        hint && <span className="ws-field__hint">{hint}</span>
      )}
    </div>
  );
}
