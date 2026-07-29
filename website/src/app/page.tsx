import { Navbar } from "@/site/components/Navbar";
import { Hero } from "@/site/components/Hero";
import { Story } from "@/site/components/Story";
import { Suits } from "@/site/components/Suits";
import { WhyBespoke } from "@/site/components/WhyBespoke";
import { Collections } from "@/site/components/Collections";
import { Portfolio } from "@/site/components/Portfolio";
import { Process } from "@/site/components/Process";
import { FAQSection } from "@/site/components/FAQ";
import { Booking } from "@/site/components/Booking";
import { Contact } from "@/site/components/Contact";
import { Footer } from "@/site/components/Footer";
import { FloatingActions, MobileActionBar } from "@/site/components/Shell";

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-gold focus:px-5 focus:py-3 focus:text-[12px] focus:uppercase focus:tracking-[0.2em] focus:text-ink"
      >
        Skip to content
      </a>

      <Navbar />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Story />
        <Suits />
        <WhyBespoke />
        <Collections />
        <Portfolio />
        <Process />
        <FAQSection />
        <Booking />
        <Contact />
      </main>

      <Footer />

      {/* spacer so the mobile action bar never covers the footer */}
      <div aria-hidden className="h-16 lg:hidden" />

      <FloatingActions />
      <MobileActionBar />
    </>
  );
}
