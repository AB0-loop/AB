import { useState, type FormEvent } from "react";
import { CONFIG, whatsappLink, COLLECTIONS } from "../lib/site";
import { Container, Eyebrow, Reveal } from "./ui";
import { Brand, Check, Phone, Mail, MapPin } from "./icons";

const REQUIREMENTS = [
  ...COLLECTIONS.map((c) => c.name),
  "Multiple pieces / wardrobe",
  "Not sure yet - please advise",
];

const REASSURANCE = [
  "Same-day appointments available, subject to availability",
  "We visit your home or office across Bangalore, Karnataka, and UAE",
  "No obligation - simply a conversation about what you'd like made",
  "Every commission is overseen by Master Tailor Mohammed Ghouse, with trained atelier staff visiting clients as required.",
];

const fieldCls = "w-full border border-line bg-ink px-4 py-3.5 text-[15px] text-bone placeholder:text-mute/60 outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-mute";

type FormState = { name: string; phone: string; email: string; city: string; date: string; requirement: string; };
const EMPTY: FormState = { name: "", phone: "", email: "", city: "", date: "", requirement: "" };
type EmailStatus = "idle" | "sending" | "success" | "error";

export function Booking() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [channel, setChannel] = useState<"whatsapp" | "email" | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");

  function update(key: keyof FormState, value: string) { setForm((f) => ({ ...f, [key]: value })); setErrors((e) => ({ ...e, [key]: undefined })); }
  function validate() { const e: Partial<Record<keyof FormState, string>> = {}; if (!form.name.trim()) e.name = "Please enter your name"; if (!form.phone.trim()) e.phone = "Please enter a phone number"; else if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid number"; if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email"; if (!form.city.trim()) e.city = "Please enter your city / area"; if (!form.requirement) e.requirement = "Please select a requirement"; setErrors(e); return Object.keys(e).length === 0; }
  function buildMessage() { return ["New consultation request - Aurum Bespoke", "", `Name: ${form.name}`, `Phone: ${form.phone}`, form.email ? `Email: ${form.email}` : "", `City / Area: ${form.city}`, form.date ? `Preferred date: ${form.date}` : "Preferred date: to be confirmed", `Requirement: ${form.requirement}`].filter(Boolean).join("\n"); }
  function onWhatsApp(ev: FormEvent) { ev.preventDefault(); if (!validate()) return; window.open(whatsappLink(buildMessage()), "_blank", "noopener,noreferrer"); setChannel("whatsapp"); }
  async function onEmail(ev: FormEvent) { ev.preventDefault(); if (!validate()) return; setEmailStatus("sending"); try { const res = await fetch(CONFIG.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email || "(not provided)", city: form.city, preferredDate: form.date || "to be confirmed", requirement: form.requirement, _subject: "New consultation request - Aurum Bespoke", _template: "box", _captcha: "false" }) }); if (!res.ok) throw new Error("Request failed"); setChannel("email"); } catch { setEmailStatus("error"); } }
  function reset() { setForm(EMPTY); setErrors({}); setChannel(null); setEmailStatus("idle"); }
  const firstName = form.name.split(" ")[0];

  return (
    <section id="booking" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Reveal><Eyebrow>Book Consultation</Eyebrow></Reveal>
            <Reveal delay={80}><h2 className="mt-5 font-display text-4xl leading-[1.08] text-bone sm:text-5xl">Book your private consultation.</h2></Reveal>
             <Reveal delay={150}><p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">Share a few details and our atelier will confirm your appointment - typically over WhatsApp - and arrange to visit you at home or office. Every commission is overseen by Master Tailor Mohammed Ghouse, with trained atelier staff visiting clients as required.</p></Reveal>
            <Reveal delay={210}><ul className="mt-9 space-y-4">{REASSURANCE.map((r) => <li key={r} className="flex items-start gap-3 text-[14px] text-body"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-gold/15 text-gold"><Check className="h-3.5 w-3.5" /></span>{r}</li>)}</ul></Reveal>
            <Reveal delay={270}><div className="mt-10 space-y-3 border-t border-line pt-8"><a href={CONFIG.phoneHref} className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold"><Phone className="h-4 w-4 text-gold" /> {CONFIG.phoneDisplay}</a><a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold"><Brand.whatsapp className="h-4 w-4 text-gold" /> Chat on WhatsApp</a><a href={CONFIG.emailHref} className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold"><Mail className="h-4 w-4 text-gold" /> {CONFIG.email}</a><p className="flex items-center gap-3 text-[14px] text-body"><MapPin className="h-4 w-4 text-gold" /> {CONFIG.city}</p></div></Reveal>
          </div>
          <Reveal delay={120}><div className="bg-ink-2 p-6 sm:p-10">{channel ? <div className="flex min-h-[420px] flex-col items-center justify-center text-center"><span className="grid h-16 w-16 place-items-center border border-gold/30 text-gold">{channel === "whatsapp" ? <Brand.whatsapp className="h-8 w-8" /> : <Check className="h-8 w-8" />}</span><h3 className="mt-6 font-display text-3xl text-bone">{channel === "whatsapp" ? "Opening WhatsApp..." : "Request received"}</h3><p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mute">{channel === "whatsapp" ? `Thank you, ${firstName || "and welcome"}. Your details are ready to send to our atelier on WhatsApp. We'll confirm your appointment shortly.` : `Thank you, ${firstName || "and welcome"}. Your enquiry is on its way to ${CONFIG.email}. We'll reply soon.`}</p><button type="button" onClick={reset} className="mt-8 border border-gold/30 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold">Book another</button></div> : <form onSubmit={onWhatsApp} noValidate><div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="bk-name" className={labelCls}>Full name *</label><input id="bk-name" className={fieldCls} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" autoComplete="name" />{errors.name && <p className="mt-1.5 text-[12px] text-gold/80">{errors.name}</p>}</div><div><label htmlFor="bk-phone" className={labelCls}>Phone / WhatsApp *</label><input id="bk-phone" className={fieldCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." inputMode="tel" autoComplete="tel" />{errors.phone && <p className="mt-1.5 text-[12px] text-gold/80">{errors.phone}</p>}</div><div><label htmlFor="bk-email" className={labelCls}>Email</label><input id="bk-email" className={fieldCls} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" inputMode="email" autoComplete="email" />{errors.email && <p className="mt-1.5 text-[12px] text-gold/80">{errors.email}</p>}</div><div><label htmlFor="bk-city" className={labelCls}>City / Area *</label><input id="bk-city" className={fieldCls} value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="e.g. Koramangala, Bangalore" autoComplete="address-level2" />{errors.city && <p className="mt-1.5 text-[12px] text-gold/80">{errors.city}</p>}</div><div><label htmlFor="bk-date" className={labelCls}>Preferred date</label><input id="bk-date" type="date" className={`${fieldCls} [color-scheme:dark]`} value={form.date} onChange={(e) => update("date", e.target.value)} /></div><div><label htmlFor="bk-req" className={labelCls}>Requirement *</label><select id="bk-req" className={fieldCls} value={form.requirement} onChange={(e) => update("requirement", e.target.value)}><option value="">Select a garment...</option>{REQUIREMENTS.map((r) => <option key={r} value={r}>{r}</option>)}</select>{errors.requirement && <p className="mt-1.5 text-[12px] text-gold/80">{errors.requirement}</p>}</div></div><button type="submit" className="mt-7 flex w-full items-center justify-center gap-2.5 bg-gold px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-2"><Brand.whatsapp className="h-4 w-4" />Send via WhatsApp</button><button type="button" onClick={onEmail} disabled={emailStatus === "sending"} className="mt-3 flex w-full items-center justify-center gap-2.5 border border-gold/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold disabled:opacity-60"><Mail className="h-4 w-4" />{emailStatus === "sending" ? "Sending..." : "Or send by email"}</button>{emailStatus === "error" && <p className="mt-2 text-center text-[12px] text-gold/80">Couldn't send by email - please use WhatsApp above.</p>}<p className="mt-4 text-center text-[12px] leading-relaxed text-mute">WhatsApp is fastest. Your details are not stored on this site.</p></form>}</div></Reveal>
        </div>
      </Container>
    </section>
  );
}