import { CONFIG, HERO_IMAGE } from "../lib/site";
import { Container, Eyebrow } from "./ui";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/*
        Static hero image, not video. Pexels blocks video hotlinking (403), and
        the only file that still resolved was an 82 MB 4K master — unusable on
        mobile data. This is the LCP element: eager, high priority, preloaded
        in the document head.
      */}
      <picture>
        <source media="(max-width: 640px)" srcSet={HERO_IMAGE.srcMobile} />
        <img
          src={HERO_IMAGE.src}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-ink/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />

      <Container className="relative z-10 pt-28 pb-28 sm:pb-24">
        <div className="max-w-3xl">
          <Eyebrow>Bespoke Menswear · Bengaluru</Eyebrow>

          <h1 className="mt-7 font-display text-[2.9rem] leading-[0.98] text-bone text-shadow-soft sm:text-7xl lg:text-[5.4rem]">
            <span className="block">The fit that speaks</span>
            <span className="block text-gold">before you do.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            Bespoke suits, tuxedos, sherwanis and shirts — handcrafted in our atelier and
            measured to the millimetre, with private consultations at your home or office
            across Bengaluru.
          </p>

          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <a
              href="#booking"
              className="inline-flex items-center justify-center bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink hover:bg-gold-2"
            >
              Book a Consultation
            </a>
            <a
              href="#collections"
              className="inline-flex items-center justify-center border border-gold/30 px-9 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone hover:border-gold hover:bg-gold hover:text-ink"
            >
              Explore Collections
            </a>
          </div>

          <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-mute">
            <span>By appointment only</span>
            <span className="h-3 w-px bg-line" />
            <span>Doorstep service</span>
            <span className="h-3 w-px bg-line" />
            <span>Around-one-week turnaround</span>
          </div>
        </div>
      </Container>

      <span className="sr-only">{CONFIG.tagline}</span>
    </section>
  );
}
