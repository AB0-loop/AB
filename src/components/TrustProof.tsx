import { CONFIG } from "../lib/site";
import { Container, Eyebrow, Reveal, SectionHeading } from "./ui";
import { ArrowUpRight, Sparkles } from "./icons";

const TRUST_ITEMS = [
  { title: "Private consultations", desc: "Home or office appointments across Bangalore, with privacy and discretion at the centre of every meeting." },
  { title: "Real tailoring depth", desc: "From British and Italian fit profiles to women's formal suiting, every commission is shaped around purpose and posture." },
  { title: "Visual authority", desc: "An expanded portfolio of premium suiting, wedding tailoring, ceremonial dressing and formal separates." },
];

export function TrustProof() {
  return (
    <section id="trust" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Proof & Trust" title="Trusted by clients who want fit, discretion and presence" intro="Aurum Bespoke is built for wedding clients, corporate leaders, hospitality teams and women seeking formal suiting that feels composed and modern." />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="rounded-[2rem] border border-gold/20 bg-ink-2 p-8 sm:p-10">
              <Eyebrow>What clients commonly choose</Eyebrow>
              <div className="mt-8 space-y-4">
                {[
                  { title: "Wedding commissions", desc: "Ceremony tailoring with comfort, movement and the polish required for long days and formal photographs." },
                  { title: "Executive wardrobes", desc: "Boardroom suits, polished separates and formal dressing that feels sharp from the first meeting to the last appointment." },
                  { title: "Women's tailoring", desc: "Women's tuxedos, pantsuits, occasion wear and corporate uniforms for women - designed with precision and presence." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-line/70 bg-ink p-5">
                    <h3 className="font-display text-2xl text-bone">{item.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-mute">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="flex h-full flex-col justify-between rounded-[2rem] border border-gold/20 bg-gradient-to-br from-ink-3 to-ink p-8 sm:p-10">
              <div>
                <Eyebrow>Why clients choose us</Eyebrow>
                <div className="mt-8 space-y-4">
                  {TRUST_ITEMS.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 rounded-[1.25rem] border border-line/70 bg-ink/60 p-4">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center bg-gold/15 text-gold"><Sparkles className="h-3.5 w-3.5" /></span>
                      <div>
                        <h3 className="font-display text-xl text-bone">{item.title}</h3>
                        <p className="mt-2 text-[14px] leading-relaxed text-mute">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a href={CONFIG.googleBusinessProfileUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-2">
                View Google Business Profile <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}><div className="mt-12 flex flex-col items-center gap-3 border-t border-line pt-10 text-center"><p className="text-[11px] uppercase tracking-[0.24em] text-gold">Serving Bangalore and select remote clients</p><p className="max-w-2xl text-[15px] leading-relaxed text-mute">{CONFIG.address} / {CONFIG.city} / Private consultations designed for the modern wardrobe.</p></div></Reveal>
      </Container>
    </section>
  );
}
