import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "../lib/site";

/**
 * Shared shell for the standalone pages (404, thank-you, error) so they carry
 * exactly the same black-and-gold identity as the main site.
 */
export function Interstitial({
  eyebrow,
  title,
  intro,
  children,
  links,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
  links?: { label: string; href: string }[];
}) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-6 py-20">
      {/* soft gold vignette, no imagery needed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-xl text-center">
        <Link
          href="/"
          aria-label={`${CONFIG.brand} — home`}
          className="mx-auto grid h-16 w-16 place-items-center border border-gold/30 transition-colors hover:border-gold"
        >
          <Image
            src="/brand/aurum-mark.png"
            alt=""
            width={128}
            height={128}
            className="h-full w-full scale-110 object-contain"
          />
        </Link>

        <p className="mt-9 text-[11px] font-medium uppercase tracking-luxe text-gold">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-[2.4rem] leading-[1.05] text-bone sm:text-5xl">
          {title}
        </h1>
        <div className="gold-rule mx-auto mt-7 w-24" />
        <p className="mx-auto mt-7 max-w-md text-[15px] leading-relaxed text-mute">{intro}</p>

        {children}

        {links && links.length > 0 && (
          <>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={links[0].href}
                className="inline-flex items-center justify-center bg-gold px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:bg-gold-2"
              >
                {links[0].label}
              </a>
              {links.slice(1).map((l) => (
                <a
                  key={l.href + l.label}
                  href={l.href}
                  className="inline-flex items-center justify-center border border-gold/30 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-bone hover:border-gold hover:bg-gold hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </>
        )}

        <nav
          aria-label="Site sections"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-8 text-[11px] uppercase tracking-[0.18em] text-mute"
        >
          {[
            { label: "Atelier", href: "/#story" },
            { label: "Suits", href: "/#suits" },
            { label: "Collections", href: "/#collections" },
            { label: "Portfolio", href: "/#portfolio" },
            { label: "Process", href: "/#process" },
            { label: "FAQ", href: "/#faq" },
            { label: "Contact", href: "/#contact" },
            { label: "Privacy", href: "/privacy" },
          ].map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-gold">
              {l.label}
            </a>
          ))}
        </nav>

        <p className="mt-8 text-[12px] text-mute/80">
          Or reach the atelier directly —{" "}
          <a href={CONFIG.phoneHref} className="text-gold transition-colors hover:text-gold-2">
            {CONFIG.phoneDisplay}
          </a>
        </p>
      </div>
    </main>
  );
}
