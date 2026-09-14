import { CONFIG, SOCIALS } from "@/site/lib/site";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    "@context": "https://schema.org",
    "@type": ["Organization", "ClothingStore", "ProfessionalService"],
    "@id": `${CONFIG.websiteUrl}/#organisation`,
    name: CONFIG.brand,
    url: CONFIG.websiteUrl,
    founder: [
      { "@type": "Person", name: CONFIG.founder },
      { "@type": "Person", name: CONFIG.coFounder },
    ],
    telephone: CONFIG.phoneDisplay,
    email: CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: { "@type": "City", name: "Bengaluru" },
    sameAs: [
      CONFIG.googleBusinessProfile,
      ...SOCIALS.filter((item) => item.key !== "whatsapp").map((item) => item.href),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: CONFIG.phoneDisplay,
      email: CONFIG.email,
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
  });
}
