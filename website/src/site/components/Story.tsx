import { FEATURES } from "../lib/site";
import { Container, Eyebrow, Reveal, SectionHeading, Button, Ornament } from "./ui";
import { FEATURE_ICONS, ArrowUpRight } from "./icons";
import { CommissionLink } from "./CommissionLink";

const ATELIER_IMG =
  "https://images.pexels.com/photos/37251960/pexels-photo-37251960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=820";
const WEDDING_IMG =
  "https://images.pexels.com/photos/12730010/pexels-photo-12730010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=820";
const CORPORATE_IMG =
  "https://images.pexels.com/photos/9077996/pexels-photo-9077996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000";

export function Story() {
  return (
    <>
      {/* Atelier */}
      <section id="story" className="scroll-mt-24 border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <div className="relative">
                <div className="overflow-hidden">
                  <img
                    src={ATELIER_IMG}
                    alt="Tailoring in progress at the Aurum Bespoke atelier"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                {/* corner frame */}
                <span aria-hidden className="pointer-events-none absolute -inset-3 border border-gold/20" />
                <div className="absolute bottom-4 left-4 right-4 border border-gold/30 bg-ink/85 px-4 py-3 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-5 sm:px-5">
                  <p className="font-display text-base text-bone sm:text-lg">The Aurum Bespoke Atelier</p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-gold/80">Bengaluru · By appointment</p>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <Eyebrow>The House of Aurum Bespoke</Eyebrow>
              </Reveal>
              <Reveal>
                <h2 className="mt-5 font-display text-[2rem] leading-[1.08] text-bone sm:text-4xl md:text-5xl">
                  An atelier built around you.
                </h2>
              </Reveal>
              <Reveal>
                <p className="mt-6 text-[15px] leading-relaxed text-mute">
                  Aurum Bespoke began with a single conviction — that a perfectly fitted
                  garment changes the way a man carries himself. Today, a small atelier of
                  master artisans carries that conviction to your door, crafting bespoke
                  menswear with the discretion of a private appointment.
                </p>
              </Reveal>

              <Reveal>
                <figure className="mt-8 border-l-2 border-gold/50 pl-5 sm:pl-6">
                  <blockquote className="font-display text-xl italic leading-snug text-bone sm:text-2xl">
                    “True luxury isn’t about the price tag — it’s about the precision in
                    every stitch, and the confidence you feel in something made just for you.”
                  </blockquote>
                  <figcaption className="mt-4 text-[11px] uppercase tracking-[0.2em] text-gold">
                    Mohammed Ghouse — Founder
                  </figcaption>
                </figure>
              </Reveal>

              <Reveal>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.18em] text-body">
                  <span>Master artisans</span>
                  <span className="h-3 w-px bg-line" />
                  <span>Hand-finished</span>
                  <span className="h-3 w-px bg-line" />
                  <span>Private, by appointment</span>
                </div>
              </Reveal>

              <Reveal>
                <div className="mt-10">
                  <Button href="#process" variant="ghost">
                    Discover the process
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Standards / features */}
      <section id="standards" className="scroll-mt-24 border-t border-line bg-ink-2 py-16 sm:py-20 md:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Why Aurum Bespoke"
            title="Standards we never compromise"
            intro="Every Aurum Bespoke garment is held to the same exacting standard — from the first measurement to the final stitch."
          />

          <div className="mt-10 grid sm:mt-14 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[f.icon];
              return (
                <Reveal key={f.title}>
                  <div className="group h-full bg-ink-2 p-6 transition-colors hover:bg-ink-3 sm:p-8">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-gold/30 text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </span>
                    <h3 className="mt-5 font-display text-xl text-bone sm:mt-6 sm:text-2xl">{f.title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-mute">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Specializations */}
      <section id="specialisations" className="scroll-mt-24 border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container>
          <div className="flex flex-col items-center text-center">
            <SectionHeading
              align="center"
              eyebrow="Specialisations"
              title="Two disciplines, one standard"
            />
          </div>

          <div className="mt-10 grid sm:mt-14 gap-6 lg:grid-cols-2">
            {[
              {
                img: WEDDING_IMG,
                requirement: "Wedding Suits",
                kicker: "Weddings & Celebrations",
                title: "For the day you’ll always remember",
                copy: "From the engagement sherwani to the reception tuxedo — coordinated tailoring for the groom and his party, timed to your dates.",
              },
              {
                img: CORPORATE_IMG,
                requirement: "Corporate Uniforms",
                kicker: "Corporate & Hospitality",
                title: "A wardrobe that represents",
                copy: "Unified, branded uniforms and executive wardrobes for teams, hotels and premium establishments — consistent in fit and finish.",
              },
            ].map((p, i) => (
              <Reveal key={p.kicker}>
                <CommissionLink
                  requirement={p.requirement}
                  className="group relative block overflow-hidden border border-line"
                >
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[3/2] h-full w-full object-cover lg:aspect-[5/4]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{p.kicker}</p>
                    <h3 className="mt-3 font-display text-2xl text-bone sm:text-3xl md:text-4xl">{p.title}</h3>
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-body/90">{p.copy}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                      Enquire <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </CommissionLink>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 sm:mt-16">
            <Ornament />
          </div>
        </Container>
      </section>
    </>
  );
}
