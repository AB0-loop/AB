import { TESTIMONIALS } from "../lib/site";
import { Container, Reveal, SectionHeading } from "./ui";

export function Testimonials() {
  return (
    <section className="border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <Reveal>
          <SectionHeading align="center" eyebrow="Testimonials" title="What clients say" intro="Direct from the atelier floor - notes from clients who commissioned bespoke garments across Bangalore and UAE." />
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <div className="h-full rounded-2xl border border-line bg-ink p-7 sm:p-8">
                <p className="text-[15px] leading-relaxed text-body">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold font-display text-lg">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium text-bone">{t.name}</span>
                    <span className="text-[12px] text-mute">{t.area}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
