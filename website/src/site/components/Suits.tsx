import { SUITS } from "../lib/site";
import { Container, Eyebrow, Reveal, SectionHeading } from "./ui";
import { Check } from "./icons";
import { CommissionLink } from "./CommissionLink";

export function Suits() {
  return (
    <section id="suits" className="scroll-mt-24 border-t border-line bg-ink py-16 sm:py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="The Flagship"
          title="The suit, perfected"
          intro={SUITS.intro}
        />

        {/* Suit looks */}
        <div className="mt-10 grid sm:mt-14 gap-6 sm:grid-cols-3">
          {SUITS.looks.map((look, i) => (
            <Reveal key={look.name}>
              <CommissionLink
                requirement={look.requirement}
                className="group relative block overflow-hidden border border-line"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={look.image}
                    alt={`${look.name} — ${look.cut}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
                  <h3 className="font-display text-xl text-bone sm:text-2xl md:text-3xl">{look.name}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-gold sm:text-[11px] sm:tracking-[0.2em]">{look.cut}</p>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 border border-transparent transition-colors group-hover:border-gold/40"
                />
              </CommissionLink>
            </Reveal>
          ))}
        </div>

        {/* Construction details */}
        <div className="mt-10 grid sm:mt-14 gap-x-12 gap-y-8 md:grid-cols-2">
          <Reveal>
            <div>
              <Eyebrow>What defines an Aurum Bespoke suit</Eyebrow>
              <h3 className="mt-5 font-display text-3xl text-bone sm:text-4xl">
                Built, not just sewn.
              </h3>
            </div>
          </Reveal>
          <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {SUITS.details.map((d, i) => (
              <Reveal key={d.title}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-gold/15 text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h4 className="font-display text-lg text-bone">{d.title}</h4>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-mute">{d.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <p className="mx-auto mt-12 max-w-xl sm:mt-16 text-center font-display text-2xl italic leading-snug text-bone/90">
            A suit is the quietest way to be remembered. We’d be glad to make yours.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
