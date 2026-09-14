import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, PageShell } from "@/site/components/PageShell";
import { Button, Container } from "@/site/components/ui";
import {
  CONFIG,
  PROCESS,
  SERVICE_AREAS,
  SERVICE_PAGES,
  whatsappLink,
} from "@/site/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_PAGES.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

function getService(slug: string) {
  return SERVICE_PAGES.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getService((await params).slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    alternates: { canonical: `/services/${item.slug}` },
    openGraph: {
      title: item.title,
      description: item.description,
      url: `${CONFIG.websiteUrl}/services/${item.slug}`,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const item = getService((await params).slug);
  if (!item) notFound();

  const url = `${CONFIG.websiteUrl}/services/${item.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
        { "@type": "ListItem", position: 2, name: "Services", item: `${CONFIG.websiteUrl}/#collections` },
        { "@type": "ListItem", position: 3, name: item.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${url}/#service`,
      name: `${item.name} in Bangalore`,
      description: item.description,
      url,
      provider: { "@id": `${CONFIG.websiteUrl}/#organisation` },
      serviceType: item.name,
      areaServed: SERVICE_AREAS.map((name) => ({
        "@type": "Place",
        name,
        address: {
          "@type": "PostalAddress",
          addressLocality: name,
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
      })),
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        description: "Individually quoted according to fabric, construction and detailing",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: item.faqs.map(([q, a]) => ({
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
        { label: "Services" },
        { label: item.name },
      ]}
    >
      <PageHero
        eyebrow={`${item.eyebrow} · Bengaluru`}
        title={`${item.name} in Bangalore`}
        intro={item.lead}
        actions={
          <>
            <Button href={`/booking?requirement=${encodeURIComponent(item.name)}`}>Book consultation</Button>
            <Button href={whatsappLink(`Hello Aurum Bespoke, I'd like to discuss ${item.name}.`)} variant="ghost">
              Ask on WhatsApp
            </Button>
          </>
        }
      />

      <section className="border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,0.7fr)] lg:gap-16">
          <article>
            <p className="max-w-2xl text-[15px] leading-relaxed text-mute">{item.short}</p>
            <ul className="mt-8 space-y-3 text-[15px] text-body">
              {item.includes.map((entry) => (
                <li key={entry} className="border-b border-line/70 pb-3">
                  {entry}
                </li>
              ))}
            </ul>

            {item.sections.map(([title, text]) => (
              <section key={title} className="mt-12">
                <h2 className="font-display text-3xl text-bone sm:text-4xl">{title}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">{text}</p>
              </section>
            ))}

            <section className="mt-12">
              <h2 className="font-display text-3xl text-bone sm:text-4xl">The Aurum Bespoke process</h2>
              <div className="mt-6 space-y-5">
                {PROCESS.map((step) => (
                  <div key={step.no}>
                    <h3 className="font-display text-xl text-gold">
                      {step.no} · {step.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-mute">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="font-display text-3xl text-bone sm:text-4xl">Frequently asked questions</h2>
              <div className="mt-6 divide-y divide-line border-y border-line">
                {item.faqs.map(([q, a]) => (
                  <details key={q} className="py-5">
                    <summary className="cursor-pointer font-display text-xl text-bone">{q}</summary>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mute">{a}</p>
                  </details>
                ))}
              </div>
            </section>

            <p className="mt-10 text-[15px] leading-relaxed text-mute">
              Continue with{" "}
              <Link href="/journal/bespoke-vs-made-to-measure" className="text-gold hover:text-gold-2">
                bespoke vs made-to-measure
              </Link>
              , the{" "}
              <Link href="/journal/best-suit-fabrics-bangalore-weather" className="text-gold hover:text-gold-2">
                Bangalore fabric guide
              </Link>
              , or{" "}
              <Link href="/about" className="text-gold hover:text-gold-2">
                the atelier story
              </Link>
              .
            </p>
          </article>

          <aside className="h-max border border-line bg-ink-2 p-7 lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">At a glance</p>
            <h2 className="mt-4 font-display text-3xl text-bone">{item.name}</h2>
            <ul className="mt-6 space-y-3 text-[14px] text-mute">
              <li>Bengaluru doorstep service</li>
              <li>Home or office consultation</li>
              <li>20+ point measurement study</li>
              <li>Typical turnaround: around one week</li>
              <li>Quoted after cloth and construction selection</li>
            </ul>
            <p className="mt-6 text-[14px] text-body">
              <a href={CONFIG.phoneHref} className="text-gold hover:text-gold-2">
                {CONFIG.phoneDisplay}
              </a>
              <br />
              {CONFIG.email}
            </p>
            <Button href="/booking" className="mt-8 w-full">
              Request appointment
            </Button>
          </aside>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-2 py-16 sm:py-20">
        <Container>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Related services</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SERVICE_PAGES.filter((service) => service.slug !== item.slug).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="border border-line px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-body transition-colors hover:border-gold hover:text-gold"
              >
                {service.name}
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
