import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. Default `neutral`. */
  tone?: "neutral" | "coral" | "azure" | "amber" | "success" | "danger";
  /** Show a leading status dot. */
  dot?: boolean;
  /** Outline style (transparent fill, hairline ring). */
  outline?: boolean;
}

/**
 * A small status / metadata pill — engagement status, "Ongoing", "Dental",
 * tech-stack flags. Quiet by default; tones map to the brand palette.
 */
export function Badge(props: BadgeProps): JSX.Element;
