import { FEATURES, FABRIC_TAGS } from "../lib/site";
import { Container, Eyebrow, Reveal, SectionHeading } from "./ui";
import { FEATURE_ICONS, ArrowUpRight } from "./icons";

const ATELIER_IMG = "https://images.pexels.com/photos/37251960/pexels-photo-37251960.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=820";
const WEDDING_IMG = "https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=820";
const CORPORATE_IMG = "https://images.pexels.com/photos/9077996/pexels-photo-9077996.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=620&w=1000";

export function Story() {
  return (
    <>
      <section id="story" className="scroll-mt-24 bg-ink py-24 md:py-32">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <Reveal>
              <div className="relative overflow-hidden">
                <img src={ATELIER_IMG} alt="A master tailor crafting a garment in the Aurum atelier" loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-gold">Master-led bespoke tailoring</p>
                  <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">Crafted with precision, delivered with discretion.</h2>
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal><Eyebrow>The House of Aurum</Eyebrow></Reveal>
              <Reveal delay={80}><h2 className="mt-5 font-display text-4xl leading-[1.08] text-bone sm:text-5xl">An atelier built around you.</h2></Reveal>
              <Reveal delay={150}><p className="mt-6 text-[15px] leading-relaxed text-mute">Aurum Bespoke is a private bespoke tailoring atelier serving Bangalore, Karnataka, and UAE with home and office consultations, online sessions for remote clients, and a made-to-order workflow focused on fit, fabric and finish.</p></Reveal>
              <Reveal delay={210}><div className="mt-8 rounded-2xl bg-ink-2 p-6 sm:p-7"><p className="text-[11px] uppercase tracking-[0.24em] text-gold">Master-led standard</p><p className="mt-4 font-display text-2xl text-bone">Craft, fit and client coordination under one atelier</p><p className="mt-2 text-[14px] leading-relaxed text-mute">The tailoring standard is led by a master tailor with 10+ years of experience, while trained atelier staff may handle measurements, consultations and client visits when required.</p></div></Reveal>
              <Reveal delay={270}><div className="mt-8 flex flex-wrap gap-2">{FABRIC_TAGS.map((tag) => <span key={tag} className="px-3 py-1.5 text-[12px] tracking-wide text-body">{tag}</span>)}</div></Reveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-ink-2 py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center">
            <SectionHeading align="center" eyebrow="Specialisations" title="Two disciplines, one standard" />
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              { img: WEDDING_IMG, kicker: "Weddings & Celebrations", title: "For the day you'll always remember", copy: "From the engagement sherwani to the reception tuxedo - coordinated tailoring for the groom and his party, timed around confirmed trial and delivery dates." },
              { img: CORPORATE_IMG, kicker: "Corporate & Hospitality", title: "A wardrobe that represents", copy: "Unified, branded uniforms and executive wardrobes for teams, hotels and premium establishments - consistent in fit and finish." }
            ].map((p, i) => (
              <Reveal key={p.kicker} delay={i * 120}>
                <div className="group relative block overflow-hidden rounded-3xl">
                  <img src={p.img} alt={p.title} loading="lazy" decoding="async" className="aspect-[3/2] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 lg:aspect-[5/4]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{p.kicker}</p>
                    <h3 className="mt-3 font-display text-3xl text-bone md:text-4xl">{p.title}</h3>
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-body/90">{p.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-ink py-24 md:py-32">
        <Container>
          <div className="flex flex-col items-center text-center">
            <SectionHeading align="center" eyebrow="Specialisations" title="Two disciplines, one standard" />
          </div>
          <div className="mt-16 grid gap-6 lg:grid-cols-2">
            {[
              { img: WEDDING_IMG, kicker: "Weddings & Celebrations", title: "For the day you'll always remember", copy: "From the engagement sherwani to the reception tuxedo - coordinated tailoring for the groom and his party, timed around confirmed trial and delivery dates." },
              { img: CORPORATE_IMG, kicker: "Corporate & Hospitality", title: "A wardrobe that represents", copy: "Unified, branded uniforms and executive wardrobes for teams, hotels and premium establishments - consistent in fit and finish." }
            ].map((p, i) => (
              <Reveal key={p.kicker} delay={i * 120}>
                <a href="#booking" className="group relative block overflow-hidden rounded-3xl border border-gold/15">
                  <img src={p.img} alt={p.title} loading="lazy" decoding="async" className="aspect-[3/2] h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 lg:aspect-[5/4]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-gold">{p.kicker}</p>
                    <h3 className="mt-3 font-display text-3xl text-bone md:text-4xl">{p.title}</h3>
                    <p className="mt-3 max-w-md text-[14px] leading-relaxed text-body/90">{p.copy}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold">
                      Enquire <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
