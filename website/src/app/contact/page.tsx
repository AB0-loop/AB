import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, PageShell } from "@/site/components/PageShell";
import { Button, Container } from "@/site/components/ui";
import { CONFIG, LOCATION_PAGES, SERVICE_AREAS, whatsappLink } from "@/site/lib/site";

export const metadata: Metadata = {
  title: "Contact Aurum Bespoke | Private Tailor in Bangalore",
  description:
    "Contact Aurum Bespoke in Bangalore by phone, WhatsApp or email to arrange an appointment-only tailoring consultation at your home or office across Bengaluru.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${CONFIG.websiteUrl}/contact` },
    ],
  };

  return (
    <PageShell crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}>
      <PageHero
        eyebrow="Contact · Aurum Bespoke Bengaluru"
        title="Contact your bespoke tailor in Bangalore"
        intro="The quickest route is WhatsApp. The atelier confirms your private home or office appointment and answers questions about garments, cloth and timing."
        actions={
          <>
            <Button href={whatsappLink()}>WhatsApp {CONFIG.phoneDisplay}</Button>
            <Button href={CONFIG.phoneHref} variant="ghost">
              Call the atelier
            </Button>
          </>
        }
      />

      <section className="border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.7fr)]">
          <article>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Direct details</p>
            <h2 className="mt-4 font-display text-4xl text-bone">Aurum Bespoke</h2>
            <p className="mt-6 text-[15px] leading-relaxed text-mute">
              <strong className="text-bone">Phone / WhatsApp:</strong>{" "}
              <a href={CONFIG.phoneHref} className="text-gold hover:text-gold-2">
                {CONFIG.phoneDisplay}
              </a>
              <br />
              <strong className="text-bone">Email:</strong>{" "}
              <a href={CONFIG.emailHref} className="text-gold hover:text-gold-2">
                {CONFIG.email}
              </a>
              <br />
              <strong className="text-bone">Hours:</strong> Monday–Saturday, 10:00–20:00
              <br />
              <strong className="text-bone">Model:</strong> By appointment only; private visits across Bengaluru
            </p>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-mute">
              Aurum Bespoke does not publish a walk-in showroom address. This is a doorstep service, so a home or office location is agreed privately after the appointment is confirmed.
            </p>

            <h2 className="mt-12 font-display text-3xl text-bone">Where the atelier serves</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {SERVICE_AREAS.map((area) => {
                const page = LOCATION_PAGES.find((item) => item.name === area);
                return page ? (
                  <Link
                    key={area}
                    href={`/locations/${page.slug}`}
                    className="border border-line px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-body transition-colors hover:border-gold hover:text-gold"
                  >
                    {area}
                  </Link>
                ) : (
                  <span key={area} className="border border-line px-4 py-3 text-[12px] uppercase tracking-[0.14em] text-mute">
                    {area}
                  </span>
                );
              })}
            </div>

            <h2 className="mt-12 font-display text-3xl text-bone">Before you contact us</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              It helps to share the garment, occasion, preferred date and your Bengaluru area. For weddings, include all ceremony dates and an approximate number of people if family or party coordination is needed.
            </p>
          </article>

          <aside className="h-max border border-line bg-ink-2 p-7">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Verified profile</p>
            <h2 className="mt-4 font-display text-3xl text-bone">Local business details</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute">
              View Aurum Bespoke’s published Google Business Profile for the current listing and directions context.
            </p>
            <a
              href={CONFIG.googleBusinessProfile}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex border border-gold/30 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink"
            >
              Google profile ↗
            </a>
            <Button href="/booking" className="mt-4 w-full">
              Booking form
            </Button>
          </aside>
        </Container>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </PageShell>
  );
}
