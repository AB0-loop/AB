import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageShell } from "@/site/components/PageShell";
import { Button, Container } from "@/site/components/ui";
import { CONFIG, PROCESS, SERVICE_PAGES } from "@/site/lib/site";

export const metadata: Metadata = {
  title: "About Aurum Bespoke | Bangalore Bespoke Tailoring Atelier",
  description:
    "Meet Aurum Bespoke, an appointment-only Bangalore menswear atelier founded by Mohammed Ghouse with private fittings and handcrafted tailoring in Bengaluru.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
      { "@type": "ListItem", position: 2, name: "About Aurum Bespoke", item: `${CONFIG.websiteUrl}/about` },
    ],
  };

  return (
    <PageShell crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}>
      <PageHero
        eyebrow="The house of Aurum Bespoke"
        title="A Bangalore tailoring atelier built around you"
        intro={`An appointment-only house for bespoke menswear, founded by ${CONFIG.founder} with ${CONFIG.coFounder} and supported by master artisans.`}
        actions={
          <>
            <Button href="/booking">Book a consultation</Button>
            <Button href="/services/bespoke-suits-bangalore" variant="ghost">
              Explore bespoke suits
            </Button>
          </>
        }
      />

      <section className="border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="overflow-hidden border border-line">
            <img
              src="https://images.pexels.com/photos/15352659/pexels-photo-15352659.jpeg?auto=compress&cs=tinysrgb&w=900"
              width={900}
              height={1125}
              alt="Tailor at work in a bespoke atelier"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">A private standard</p>
            <h2 className="mt-4 font-display text-4xl text-bone sm:text-5xl">The garment starts with the person.</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-mute">
              Aurum Bespoke began with a clear conviction: a well-fitted garment changes how a man carries himself. The atelier does not operate as a walk-in retail showroom. Instead, consultations and fittings are arranged at a client’s home or office across Bengaluru.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-mute">
              That setting makes the first conversation more useful. The tailor can understand work, occasion, personal taste and the wardrobe the new piece has to join. Cloth and construction can then be selected for a purpose rather than a sales display.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-mute">
              The published service is deliberately specific: handcrafted suits, tuxedos, sherwanis, shirts and coordinated wardrobes; more than twenty measurements; a trial fitting; and ongoing alteration support.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-2 py-16 sm:py-20 md:py-28">
        <Container>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">How a commission moves</p>
          <h2 className="mt-4 font-display text-4xl text-bone sm:text-5xl">Five considered stages.</h2>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mute">
            Most pieces are completed in around one week. Wedding and heavily embroidered garments may take longer, and the real timeline is confirmed before work starts.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((step) => (
              <article key={step.no} className="border border-line bg-ink p-5">
                <p className="font-display text-sm tracking-[0.3em] text-gold/60">{step.no}</p>
                <h3 className="mt-3 font-display text-2xl text-bone">{step.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mute">{step.desc}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-ink py-16 sm:py-20">
        <Container>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Explore the work</p>
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2">
            {SERVICE_PAGES.map((service) => (
              <article key={service.slug} className="bg-ink-2 p-8">
                <h3 className="font-display text-3xl text-bone">{service.name}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-mute">{service.short}</p>
                <Link href={`/services/${service.slug}`} className="mt-6 inline-block text-[12px] uppercase tracking-[0.16em] text-gold hover:text-gold-2">
                  View service →
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </PageShell>
  );
}
