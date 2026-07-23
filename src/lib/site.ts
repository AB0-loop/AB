// Single source of truth for all site content & configuration.

export const CONFIG = {
  brand: "Aurum Bespoke",
  founder: "Mohammed Ghouse",
  coFounder: "Mohammed Usman e Ghani",
  masterTailor: "Mohammed Ghouse",
  masterTailorExperience: "10+ years",
  tagline: "Fit That Speaks Before You Do",
  shortTagline: "Fit That Speaks",
  websiteLabel: "aurumbespoke.com",
  websiteUrl: "https://aurumbespoke.com",
  phoneDisplay: "+91 81238 94565",
  phoneHref: "tel:+918123894565",
  whatsappNumber: "918123894565",
  email: "hello@aurumbespoke.com",
  emailHref: "mailto:hello@aurumbespoke.com",
  formEndpoint: "https://formsubmit.co/ajax/hello@aurumbespoke.com",
  city: "Bangalore, Karnataka",
  address: "#17/1 Sardar Complex, Venkatesh Pura, Arabic College Post, Bengaluru 560045",
  addressNote: "Warehouse address. Consultations are held by appointment at the client's home or office.",
  googleBusinessProfileUrl: "https://share.google/v4mBSOxk5qlljYpMV",
  geo: { lat: 12.9716, lng: 77.5946 },
  hours: "By appointment. Monday-Saturday, 10:00-20:00",
  serviceAreas: ["Bangalore", "Koramangala", "Sarjapur Road", "Indiranagar", "Whitefield", "HSR Layout", "Jayanagar", "MG Road", "UAE", "Dubai", "Abu Dhabi"],
  internationalDelivery: true,
  childrenSuits: true,
  womensSuits: true,
};

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? "Hello Aurum Bespoke, I would like to book a consultation for a bespoke garment.");
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
  { label: "Collections", href: "#collections" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "The Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const HERO_VIDEO = {
  src: "https://videos.pexels.com/video-files/4622445/4622445-hd_1920_1080_25fps.mp4",
  srcUhd: "https://videos.pexels.com/video-files/4622445/4622445-uhd_4096_2160_25fps.mp4",
  poster: "https://images.pexels.com/videos/4622445/pexels-photo-4622445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920",
  rate: 1.8,
};

export type Collection = {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  image: string;
};

