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
    <section className="py-16 px-4 bg-[#09090a] text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8">
          Get insights on bespoke tailoring, new fabric arrivals, and exclusive styling tips.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-4 py-3 rounded bg-white text-[#09090a] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c8a45c]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-8 py-3 bg-[#c8a45c] text-[#09090a] rounded font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {status === "success" && <p className="text-green-400 mt-4">✓ Thank you for subscribing!</p>}
        {status === "error" && <p className="text-red-400 mt-4">⚠ Something went wrong. Try again.</p>}

        <p className="text-xs text-gray-400 mt-4">We respect your privacy. No spam, ever.</p>
      </div>
    </section>
  );
}
