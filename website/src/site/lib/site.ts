// Single source of truth for all site content & configuration.

import { SITE_URL } from "./public-config";

export { SITE_URL };

export const CONFIG = {
  brand: "Aurum Bespoke",
  founder: "Mohammed Ghouse",
  coFounder: "Mohammed Usman e Ghani",
  tagline: "Fit That Speaks Before You Do",
  shortTagline: "Fit That Speaks",
  websiteLabel: "aurumbespoke.com",
  websiteUrl: SITE_URL,
  phoneDisplay: "+91 81238 94565",
  phoneHref: "tel:+918123894565",
  whatsappNumber: "918123894565",
  email: "hello@aurumbespoke.com",
  emailHref: "mailto:hello@aurumbespoke.com",
  // Bookings post to our own endpoint, which stores them and emails the atelier.
  formEndpoint: "/api/bookings",
  city: "Bengaluru, Karnataka",
  geo: { lat: 12.9716, lng: 77.5946 },
  hours: "By appointment · Monday–Saturday, 10:00–20:00",
  /** Google Business Profile — the strongest local-ranking signal we can declare. */
  googleBusinessProfile: "https://share.google/v4mBSOxk5qlljYpMV",
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(
    message ?? "Hello Aurum Bespoke, I'd like to book a consultation."
  );
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

export const SOCIALS = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/aurum.bespoke" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61577099666419" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@aurumBespokeofficial" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/aurum-bespoke-undefined-b06369417" },
  { key: "x", label: "X", href: "https://x.com/Aurum_Bespoke" },
  { key: "whatsapp", label: "WhatsApp", href: whatsappLink() },
] as const;