export const COLLECTIONS: Collection[] = [
  { id: "business-suits", name: "Business Suits", tagline: "The boardroom", blurb: "Sharp, composed tailoring built for leadership, meetings and daily presence. English, British, Italian, classic, modern and custom fit directions can be discussed during consultation.", image: "https://images.pexels.com/photos/37148298/pexels-photo-37148298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "wedding-suits", name: "Wedding Suits", tagline: "The ceremony", blurb: "Ceremonial tailoring for the groom, refined for comfort, movement and lasting photographs. Hand-finished details that photograph beautifully.", image: "https://images.pexels.com/photos/12730010/pexels-photo-12730010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "tuxedos", name: "Tuxedos", tagline: "After dark", blurb: "Black-tie evening wear with satin lapels and a quiet, commanding silhouette. Peak or shawl lapel options available.", image: "https://images.pexels.com/photos/34946643/pexels-photo-34946643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "sherwanis", name: "Sherwanis", tagline: "Regal occasion", blurb: "Heritage-led silhouettes with hand-finished detailing and modern drape. Custom embroidery and fabric options.", image: "https://images.pexels.com/photos/36248984/pexels-photo-36248984.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "shirts", name: "Shirts", tagline: "Everyday elegance", blurb: "Made-to-measure shirts with tailored collars, cuffs, pocket choices, buttons, sleeve length, fit direction and optional monogramming.", image: "https://images.pexels.com/photos/37825460/pexels-photo-37825460.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "kurta-pajama", name: "Kurta Pajama", tagline: "Festive classic", blurb: "Comfortable, elegant, and structured for weddings, festivities and special occasions. Modern cuts with traditional craftsmanship.", image: "https://images.pexels.com/photos/25786314/pexels-photo-25786314.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "womens-formal-suits", name: "Women's Formal Suits", tagline: "For the modern woman", blurb: "Tailored formal suiting for women, designed to feel powerful, polished and effortless. Boardroom to evening wear.", image: "https://images.pexels.com/photos/10141164/pexels-photo-10141164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
  { id: "childrens-formal-suits", name: "Children's Formal Suits", tagline: "Young elegance", blurb: "Bespoke formal wear for children, crafted with the same attention to detail and fit as adult garments.", image: "https://images.pexels.com/photos/37148349/pexels-photo-37148349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800" },
];

export const SUITS = {
  intro: "The suit is our flagship discipline. Every Aurum Bespoke suit is cut to your measurements and built around the right structure for your use, fabric and posture.",
  looks: [
    { name: "The Boardroom", cut: "Two-piece / structured shoulder", image: "https://images.pexels.com/photos/37148349/pexels-photo-37148349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
    { name: "The Evening", cut: "Tuxedo / satin peak lapel", image: "https://images.pexels.com/photos/13773240/pexels-photo-13773240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
    { name: "The Groom", cut: "Three-piece / ceremony cut", image: "https://images.pexels.com/photos/12730010/pexels-photo-12730010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  ],
  details: [
    { title: "Half & full-canvas build", desc: "Half-canvas, full-canvas or softer construction can be recommended based on climate, occasion, cloth and budget." },
    { title: "Lapel architecture", desc: "Notch, peak or shawl lapels can be balanced with lapel width, button stance and shoulder expression." },
    { title: "Hand-finished buttonholes", desc: "Working cuffs, button choices, pockets, vents, lining and internal finishing are discussed before production." },
    { title: "Your cloth", desc: "Wool, wool blends, cotton, linen, silk, velvet, tweed, cashmere blends and seasonal fabrics can be sourced on request where available." },
    { title: "Fit, your way", desc: "English fit, Italian fit, British fit, classic, modern, slim, relaxed and fully custom directions are shaped to your posture." },
    { title: "Personal monogramming", desc: "Your initials, hand-embroidered inside the lining." },
  ],
};

export const FIT_PROFILES = [
  { name: "English Fit", desc: "Structured and polished, with shape through the chest and waist for formal business and occasion wear." },
  { name: "British Fit", desc: "Structured shoulders, a sharper waist and a formal silhouette for the boardroom and black tie." },
  { name: "Italian Fit", desc: "Cleaner drape, softer structure and an easy line that feels refined without feeling stiff." },
  { name: "American Fit", desc: "Cleaner comfort through the body with a more relaxed, practical line." },
  { name: "Classic Fit", desc: "A timeless cut with comfort and movement built in for long days and important occasions." },
  { name: "Modern Fit", desc: "A balanced silhouette: cleaner than classic, less close than slim." },
  { name: "Slim Fit", desc: "A closer line for clients who prefer a sharper, more tapered profile." },
  { name: "Relaxed Fit", desc: "More ease through the body while still being drafted to your measurements." },
  { name: "Soft Structure", desc: "Relaxed but composed, ideal for daily wear and more fluid, contemporary dressing." },
  { name: "Custom Fit", desc: "A from-scratch fit direction based on body shape, posture, comfort and occasion." },
];

export const FABRIC_TAGS = ["Worsted Wool", "Flannel", "Linen", "Twill", "Silk", "Velvet", "Cashmere Blends", "Cotton", "Tropical Weave", "Super Wool Grades", "Mohair", "Tweed", "Herringbone", "Hopsack"];

export const CUSTOMIZATION_GROUPS = [
  { title: "Jacket options", items: ["Single breasted", "Double breasted", "One button", "Two button", "Three button", "Side vents", "Center vent", "Ventless"] },
  { title: "Lapels", items: ["Notch", "Peak", "Shawl", "Slim lapel", "Wide lapel", "Pick stitching"] },
  { title: "Shoulders", items: ["Soft shoulder", "Structured shoulder", "Roped shoulder", "Natural shoulder"] },
  { title: "Sleeves and cuffs", items: ["Surgeon cuffs", "Functional buttons", "Decorative buttons", "Cuff button layout"] },
  { title: "Trousers", items: ["Flat front", "Pleated", "Side adjusters", "Belt loops", "Cuffed hem", "Plain hem", "Tapered leg", "Classic leg"] },
  { title: "Waistcoats", items: ["Single breasted", "Double breasted", "Shawl collar", "Peak lapel", "Back adjuster", "Ceremony waistcoat"] },
  { title: "Shirts", items: ["Spread collar", "Cutaway collar", "Point collar", "Button-down collar", "French cuff", "Barrel cuff", "Pocket options", "Monogram"] },
  { title: "Fabric education", items: ["Wool", "Super wool grades", "Cashmere blends", "Mohair", "Linen", "Cotton", "Silk", "Velvet", "Tweed", "Twill", "Plain weave", "Herringbone", "Birdseye", "Hopsack", "Sharkskin", "Flannel", "Fresco", "Gabardine"] },
];

export const AUTHORITY_TOPICS = [
  { title: "Bespoke vs ready-made", desc: "Ready-made starts with a standard size. Bespoke starts with your measurements, posture, cloth, use case and preferred silhouette." },
  { title: "Bespoke vs made-to-measure", desc: "Made-to-measure adjusts an existing block. Bespoke allows a deeper pattern and style discussion, including structure, balance, cloth and finishing." },
  { title: "Fabric sourcing", desc: "Aurum Bespoke can source fabrics on request where available through textile partners, with options across different budgets and seasons." },
  { title: "Bangalore and UAE workflow", desc: "Bangalore clients can use home or office consultations. UAE clients are handled through online sessions, remote measurement guidance and delivery timelines confirmed before production." },
  { title: "Women and children's tailoring", desc: "Formal suits, tuxedos, separates and occasion wear are available for women and children, drafted for comfort, proportion and presence." },
  { title: "No ready collections", desc: "Aurum Bespoke is made-to-order. The focus is consultation, measurement, fabric choice and garment construction rather than ready inventory." },
  { title: "No alteration-only service", desc: "Aurum Bespoke focuses on new bespoke commissions and does not position alteration-only work as a standalone service." },
];

export type ProcessStep = { no: string; title: string; desc: string; icon: "consult" | "fabric" | "measure" | "trial" | "deliver"; };

export const PROCESS: ProcessStep[] = [
  { no: "01", title: "Consultation", desc: "A private conversation at your home or office to understand your occasion, style and wardrobe. Our atelier team visits you across Bangalore.", icon: "consult" },
  { no: "02", title: "Fabric Selection", desc: "Choose curated cloths and discuss special sourcing requests through textile partners, subject to fabric availability.", icon: "fabric" },
  { no: "03", title: "Measurements", desc: "Precise measurements map posture, proportion and comfort requirements before drafting begins.", icon: "measure" },
  { no: "04", title: "Trial Within 7 Days", desc: "Your first trial is planned within the first seven days for fit checks and proportion refinements, subject to fabric and schedule confirmation.", icon: "trial" },
  { no: "05", title: "Final Delivery In The Next 7 Days", desc: "After trial approval, the final garment is finished and delivered in the following seven days where production conditions allow.", icon: "deliver" },
];

export type Feature = { icon: string; title: string; desc: string };

export const FEATURES: Feature[] = [
  { icon: "home", title: "Doorstep Consultation", desc: "Private appointments at your home or office across Bangalore, handled by trained atelier staff where required." },
  { icon: "ruler", title: "20+ Point Measurements", desc: "A precise body map of over twenty points ensures a fit that is unmistakably yours." },
  { icon: "fabric", title: "Premium Fabrics", desc: "Curated cloths and special sourcing requests through textile partners, subject to availability." },
  { icon: "scissors", title: "Master-Led Craftsmanship", desc: "The tailoring standard is guided by Master Tailor Mohammed Ghouse. Trained atelier staff also handle consultations, measurements and client visits." },
  { icon: "clock", title: "7 + 7 Workflow", desc: "Trial is planned within the first seven days, with final delivery targeted in the next seven days after approval where feasible." },
  { icon: "refresh", title: "Made-To-Order Only", desc: "No ready collections and no alteration-only positioning. Every commission is built around the client." },
];

export type PortfolioItem = { id: string; title: string; category: "Business" | "Wedding" | "Ethnic" | "Evening" | "Women" | "Children"; image: string; tall?: boolean; };

export const PORTFOLIO: PortfolioItem[] = [
  { id: "p1", title: "Pinstripe Authority", category: "Business", tall: true, image: "https://images.pexels.com/photos/35462550/pexels-photo-35462550.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p2", title: "The Grey Plaid", category: "Business", image: "https://images.pexels.com/photos/15352659/pexels-photo-15352659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=800" },
  { id: "p3", title: "Royal Heritage", category: "Wedding", tall: true, image: "https://images.pexels.com/photos/35043829/pexels-photo-35043829.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p5", title: "Festive Sherwani", category: "Ethnic", image: "https://images.pexels.com/photos/36862009/pexels-photo-36862009.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p7", title: "Evening Tuxedo", category: "Evening", image: "https://images.pexels.com/photos/16388958/pexels-photo-16388958.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p9", title: "The Groom", category: "Wedding", image: "https://images.pexels.com/photos/33049965/pexels-photo-33049965.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p10", title: "Midnight Bandhgala", category: "Ethnic", tall: true, image: "https://images.pexels.com/photos/18166785/pexels-photo-18166785.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p12", title: "After Dark", category: "Evening", image: "https://images.pexels.com/photos/19287301/pexels-photo-19287301.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p13", title: "The Brown Three-Piece", category: "Business", tall: true, image: "https://images.pexels.com/photos/37148349/pexels-photo-37148349.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p14", title: "Onyx Tailoring", category: "Evening", tall: true, image: "https://images.pexels.com/photos/13773240/pexels-photo-13773240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1100&w=800" },
  { id: "p15", title: "Charcoal Executive", category: "Business", image: "https://images.pexels.com/photos/10141180/pexels-photo-10141180.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p16", title: "The Statement Lapel", category: "Evening", image: "https://images.pexels.com/photos/7554984/pexels-photo-7554984.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p17", title: "Women's Formal Power", category: "Women", image: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p18", title: "Pinstripe Presence", category: "Business", image: "https://images.pexels.com/photos/10141160/pexels-photo-10141160.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p19", title: "Refined Plaid", category: "Business", image: "https://images.pexels.com/photos/15352634/pexels-photo-15352634.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p20", title: "Classic Drape", category: "Evening", image: "https://images.pexels.com/photos/15352638/pexels-photo-15352638.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p21", title: "The Ceremony Suit", category: "Wedding", image: "https://images.pexels.com/photos/12730010/pexels-photo-12730010.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
  { id: "p22", title: "Heritage Attire", category: "Ethnic", image: "https://images.pexels.com/photos/35542189/pexels-photo-35542189.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=800" },
];

export const PORTFOLIO_FILTERS = ["All", "Business", "Wedding", "Ethnic", "Evening", "Women", "Children"] as const;

export const PORTFOLIO_NOTES: Record<string, string> = {
  p1: "A two-piece in fine Italian wool with a structured shoulder and a clean, uninterrupted drape for the modern professional.",
  p2: "A relaxed Prince-of-Wales check, softened for day-long wear without ever losing its line.",
  p3: "An ivory ceremony ensemble with a hand-finished placket and regalia-ready tailoring.",
  p5: "Hand-embroidered motifs across a regal silhouette, balanced for movement and poise.",
  p7: "Satin-faced peak lapels and a suppressed waist, cut for black-tie occasions.",
  p9: "Coordinated wedding-day tailoring, cut to photograph as beautifully as it wears.",
  p10: "A deep bandhgala with mandarin collar - heritage form, contemporary fit.",
  p12: "An after-hours suit in midnight tones, lean through the chest and leg.",
  p13: "A brown three-piece in warm tonal cloth - half-canvas build, softly structured.",
  p14: "An onyx evening suit, close-cut with a satin sheen for after-dark occasions.",
  p15: "A charcoal executive two-piece, pressed sharp for the demands of the day.",
  p16: "A peak lapel with real presence, built around a hand-rolled canvas.",
  p17: "Structured, polished suiting for women who want a formal silhouette that still feels powerful and calm.",
  p18: "A pinstripe cut lean, the boardroom classic reimagined for modern shoulders.",
  p19: "A refined plaid in muted tones - texture without noise.",
  p20: "A timeless drape in classic cloth, tailored for the long wear.",
  p21: "A groom's ceremony suit, cut for comfort across a full day of celebration.",
  p22: "Heritage ethnic attire with hand-detailing, fitted to a contemporary silhouette.",
};

export const SERVICE_AREAS = ["Koramangala", "Sarjapur Road", "Indiranagar", "Whitefield", "HSR Layout", "Jayanagar", "MG Road & UB City", "Electronic City", "Hebbal", "Malleshwaram", "Sadashivanagar", "Yelahanka", "JP Nagar", "Bellandur", "Marathahalli"];

export const TESTIMONIALS: { quote: string; name: string; area: string }[] = [
  { quote: "Aurum Bespoke handled the consultation cleanly and understood the fit requirement without pushing ready-made options.", name: "W3Bhub", area: "Bangalore" },
  { quote: "The process was direct, measured and professional. The team kept the garment focused on fit, fabric and finish.", name: "AFX Cash Pilot", area: "Bangalore" },
  { quote: "The online consultation and follow-up were practical, especially for remote coordination and delivery planning.", name: "Ghani", area: "UAE" },
];

export const CASE_STUDIES = [
  { title: "Wedding Commission", desc: "A groom's ceremony suit with tailored structure, comfort for a full day and finish that held under every camera angle.", accent: "Wedding" },
  { title: "Corporate Wardrobe", desc: "A formal executive wardrobe with consistency across team dressing, polished fabric choice and exact fit from day one.", accent: "Corporate" },
  { title: "Women's Formal Suits", desc: "A sharply tailored formal suit designed for professional presence, movement and a confident line.", accent: "Women" },
];

export const FAQ = [
  { q: "How do I book a consultation?", a: "Tap any Book Consultation or WhatsApp button, or send your details through the booking form. Our atelier confirms your appointment - usually over WhatsApp - and arranges a visit to your home or office." },
  { q: "Where do you offer consultations?", a: "We visit you across Bangalore at your home or office. We also serve select remote clients across Karnataka and UAE - just ask and we'll let you know what's possible." },
  { q: "How long does a bespoke garment take?", a: "The standard workflow targets a first trial within seven days and final delivery in the following seven days after trial approval, subject to garment type, fabric availability and customization." },
  { q: "What is the difference between British fit and Italian fit?", a: "British fit is more structured and formal, with sharper shoulders and a more defined waist. Italian fit is softer and more fluid, with a cleaner drape and a contemporary line." },
  { q: "Do you make formal suits for women too?", a: "Yes. We create tailored formal suiting for women - from sharp boardroom separates to polished evening pieces, designed for both presence and wearability." },
  { q: "Do you make wedding outfits for the full party?", a: "Yes. We coordinate tailoring for the groom, family and wedding party, and we're open to collaborating with event planners and stylists to keep everything consistent." },
  { q: "How is pricing decided?", a: "Each garment is quoted individually based on your chosen fabric, construction and detailing. We share clear options at your consultation - no obligation." },
  { q: "Do you make children's formal suits?", a: "Yes. We craft bespoke formal wear for children with the same attention to detail and fit as adult garments." },
  { q: "Can you source a specific fabric I want?", a: "We can check special fabric sourcing options through textile partners, subject to availability, budget and delivery timelines." },
  { q: "What fit options do you offer?", a: "We discuss English, British, Italian, American, classic, modern, slim, relaxed, soft-structure and fully custom fit directions, then draft around your measurements and posture." },
  { q: "How do UAE online orders work?", a: "UAE clients are handled through online consultation sessions, remote measurement guidance, fabric and design confirmation, then production in Bangalore. A realistic final delivery window is usually three to five weeks depending on fabric, customization and courier clearance." },
];

// Aggressive SEO keywords for all platforms
export const SEO_KEYWORDS = [
  "bespoke suits bangalore",
  "custom tailor bangalore",
  "wedding sherwani bangalore",
  "tuxedo bangalore",
  "women's formal suits bangalore",
  "children's formal suits bangalore",
  "british fit suits",
  "italian fit suits",
  "handcrafted suits",
  "master tailor",
  "doorstep tailoring",
  "home consultation tailor",
  "office tailor bangalore",
  "uae bespoke tailor",
  "dubai custom suits",
  "abu dhabi tailor",
  "corporate uniforms bangalore",
  "custom shirts bangalore",
  "kurta pajama bangalore",
  "bespoke clothing india",
];

export const GA4 = {
  measurementId: "G-EV18G05FL2",
};

export const DISCLAIMER = {
  title: "Disclaimer & Rights",
  lines: [
    "All images and content on aurumbespoke.com are for illustrative purposes only. Actual garments may vary slightly in finish, texture and drape depending on fabric availability and client-specific customization.",
    "Pricing, delivery timelines and fabric availability are subject to confirmation at the time of consultation.",
    "Aurum Bespoke reserves the right to decline or modify any commission that falls outside practical tailoring, fabric or ethical boundaries.",
    "All trademarks, logos and brand names are the property of their respective owners.",
    "(c) Aurum Bespoke. All rights reserved.",
  ],
};

// AEO/GEO optimized questions for AI platforms
export const AEO_QUESTIONS = [
  "Best bespoke tailor in Bangalore?",
  "How to get custom suits in Bangalore?",
  "What is British fit vs Italian fit?",
  "Do women need bespoke suits?",
  "Children's formal wear tailor Bangalore?",
  "UAE bespoke tailoring service?",
  "How much does a bespoke suit cost in Bangalore?",
  "Bespoke vs ready-made suits?",
  "Home visit tailor Bangalore?",
  "Wedding suit tailor Bangalore?",
];
