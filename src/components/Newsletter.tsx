import { useState } from "react";
import { CONFIG } from "@/lib/site";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const formData = new FormData();
      formData.append("access_key", CONFIG.newsletterAccessKey);
      formData.append("email", email);
      formData.append("subject", "New Newsletter Signup - Aurum Bespoke");

      const response = await fetch(CONFIG.newsletterEndpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="newsletter" className="scroll-mt-24 border-t border-line bg-ink py-20 px-4 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.26em] text-gold">Newsletter</p>
        <h2 className="mt-4 text-3xl md:text-4xl font-display text-bone">Be the first to hear about new arrivals.</h2>
        <p className="mt-4 text-base leading-relaxed text-body/80">Subscribe for premium fabric drops, fit guidance and private appointment updates.</p>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border border-line/70 bg-ink-2 px-5 py-4 text-bone placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-2 disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && <p className="text-emerald-400 mt-4">✓ You're on the list.</p>}
        {status === "error" && <p className="text-rose-400 mt-4">⚠ There was a problem. Try again.</p>}

        <p className="mt-4 text-xs text-mute">Powered by Web3Forms. We use your email for service updates only.</p>
      </div>
    </section>
  );
}
