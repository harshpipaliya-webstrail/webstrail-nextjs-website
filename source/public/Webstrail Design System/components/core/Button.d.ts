import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` = confident near-black; `brand` = solid orange; `azure` = solid blue; `secondary` = outline; `ghost` = quiet. */
  variant?: "primary" | "brand" | "azure" | "secondary" | "ghost";
  /** Size of the control. Default `md`. */
  size?: "sm" | "md" | "lg";
  /** Stretch to fill the container width. */
  block?: boolean;
  /** Icon element rendered before the label (use a Lucide SVG). */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label. */
  iconRight?: React.ReactNode;
  /** Render as an anchor instead of a button. */
  href?: string;
  /** Disabled state. */
  disabled?: boolean;
  /** Use the on-dark treatment for `secondary` over dark/brand surfaces. */
  onDark?: boolean;
}

/**
 * The Webstrail button. Primary actions are near-black and final; the solid
 * orange (brand) and azure variants carry brand energy; secondary + ghost recede.
 * Always pill-shaped.
 *
 * @startingPoint section="Core" subtitle="Primary, brand, azure, secondary & ghost buttons" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
