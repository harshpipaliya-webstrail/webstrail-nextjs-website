import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Field label rendered above the control. */
  label?: React.ReactNode;
  /** Helper text under the field. */
  hint?: React.ReactNode;
  /** Error message — turns the field red and replaces the hint. */
  error?: React.ReactNode;
  /** Leading icon element (a Lucide SVG). */
  icon?: React.ReactNode;
  /** Render a multi-line textarea instead of a single-line input. */
  multiline?: boolean;
}

/**
 * Labeled text input / textarea for discovery-call and contact forms.
 * Warm hairline border, azure focus ring, inline hint + error states.
 */
export function Input(props: InputProps): JSX.Element;
