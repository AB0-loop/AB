import { CONFIG, SOCIALS, NAV, COLLECTIONS } from "../lib/site";
import { Logo } from "./Logo";
import { Container } from "./ui";
import { Brand, Phone, Mail, MapPin } from "./icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-mute">Appointment-only bespoke menswear - handcrafted by master tailors and delivered with the discretion of a private consultation, across Bangalore and select remote clients.</p>
            <div className="mt-6 flex items-center gap-3">{SOCIALS.map((s) => { const Icon = Brand[s.key]; return <a key={s.key} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center border border-gold/25 text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-ink"><Icon className="h-[17px] w-[17px]" /></a>; })}</div>
          </div>
          <div><h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold">Explore</h3><ul className="mt-5 space-y-3">{NAV.map((n) => <li key={n.href}><a href={n.href} className="text-[14px] text-body transition-colors hover:text-gold">{n.label}</a></li>)}<li><a href="#booking" className="text-[14px] text-body transition-colors hover:text-gold">Book Consultation</a></li></ul></div>
          <div><h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold">Collections</h3><ul className="mt-5 space-y-3">{COLLECTIONS.map((c) => <li key={c.id}><a href="#collections" className="text-[14px] text-body transition-colors hover:text-gold">{c.name}</a></li>)}</ul></div>
          <div><h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold">Contact</h3><ul className="mt-5 space-y-4 text-[14px]"><li><a href={CONFIG.phoneHref} className="flex items-center gap-3 text-body transition-colors hover:text-gold"><Phone className="h-4 w-4 shrink-0 text-gold" /> {CONFIG.phoneDisplay}</a></li><li><a href={CONFIG.emailHref} className="flex items-center gap-3 text-body transition-colors hover:text-gold"><Mail className="h-4 w-4 shrink-0 text-gold" /> {CONFIG.email}</a></li><li className="flex items-center gap-3 text-body"><MapPin className="h-4 w-4 shrink-0 text-gold" /> {CONFIG.address}</li><li><a href={CONFIG.googleBusinessProfileUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block border border-gold/30 px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-gold transition-colors hover:border-gold hover:bg-gold hover:text-ink">Google Business Profile</a></li></ul></div>
        </div>
        <div className="mt-14 gold-rule" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-center text-[12px] text-mute sm:flex-row sm:text-left"><p>(c) {year} Aurum Bespoke. All rights reserved.</p><p className="tracking-wide">{CONFIG.tagline} / Crafted in Bangalore</p></div>
      </Container>
    </footer>
  );
}
