import { BEFORE_AFTER } from "@/lib/site";
import { useState } from "react";

export function BeforeAfter() {
  const [activeSlider, setActiveSlider] = useState<{ [key: string]: number }>({
    "1": 50,
  });

  if (!BEFORE_AFTER || BEFORE_AFTER.length === 0) return null;

  return (
    <section id="before-after" className="scroll-mt-24 border-t border-line bg-ink-2 py-24 px-4 text-bone">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.26em] text-gold">Before & After</p>
          <h2 className="mt-4 text-4xl font-display text-bone sm:text-5xl">A single transformation placeholder.</h2>
          <p className="mt-4 text-base leading-relaxed text-body/80">A before/after showcase is reserved here. Replace these placeholder visuals when your gallery images are ready.</p>
        </div>

        {BEFORE_AFTER.map((item) => (
          <div key={item.id} className="mx-auto max-w-4xl">
            <h3 className="text-xl font-display mb-6 text-bone">{item.title}</h3>
            <div className="relative overflow-hidden rounded-[2rem] border border-line/70 bg-ink h-[520px] sm:h-[560px]">
              <img src={item.after} alt="After" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-ink/30" />
              <div className="absolute top-0 left-0 h-full overflow-hidden transition-all" style={{ width: `${activeSlider[item.id] || 50}%` }}>
                <img src={item.before} alt="Before" className="h-full w-full object-cover" />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={activeSlider[item.id] || 50}
                onChange={(e) => setActiveSlider({ ...activeSlider, [item.id]: parseInt(e.target.value) })}
                className="absolute inset-0 w-full h-full cursor-col-resize opacity-0"
              />
              <div className="absolute top-0 h-full w-1 bg-gold/80" style={{ left: `${activeSlider[item.id] || 50}%` }} />
              <div className="absolute left-6 bottom-6 rounded-full bg-ink/85 px-4 py-3 text-sm tracking-[0.18em] text-gold">DRAG</div>
            </div>
            <p className="mt-4 text-sm text-body/80">Single before & after placeholder. Image will be replaced later.</p>
          </div>
        ))}
      </div>
    </section>
  );
}
