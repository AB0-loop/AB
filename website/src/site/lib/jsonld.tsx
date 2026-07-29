import { CONFIG, COLLECTIONS, FAQ, SOCIALS, SERVICE_AREAS } from "./site";

const ORG_ID = `${CONFIG.websiteUrl}/#organisation`;
const SITE_ID = `${CONFIG.websiteUrl}/#website`;

function graph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ClothingStore", "LocalBusiness", "Organization"],
        "@id": ORG_ID,
        name: CONFIG.brand,
        alternateName: "Aurum Bespoke Tailoring",
        slogan: CONFIG.tagline,
        description:
          "Appointment-only bespoke menswear atelier in Bengaluru offering handcrafted suits, tuxedos, sherwanis, shirts and ethnic wear, with private home and office consultations.",
        url: CONFIG.websiteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${CONFIG.websiteUrl}/brand/icon-512.png`,
          width: 512,
          height: 512,
        },
        image: `${CONFIG.websiteUrl}/brand/og-image.jpg`,
        telephone: CONFIG.phoneHref.replace("tel:", ""),
        email: CONFIG.email,
        priceRange: "$$$",
        currenciesAccepted: "INR",
        founder: [{ "@id": `${CONFIG.websiteUrl}/#founder` }, { "@id": `${CONFIG.websiteUrl}/#cofounder` }],
        employee: [{ "@id": `${CONFIG.websiteUrl}/#founder` }, { "@id": `${CONFIG.websiteUrl}/#cofounder` }],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: CONFIG.geo.lat,
          longitude: CONFIG.geo.lng,
        },
        areaServed: [
          { "@type": "City", name: "Bengaluru" },
          { "@type": "State", name: "Karnataka" },
          ...SERVICE_AREAS.map((a) => ({ "@type": "Place", name: a })),
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "10:00",
            closes: "20:00",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Bespoke Collections",
          itemListElement: COLLECTIONS.map((c) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: c.name,
              description: c.blurb,
            },
          })),
        },
        sameAs: [
          CONFIG.googleBusinessProfile,
          ...SOCIALS.filter((s) => s.key !== "whatsapp").map((s) => s.href),
        ],
        hasMap: CONFIG.googleBusinessProfile,
        paymentAccepted: "Cash, UPI, Bank Transfer, Card",
        knowsLanguage: ["en-IN", "hi", "ur", "kn"],
      },
      {
        "@type": "Person",
        "@id": `${CONFIG.websiteUrl}/#founder`,
        name: CONFIG.founder,
        jobTitle: "Founder",
        worksFor: { "@id": ORG_ID },
        knowsAbout: ["Bespoke tailoring", "Menswear", "Suit construction"],
      },
      {
        "@type": "Person",
        "@id": `${CONFIG.websiteUrl}/#cofounder`,
        name: CONFIG.coFounder,
        jobTitle: "Co-Founder",
        worksFor: { "@id": ORG_ID },
        knowsAbout: ["Bespoke tailoring", "Menswear"],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: CONFIG.websiteUrl,
        name: CONFIG.brand,
        inLanguage: "en-IN",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${CONFIG.websiteUrl}/#webpage`,
        url: CONFIG.websiteUrl,
        name: `${CONFIG.brand} — ${CONFIG.tagline}`,
        isPartOf: { "@id": SITE_ID },
        about: { "@id": ORG_ID },
        primaryImageOfPage: `${CONFIG.websiteUrl}/brand/og-image.jpg`,
      },
      {
        "@type": "FAQPage",
        "@id": `${CONFIG.websiteUrl}/#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "Service",
        "@id": `${CONFIG.websiteUrl}/#service`,
        serviceType: "Bespoke tailoring with home & office consultation",
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "City", name: "Bengaluru" },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${CONFIG.websiteUrl}/#booking`,
          servicePhone: CONFIG.phoneDisplay,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CONFIG.websiteUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: CONFIG.websiteUrl,
          },
        ],
      },
    ],
  };
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Structured data for SEO / AEO / GEO discovery.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph()) }}
    />
  );
}
