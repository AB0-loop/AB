import { PRICING_TIERS, CONFIG } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Investment In Excellence</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bespoke tailoring starts at <span className="font-bold text-[#c8a45c]">{CONFIG.priceStarting}</span>. Final pricing depends on fabric selection and customizations.
          </p>
          <p className="text-sm text-gray-500 mt-2">{CONFIG.priceNote}</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {PRICING_TIERS.map((tier, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:border-[#c8a45c] transition">
              <h3 className="text-xl font-serif mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-[#c8a45c] mb-2">{tier.price}</div>
              <p className="text-sm text-gray-600 mb-6">{tier.desc}</p>
              <button className="w-full bg-[#c8a45c] text-[#09090a] py-2 rounded hover:bg-opacity-90 transition text-sm font-semibold">
                Consult
              </button>
            </div>
          ))}
        </div>

        <div className="bg-[#f5f5f5] p-8 rounded-lg">
          <h3 className="text-2xl font-serif mb-4">What's Included</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Home or office consultation
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Premium fabric selection
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Precision measurements (20+ points)
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Fit trial within 7 days
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Customization (buttons, cuffs, everything)
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#c8a45c] mt-1">✓</span> Final delivery in 7 days
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
