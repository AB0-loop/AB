"use client";

import { useEffect, useState } from "react";
import { CONFIG, whatsappLink } from "../lib/site";
import { Brand, Phone, ArrowRight, ArrowUp } from "./icons";

/**
 * Desktop floating actions — back to top sits directly above WhatsApp.
 * Both appear only once the visitor has scrolled past the hero.
 */
export function FloatingActions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed right-6 bottom-6 z-40 hidden flex-col items-center gap-3 lg:flex">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0 })}
        aria-label="Back to top"
        className="grid h-12 w-12 place-items-center border border-gold/40 bg-ink/90 text-gold hover:border-gold hover:bg-gold hover:text-ink"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with ${CONFIG.brand} on WhatsApp`}
        className="grid h-14 w-14 place-items-center rounded-full bg-gold text-ink ring-1 ring-gold-2/40 hover:bg-gold-2"
      >
        <Brand.whatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}

/**
 * Mobile bottom bar — Call, WhatsApp, Book. Back to top sits just above it,
 * appearing only after the visitor has scrolled.
 */
export function MobileActionBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {show && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Back to top"
          className="fixed right-4 z-40 grid h-11 w-11 place-items-center border border-gold/40 bg-ink/95 text-gold lg:hidden"
          style={{ bottom: "calc(4.75rem + env(safe-area-inset-bottom))" }}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      <div
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-gold/25 bg-ink/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={CONFIG.phoneHref}
          aria-label={`Call ${CONFIG.brand}`}
          className="flex flex-col items-center justify-center gap-1 py-3 text-bone active:bg-ink-3"
        >
          <Phone className="h-5 w-5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.15em]">Call</span>
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noreferrer"
          aria-label={`WhatsApp ${CONFIG.brand}`}
          className="flex flex-col items-center justify-center gap-1 border-x border-line bg-gold py-3 text-ink"
        >
          <Brand.whatsapp className="h-5 w-5" />
          <span className="text-[10px] font-medium uppercase tracking-[0.15em]">WhatsApp</span>
        </a>
        <a
          href="#booking"
          aria-label="Book a consultation"
          className="flex flex-col items-center justify-center gap-1 py-3 text-bone active:bg-ink-3"
        >
          <ArrowRight className="h-5 w-5 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.15em]">Book</span>
        </a>
      </div>
    </>
  );
}