export const NAV = [
  { label: "Home", href: "#home" },
  { label: "Atelier", href: "#story" },
  { label: "Suits", href: "#suits" },
  { label: "Collections", href: "#collections" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
] as const;

/* Every section on the page — powers the footer index and the sitemap. */
export const SITE_SECTIONS = [
  { label: "Home", href: "#home" },
  { label: "The Atelier", href: "#story" },
  { label: "The Suit", href: "#suits" },
  { label: "Why Bespoke", href: "#why" },
  { label: "Collections", href: "#collections" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "The Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Book Consultation", href: "#booking" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Hero background. A still image, not video: Pexels now returns 403 for every
 * video file, and the single URL that still resolved was an 82 MB 4K master.
 * This is the LCP element, so it is preloaded and served eagerly.
 */
export const HERO_IMAGE = {
  src: "https://images.pexels.com/videos/4622445/pexels-photo-4622445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1280&w=1920",
  /** Narrower crop fetched by phones — roughly a third of the desktop bytes. */
  srcMobile:
    "https://images.pexels.com/videos/4622445/pexels-photo-4622445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
};

export type Collection = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
};

export const COLLECTIONS: Collection[] = [
  {
    id: "business-suits",
    name: "Business Suits",
    tagline: "The boardroom",
    blurb:
      "Two and three-piece suits, structured and clean — engineered for presence in every room you enter.",
    image:
      "https://images.pexels.com/photos/37148298/pexels-photo-37148298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "wedding-suits",
    name: "Wedding Suits",
    tagline: "The ceremony",
    blurb:
      "Ceremonial tailoring for the groom — cut for comfort, movement and the photographs that last a lifetime.",
    image:
      "https://images.pexels.com/photos/35043829/pexels-photo-35043829.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "tuxedos",
    name: "Tuxedos",
    tagline: "After dark",
    blurb:
      "Black-tie evening wear with satin lapels and a quiet, commanding silhouette.",
    image:
      "https://images.pexels.com/photos/34946643/pexels-photo-34946643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "sherwanis",
    name: "Sherwanis",
    tagline: "Regal occasion",
    blurb:
      "Regal silhouettes with hand-finished embroidery — heritage form, modern fit.",
    image:
      "https://images.pexels.com/photos/36248984/pexels-photo-36248984.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "shirts",
    name: "Shirts",
    tagline: "Everyday elegance",
    blurb:
      "Made-to-measure shirts with a collar, cuff and drape that are yours alone.",
    image:
      "https://images.pexels.com/photos/37825460/pexels-photo-37825460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "kurta-pajama",
    name: "Kurta Pajama",
    tagline: "Festive classic",
    blurb:
      "Classic, comfortable ethnic tailoring for festive days and intimate celebrations.",
    image:
      "https://images.pexels.com/photos/25786314/pexels-photo-25786314.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
  },
  {
    id: "corporate-uniforms",
    name: "Corporate Uniforms",
    tagline: "The house style",
    blurb:
      "Unified, branded wardrobes tailored for teams, hotels and premium establishments.",
    image:
      "https://images.pexels.com/photos/10141180/pexels-photo-10141180.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
  },
];

/* Suits promoted as the flagship category */
export const SUITS = {
  intro:
    "The suit is our flagship discipline. Every Aurum suit is cut to your measurements and built around a hand-structured canvas — the difference between a garment that fits today and one that fits for years.",
  looks: [
    {
      name: "The Boardroom",
      requirement: "Business Suits",
      cut: "Two-piece · structured shoulder",
      image:
        "https://images.pexels.com/photos/37148349/pexels-photo-37148349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
    },
    {
      name: "The Evening",
      requirement: "Tuxedos",
      cut: "Tuxedo · satin peak lapel",
      image:
        "https://images.pexels.com/photos/13773240/pexels-photo-13773240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
    },
    {
      name: "The Groom",
      requirement: "Wedding Suits",
      cut: "Three-piece · ceremony cut",
      image:
        "https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900",
    },
  ],
  details: [
    { title: "Half & full-canvas build", desc: "A floating canvas moulds to your chest over time — the mark of a suit that lasts decades, not seasons." },
    { title: "Lapel architecture", desc: "Notch, peak or shawl — cut and rolled by hand for the right line." },
    { title: "Hand-finished buttonholes", desc: "Working cuffs with hand-sewn buttonholes — the quiet signature of true bespoke." },
    { title: "Your cloth", desc: "Italian, English and Indian mill fabrics — worsteds, flannels, frescos and linens." },
    { title: "Fit, your way", desc: "Slim, tailored or classic — drawn to your posture, never a size chart." },
    { title: "Personal monogramming", desc: "Your initials, hand-embroidered inside the lining." },
  ],
};

export type ProcessStep = {
  no: string;
  title: string;
  desc: string;
  icon: "consult" | "fabric" | "measure" | "trial" | "deliver";
};

export const PROCESS: ProcessStep[] = [
  {
    no: "01",
    title: "Consultation",
    desc: "A private conversation — at your home or office — to understand your occasion, style and wardrobe.",
    icon: "consult",
  },
  {
    no: "02",
    title: "Fabric Selection",
    desc: "Choose from curated cloths by renowned mills in Italy, the United Kingdom and India.",
    icon: "fabric",
  },
  {
    no: "03",
    title: "Measurements",
    desc: "More than twenty precise measurements map your posture and form for an unmistakably personal fit.",
    icon: "measure",
  },
  {
    no: "04",
    title: "Trial",
    desc: "A fitting refines drape and proportion before the garment receives its final, hand-finished detailing.",
    icon: "trial",
  },
  {
    no: "05",
    title: "Final Delivery",
    desc: "Your finished garment is delivered, pressed and ready — with alterations whenever you need them.",
    icon: "deliver",
  },
];

export type Feature = { icon: string; title: string; desc: string };

export const FEATURES: Feature[] = [
  {
    icon: "home",
    title: "Doorstep Consultation",
    desc: "Private appointments at your home or office across Bangalore — no travel, no waiting rooms.",
  },
  {
    icon: "ruler",
    title: "20+ Point Measurements",
    desc: "A precise body map of over twenty points ensures a fit that is unmistakably yours.",
  },
  {
    icon: "fabric",
    title: "Premium Fabrics",
    desc: "Curated cloths from renowned mills in Italy, the United Kingdom and India.",
  },
  {
    icon: "scissors",
    title: "Master Craftsmanship",
    desc: "Each garment hand-finished by tailors with decades of experience.",
  },
  {
    icon: "clock",
    title: "Around-One-Week Turnaround",
    desc: "A streamlined atelier workflow delivers your garment without the usual wait.",
  },
  {
    icon: "refresh",
    title: "Ongoing Alterations",
    desc: "Refinements and alterations so your wardrobe always fits perfectly.",
  },
];

export type PortfolioItem = {
  id: string;
  title: string;
  category: "Business" | "Evening" | "Ethnic";
  image: string;
  tall?: boolean;
};

export const PORTFOLIO: PortfolioItem[] = [
  { id: "p1", title: "Pinstripe Authority", category: "Business", tall: true, image: "https://images.pexels.com/photos/35462550/pexels-photo-35462550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p2", title: "The Grey Plaid", category: "Business", image: "https://images.pexels.com/photos/15352659/pexels-photo-15352659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p3", title: "Charcoal Executive", category: "Business", image: "https://images.pexels.com/photos/10141160/pexels-photo-10141160.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p4", title: "Graphite Ease", category: "Business", image: "https://images.pexels.com/photos/10141164/pexels-photo-10141164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p5", title: "Refined Plaid", category: "Business", tall: true, image: "https://images.pexels.com/photos/15352634/pexels-photo-15352634.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p6", title: "Evening Tuxedo", category: "Evening", tall: true, image: "https://images.pexels.com/photos/16388958/pexels-photo-16388958.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p7", title: "After Dark", category: "Evening", image: "https://images.pexels.com/photos/19287301/pexels-photo-19287301.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p8", title: "The Statement Lapel", category: "Evening", image: "https://images.pexels.com/photos/7554984/pexels-photo-7554984.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p9", title: "Classic Drape", category: "Evening", tall: true, image: "https://images.pexels.com/photos/15352638/pexels-photo-15352638.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p10", title: "Festive Sherwani", category: "Ethnic", tall: true, image: "https://images.pexels.com/photos/36862009/pexels-photo-36862009.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p11", title: "Midnight Bandhgala", category: "Ethnic", image: "https://images.pexels.com/photos/18166785/pexels-photo-18166785.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p12", title: "Heritage Attire", category: "Ethnic", image: "https://images.pexels.com/photos/35542189/pexels-photo-35542189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
];

export const PORTFOLIO_FILTERS = ["All", "Business", "Evening", "Ethnic"] as const;

export const PORTFOLIO_NOTES: Record<string, string> = {
  p1: "A two-piece in fine Italian wool with a structured shoulder and a clean, uninterrupted drape.",
  p2: "A relaxed Prince-of-Wales check, softened for day-long wear without ever losing its line.",
  p3: "A charcoal two-piece, pressed sharp for the demands of a working day.",
  p4: "A graphite suit with eased proportions — effortless from desk to dinner.",
  p5: "A muted plaid with texture and no noise — tailored for the long wear.",
  p6: "Satin-faced peak lapels and a suppressed waist, cut for black-tie occasions.",
  p7: "An after-hours suit in midnight tones, lean through the chest and leg.",
  p8: "A peak lapel with real presence, built around a hand-rolled canvas.",
  p9: "A timeless drape in classic cloth, balanced for movement and poise.",
  p10: "Hand-embroidered motifs across a regal silhouette, balanced for movement.",
  p11: "A deep bandhgala with mandarin collar — heritage form, contemporary fit.",
  p12: "Heritage ethnic tailoring with hand-detailing, fitted to a modern silhouette.",
};

export const SERVICE_AREAS = [
  "Koramangala",
  "Indiranagar",
  "Whitefield",
  "Jayanagar",
  "HSR Layout",
  "MG Road & UB City",
  "Electronic City",
  "Hebbal",
  "Malleshwaram",
  "Sadashivanagar",
  "Yelahanka",
  "JP Nagar",
];

/* FAQ — powers the accordion AND the FAQPage structured data (AEO/SEO). */
export const FAQ = [
  {
    q: "How do I book a consultation?",
    a: "Tap any “Book Consultation” or WhatsApp button, or send your details through the booking form. Our atelier confirms your appointment — usually over WhatsApp — and arranges a visit to your home or office.",
  },
  {
    q: "Where do you offer consultations?",
    a: "We visit you across Bangalore at your home or office. We also serve select remote clients across Karnataka and beyond — just ask and we’ll let you know what’s possible.",
  },
  {
    q: "How long does a bespoke garment take?",
    a: "Most pieces are completed in around one week. Wedding and heavily embroidered orders may take a little longer, which we’ll confirm up front so it’s timed to your dates.",
  },
  {
    q: "How many visits are needed?",
    a: "Usually two: a first appointment for consultation and measurements, and a trial to refine the fit before final hand-finishing. We come to you each time.",
  },
  {
    q: "Do you make wedding outfits for the full party?",
    a: "Yes. We coordinate tailoring for the groom, family and wedding party, and we’re open to collaborating with event planners and stylists to keep everything consistent.",
  },
  {
    q: "What if my body or fit changes later?",
    a: "Alterations are part of the service. Bring the garment back and we’ll refine the fit so it always feels made for you.",
  },
  {
    q: "How is pricing decided?",
    a: "Each garment is quoted individually based on your chosen fabric, construction and detailing. We share clear options at your consultation — no obligation.",
  },
];

export type ServicePage = {
  slug: string;
  name: string;
  short: string;
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  includes: string[];
  sections: [string, string][];
  faqs: [string, string][];
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: "bespoke-suits-bangalore",
    name: "Bespoke Suits",
    short: "Individual pattern development, hand-structured canvas options and fittings refined for posture and proportion.",
    title: "Bespoke Suits in Bangalore | Aurum Bespoke Tailoring",
    description: "Commission bespoke suits in Bangalore with private doorstep consultations, 20+ measurements, premium cloth and considered fittings by Aurum Bespoke today.",
    eyebrow: "The flagship discipline",
    lead: "A bespoke suit begins with your body rather than a stock block. We study stance, shoulder level, posture and proportion before cloth is cut, then refine the garment through a trial fitting.",
    includes: [
      "Private style consultation",
      "20+ point body and posture study",
      "Italian, English and Indian cloth options",
      "Half or full-canvas construction options",
      "Trial fitting and final refinement",
      "Working cuffs and personal monogramming",
    ],
    sections: [
      ["Cut for the individual", "The pattern is developed for the wearer and adjusted for real posture. This gives the coat a cleaner chest, more natural collar and balanced skirt while allowing comfortable movement."],
      ["Construction that settles with wear", "Canvas supports the front of a tailored jacket. We explain half- and full-canvas choices in plain terms so you can select the structure that suits your use, climate and expectations."],
      ["Cloth chosen for Bengaluru", "Weight, weave and breathability matter in a warm city. Fresco, high-twist wool, lightweight worsted, linen blends and seasonally appropriate Indian cloth are considered alongside colour."],
      ["A useful long-term wardrobe", "A commission should work with the shirts, shoes and occasions already in your life. We help decide whether a navy two-piece, charcoal business suit or separate jacket creates the most value."],
    ],
    faqs: [
      ["How much does a bespoke suit cost in Bangalore?", "Aurum Bespoke does not publish a fixed price because cloth, canvas construction and hand detailing change each commission. Clear options are quoted during the private consultation before you commit."],
      ["How long does a bespoke suit take?", "Most Aurum Bespoke garments are completed in around one week. Complex wedding work may need longer; the delivery plan is agreed before cloth is cut."],
      ["How many fittings are needed?", "Most commissions involve an initial consultation and measurements followed by a trial fitting. Additional refinement is arranged when the garment or posture requires it."],
    ],
  },
  {
    slug: "made-to-measure-bangalore",
    name: "Made-to-Measure",
    short: "Personalised shirts and tailored garments adjusted to your measurements, preferences and intended use.",
    title: "Made-to-Measure Tailoring Bangalore | Aurum Bespoke",
    description: "Explore made-to-measure tailoring in Bangalore with doorstep measurements, curated fabrics and a fit refined for your work, travel and daily wardrobe.",
    eyebrow: "Precision for daily wear",
    lead: "Made-to-measure adapts a proven base pattern using your measurements and fit preferences. It is an efficient route to consistent shirts, trousers and tailored staples without relying on retail sizing.",
    includes: [
      "At-home or office appointment",
      "Collar, cuff and silhouette choices",
      "Measured shirt and trouser proportions",
      "Curated warm-weather fabrics",
      "Trial and alteration support",
      "Repeat-order measurement record",
    ],
    sections: [
      ["Beyond a size label", "Neck, shoulder, sleeve, chest, waist and garment length are considered together. The result is designed to avoid the compromises common in standard small, medium or large sizing."],
      ["Details with a purpose", "A collar should sit correctly under a jacket; a cuff should meet the wrist at the intended point. We guide these choices around your wardrobe rather than adding decoration for its own sake."],
      ["Built for repetition", "Once fit has been refined, the same measurement logic can support future shirts and wardrobe additions. Changes in posture or body shape can be recorded at the next appointment."],
      ["Doorstep convenience", "Consultation, cloth selection and measuring can happen at your home or office across Bengaluru. This keeps the process private and reduces time away from your day."],
    ],
    faqs: [
      ["What is the difference between bespoke and made-to-measure?", "Bespoke develops an individual pattern and uses fittings to shape the garment from that pattern. Made-to-measure adjusts a proven base pattern to your measurements and selected details."],
      ["Can you keep my measurements for later orders?", "Yes. Measurements and fit preferences can guide repeat work, with a fresh check recommended because bodies, posture and preferences change."],
      ["Do you visit offices in Bangalore?", "Yes. Aurum Bespoke offers appointment-only consultations at homes and offices across Greater Bangalore."],
    ],
  },
  {
    slug: "wedding-suits-bangalore",
    name: "Wedding Suiting",
    short: "Suits, tuxedos and coordinated ceremonial wardrobes for grooms, families and wedding parties.",
    title: "Wedding Suits in Bangalore | Bespoke Groom Tailoring",
    description: "Plan bespoke wedding suits in Bangalore for grooms and families, with private fittings, coordinated styling and delivery scheduled around your ceremonies.",
    eyebrow: "Tailoring for the ceremony",
    lead: "Wedding tailoring has to look composed in person, move comfortably through a long day and photograph well from every angle. We plan the cloth, silhouette and fitting calendar around the event—not the other way round.",
    includes: [
      "Groom style and occasion consultation",
      "Suits, tuxedos and sherwani coordination",
      "Family and wedding-party planning",
      "Fabric and accessory guidance",
      "Fitting schedule aligned to event dates",
      "Final pressing and doorstep delivery",
    ],
    sections: [
      ["Begin with the setting", "Venue, time of day, dress code and ceremony format shape the right answer. A daytime garden ceremony asks something different of cloth and colour than an evening ballroom reception."],
      ["Coordinate without matching blindly", "The groom should remain distinct while belonging to the wider visual story. We can align lapels, cloth tones, waistcoats or accessories across family and wedding-party commissions."],
      ["Plan for Indian celebrations", "Multiple functions may call for different levels of formality. We help build a sequence across suits, tuxedos, sherwanis and kurta pajama rather than treating every event as a separate purchase."],
      ["Protect the timeline", "Wedding and embroidered work can take longer than a standard commission. Early consultation leaves room for selection, trial, refinement and any coordinated group work without rushed decisions."],
    ],
    faqs: [
      ["When should I order a wedding suit in Bangalore?", "Book as early as practical, especially for group orders or embroidered garments. At consultation we confirm a realistic fitting and delivery schedule against your event dates."],
      ["Can you tailor for the groom’s family?", "Yes. Aurum Bespoke coordinates commissions for grooms, family members and wedding parties, and can collaborate with planners and stylists."],
      ["Do you make tuxedos and sherwanis?", "Yes. Wedding commissions can include bespoke suits, tuxedos, sherwanis, shirts and kurta pajama, depending on the ceremonies."],
    ],
  },
  {
    slug: "corporate-wardrobe-bangalore",
    name: "Corporate Wardrobe",
    short: "Consistent personal wardrobes and tailored team uniforms for leaders, hospitality teams and premium businesses.",
    title: "Corporate Wardrobe Tailoring Bangalore | Aurum Bespoke",
    description: "Build a tailored corporate wardrobe in Bangalore, from executive suits and shirts to consistent uniforms for hospitality and premium service teams today.",
    eyebrow: "A considered house style",
    lead: "Corporate tailoring is not simply a logo on a garment. Fit, cloth durability, movement, care and repeatability have to work together for an individual executive or an entire client-facing team.",
    includes: [
      "Executive wardrobe consultation",
      "Role and workplace needs review",
      "Team measurement planning",
      "Repeatable cloth and trim standards",
      "Alteration and replacement support",
      "Doorstep office appointments",
    ],
    sections: [
      ["Wardrobes for real schedules", "Travel, long meetings, climate and frequency of wear determine useful cloth and garment combinations. The aim is fewer pieces that work harder together."],
      ["Consistency across teams", "For hospitality and service businesses, we establish a controlled visual language while measuring each wearer individually. Consistency should never require visibly poor fit."],
      ["Practical material decisions", "Abrasion, crease recovery, breathability and cleaning routines matter as much as colour. We discuss these constraints before recommending a cloth."],
      ["A maintainable programme", "New joiners, replacements and fit changes are part of corporate life. A clear specification and measurement process makes future orders easier to manage."],
    ],
    faqs: [
      ["Do you provide corporate uniforms in Bangalore?", "Yes. Aurum Bespoke creates tailored wardrobes for teams, hotels and premium establishments, with scope agreed after a requirements discussion."],
      ["Can appointments happen at our office?", "Yes. Team and executive consultations can be arranged at an office across Greater Bangalore by appointment."],
      ["Is there a minimum order?", "Order scope depends on the garment and programme. Contact the atelier with your team size, roles and timeline for a specific proposal."],
    ],
  },
];

export type LocationPage = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
};

export const LOCATION_PAGES: LocationPage[] = [
  {
    slug: "koramangala",
    name: "Koramangala",
    title: "Bespoke Tailor in Koramangala, Bangalore | Aurum Bespoke",
    description: "Book a private bespoke tailor in Koramangala for suits, wedding wear and made-to-measure shirts, with consultation and fittings at your home or office.",
    intro: "For Koramangala clients, the atelier brings cloth, consultation and precise measuring to your residence or workplace, then returns for the fitting and final delivery.",
  },
  {
    slug: "indiranagar",
    name: "Indiranagar",
    title: "Bespoke Suits in Indiranagar, Bangalore | Aurum Bespoke",
    description: "Commission bespoke suits in Indiranagar with private doorstep consultations, premium fabric selection, precise measurements and considered fitting support.",
    intro: "Aurum Bespoke serves Indiranagar through private doorstep appointments for business suits, wedding tailoring, tuxedos, shirts and coordinated wardrobes.",
  },
  {
    slug: "whitefield",
    name: "Whitefield",
    title: "Custom Suits in Whitefield, Bangalore | Aurum Bespoke",
    description: "Arrange custom suit tailoring in Whitefield at your home or office, from fabric selection and 20+ measurements through trial fitting and delivery today.",
    intro: "Whitefield clients can arrange the full commission around home and office schedules, without travelling to a retail showroom or waiting for a walk-in fitting.",
  },
];

export type JournalPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  answer: string;
  sections: [string, string][];
};

