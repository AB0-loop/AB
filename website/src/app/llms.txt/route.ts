import {
  CONFIG,
  JOURNAL_PAGES,
  SERVICE_AREAS,
  SERVICE_PAGES,
} from "@/site/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${CONFIG.brand}

> ${CONFIG.tagline}. Appointment-only bespoke menswear in Bengaluru, with consultations and fittings at a client's home or office.

## Services
${SERVICE_PAGES.map((item) => `- [${item.name}](${CONFIG.websiteUrl}/services/${item.slug}/): ${item.short}`).join("\n")}

## Process
- Consultation, fabric selection, 20+ measurements, trial fitting, final delivery and ongoing alteration support.
- Most garments are completed in around one week; complex wedding or embroidered work may take longer.

## Pricing
- Prices are quoted individually after cloth, construction and detailing are selected. No fixed public price range is claimed.
- [How pricing works](${CONFIG.websiteUrl}/journal/bespoke-suit-cost-bangalore/): factual explanation of cost variables.

## Service areas
- Bengaluru, Karnataka, including ${SERVICE_AREAS.join(", ")}.
- There is no walk-in retail showroom; the service is private and appointment-only.

## Contact
- [Book a consultation](${CONFIG.websiteUrl}/booking/): request a home or office appointment.
- [Contact Aurum Bespoke](${CONFIG.websiteUrl}/contact/): WhatsApp/phone ${CONFIG.phoneDisplay}; email ${CONFIG.email}.

## Guides
${JOURNAL_PAGES.map((item) => `- [${item.title}](${CONFIG.websiteUrl}/journal/${item.slug}/): ${item.description}`).join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
