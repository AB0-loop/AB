import { FABRIC_BRANDS, SUITS } from "../lib/site";
import { Container, Eyebrow, Reveal, SectionHeading } from "./ui";
import { Check } from "./icons";

export function Suits() {
  return (
    <section id="suits" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="The Flagship" title="The suit, perfected" intro={SUITS.intro} />
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {SUITS.looks.map((look, i) => <Reveal key={look.name} delay={i * 90}><div className="group relative block overflow-hidden rounded-[1.75rem] border border-line"><div className="relative aspect-[4/5] overflow-hidden"><img src={look.image} alt={`${look.name} - ${look.cut}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" /></div><div className="absolute inset-x-0 bottom-0 p-6"><h3 className="font-display text-2xl text-bone md:text-3xl">{look.name}</h3><p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-gold">{look.cut}</p></div><span aria-hidden className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-gold/40" /></div></Reveal>)}
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="rounded-[2rem] border border-gold/15 bg-ink-2 p-7 sm:p-8">
              <Eyebrow>What defines an Aurum suit</Eyebrow>
              <h3 className="mt-5 font-display text-3xl text-bone sm:text-4xl">Built, not just sewn.</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-mute">We create suits that feel composed from the first fitting - and continue to feel exceptional through every season and every occasion.</p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {SUITS.details.map((d, i) => <Reveal key={d.title} delay={(i % 2) * 70}><div className="rounded-[1.5rem] border border-line/70 bg-ink-2 p-5"><div className="flex items-start gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-gold/15 text-gold"><Check className="h-3.5 w-3.5" /></span><div><h4 className="font-display text-lg text-bone">{d.title}</h4><p className="mt-1 text-[13.5px] leading-relaxed text-mute">{d.desc}</p></div></div></div></Reveal>)}
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-[2rem] border border-line/70 bg-ink-2 p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Premium fabric partners</p>
              <div className="mt-6 space-y-3">
                {FABRIC_BRANDS.map((brand) => (
                  <div key={brand.name}>
                    <p className="text-[15px] font-medium text-bone">{brand.name}</p>
                    <p className="text-sm text-mute">{brand.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="rounded-[2rem] border border-line/70 bg-ink-2 p-7 sm:p-8">
              <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Fit directions</p>
              <div className="mt-6 space-y-3">
                {[
                  "English fit",
                  "Italian fit",
                  "British fit",
                  "American fit",
                  "Classic fit",
                  "Modern fit",
                  "Custom fit"
                ].map((fit) => (
                  <p key={fit} className="text-sm leading-relaxed text-body/80">• {fit}</p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}><p className="mx-auto mt-16 max-w-xl text-center font-display text-xl italic leading-snug text-bone/85 sm:text-2xl">A suit is the quietest way to be remembered. We'd be glad to make yours.</p></Reveal>
      </Container>
    </section>
  );
}
