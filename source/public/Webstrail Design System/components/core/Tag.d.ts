import * as React from "react";

export interface TagProps extends React.HTMLAttributes<HTMLElement> {
  /** Active/selected state (used for filter chips). */
  active?: boolean;
  /** Element to render. Use `"button"` for interactive filter chips. */
  as?: "span" | "button" | "a";
}

/**
 * A tag for tech stack, integrations, and filterable categories (Open Dental,
 * MERN, RCM). Reads as a precise, engineering-flavored label.
 */
export function Tag(props: TagProps): JSX.Element;
