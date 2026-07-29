"use client";

import type { ReactNode } from "react";
import { setRequirement } from "../lib/requirement";

/**
 * A link into the booking form that carries the visitor's intent with it.
 * Falls back to a plain anchor jump when JavaScript is unavailable.
 */
export function CommissionLink({
  requirement,
  className,
  children,
  label,
}: {
  requirement: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      href="#booking"
      data-requirement={requirement}
      aria-label={label ?? `Book a consultation for ${requirement}`}
      onClick={() => setRequirement(requirement)}
      className={className}
    >
      {children}
    </a>
  );
}
