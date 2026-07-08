import { PROCESS } from "../lib/site";
import { PROCESS_ICONS } from "./icons";
import { Container, Reveal, SectionHeading, Button } from "./ui";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The Process"
          title="From conversation to delivery"
          intro="Five considered stages, each performed by hand - and always on your schedule."
        />

        <div className="relative mt-20">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {PROCESS.map((step, i) => {
              const Icon = PROCESS_ICONS[step.icon];
              return (
                <Reveal key={step.no} delay={i * 90}>
                  <div className="relative text-center lg:text-left">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center border border-gold/30 bg-ink-2 text-gold lg:mx-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-6 block font-display text-sm tracking-[0.3em] text-gold/50">
                      {step.no}
                    </span>
                    <h3 className="mt-1 font-display text-2xl text-bone">{step.title}</h3>
                    <p className="mx-auto mt-3 max-w-[15rem] text-[14px] leading-relaxed text-mute lg:mx-0">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="font-display text-2xl text-bone">Your garment begins with a conversation.</p>
            <Button href="#booking">Book your consultation</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
