import { COLLECTIONS } from "../lib/site";
import { Container, Eyebrow, Reveal } from "./ui";
import { ArrowUpRight } from "./icons";

export function Collections() {
  const [feature, ...rest] = COLLECTIONS;
  const corporate = rest[rest.length - 1];
  const middle = rest.slice(0, -1);

  return (
    <section id="collections" className="scroll-mt-24 border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal><Eyebrow>The Collections</Eyebrow></Reveal>
            <Reveal delay={80}><h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.08] text-bone sm:text-5xl">A wardrobe, made to measure.</h2></Reveal>
          </div>
            <Reveal delay={140}><p className="max-w-sm text-[15px] leading-relaxed text-mute">Tailored disciplines for every bespoke occasion: suits, tuxedos, sherwanis, shirts, kurtas, women's formalwear and children's formal wear. Every piece is built to your measurements, your cloth and your use case.</p></Reveal>
        </div>

        <Reveal delay={120}><a href="#booking" className="group mt-14 block overflow-hidden border border-line">
          <div className="grid lg:grid-cols-2">
            <div className="relative overflow-hidden"><img src={feature.image} alt={feature.name} loading="lazy" decoding="async" className="h-full min-h-[320px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-r from-transparent to-ink-2/60 lg:bg-gradient-to-l" /></div>
            <div className="flex flex-col justify-center bg-ink p-9 md:p-14"><span className="text-[11px] uppercase tracking-[0.25em] text-gold">{feature.tagline}</span><h3 className="mt-3 font-display text-4xl text-bone md:text-5xl">{feature.name}</h3><p className="mt-4 max-w-md text-[15px] leading-relaxed text-mute">{feature.blurb}</p><span className="mt-7 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">Begin a commission <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div>
          </div>
        </a></Reveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {middle.map((c, i) => <Reveal key={c.id} delay={(i % 3) * 90}><a href="#booking" className="group relative block overflow-hidden border border-line"><div className="relative aspect-[4/5] overflow-hidden"><img src={c.image} alt={c.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" /></div><div className="absolute inset-x-0 bottom-0 p-7"><span className="text-[11px] uppercase tracking-[0.25em] text-gold">{c.tagline}</span><h3 className="mt-2 font-display text-2xl text-bone md:text-3xl">{c.name}</h3><p className="mt-2 max-w-xs text-[13px] leading-relaxed text-body/85 opacity-0 transition-all duration-500 group-hover:opacity-100">{c.blurb}</p></div><span aria-hidden className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-gold/40" /></a></Reveal>)}
        </div>

        <Reveal delay={120}><a href="#booking" className="group relative mt-6 block overflow-hidden border border-line"><img src={corporate.image} alt={corporate.name} loading="lazy" decoding="async" className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 md:h-[340px]" /><div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/55 to-transparent" /><div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-center p-9 md:p-14"><span className="text-[11px] uppercase tracking-[0.25em] text-gold">{corporate.tagline}</span><h3 className="mt-3 font-display text-4xl text-bone md:text-5xl">{corporate.name}</h3><p className="mt-4 max-w-md text-[15px] leading-relaxed text-body/90">{corporate.blurb}</p><span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">Enquire for your team <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span></div></a></Reveal>
      </Container>
    </section>
  );
}
