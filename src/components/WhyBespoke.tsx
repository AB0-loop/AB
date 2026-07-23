import { FIT_PROFILES, FABRIC_BRANDS, FUNCTIONAL_DETAILS } from "../lib/site";
import { Container, Reveal, SectionHeading } from "./ui";
import { Check } from "./icons";

const ROWS = [
  { label: "Fit", rack: "Made to a size chart", bespoke: "Cut to your body" },
  { label: "Fabric", rack: "What the rack offers", bespoke: "Italian, English & Indian mills" },
  { label: "Construction", rack: "Fused, factory-glued", bespoke: "Hand-structured canvas" },
  { label: "Experience", rack: "A shop floor", bespoke: "A private consultation" },
];

export function WhyBespoke() {
  return (
    <section className="border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Why Bespoke" title="Bespoke isn't a product. It's a standard." intro="The difference between a garment that fits and one that was made for you." />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="rounded-[2rem] border border-gold/15 bg-ink p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">What changes when it is made for you</p>
              <div className="mt-7 space-y-4">
                {ROWS.map((row) => (
                  <div key={row.label} className="flex flex-col gap-2 border-b border-line/70 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-display text-xl text-bone">{row.label}</span>
                    <div className="flex items-center gap-2 text-[14px] text-mute"><span className="inline-flex items-center gap-2">{row.rack}</span><span className="text-gold">→</span><span className="text-bone">{row.bespoke}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="rounded-[2rem] border border-gold/15 bg-gradient-to-br from-ink-3 to-ink p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Fit profiles</p>
              <div className="mt-7 space-y-4">
                {FIT_PROFILES.map((fit) => (
                  <div key={fit.name} className="flex items-start gap-3 rounded-2xl border border-line/70 bg-ink/60 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-gold/15 text-gold"><Check className="h-3.5 w-3.5" /></span>
                    <div>
                      <h3 className="font-display text-xl text-bone">{fit.name}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-mute">{fit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={180}>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-line/70 bg-ink p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Selected fabric partners</p>
              <div className="mt-6 space-y-4">
                {FABRIC_BRANDS.map((brand) => (
                  <div key={brand.name}>
                    <p className="text-[15px] font-medium text-bone">{brand.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-mute">{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-line/70 bg-ink p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Everything is functional</p>
              <div className="mt-6 space-y-4">
                {FUNCTIONAL_DETAILS.options.map((option) => (
                  <div key={option.feature} className="rounded-2xl border border-line/70 bg-ink/60 p-4">
                    <p className="text-sm font-medium text-bone">{option.feature}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={260}><p className="mx-auto mt-10 max-w-xl text-center font-display text-xl italic leading-snug text-bone/85 sm:text-2xl">We don't sell clothes off a shelf. We build a wardrobe around the way you live - and the way you want to be remembered.</p></Reveal>
      </Container>
    </section>
  );
}
