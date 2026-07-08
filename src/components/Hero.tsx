import { useEffect, useRef } from "react";
import { CONFIG, HERO_VIDEO } from "../lib/site";
import { Container, Eyebrow } from "./ui";

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const setRate = () => {
      try { v.playbackRate = HERO_VIDEO.rate; } catch {}
    };
    v.addEventListener("loadedmetadata", setRate);
    setRate();
    return () => v.removeEventListener("loadedmetadata", setRate);
  }, []);

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster={HERO_VIDEO.poster} aria-hidden>
        <source src={HERO_VIDEO.src} type="video/mp4" />
        <source src={HERO_VIDEO.srcUhd} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-ink/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-transparent to-transparent" />

      <Container className="relative z-10 pt-28 pb-28 sm:pb-24">
        <div className="max-w-3xl">
          <div className="reveal is-visible"><Eyebrow>{CONFIG.brand}</Eyebrow></div>
          <h1 className="mt-7 font-display text-[2.5rem] leading-[0.98] text-bone text-shadow-soft sm:text-7xl lg:text-[5.4rem]">
            <span className="block">Aurum Bespoke</span>
            <span className="block text-gold">{CONFIG.tagline}</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-body sm:text-lg">
            Bespoke suits, tuxedos, sherwanis, shirts, kurta pajama, women's formal suits, and children's formal wear - measured for your body, occasion and preferred fit, with private consultations across Bangalore and online sessions for UAE clients.
          </p>
          <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
            <a href="#booking" className="inline-flex items-center justify-center gap-2.5 bg-gold px-9 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-2">Book a Consultation</a>
            <a href="#collections" className="inline-flex items-center justify-center gap-2.5 border border-gold/30 px-9 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink">Explore Collections</a>
          </div>
          <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] uppercase tracking-[0.2em] text-mute">
            <span>10+ years experience</span><span className="h-3 w-px bg-line" /><span>Doorstep consultation</span><span className="h-3 w-px bg-line" /><span>Fabric sourcing on request</span>
          </div>
        </div>
      </Container>
      <span className="sr-only">{CONFIG.tagline}</span>
    </section>
  );
}
