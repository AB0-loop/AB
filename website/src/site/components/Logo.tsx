import Image from "next/image";
import { cn } from "../utils/cn";
import { CONFIG } from "../lib/site";

type LogoProps = {
  className?: string;
  /** Renders the mark only — used in tight mobile headers. */
  markOnly?: boolean;
};

/**
 * Aurum Bespoke lockup — the gold needle-and-jacket mark paired with the
 * engraved "AURUM BESPOKE" wordmark and tagline.
 *
 * Swap `/brand/aurum-mark-v2.png` with the official artwork (transparent PNG or
 * SVG) at any time; nothing else needs to change.
 */
export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <a
      href="#home"
      aria-label={`${CONFIG.brand} — return to home`}
      className={cn("group inline-flex shrink-0 items-center gap-3.5", className)}
    >
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden border border-gold/30 transition-colors group-hover:border-gold/70">
        <Image
          src="/brand/aurum-mark-v2.png"
          alt=""
          width={88}
          height={88}
          priority
          className="h-full w-full scale-110 object-contain"
        />
        <span aria-hidden className="absolute left-[-1px] top-[-1px] h-2 w-2 border-l border-t border-gold" />
        <span aria-hidden className="absolute bottom-[-1px] right-[-1px] h-2 w-2 border-b border-r border-gold" />
      </span>

      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className="font-logo text-[13px] font-semibold tracking-[0.26em] text-gold sm:text-[15px] sm:tracking-[0.28em]">
            AURUM BESPOKE
          </span>
          <span className="mt-2 flex items-center gap-2">
            <span aria-hidden className="h-px w-3 bg-gold/50" />
            <span className="text-[8px] font-medium uppercase tracking-[0.4em] text-gold/70">
              {CONFIG.shortTagline}
            </span>
          </span>
        </span>
      )}
    </a>
  );
}
