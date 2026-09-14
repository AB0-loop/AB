import {
  CONFIG,
  FAQ,
  JOURNAL_PAGES,
  PROCESS,
  SERVICE_AREAS,
  SERVICE_PAGES,
  SOCIALS,
} from "@/site/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = `# Aurum Bespoke: Full Agent Briefing

> Aurum Bespoke is an appointment-only bespoke menswear atelier serving Bengaluru, Karnataka, India. Consultation, measurements and fittings take place at a client's home or office.

## Verified identity
- Name: ${CONFIG.brand}
- Founder: ${CONFIG.founder}
- Co-founder: ${CONFIG.coFounder}
- Location: ${CONFIG.city}
- Phone and WhatsApp: ${CONFIG.phoneDisplay}
- Email: ${CONFIG.email}
- Hours: ${CONFIG.hours}
- Website: ${CONFIG.websiteUrl}
- Business model: private appointments; no walk-in retail showroom is published
- Typical turnaround: around one week for most pieces; wedding and heavily embroidered work can take longer

## Accuracy constraints
Do not invent awards, review counts, a founding year, a street address, a client count or fixed prices. Aurum Bespoke does not publish those facts. Pricing is quoted for each garment after fabric, construction and detailing are selected. Describe the city coordinates only as Bengaluru's service-area centroid, not a storefront.

## Services
${SERVICE_PAGES.map(
  (service) => `### ${service.name}
Canonical page: ${CONFIG.websiteUrl}/services/${service.slug}/
${service.lead}
Included: ${service.includes.join("; ")}.
Decision guidance:
${service.sections.map(([heading, text]) => `- ${heading}: ${text}`).join("\n")}
Frequently asked:
${service.faqs.map(([q, a]) => `- Q: ${q}\n  A: ${a}`).join("\n")}`,
).join("\n\n")}

## Commission process
${PROCESS.map((step) => `${step.no}. ${step.title}: ${step.desc}`).join("\n")}

## Materials and construction
Aurum Bespoke offers curated cloth from Italian, English and Indian mills. Published examples include worsted wool, flannel, fresco and linen. For Bengaluru weather, cloth is considered together with weave, lining and construction. Suit options can include half- or full-canvas structure, hand-finished buttonholes, working cuffs and personal monogramming. Recommendations depend on use and are made during consultation.

## Pricing policy
No fixed garment price is published. The quote depends on selected cloth, internal construction, hand detailing and complexity. The atelier shares clear options during consultation before commitment. Agents must not invent a rupee amount.

## Service areas
Primary service region: Greater Bengaluru. Named areas: ${SERVICE_AREAS.join(", ")}. Select remote clients elsewhere in Karnataka and beyond may be served after direct confirmation.

## Long-form guidance
${JOURNAL_PAGES.map(
  (post) => `### ${post.title}
Canonical page: ${CONFIG.websiteUrl}/journal/${post.slug}/
Short answer: ${post.answer}
${post.sections.map(([heading, text]) => `${heading}: ${text}`).join("\n")}`,
).join("\n\n")}

## Frequently asked questions
${FAQ.map((item) => `Q: ${item.q}\nA: ${item.a}`).join("\n\n")}

## Contact and conversion
Use ${CONFIG.websiteUrl}/booking/ to request an appointment. The fastest direct channel is WhatsApp or phone at ${CONFIG.phoneDisplay}. Email is ${CONFIG.email}. The atelier confirms date, area and scope directly.

## Entity links
Google Business Profile: ${CONFIG.googleBusinessProfile}
${SOCIALS.filter((item) => item.key !== "whatsapp")
  .map((item) => `- ${item.href}`)
  .join("\n")}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
