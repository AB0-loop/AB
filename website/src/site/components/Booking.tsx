"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONFIG, whatsappLink, COLLECTIONS } from "../lib/site";
import { onRequirement } from "../lib/requirement";
import { track } from "./Analytics";
import { WEB3FORMS_KEY } from "../lib/public-config";
import { Container, Eyebrow, Reveal } from "./ui";
import { Brand, Check, Phone, Mail, MapPin } from "./icons";

const REQUIREMENTS = [
  ...COLLECTIONS.map((c) => c.name),
  "Multiple pieces / wardrobe",
  "Not sure yet — please advise",
];

const REASSURANCE = [
  "Same-day appointments, subject to availability",
  "We visit your home or office across Bangalore",
  "No obligation — simply a conversation about what you’d like made",
];

const fieldCls =
  "w-full border border-line bg-ink px-4 py-3.5 text-[15px] text-bone placeholder:text-mute/60 outline-none transition-colors focus:border-gold";
const labelCls = "mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-mute";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  date: string;
  requirement: string;
};

const EMPTY: FormState = { name: "", phone: "", email: "", city: "", date: "", requirement: "" };

type EmailStatus = "idle" | "sending" | "success" | "error";

export function Booking() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [channel, setChannel] = useState<"whatsapp" | "email" | null>(null);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const requirementRef = useRef<HTMLSelectElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  // Any collection / look / project card can pre-fill the requirement.
  useEffect(
    () =>
      onRequirement((value) => {
        if (!REQUIREMENTS.includes(value)) return;
        setChannel(null);
        setForm((f) => ({ ...f, requirement: value }));
        setErrors((e) => ({ ...e, requirement: undefined }));
        window.setTimeout(() => {
          const el = requirementRef.current;
          if (!el) return;
          el.classList.add("ring-1", "ring-gold");
          window.setTimeout(() => el.classList.remove("ring-1", "ring-gold"), 1600);
        }, 700);
      }),
    [],
  );

  function update(key: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.phone.trim()) e.phone = "Please enter a phone number";
    else if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Please enter a valid email";
    if (!form.city.trim()) e.city = "Please enter your city / area";
    if (!form.requirement) e.requirement = "Please select a requirement";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildMessage() {
    return [
      "New consultation request — Aurum Bespoke",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      `City / Area: ${form.city}`,
      form.date ? `Preferred date: ${form.date}` : "Preferred date: to be confirmed",
      `Requirement: ${form.requirement}`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  // Persist every enquiry to the atelier's own records.
  async function record(source: "whatsapp" | "website") {
    try {
      await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          preferredDate: form.date,
          requirement: form.requirement,
          company: honeypotRef.current?.value ?? "",
          source,
        }),
      });
    } catch {
      /* the WhatsApp hand-off is the primary path — never block it */
    }
  }

  // Primary path — everything routes to WhatsApp.
  function onWhatsApp(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    window.open(whatsappLink(buildMessage()), "_blank", "noopener,noreferrer");
    track("generate_lead", { method: "whatsapp", requirement: form.requirement });
    void record("whatsapp");
    setChannel("whatsapp");
  }

  // Email path — Web3Forms delivers straight to the atelier's inbox.
  // Their access key is a public form ID, called from the browser by design.
  async function onEmail(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    if (honeypotRef.current?.value) return;

    const key = WEB3FORMS_KEY;
    if (!key) {
      setEmailStatus("error");
      return;
    }

    setEmailStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: key,
          subject: `New consultation request — ${form.name}`,
          from_name: "Aurum Bespoke Website",
          botcheck: "",
          name: form.name,
          phone: form.phone,
          email: form.email || "(not provided)",
          city: form.city,
          preferred_date: form.date || "to be confirmed",
          requirement: form.requirement,
        }),
      });
      const data: { success?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error("Delivery failed");

      track("generate_lead", { method: "form", requirement: form.requirement });
      void record("website");
      router.push("/thank-you");
    } catch {
      setEmailStatus("error");
    }
  }

  function reset() {
    setForm(EMPTY);
    setErrors({});
    setChannel(null);
    setEmailStatus("idle");
  }

  const firstName = form.name.split(" ")[0];

  return (
    <section id="booking" className="scroll-mt-24 border-t border-line bg-ink py-16 sm:py-20 md:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left — persuasion */}
          <div>
            <Reveal>
              <Eyebrow>Book Consultation</Eyebrow>
            </Reveal>
            <Reveal>
              <h2 className="mt-5 font-display text-[2rem] leading-[1.08] text-bone sm:text-4xl md:text-5xl">
                Book your private consultation.
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mute">
                Share a few details and our atelier will confirm your appointment — typically
                over WhatsApp — and arrange to visit you at home or office.
              </p>
            </Reveal>

            <Reveal>
              <ul className="mt-9 space-y-4">
                {REASSURANCE.map((r) => (
                  <li key={r} className="flex items-start gap-3 text-[14px] text-body">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center bg-gold/15 text-gold">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <div className="mt-10 space-y-3 border-t border-line pt-8">
                <a href={CONFIG.phoneHref} className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold">
                  <Phone className="h-4 w-4 text-gold" /> {CONFIG.phoneDisplay}
                </a>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold">
                  <Brand.whatsapp className="h-4 w-4 text-gold" /> Chat on WhatsApp
                </a>
                <a href={CONFIG.emailHref} className="flex items-center gap-3 text-[14px] text-body transition-colors hover:text-gold">
                  <Mail className="h-4 w-4 text-gold" /> {CONFIG.email}
                </a>
                <p className="flex items-center gap-3 text-[14px] text-body">
                  <MapPin className="h-4 w-4 text-gold" /> {CONFIG.city}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal>
            <div className="border border-line bg-ink-2 p-5 sm:p-8 md:p-10">
              {channel ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center border border-gold/30 text-gold">
                    {channel === "whatsapp" ? <Brand.whatsapp className="h-8 w-8" /> : <Check className="h-8 w-8" />}
                  </span>
                  <h3 className="mt-6 font-display text-3xl text-bone">
                    {channel === "whatsapp" ? "Opening WhatsApp…" : "Request received"}
                  </h3>
                  <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-mute">
                    {channel === "whatsapp"
                      ? `Thank you, ${firstName || "and welcome"}. Your details are ready to send to our atelier on WhatsApp. We’ll confirm your appointment shortly.`
                      : `Thank you, ${firstName || "and welcome"}. Your request has reached our atelier. We’ll be in touch shortly on ${form.phone}.`}
                  </p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-8 border border-gold/30 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold"
                  >
                    Book another
                  </button>
                </div>
              ) : (
                <form onSubmit={onWhatsApp} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bk-name" className={labelCls}>Full name *</label>
                      <input
                        id="bk-name"
                        required
                        aria-required="true"
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "bk-name-err" : undefined}
                        className={fieldCls}
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                      {errors.name && <p id="bk-name-err" role="alert" className="mt-1.5 text-[12px] text-gold/80">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-phone" className={labelCls}>Phone / WhatsApp *</label>
                      <input
                        id="bk-phone"
                        type="tel"
                        required
                        aria-required="true"
                        aria-invalid={errors.phone ? true : undefined}
                        aria-describedby={errors.phone ? "bk-phone-err" : undefined}
                        className={fieldCls}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+91 ..."
                        inputMode="tel"
                        autoComplete="tel"
                      />
                      {errors.phone && <p id="bk-phone-err" role="alert" className="mt-1.5 text-[12px] text-gold/80">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-email" className={labelCls}>Email</label>
                      <input
                        id="bk-email"
                        type="email"
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "bk-email-err" : undefined}
                        className={fieldCls}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="you@email.com"
                        inputMode="email"
                        autoComplete="email"
                      />
                      {errors.email && <p id="bk-email-err" role="alert" className="mt-1.5 text-[12px] text-gold/80">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-city" className={labelCls}>City / Area *</label>
                      <input
                        id="bk-city"
                        required
                        aria-required="true"
                        aria-invalid={errors.city ? true : undefined}
                        aria-describedby={errors.city ? "bk-city-err" : undefined}
                        className={fieldCls}
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="e.g. Koramangala, Bangalore"
                        autoComplete="address-level2"
                      />
                      {errors.city && <p id="bk-city-err" role="alert" className="mt-1.5 text-[12px] text-gold/80">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="bk-date" className={labelCls}>Preferred date</label>
                      <input
                        id="bk-date"
                        type="date"
                        min={today}
                        className={`${fieldCls} [color-scheme:dark]`}
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="bk-req" className={labelCls}>Requirement *</label>
                      <select
                        id="bk-req"
                        ref={requirementRef}
                        required
                        aria-required="true"
                        aria-invalid={errors.requirement ? true : undefined}
                        aria-describedby={errors.requirement ? "bk-req-err" : undefined}
                        className={`${fieldCls} transition-shadow`}
                        value={form.requirement}
                        onChange={(e) => update("requirement", e.target.value)}
                      >
                        <option value="">Select a garment…</option>
                        {REQUIREMENTS.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      {errors.requirement && <p id="bk-req-err" role="alert" className="mt-1.5 text-[12px] text-gold/80">{errors.requirement}</p>}
                    </div>
                  </div>

                  {/* Honeypot — hidden from people, irresistible to bots */}
                  <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="bk-company">Company</label>
                    <input
                      id="bk-company"
                      ref={honeypotRef}
                      aria-hidden="true"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      defaultValue=""
                    />
                  </div>

                  {/* Primary: WhatsApp */}
                  <button
                    type="submit"
                    className="mt-7 flex w-full items-center justify-center gap-2.5 bg-gold px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink hover:bg-gold-2"
                  >
                    <Brand.whatsapp className="h-4 w-4" />
                    Send via WhatsApp
                  </button>

                  {/* Secondary: email webform */}
                  <button
                    type="button"
                    onClick={onEmail}
                    disabled={emailStatus === "sending"}
                    className="mt-3 flex w-full items-center justify-center gap-2.5 border border-gold/30 px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
                  >
                    <Mail className="h-4 w-4" />
                    {emailStatus === "sending" ? "Sending…" : "Or send by email"}
                  </button>
                  {emailStatus === "error" && (
                    <p className="mt-2 text-center text-[12px] text-gold/80">
                      Couldn’t send by email — please use WhatsApp above.
                    </p>
                  )}
                  <p className="mt-4 text-center text-[12px] leading-relaxed text-mute">
                    WhatsApp is fastest. Your details are not stored on this site.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
