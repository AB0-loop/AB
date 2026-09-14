import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, PageShell } from "@/site/components/PageShell";
import { Container } from "@/site/components/ui";
import { CONFIG, JOURNAL_PAGES, SERVICE_PAGES } from "@/site/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOURNAL_PAGES.map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

function getPost(slug: string) {
  return JOURNAL_PAGES.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle,
      description: post.description,
      url: `${CONFIG.websiteUrl}/journal/${post.slug}`,
    },
  };
}

export default async function JournalPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const url = `${CONFIG.websiteUrl}/journal/${post.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
        { "@type": "ListItem", position: 2, name: "Journal", item: `${CONFIG.websiteUrl}/journal/${post.slug}` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}/#article`,
      headline: post.title,
      description: post.description,
      mainEntityOfPage: url,
      author: { "@type": "Person", name: CONFIG.founder },
      publisher: { "@id": `${CONFIG.websiteUrl}/#organisation` },
      about: ["Bespoke tailoring", "Menswear", "Bengaluru"],
    },
  ];

  return (
    <PageShell crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }, { label: post.title }]}>
      <PageHero eyebrow="Aurum field notes · Bengaluru tailoring" title={post.title} intro={post.description} />

      <section className="border-t border-line bg-ink py-16 sm:py-20 md:py-28">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.6fr)]">
          <article>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">The short answer</p>
            <p className="mt-4 max-w-2xl border-l-2 border-gold pl-5 font-display text-2xl leading-snug text-bone">
              {post.answer}
            </p>

            {post.sections.map(([heading, text]) => (
              <section key={heading} className="mt-12">
                <h2 className="font-display text-3xl text-bone sm:text-4xl">{heading}</h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">{text}</p>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
                  Context matters: the same recommendation is not right for every body, calendar or wardrobe. A private consultation lets the atelier examine the practical requirement, show relevant cloth and explain trade-offs before any commitment.
                </p>
              </section>
            ))}

            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">What to ask your tailor</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              Ask how the pattern is created, what construction is included, when fit is checked, how the cloth suits your intended use and what happens if adjustment is needed after delivery. Specific answers are more useful than labels such as “premium” or “luxury.”
            </p>

            <h2 className="mt-12 font-display text-3xl text-bone sm:text-4xl">Speak to Aurum Bespoke</h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-mute">
              For advice tied to your own commission,{" "}
              <Link href="/booking" className="text-gold hover:text-gold-2">
                book a private consultation
              </Link>
              , review{" "}
              <Link href="/services/bespoke-suits-bangalore" className="text-gold hover:text-gold-2">
                bespoke suits in Bangalore
              </Link>
              , or read{" "}
              <Link href="/about" className="text-gold hover:text-gold-2">
                about the atelier and its process
              </Link>
              .
            </p>
          </article>

          <aside className="h-max border border-line bg-ink-2 p-7 lg:sticky lg:top-28">
            <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Related services</p>
            <h2 className="mt-4 font-display text-3xl text-bone">Explore commissions</h2>
            <div className="mt-6 space-y-4">
              {SERVICE_PAGES.map((service) => (
                <Link key={service.slug} href={`/services/${service.slug}`} className="block text-[14px] text-gold hover:text-gold-2">
                  {service.name} →
                </Link>
              ))}
            </div>
            <p className="mt-8 text-[13px] text-mute">
              Reviewed by {CONFIG.founder}
              <br />
              {CONFIG.brand}, Bengaluru
            </p>
          </aside>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-2 py-16 sm:py-20">
        <Container>
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Continue reading</p>
          <div className="mt-8 grid gap-px bg-line sm:grid-cols-2">
            {JOURNAL_PAGES.filter((item) => item.slug !== post.slug)
              .slice(0, 2)
              .map((item) => (
                <article key={item.slug} className="bg-ink p-8">
                  <h3 className="font-display text-2xl text-bone">{item.title}</h3>
                  <p className="mt-4 text-[14px] leading-relaxed text-mute">{item.description}</p>
                  <Link href={`/journal/${item.slug}`} className="mt-6 inline-block text-[12px] uppercase tracking-[0.16em] text-gold hover:text-gold-2">
                    Read guide →
                  </Link>
                </article>
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
