import type { Metadata } from "next";
import { Interstitial } from "@/site/components/Interstitial";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "This page could not be found. Return to Aurum Bespoke — appointment-only bespoke menswear in Bengaluru.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <Interstitial
      eyebrow="Error 404"
      title="This thread leads nowhere."
      intro="The page you were looking for has been moved or never existed. Everything we make is still a tap away."
      links={[
        { label: "Return home", href: "/" },
        { label: "Book a consultation", href: "/#booking" },
      ]}
    />
  );
}
