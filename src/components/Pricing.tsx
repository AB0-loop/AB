import { PRICING_TIERS, CONFIG } from "@/lib/site";
import { Container } from "./ui";

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.26em] text-gold">Investment</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-bone sm:text-5xl">Pricing built around value and clarity.</h2>
          <p className="mt-6 text-base leading-relaxed text-body sm:text-lg">
            Bespoke tailoring starts at <span className="font-semibold text-gold">{CONFIG.priceStarting}</span>. Final investment depends on fabric, structure and the details you choose.
          </p>
          <p className="mt-3 text-sm text-mute">{CONFIG.priceNote}</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-4">
          {PRICING_TIERS.map((tier, idx) => (
            <div key={idx} className="rounded-[2rem] border border-line/70 bg-ink-2 p-8 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.45)] transition hover:border-gold/50">
              <p className="text-sm uppercase tracking-[0.24em] text-gold">{tier.name}</p>
              <p className="mt-5 text-4xl font-semibold text-bone">{tier.price}</p>
              <p className="mt-4 text-sm leading-relaxed text-body/85">{tier.desc}</p>
              <a href="#booking" className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-2">
                Book Consultation
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[2rem] border border-line/70 bg-ink-2 p-8">
          <h3 className="text-2xl font-display text-bone">What is included</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              "Home and office consultation",
              "Premium fabric options from Italian and British mills",
              "20+ point measurements and fit trial",
              "Functional cuffs, buttons, vents and finishing",
              "Personalized fit direction: English, Italian, British and custom",
              "Final delivery and styling guidance"
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 text-body/80">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
