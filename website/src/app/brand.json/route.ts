import {
  CONFIG,
  SERVICE_AREAS,
  SERVICE_PAGES,
} from "@/site/lib/site";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    name: CONFIG.brand,
    canonicalUrl: CONFIG.websiteUrl,
    tagline: CONFIG.tagline,
    businessType: "Appointment-only bespoke menswear atelier",
    founders: [CONFIG.founder, CONFIG.coFounder],
    foundedYear: null,
    location: {
      city: "Bengaluru",
      region: "Karnataka",
      country: "India",
    },
    contact: {
      telephone: CONFIG.phoneDisplay,
      email: CONFIG.email,
      whatsapp: `https://wa.me/${CONFIG.whatsappNumber}`,
    },
    hours: CONFIG.hours,
    specialties: SERVICE_PAGES.map((item) => item.name),
    pricing: {
      currency: "INR",
      policy: "Quoted individually after fabric, construction and detailing are selected",
      fixedRangesPublished: false,
    },
    serviceAreas: SERVICE_AREAS,
    differentiators: [
      "Private home or office appointments",
      "20+ point measurement study",
      "Trial fitting",
      "Italian, English and Indian cloth options",
      "Ongoing alteration support",
    ],
    typicalTurnaround: "Around one week for most pieces; complex wedding work may take longer",
    accuracyNotice:
      "No published street address, awards, ratings, client count, founding year or fixed prices.",
  });
}
