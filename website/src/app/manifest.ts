import type { MetadataRoute } from "next";
import { CONFIG } from "@/site/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${CONFIG.brand} — ${CONFIG.tagline}`,
    short_name: "Aurum",
    description:
      "Appointment-only bespoke menswear atelier in Bengaluru. Suits, tuxedos, sherwanis and shirts, measured at your home or office.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09090a",
    theme_color: "#09090a",
    categories: ["shopping", "lifestyle", "business"],
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
