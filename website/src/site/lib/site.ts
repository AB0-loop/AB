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
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/aurum.bespoke?igsh=czc2cnZ1NnMwdHdi" },
  { key: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61577099666419" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@aurumBespokeofficial" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/aurum-bespoke-undefined-b06369417" },
  { key: "x", label: "X", href: "https://x.com/Aurum_Bespoke?t=303eKb_ss5Dn4K0jiIGJHQ&s=35" },
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
