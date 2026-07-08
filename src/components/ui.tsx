import {
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
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

/* --------------------------- Reveal on scroll --------------------------- */

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
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
        "inline-flex text-[11px] font-medium uppercase tracking-luxe text-gold",
        className
      )}
    >
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
      <Reveal delay={80}>
        <h2 className="mt-5 font-display text-[2.1rem] leading-[1.08] text-bone sm:text-5xl md:text-[3.3rem]">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={150}>
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
  "group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 hover:-translate-y-0.5";

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
