import * as React from "react";

export interface StatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline figure, e.g. "2" or "100". */
  value: React.ReactNode;
  /** Small accent unit appended to the value, e.g. "yrs" or "%". */
  unit?: string;
  /** Caption under the figure. */
  label: React.ReactNode;
  /** Paint the value in solid orange (the warm logo accent). */
  accent?: boolean;
  /** Use light type for dark/brand surfaces. */
  onDark?: boolean;
}

/**
 * A proof-point figure — "2 yrs running", "4 dental products shipped".
 * Serif numeral, mono-tabular, quiet caption. Keep claims to ones you can back.
 */
export function Stat(props: StatProps): JSX.Element;
