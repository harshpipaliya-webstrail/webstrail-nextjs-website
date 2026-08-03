import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Background surface. Default `white`. */
  surface?: "white" | "soft" | "sand";
  /** Interior padding. Default `md`. */
  padding?: "md" | "lg";
  /** Lift + shadow on hover; sets pointer cursor. */
  interactive?: boolean;
  /** Add the orange top accent bar. */
  accent?: boolean;
  /** Element to render. */
  as?: "div" | "article" | "a" | "li";
}

/**
 * The base content card: white (or warm) surface, soft shadow, hairline ring,
 * generous radius. Compose case studies, feature blurbs, and stats inside it.
 *
 * @startingPoint section="Surfaces" subtitle="Content card with optional ribbon accent + hover lift" viewport="700x260"
 */
export function Card(props: CardProps): JSX.Element;
