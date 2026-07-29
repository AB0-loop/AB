import { Container, Eyebrow, Reveal, SectionHeading } from "./ui";
import { Check, Close } from "./icons";

const ROWS: { label: string; rack: string; bespoke: string }[] = [
  { label: "Fit", rack: "Made to a size chart", bespoke: "Cut to your body" },
  { label: "Fabric", rack: "What the rack offers", bespoke: "Italian, English & Indian mills" },
  { label: "Construction", rack: "Fused, factory-glued", bespoke: "Hand-structured canvas" },
  { label: "Detailing", rack: "Standard, fixed", bespoke: "Lapel, lining & monogram, yours" },
  { label: "Lifespan", rack: "A few seasons", bespoke: "Altered to last decades" },
  { label: "Experience", rack: "A shop floor", bespoke: "A private consultation" },
];

export function WhyBespoke() {
  return (
    <section id="why" className="scroll-mt-24 border-t border-line bg-ink-2 py-16 sm:py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Bespoke"
          title="Bespoke isn't a product. It's a standard."
          intro="The difference between a garment that fits and one that was made for you."
        />

        <div className="mt-10 overflow-hidden border border-line sm:mt-14">
          {/* header row — desktop only; mobile rows carry their own labels */}
          <div className="hidden grid-cols-[1.1fr_1fr_1fr] border-b border-line bg-ink text-[11px] uppercase tracking-[0.2em] sm:grid">
            <div className="p-5" />
            <div className="border-l border-line p-5 text-mute">Off the rack</div>
            <div className="border-l border-line bg-gold/[0.06] p-5 text-gold">Aurum Bespoke</div>
          </div>

          {ROWS.map((r, i) => (
            <Reveal key={r.label}>
              <div className="grid border-b border-line/70 text-[14px] last:border-0 sm:grid-cols-[1.1fr_1fr_1fr] sm:text-[15px]">
                <div className="bg-ink px-5 py-3 font-display text-base text-bone sm:bg-transparent sm:p-5 sm:text-lg">
                  {r.label}
                </div>
                <div className="flex items-start gap-2.5 px-5 py-3 text-mute sm:border-l sm:border-line/70 sm:p-5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center border border-line text-mute/60">
                    <Close className="h-3 w-3" />
                  </span>
                  <span>
                    <span className="mr-1.5 text-[11px] uppercase tracking-[0.15em] text-mute/60 sm:hidden">
                      Off the rack —
                    </span>
                    {r.rack}
                  </span>
                </div>
                <div className="flex items-start gap-2.5 bg-gold/[0.04] px-5 py-3 text-bone sm:border-l sm:border-line/70 sm:p-5">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-gold/15 text-gold">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="mr-1.5 text-[11px] uppercase tracking-[0.15em] text-gold/70 sm:hidden">
                      Aurum —
                    </span>
                    {r.bespoke}
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto mt-10 max-w-xl text-center font-display text-xl italic leading-snug text-bone/85 sm:text-2xl">
            We don&apos;t sell clothes off a shelf. We build a wardrobe around the way you live.
          </p>
        </Reveal>

        <div className="mt-10 flex justify-center">
          <Eyebrow>Made once. Worn for years.</Eyebrow>
        </div>
      </Container>
    </section>
  );
}
