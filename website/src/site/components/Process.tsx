import { PROCESS } from "../lib/site";
import { PROCESS_ICONS } from "./icons";
import { Container, Reveal, SectionHeading, Button } from "./ui";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-line bg-ink-2 py-16 sm:py-20 md:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="The Process"
          title="From conversation to delivery"
          intro="Five considered stages, each performed by hand — and always on your schedule."
        />

        <div className="relative mt-10 sm:mt-14">
          {/* connecting line */}
          <span
            aria-hidden
            className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block"
          />

          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5 lg:gap-6">
            {PROCESS.map((step, i) => {
              const Icon = PROCESS_ICONS[step.icon];
              return (
                <Reveal key={step.no}>
                  <div className="relative flex gap-4 text-left sm:block sm:text-center lg:text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-gold/30 bg-ink-2 text-gold sm:mx-auto sm:h-14 sm:w-14 lg:mx-0">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-display text-sm tracking-[0.3em] text-gold/50 sm:mt-6">
                        {step.no}
                      </span>
                      <h3 className="mt-1 font-display text-xl text-bone sm:text-2xl">{step.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-mute sm:mx-auto sm:mt-3 sm:max-w-[15rem] lg:mx-0">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-5 text-center sm:mt-16">
            <p className="font-display text-xl text-bone sm:text-2xl">Your garment begins with a conversation.</p>
            <Button href="#booking">Book your consultation</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
