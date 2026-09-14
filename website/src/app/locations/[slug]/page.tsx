import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, PageShell } from "@/site/components/PageShell";
import { Button, Container } from "@/site/components/ui";
import {
  CONFIG,
  LOCATION_PAGES,
  PROCESS,
  SERVICE_PAGES,
  whatsappLink,
} from "@/site/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LOCATION_PAGES.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

function getLocation(slug: string) {
  return LOCATION_PAGES.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getLocation((await params).slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/locations/${item.slug}` },
  };
}

export default async function LocationPage({ params }: Props) {
  const place = getLocation((await params).slug);
  if (!place) notFound();

  const url = `${CONFIG.websiteUrl}/locations/${place.slug}`;
  const faq: [string, string][] = [
    [
      `Does Aurum Bespoke have a walk-in shop in ${place.name}?`,
      `No. Aurum Bespoke is appointment-only. The atelier arranges consultation, measurements and fittings at your home or office in ${place.name}.`,
    ],
    [
      `Which tailoring services are available in ${place.name}?`,
      "Clients can commission bespoke suits, made-to-measure garments, wedding tailoring and corporate wardrobes through a private doorstep appointment.",
    ],
    [
      `How do I book a fitting in ${place.name}?`,
      `Use the booking form or WhatsApp ${CONFIG.phoneDisplay}. The atelier confirms availability and arranges a suitable home or office visit.`,
    ],
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
        { "@type": "ListItem", position: 2, name: "Locations", item: `${CONFIG.websiteUrl}/#contact` },
        { "@type": "ListItem", position: 3, name: place.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": ["ClothingStore", "ProfessionalService"],
      "@id": `${url}/#localbusiness`,
      name: `${CONFIG.brand} — ${place.name} service area`,
      url,
      image: `${CONFIG.websiteUrl}/brand/icon-512.png`,
      telephone: CONFIG.phoneHref.replace("tel:", ""),
      email: CONFIG.email,
      priceRange: "₹₹₹",
      address: {
        "@type": "PostalAddress",
        addressLocality: place.name,
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: CONFIG.geo.lat,
        longitude: CONFIG.geo.lng,
      },
      areaServed: { "@type": "Place", name: place.name },
      parentOrganization: { "@id": `${CONFIG.websiteUrl}/#organisation` },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "10:00",
          closes: "20:00",
          description: "By appointment only",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ];

  return (
    <PageShell
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Locations" },
        { label: place.name },
      ]}
    >
      <PageHero
        eyebrow={`Private doorstep tailoring · ${place.name}`}
        title={`Bespoke tailor in ${place.name}`}
        intro={place.intro}
        actions={
          <>
            <Button href={`/booking?city=${encodeURIComponent(place.name)}`}>Arrange a fitting</Button>
            <Button
              href={whatsappLink(`Hello Aurum Bespoke, I'd like an appointment in ${place.name}.`)}
              variant="ghost"
            >
              WhatsApp the atelier
            </Button>
          </>
        }
      />

      <section className="border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)]">
          <article>
            <p className="max-w-2xl border-l-2 border-gold pl-5 font-display text-2xl leading-snug text-bone">
              A private tailoring service designed around your schedule—not a walk-in shop.
            </p>
            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">
              How doorstep tailoring works in {place.name}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              At the first appointment, the conversation covers your occasion, work, style preferences and the garments already in your wardrobe. Fabric can be compared at home or at your office, where colour and texture can be considered in familiar light. More than twenty measurements map body and posture before the commission moves to cutting.
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              A subsequent trial checks balance, drape and proportion. The finished garment is then pressed and delivered. This model is particularly useful for clients who prefer privacy, need to work around office hours or want family members measured together for a wedding.
            </p>

            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">
              Tailoring available in {place.name}
            </h2>
            <div className="mt-6 space-y-6">
              {SERVICE_PAGES.map((service) => (
                <div key={service.slug}>
                  <h3 className="font-display text-2xl text-bone">
                    <Link href={`/services/${service.slug}`} className="hover:text-gold">
                      {service.name}
                    </Link>
                  </h3>
                  <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mute">
                    {service.short}{" "}
                    <Link href={`/services/${service.slug}`} className="text-gold hover:text-gold-2">
                      Explore the service →
                    </Link>
                  </p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">Five stages, one point of contact</h2>
            <div className="mt-6 space-y-4">
              {PROCESS.map((step) => (
                <p key={step.no} className="max-w-2xl text-[15px] leading-relaxed text-mute">
                  <strong className="text-bone">
                    {step.no} · {step.title}.
                  </strong>{" "}
                  {step.desc}
                </p>
              ))}
            </div>

            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">
              Questions about {place.name} appointments
            </h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {faq.map(([q, a]) => (
                <details key={q} className="py-5">
                  <summary className="cursor-pointer font-display text-xl text-bone">{q}</summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">{a}</p>
                </details>
              ))}
            </div>
          </article>

          <aside className="h-max border border-line bg-ink-2 p-7 lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Service-area facts</p>
            <h2 className="mt-4 font-display text-3xl text-bone">{place.name}, Bengaluru</h2>
            <ul className="mt-6 space-y-3 text-[14px] text-mute">
              <li>At-home consultations</li>
              <li>Office appointments</li>
              <li>Monday–Saturday</li>
              <li>10:00–20:00</li>
              <li>Appointment only</li>
            </ul>
            <a href={CONFIG.phoneHref} className="mt-6 block text-gold hover:text-gold-2">
              {CONFIG.phoneDisplay}
            </a>
            <Button href="/booking" className="mt-8 w-full">
              Book consultation
            </Button>
          </aside>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-2 py-16 sm:py-20">
        <Container>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Greater Bengaluru service area</p>
          <h2 className="mt-4 font-display text-3xl text-bone sm:text-5xl">Doorstep appointments across the city.</h2>
          <iframe
            className="mt-8 h-[360px] w-full border border-line grayscale contrast-125"
            loading="lazy"
            title={`Map of ${place.name}, Bengaluru`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${place.name}, Bengaluru, Karnataka`)}&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="mt-6 flex flex-wrap gap-3">
            {LOCATION_PAGES.filter((item) => item.slug !== place.slug).map((item) => (
              <Link
                key={item.slug}
                href={`/locations/${item.slug}`}
                className="border border-line px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-body transition-colors hover:border-gold hover:text-gold"
              >
                Also serving {item.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {schema.map((value, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, "\\u003c") }}
        />
      ))}
    </PageShell>
  );
}
