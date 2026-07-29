import { COLLECTIONS } from "../lib/site";
import { Container, Eyebrow, Reveal } from "./ui";
import { CommissionLink } from "./CommissionLink";
import { ArrowUpRight } from "./icons";

export function Collections() {
  const [feature, ...rest] = COLLECTIONS;
  const corporate = rest[rest.length - 1];
  const middle = rest.slice(0, -1);

  return (
    <section
      id="collections"
      className="scroll-mt-24 border-t border-line bg-ink-2 py-16 sm:py-20 md:py-28"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div>
            <Reveal>
              <Eyebrow>The Collections</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 className="mt-5 max-w-xl font-display text-[2.1rem] leading-[1.08] text-bone sm:text-4xl md:text-5xl">
                A wardrobe, made to measure.
              </h2>
            </Reveal>
          </div>
          <Reveal>
            <p className="max-w-sm text-[15px] leading-relaxed text-mute">
              Seven disciplines of bespoke tailoring — each crafted to your measurements,
              your cloth and your occasion.
            </p>
          </Reveal>
        </div>

        {/* Featured collection */}
        <Reveal>
          <CommissionLink
            requirement={feature.name}
            className="group mt-10 block overflow-hidden border border-line sm:mt-14"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative overflow-hidden">
                <img
                  src={feature.image}
                  alt={`${feature.name} — bespoke tailoring by Aurum Bespoke`}
                  loading="lazy"
                  decoding="async"
                  width={900}
                  height={1200}
                  className="aspect-[16/11] w-full object-cover sm:aspect-[16/9] lg:h-full lg:min-h-[420px] lg:aspect-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-2/70 to-transparent lg:bg-gradient-to-l" />
              </div>
              <div className="flex flex-col justify-center bg-ink p-6 sm:p-9 md:p-12">
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold">
                  {feature.tagline}
                </span>
                <h3 className="mt-3 font-display text-3xl text-bone sm:text-4xl md:text-5xl">
                  {feature.name}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mute">
                  {feature.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                  Begin a commission
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </CommissionLink>
        </Reveal>

        {/* Remaining collections */}
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {middle.map((c, i) => (
            <Reveal key={c.id}>
              <CommissionLink
                requirement={c.name}
                className="group relative block h-full overflow-hidden border border-line"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={c.image}
                    alt={`${c.name} — ${c.tagline}`}
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={1200}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold sm:text-[11px]">
                    {c.tagline}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl text-bone">{c.name}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-body/85">{c.blurb}</p>
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 border border-transparent transition-colors group-hover:border-gold/40"
                />
              </CommissionLink>
            </Reveal>
          ))}
        </div>

        {/* Corporate — stacks on mobile so nothing overflows the frame */}
        <Reveal>
          <CommissionLink
            requirement={corporate.name}
            className="group mt-5 block overflow-hidden border border-line"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-[1.15fr_1fr]">
              <div className="relative overflow-hidden">
                <img
                  src={corporate.image}
                  alt={`${corporate.name} — ${corporate.tagline}`}
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={900}
                  className="aspect-[16/10] w-full object-cover md:h-full md:min-h-[340px] md:aspect-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent md:bg-gradient-to-r" />
              </div>
              <div className="flex flex-col justify-center bg-ink p-6 sm:p-9 md:p-12">
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold">
                  {corporate.tagline}
                </span>
                <h3 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
                  {corporate.name}
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mute">
                  {corporate.blurb}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                  Enquire for your team
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </CommissionLink>
        </Reveal>
      </Container>
    </section>
  );
}
