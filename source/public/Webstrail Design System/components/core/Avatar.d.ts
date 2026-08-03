import * as React from "react";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Full name — used for initials fallback and the aria-label. */
  name?: string;
  /** Image URL. Falls back to initials on a solid color when omitted. */
  src?: string;
  /** Size token. Default `md`. */
  size?: "sm" | "md" | "lg" | "xl";
  /** Solid logo-color tone for the initials fallback. */
  tone?: "warm" | "sky" | "azure" | "amber";
  /** Add a contrast ring (use over busy backgrounds / in stacks). */
  ring?: boolean;
}

/**
 * Circular avatar for testimonials and team. Shows a photo when `src` is set,
 * otherwise renders initials on a solid logo color.
 */
export function Avatar(props: AvatarProps): JSX.Element;
