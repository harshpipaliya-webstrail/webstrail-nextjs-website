import * as React from "react";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. Default `coral`. Use `onDark` over dark/brand bands. */
  tone?: "coral" | "azure" | "muted" | "onDark";
  /** Prefix with a short horizontal rule. */
  line?: boolean;
}

/**
 * The small uppercase mono overline that labels every section ("WHAT WE DO",
 * "CASE STUDY"). The system's primary kicker — sentence content, mono casing.
 */
export function Eyebrow(props: EyebrowProps): JSX.Element;
