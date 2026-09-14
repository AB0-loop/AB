import type { Metadata } from "next";
import { Suspense } from "react";
import { Booking } from "@/site/components/Booking";
import { PageShell } from "@/site/components/PageShell";
import { CONFIG } from "@/site/lib/site";

export const metadata: Metadata = {
  title: "Book a Bespoke Tailor Consultation in Bangalore | Aurum",
  description:
    "Request a private Aurum Bespoke tailoring consultation at your Bangalore home or office for bespoke suits, wedding wear or a made-to-measure wardrobe.",
  alternates: { canonical: "/booking" },
};

export default function BookingPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: CONFIG.websiteUrl },
      { "@type": "ListItem", position: 2, name: "Book consultation", item: `${CONFIG.websiteUrl}/booking` },
    ],
  };

  return (
    <PageShell crumbs={[{ label: "Home", href: "/" }, { label: "Booking" }]}>
      <div className="border-b border-line bg-ink-2 pt-10">
        <div className="mx-auto w-full max-w-[1240px] px-6 pb-8 sm:px-8 lg:px-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Private consultation · Bengaluru</p>
          <h1 className="mt-4 max-w-4xl font-display text-[2.4rem] leading-[1.05] text-bone sm:text-5xl md:text-6xl">
            Book a bespoke tailoring consultation
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-mute">
            Share a few details and our atelier will confirm your appointment — typically over WhatsApp — and arrange to visit you at home or office.
          </p>
        </div>
      </div>
      <Suspense fallback={<div className="bg-ink px-6 py-20 text-center text-mute">Loading consultation form…</div>}>
        <Booking />
      </Suspense>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </PageShell>
  );
}
