import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cinzel, Cormorant_Garamond, Jost } from "next/font/google";
import { CONFIG } from "@/site/lib/site";
import { JsonLd } from "@/site/lib/jsonld";
import { Analytics, GtmNoScript } from "@/site/components/Analytics";
import { HERO_IMAGE } from "@/site/lib/site";
import { GSC_VERIFICATION } from "@/site/lib/public-config";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cinzel",
  display: "swap",
});

const TITLE = `${CONFIG.brand} — Bespoke Suits & Tailored Menswear in Bengaluru`;
const DESCRIPTION =
  "Aurum Bespoke is an appointment-only bespoke menswear atelier in Bengaluru. Handcrafted suits, tuxedos, sherwanis, shirts and ethnic wear, measured and fitted at your home or office. Fit that speaks before you do.";

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.websiteUrl),
  title: {
    default: TITLE,
    template: `%s | ${CONFIG.brand}`,
  },
  description: DESCRIPTION,
  applicationName: CONFIG.brand,
  authors: [{ name: CONFIG.founder }, { name: CONFIG.coFounder }],
  creator: CONFIG.brand,
  publisher: CONFIG.brand,
  category: "Bespoke Tailoring",
  keywords: [
    "bespoke suits Bangalore",
    "bespoke tailor Bengaluru",
    "custom suit Bangalore",
    "wedding sherwani Bangalore",
    "tuxedo tailoring Bangalore",
    "made to measure menswear India",
    "home tailoring service Bangalore",
    "corporate uniforms Bangalore",
    "Aurum Bespoke",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: CONFIG.brand,
    title: `${CONFIG.brand} — ${CONFIG.tagline}`,
    description: DESCRIPTION,
    url: CONFIG.websiteUrl,
    locale: "en_IN",
    images: [
      {
        url: "/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${CONFIG.brand} — ${CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONFIG.brand} — ${CONFIG.tagline}`,
    description: DESCRIPTION,
    images: ["/brand/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/brand/icon-32.png"],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
  verification: {
    google: GSC_VERIFICATION,
  },
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
    "geo.position": "12.9716;77.5946",
    ICBM: "12.9716, 77.5946",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link
          rel="preload"
          as="image"
          href={HERO_IMAGE.src}
          imageSrcSet={`${HERO_IMAGE.srcMobile} 900w, ${HERO_IMAGE.src} 1920w`}
          imageSizes="100vw"
          fetchPriority="high"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
      </head>
      <body className="bg-ink text-body antialiased">
        <GtmNoScript />
        {children}
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
