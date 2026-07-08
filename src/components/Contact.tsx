import { CONFIG, whatsappLink, SERVICE_AREAS, SOCIALS } from "../lib/site";
import { Container, Reveal, SectionHeading, Button } from "./ui";
import { Brand, Phone, Mail, MapPin, Clock, Sparkles, ArrowUpRight } from "./icons";

const ROWS = [
  { icon: Phone, label: "Call", value: CONFIG.phoneDisplay, href: CONFIG.phoneHref },
  { icon: Brand.whatsapp, label: "WhatsApp", value: "Message the atelier", href: whatsappLink(), external: true },
  { icon: Mail, label: "Email", value: CONFIG.email, href: CONFIG.emailHref },
  { icon: Clock, label: "Hours", value: CONFIG.hours },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <SectionHeading align="center" eyebrow="Contact" title="Begin the conversation" intro="The quickest way to reach us is WhatsApp - or send your details through the booking form above." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {ROWS.map((r) => { const Icon = r.icon; const inner = <div className="flex h-full items-start gap-4 bg-ink-2 p-6 transition-colors duration-300 hover:bg-ink-3"><span className="grid h-11 w-11 shrink-0 place-items-center border border-gold/30 text-gold"><Icon className="h-5 w-5" /></span><span><span className="block text-[11px] uppercase tracking-[0.2em] text-gold/80">{r.label}</span><span className="mt-1 block break-words text-[15px] text-bone">{r.value}</span></span></div>; return r.href ? <a key={r.label} href={r.href} target={r.external ? "_blank" : undefined} rel={r.external ? "noreferrer" : undefined}>{inner}</a> : <div key={r.label}>{inner}</div>; })}
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="h-full rounded-[1.75rem] border border-line bg-ink p-7 sm:p-8">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gold"><MapPin className="h-4 w-4" /> Warehouse address</p>
              <p className="mt-4 text-[15px] leading-relaxed text-mute">{CONFIG.address}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-gold/80">{CONFIG.addressNote}</p>
              <div className="mt-6 flex flex-wrap gap-2">{SERVICE_AREAS.map((area) => <span key={area} className="border border-line px-3 py-1.5 text-[12px] tracking-wide text-body">{area}</span>)}</div>
              <a href={CONFIG.googleBusinessProfileUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:text-gold-2">View Google Business Profile <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-gold/20 bg-gradient-to-br from-ink-3 to-ink p-7 sm:p-8">
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center border border-gold/30 text-gold"><Sparkles className="h-5 w-5" /></span>
                <h3 className="mt-5 font-display text-3xl text-bone">For planners & stylists</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mute">We collaborate with event planners, wedding stylists and hospitality teams to deliver coordinated menswear - groom's party, corporate wardrobes and house styles - built to a single standard.</p>
              </div>
              <div className="mt-7"><Button href={whatsappLink("Hello Aurum Bespoke, I'm an event planner or stylist and would love to collaborate.")}>Partner with us</Button></div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={120}><div className="mt-12 flex flex-col items-center gap-5 border-t border-line pt-10"><p className="text-[11px] uppercase tracking-[0.3em] text-mute">Follow the atelier</p><div className="flex flex-wrap items-center justify-center gap-3">{SOCIALS.map((s) => { const Icon = Brand[s.key]; return <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-11 w-11 place-items-center border border-gold/25 text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink"><Icon className="h-[18px] w-[18px]" /></a>; })}</div></div></Reveal>
      </Container>
    </section>
  );
}
