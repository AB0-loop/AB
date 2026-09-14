import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingActions, MobileActionBar } from "./Shell";
import { Container, Eyebrow } from "./ui";

export function PageShell({
  children,
  crumbs,
}: {
  children: ReactNode;
  crumbs?: { label: string; href?: string }[];
}) {
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
        {crumbs && crumbs.length > 0 && (
          <div className="border-b border-line bg-ink pt-24">
            <Container className="py-4">
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-mute">
                {crumbs.map((crumb, index) => (
                  <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                    {index > 0 && <span aria-hidden className="text-gold/50">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="transition-colors hover:text-gold">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-gold">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            </Container>
          </div>
        )}
        {children}
      </main>
      <Footer />
      <div aria-hidden className="h-16 lg:hidden" />
      <FloatingActions />
      <MobileActionBar />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-ink-2 pb-14 pt-10 sm:pb-16 sm:pt-12">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-4xl font-display text-[2.4rem] leading-[1.05] text-bone sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-mute sm:text-base">{intro}</p>
        {actions && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
      </Container>
    </section>
  );
}
