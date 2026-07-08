import { AUTHORITY_TOPICS, CUSTOMIZATION_GROUPS } from "../lib/site";
import { Container, Reveal, SectionHeading } from "./ui";
import { Check } from "./icons";

export function AuthorityHub() {
  return (
    <section id="bespoke-guide" className="border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Bespoke Guide"
          title="A practical guide to bespoke tailoring"
          intro="Clear, factual guidance for clients comparing bespoke, made-to-measure and ready-made garments, with the customization choices that matter before a commission begins."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {AUTHORITY_TOPICS.map((topic, i) => (
            <Reveal key={topic.title} delay={(i % 3) * 70}>
              <article className="h-full border border-line bg-ink-2 p-6 sm:p-7">
                <h3 className="font-display text-2xl text-bone">{topic.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mute">{topic.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 border border-gold/15 bg-ink-2 p-7 sm:p-9">
            <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Customization Reference</p>
            <h3 className="mt-4 max-w-3xl font-display text-3xl leading-tight text-bone sm:text-4xl">
              Fit, fabric and construction choices discussed during consultation
            </h3>
            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {CUSTOMIZATION_GROUPS.map((group) => (
                <div key={group.title}>
                  <h4 className="font-display text-xl text-bone">{group.title}</h4>
                  <ul className="mt-4 space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-mute">
                        <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
