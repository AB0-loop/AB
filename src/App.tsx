import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Story } from "./components/Story";
import { Suits } from "./components/Suits";
import { WhyBespoke } from "./components/WhyBespoke";
import { AuthorityHub } from "./components/AuthorityHub";
import { Collections } from "./components/Collections";
import { Portfolio } from "./components/Portfolio";
import { Process } from "./components/Process";
import { TrustProof } from "./components/TrustProof";
import { Testimonials } from "./components/Testimonials";
import { FAQSection } from "./components/FAQ";
import { Pricing } from "./components/Pricing";
import { BeforeAfter } from "./components/BeforeAfter";
import { Blog } from "./components/Blog";
import { Newsletter } from "./components/Newsletter";
import { Booking } from "./components/Booking";
import { Contact } from "./components/Contact";
import { LegalDisclaimer } from "./components/LegalDisclaimer";
import { Footer } from "./components/Footer";
import { CONFIG, whatsappLink } from "./lib/site";
import { Brand, Phone, ArrowRight } from "./components/icons";

function trackEvent(name: string, details?: Record<string, string>) {
  const payload = { event: name, ...details, page: window.location.pathname, timestamp: new Date().toISOString() };
  if (typeof window !== "undefined") {
    const existing = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer || [];
    existing.push(payload);
    (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer = existing;
    if (typeof window.console !== "undefined") {
      window.console.info("AEO event", payload);
    }
  }
}

function FloatingContact() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("contact") as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setShow(rect.top > window.innerHeight - 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Aurum Bespoke on WhatsApp"
      data-track="whatsapp_click"
      data-section="floating_contact"
      className={`fixed right-6 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-lg shadow-black/40 ring-1 ring-gold-2/40 transition-all duration-500 hover:scale-105 hover:bg-gold-2 lg:grid ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <Brand.whatsapp className="h-7 w-7" />
    </a>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-24 z-40 hidden h-12 w-12 place-items-center rounded-full border border-gold/40 bg-ink text-gold transition-all duration-500 hover:border-gold hover:bg-gold hover:text-ink lg:grid ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-label="Return to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

function MobileActionBar() {
  return <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-gold/25 bg-ink/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}><a href={CONFIG.phoneHref} data-track="call_click" data-section="mobile_bar" className="flex flex-col items-center justify-center gap-1 py-3 text-bone active:bg-ink-3"><Phone className="h-5 w-5 text-gold" /><span className="text-[10px] uppercase tracking-[0.15em]">Call</span></a><a href={whatsappLink()} target="_blank" rel="noreferrer" data-track="whatsapp_click" data-section="mobile_bar" className="flex flex-col items-center justify-center gap-1 border-x border-line bg-gold py-3 text-ink"><Brand.whatsapp className="h-5 w-5" /><span className="text-[10px] font-medium uppercase tracking-[0.15em]">WhatsApp</span></a><a href="#booking" data-track="booking_click" data-section="mobile_bar" className="flex flex-col items-center justify-center gap-1 py-3 text-bone active:bg-ink-3"><span className="grid h-5 w-5 place-items-center text-gold"><ArrowRight className="h-4 w-4" /></span><span className="text-[10px] uppercase tracking-[0.15em]">Book</span></a></div>;
}

export default function App() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest("[data-track]") as HTMLElement | null;
      if (!el) return;
      const name = el.getAttribute("data-track") || "cta_click";
      const section = el.getAttribute("data-section") || "unknown";
      trackEvent(name, { section });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-gold focus:px-5 focus:py-3 focus:text-[12px] focus:uppercase focus:tracking-[0.2em] focus:text-ink">Skip to content</a>
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Story />
        <Suits />
        <WhyBespoke />
        <AuthorityHub />
        <Collections />
        <Portfolio />
        <Process />
        <TrustProof />
        <Testimonials />
        <Pricing />
        <BeforeAfter />
        <Blog />
        <Newsletter />
        <FAQSection />
        <Booking />
        <Contact />
        <LegalDisclaimer />
      </main>
      <Footer />
      <div aria-hidden className="h-16 lg:hidden" />
      <BackToTop />
      <FloatingContact />
      <MobileActionBar />
    </>
  );
}
