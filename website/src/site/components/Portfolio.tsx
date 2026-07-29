"use client";

import { useEffect, useState } from "react";
import { PORTFOLIO, PORTFOLIO_FILTERS, PORTFOLIO_NOTES, type PortfolioItem } from "../lib/site";
import { cn } from "../utils/cn";
import { Container, Reveal, SectionHeading } from "./ui";
import { ArrowUpRight, Close } from "./icons";
import { setRequirement } from "../lib/requirement";

const CATEGORY_REQUIREMENT: Record<string, string> = {
  Business: "Business Suits",
  Evening: "Tuxedos",
  Ethnic: "Sherwanis",
};

export function Portfolio() {
  const [filter, setFilter] = useState<(typeof PORTFOLIO_FILTERS)[number]>("All");
  const [active, setActive] = useState<PortfolioItem | null>(null);

  const items = filter === "All" ? PORTFOLIO : PORTFOLIO.filter((p) => p.category === filter);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="portfolio" className="scroll-mt-24 border-t border-line bg-ink py-16 sm:py-20 md:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work"
            intro="Selected pieces from the atelier, grouped by the occasion they were made for."
          />

          {/* Filters */}
          <Reveal>
            <div className="no-scrollbar -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
              {PORTFOLIO_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "shrink-0 snap-start border px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
                    filter === f
                      ? "border-gold bg-gold text-ink"
                      : "border-line text-mute hover:border-gold/50 hover:text-bone"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Masonry */}
        <div className="mt-10 columns-2 gap-3 sm:mt-14 sm:gap-5 lg:columns-3">
          {items.map((item, i) => (
            <Reveal key={item.id} className="mb-3 break-inside-avoid sm:mb-5">
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group relative block w-full overflow-hidden border border-line text-left"
                aria-label={`View project: ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 sm:p-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gold sm:text-[10px] sm:tracking-[0.25em]">{item.category}</p>
                    <h3 className="mt-1 font-display text-base leading-tight text-bone sm:text-2xl">{item.title}</h3>
                  </div>
                  <span className="hidden h-9 w-9 shrink-0 place-items-center border border-gold/40 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-ink sm:grid">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Project modal */}
      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-ink/95 p-3 backdrop-blur-sm sm:p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} — project view`}
          onClick={() => setActive(null)}
        >
          <div
            className="relative my-auto grid max-h-[92vh] w-full max-w-5xl grid-rows-[auto_1fr] overflow-y-auto overscroll-contain border border-gold/25 bg-ink-2 md:max-h-[86vh] md:grid-cols-[1.5fr_1fr] md:grid-rows-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-gold/30 bg-ink/70 text-gold backdrop-blur transition-colors hover:border-gold hover:bg-gold hover:text-ink"
              aria-label="Close project view"
            >
              <Close className="h-5 w-5" />
            </button>

            <div className="bg-ink">
              <img
                src={active.image}
                alt={active.title}
                className="h-full max-h-[42vh] w-full object-cover sm:max-h-[50vh] md:max-h-[86vh]"
              />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{active.category}</p>
              <h3 className="mt-3 font-display text-3xl leading-tight text-bone sm:text-4xl">{active.title}</h3>
              <div className="mt-5 h-px w-12 bg-gold/50" />
              <p className="mt-5 text-[15px] leading-relaxed text-mute">{PORTFOLIO_NOTES[active.id]}</p>

              <a
                href="#booking"
                onClick={() => {
                  setRequirement(CATEGORY_REQUIREMENT[active.category]);
                  setActive(null);
                }}
                className="mt-8 inline-flex items-center justify-center gap-2 bg-gold px-7 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold-2"
              >
                Commission something similar
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
