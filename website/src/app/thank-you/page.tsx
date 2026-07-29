import type { Metadata } from "next";
import { Interstitial } from "@/site/components/Interstitial";
import { CONFIG, whatsappLink } from "@/site/lib/site";

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your consultation request has reached the Aurum Bespoke atelier. We will confirm your appointment shortly.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/thank-you" },
};

const NEXT_STEPS = [
  {
    no: "01",
    title: "We confirm",
    desc: "Our atelier replies — usually on WhatsApp — to agree a time that suits you.",
  },
  {
    no: "02",
    title: "We visit",
    desc: "A private consultation at your home or office: cloth, cut and over twenty measurements.",
  },
  {
    no: "03",
    title: "We deliver",
    desc: "A trial fitting refines the drape, then your finished garment arrives pressed and ready.",
  },
];

export default function ThankYouPage() {
  return (
    <Interstitial
      eyebrow="Request received"
      title="Thank you — your request is with us."
      intro="An Aurum Bespoke consultant will be in touch shortly to confirm your appointment. Here is what happens next."
      links={[
        { label: "Chat on WhatsApp", href: whatsappLink() },
        { label: "Back to home", href: "/" },
      ]}
    >
      <ol className="mx-auto mt-10 grid max-w-md gap-px overflow-hidden border border-line bg-line text-left">
        {NEXT_STEPS.map((s) => (
          <li key={s.no} className="flex gap-4 bg-ink p-5">
            <span className="font-display text-xl leading-none text-gold">{s.no}</span>
            <div>
              <h2 className="font-display text-lg text-bone">{s.title}</h2>
              <p className="mt-1 text-[13.5px] leading-relaxed text-mute">{s.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-8 text-[13px] text-mute">
        Prefer email? Write to{" "}
        <a href={CONFIG.emailHref} className="text-gold transition-colors hover:text-gold-2">
          {CONFIG.email}
        </a>
      </p>
    </Interstitial>
  );
}
