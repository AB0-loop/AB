import type { Metadata } from "next";
import Link from "next/link";
import { CONFIG } from "@/site/lib/site";

export const metadata: Metadata = {
  title: "Privacy & Cookies",
  description:
    "How Aurum Bespoke collects, uses and protects the information you share when you request a consultation or browse this website.",
  alternates: { canonical: "/privacy" },
};

const SECTIONS: { h: string; p: string[] }[] = [
  {
    h: "Who we are",
    p: [
      `${CONFIG.brand} is a bespoke menswear atelier operating in ${CONFIG.city}, founded by ${CONFIG.founder} and ${CONFIG.coFounder}. We are the data controller for the information described on this page.`,
    ],
  },
  {
    h: "What we collect",
    p: [
      "When you submit the consultation form we collect the name, phone number, city or area, preferred date and garment requirement you provide, and your email address if you choose to give one.",
      "When you browse the site, our analytics providers collect standard technical information such as pages viewed, approximate location derived from your IP address, device and browser type, and how you interact with the page.",
    ],
  },
  {
    h: "Why we collect it",
    p: [
      "Consultation details are used solely to contact you, arrange your appointment and fulfil your order. Analytics data is used to understand which parts of the site are useful and to improve them.",
      "We do not sell your information, and we do not use it for advertising to third parties.",
    ],
  },
  {
    h: "Analytics and session recording",
    p: [
      "This site uses Google Analytics 4 and Google Tag Manager (Google LLC) to measure traffic, and Microsoft Clarity (Microsoft Corporation) to understand usability. Clarity may record anonymised interactions such as clicks, scrolling and mouse movement in order to produce heatmaps and session replays. Text you type into form fields is masked by Clarity by default.",
      "These services set cookies or similar identifiers in your browser. You can block them using your browser settings, an ad-blocking extension, or your device's tracking-prevention features. Blocking them does not affect your ability to use the site or contact us.",
    ],
  },
  {
    h: "WhatsApp and messaging",
    p: [
      "If you continue an enquiry over WhatsApp, that conversation is carried out on Meta's platform and is subject to WhatsApp's own privacy terms in addition to this notice.",
    ],
  },
  {
    h: "How long we keep it",
    p: [
      "Consultation enquiries are retained for as long as needed to serve you and to keep ordinary business records. Analytics data is retained according to each provider's default retention period.",
    ],
  },
  {
    h: "Your choices",
    p: [
      `You may ask us to confirm what information we hold about you, to correct it, or to delete it. Write to ${CONFIG.email} or call ${CONFIG.phoneDisplay} and we will action your request.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-[100svh] bg-ink px-6 py-20 sm:py-28">
      <article className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="text-[11px] uppercase tracking-[0.25em] text-gold transition-colors hover:text-gold-2"
        >
          ← {CONFIG.brand}
        </Link>

        <h1 className="mt-8 font-display text-[2.2rem] leading-[1.05] text-bone sm:text-5xl">
          Privacy &amp; Cookies
        </h1>
        <div className="gold-rule mt-7 w-24" />
        <p className="mt-7 text-[15px] leading-relaxed text-mute">
          This notice explains what we collect when you use this website, why we collect it,
          and how you can control it.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.h}>
              <h2 className="font-display text-2xl text-bone">{s.h}</h2>
              {s.p.map((para) => (
                <p key={para.slice(0, 40)} className="mt-3 text-[15px] leading-relaxed text-mute">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="text-[13px] text-mute">
            Questions about this notice? Write to{" "}
            <a href={CONFIG.emailHref} className="text-gold transition-colors hover:text-gold-2">
              {CONFIG.email}
            </a>
            .
          </p>
          <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-mute">
            <Link href="/" className="transition-colors hover:text-gold">
              Home
            </Link>
            <Link href="/#booking" className="transition-colors hover:text-gold">
              Book a consultation
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-gold">
              Contact
            </Link>
          </nav>
        </div>
      </article>
    </main>
  );
}
