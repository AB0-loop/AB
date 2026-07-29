"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "../utils/cn";

/* ----------------------------- Layout ----------------------------- */

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}

/* ------------------------------- Reveal -------------------------------- */
/**
 * Kept as a layout wrapper only. Content renders immediately — no scroll
 * animation, no opacity fade, no transform. Nothing shifts under the reader.
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/* ------------------------------ Eyebrow ------------------------------ */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-luxe text-gold",
        className
      )}
    >
      <span aria-hidden className="h-px w-7 bg-gold/60" />
      {children}
    </span>
  );
}

/* --------------------------- Section heading --------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal>
        <h2 className="mt-5 font-display text-[2rem] leading-[1.08] text-bone sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal>
          <p
            className={cn(
              "mt-6 text-[15px] leading-relaxed text-mute",
              align === "center" && "mx-auto"
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------ Button ------------------------------ */

type Variant = "gold" | "ghost";

type ButtonProps = {
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLElement> & {
    type?: "button" | "submit";
  };

const BTN_BASE =
  "group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em]";

const BTN_VARIANT: Record<Variant, string> = {
  gold: "bg-gold text-ink hover:bg-gold-2",
  ghost: "border border-gold/30 text-bone hover:border-gold hover:bg-gold hover:text-ink",
};

export function Button({ href, variant = "gold", className, children, ...rest }: ButtonProps) {
  const cls = cn(BTN_BASE, BTN_VARIANT[variant], className);
  if (href) {
    return (
      <a href={href} className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/* ------------------------------ Ornament ------------------------------ */

export function Ornament({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center justify-center gap-3 text-gold", className)}>
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="rotate-45 border border-gold/70" style={{ width: 7, height: 7 }} />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
    </span>
  );
}