export const JOURNAL_PAGES: JournalPage[] = [
  {
    slug: "bespoke-suit-cost-bangalore",
    title: "How Much Does a Bespoke Suit Cost in Bangalore?",
    metaTitle: "How Much Does a Bespoke Suit Cost in Bangalore? | Guide",
    description: "Understand what shapes bespoke suit pricing in Bangalore, including cloth, canvas construction, fittings and hand finishing—without misleading fixed quotes.",
    answer: "There is no honest universal price for a bespoke suit. Cloth origin and weight, half- or full-canvas construction, handwork, complexity and the fitting programme all affect the commission. Aurum Bespoke presents clear options at consultation and does not publish a made-up starting figure.",
    sections: [
      ["What changes the price", "The largest variables are cloth, internal construction and labour. A lightweight worsted and a rare luxury fibre do not carry the same material cost. Full-canvas work takes more structure and time than simpler construction. Functional buttonholes, hand finishing and unusual design requests also affect the brief."],
      ["Compare the full specification", "Ask whether a quote includes cloth, a trial fitting, alteration support, canvas construction and finishing. Comparing only headline prices can place fundamentally different garments next to each other. A useful quote explains exactly what is being made."],
      ["Choose around use, not status", "The right spend depends on frequency of wear, climate, occasion and how the suit complements your wardrobe. A dependable navy business suit may create more value than a fragile statement cloth. Consultation should narrow decisions rather than push the most expensive option."],
      ["How Aurum Bespoke quotes", "After discussing use and fit, the atelier shows suitable cloth and construction choices. You receive clear options before committing. For a current quote, book a private consultation at your home or office in Bengaluru."],
    ],
  },
  {
    slug: "bespoke-vs-made-to-measure",
    title: "Bespoke vs Made-to-Measure: What’s the Difference?",
    metaTitle: "Bespoke vs Made-to-Measure: What Is the Difference?",
    description: "Learn the practical difference between bespoke and made-to-measure tailoring, from pattern development and fittings to choice, fit and ideal use in Bangalore.",
    answer: "Bespoke starts with an individual pattern developed around the wearer and refined through fittings. Made-to-measure modifies an established base pattern using personal measurements. Both can outperform ready-to-wear when specified and fitted carefully.",
    sections: [
      ["The starting pattern", "A bespoke cutter develops the garment around the individual. Made-to-measure begins with a house block in a nearby size and adjusts defined points. This difference affects how much control the maker has over posture and proportion."],
      ["Fittings and refinement", "Bespoke commonly uses a trial stage to inspect balance, collar, chest, sleeve pitch and trouser line before final finishing. Made-to-measure often uses fewer intermediate stages. The right route depends on the garment and degree of correction needed."],
      ["Choice is not the only distinction", "Buttons and linings are visible choices, but pattern and construction matter more. A long menu of custom options does not by itself make a garment bespoke. Ask how the pattern is created and how fit is tested."],
      ["Which should you choose", "Choose bespoke when individual pattern control, tailoring structure and deep refinement matter most. Made-to-measure can be practical for repeat shirts and wardrobe staples. Aurum Bespoke explains the suitable route during consultation."],
    ],
  },
  {
    slug: "best-suit-fabrics-bangalore-weather",
    title: "Best Suit Fabrics for Bangalore Weather",
    metaTitle: "Best Suit Fabrics for Bangalore Weather | Tailor Guide",
    description: "A practical guide to breathable suit fabrics for Bangalore weather, including high-twist wool, fresco, lightweight worsted, linen and useful blends for men.",
    answer: "For Bengaluru, breathable high-twist wool and open-weave fresco are versatile suit choices. Lightweight worsted is polished for business, while linen and wool-linen blends suit relaxed occasions. Construction and lining influence comfort as much as fibre.",
    sections: [
      ["High-twist wool", "High-twist yarn can create cloth that resists creasing, releases heat and travels well. It is a strong option for frequently worn business suits and clients moving between outdoor warmth and air-conditioned rooms."],
      ["Fresco and open weaves", "An open weave allows greater air movement and often has a dry handle. Fresco can look slightly more textured than a smooth worsted, making it useful when comfort and recovery matter more than a glossy surface."],
      ["Linen and blends", "Linen breathes well and its natural creasing is part of its character. Wool-linen or linen-silk blends can soften that informality. These cloths work particularly well for daytime events and relaxed separate jackets."],
      ["Look beyond fabric weight", "A very light but tightly woven cloth may feel warmer than expected. Lining, canvas and trouser cut also affect airflow. Select the whole garment system with a tailor, not a swatch number in isolation."],
    ],
  },
  {
    slug: "wedding-suit-guide-indian-grooms",
    title: "Wedding Suit Guide for Indian Grooms",
    metaTitle: "Wedding Suit Guide for Indian Grooms in Bangalore | Aurum",
    description: "Plan an Indian groom’s wedding wardrobe across ceremonies, from bespoke suits and tuxedos to sherwanis, fitting timelines, cloth and coordination today.",
    answer: "Start with the calendar, venues and dress codes for every function. Decide where a suit, tuxedo, sherwani or kurta belongs, then coordinate colour and formality without making each outfit identical. Protect enough time for fittings.",
    sections: [
      ["Map every function", "List the ceremony, reception, cocktail evening and smaller gatherings with time and venue. This reveals where black tie, a lighter daytime suit, sherwani or relaxed ethnic tailoring makes sense."],
      ["Coordinate with the wedding", "Use the event palette as context rather than copying it literally. Texture, pocket details or accessories can connect the groom to the wider setting while preserving a distinct silhouette."],
      ["Fit for movement and photography", "A wedding outfit must allow sitting, greeting, dancing and long hours. During the trial, test normal movement. Clean shoulder and trouser lines also matter in photographs from angles you cannot control."],
      ["Build a realistic timeline", "Group orders and embroidery need additional planning. Begin early enough for cloth selection, measuring, trial and final adjustments. Aurum Bespoke confirms the schedule against actual event dates before work begins."],
    ],
  },
];

export const FOOTER_SERVICES = [
  { label: "Bespoke Suits", href: "/services/bespoke-suits-bangalore" },
  { label: "Made-to-Measure", href: "/services/made-to-measure-bangalore" },
  { label: "Wedding Suiting", href: "/services/wedding-suits-bangalore" },
  { label: "Corporate Wardrobe", href: "/services/corporate-wardrobe-bangalore" },
] as const;

export const FOOTER_AREAS = [
  { label: "Koramangala", href: "/locations/koramangala" },
  { label: "Indiranagar", href: "/locations/indiranagar" },
  { label: "Whitefield", href: "/locations/whitefield" },
  { label: "All service areas", href: "/#contact" },
] as const;

export const FOOTER_GUIDES = JOURNAL_PAGES.map((j) => ({ label: j.title, href: `/journal/${j.slug}` }));
