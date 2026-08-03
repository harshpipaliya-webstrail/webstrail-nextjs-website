import * as React from "react";

export interface SignatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Small uppercase kicker at the top. */
  eyebrow?: React.ReactNode;
  /** Headline. */
  title?: React.ReactNode;
  /** Footer content — typically a Button or a link row. */
  footer?: React.ReactNode;
  /** Solid signature surface — one per logo color. Default `azure`. */
  variant?: "coral" | "amber" | "sky" | "azure" | "navy" | "ink";
  /** Lift on hover. */
  interactive?: boolean;
}

/**
 * The brand-voltage surface: a full-bleed SOLID color card (one per logo color)
 * that punctuates a long scroll every few sections. Use sparingly — these are
 * the loud moments.
 *
 * @startingPoint section="Surfaces" subtitle="Full-bleed solid-color brand card" viewport="700x300"
 */
export function SignatureCard(props: SignatureCardProps): JSX.Element;
