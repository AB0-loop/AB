import { useEffect, useState } from "react";
import { PORTFOLIO, PORTFOLIO_FILTERS, PORTFOLIO_NOTES, type PortfolioItem } from "../lib/site";
import { cn } from "../utils/cn";
import { Container, Reveal, SectionHeading } from "./ui";
import { ArrowUpRight, Close } from "./icons";

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
    <section id="portfolio" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Portfolio"
            title="Selected work"
            intro="A living atelier gallery - refreshed as new commissions are delivered."
          />

          {/* Filters */}
          <Reveal delay={120}>
            <div className="flex flex-wrap gap-2">
              {PORTFOLIO_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300",
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
        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 70} className="mb-5 break-inside-avoid">
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
                  className="w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-gold">{item.category}</p>
                    <h3 className="mt-1 font-display text-2xl text-bone">{item.title}</h3>
                  </div>
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-gold/40 text-gold transition-all duration-300 group-hover:bg-gold group-hover:text-ink">
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} - project view`}
          onClick={() => setActive(null)}
        >
          <div
            className="relative grid w-full max-w-5xl overflow-hidden border border-gold/25 bg-ink-2 md:grid-cols-[1.5fr_1fr]"
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
                className="h-full max-h-[60vh] w-full object-cover md:max-h-[80vh]"
              />
            </div>

            <div className="flex flex-col justify-center p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{active.category}</p>
              <h3 className="mt-3 font-display text-4xl leading-tight text-bone">{active.title}</h3>
              <div className="mt-5 h-px w-12 bg-gold/50" />
              <p className="mt-5 text-[15px] leading-relaxed text-mute">{PORTFOLIO_NOTES[active.id]}</p>

              <a
                href="#booking"
                onClick={() => setActive(null)}
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
