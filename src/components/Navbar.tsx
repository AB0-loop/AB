import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { NAV, SOCIALS, CONFIG } from "../lib/site";
import { Logo } from "./Logo";
import { Button } from "./ui";
import { Brand, Close, Menu, Phone } from "./icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 28);
        const ids = [...NAV.map((n) => n.href), "#booking"];
        const mid = window.scrollY + window.innerHeight * 0.35;
        let current = "#home";
        for (const id of ids) {
          const el = document.querySelector(id);
          if (el && el.getBoundingClientRect().top + window.scrollY <= mid) {
            current = id;
          }
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-500",
          scrolled
            ? "border-b border-line bg-ink/85 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
        )}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1240px] items-center justify-between px-6 sm:px-8 lg:px-12">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const isActive = active === item.href;
              return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
                  isActive
                    ? "text-gold"
                    : "text-body hover:text-bone"
                )}
              >
                {item.label}
              </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={CONFIG.phoneHref}
              className="flex items-center gap-2 text-[12px] tracking-wide text-body transition-colors hover:text-gold"
            >
              <Phone className="h-4 w-4 text-gold" />
              {CONFIG.phoneDisplay}
            </a>
            <Button href="#booking" className="px-6 py-3">
              Book Consultation
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center border border-gold/30 text-gold transition-colors hover:border-gold lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-ink transition-all duration-500 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-line px-6">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center border border-gold/30 text-gold transition-colors hover:border-gold"
            aria-label="Close menu"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line/60 py-4 font-display text-3xl text-bone transition-colors hover:text-gold"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="mt-4 font-display text-3xl text-gold"
          >
            Book Consultation
          </a>
        </nav>

        <div className="flex flex-col gap-5 border-t border-line px-8 py-8">
          <a href={CONFIG.phoneHref} className="flex items-center gap-2 text-body">
            <Phone className="h-4 w-4 text-gold" /> {CONFIG.phoneDisplay}
          </a>
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => {
              const Icon = Brand[s.key];
              return (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center border border-gold/25 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
