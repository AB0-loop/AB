import { BEFORE_AFTER } from "@/lib/site";
import { useState } from "react";

export function BeforeAfter() {
  const [activeSlider, setActiveSlider] = useState<{ [key: string]: number }>({
    "1": 50,
  });

  if (!BEFORE_AFTER || BEFORE_AFTER.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-[#f9f9f9]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif mb-4">Transformation Gallery</h2>
          <p className="text-gray-600">See the power of precision tailoring</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {BEFORE_AFTER.map((item) => (
            <div key={item.id} className="group">
              <h3 className="text-xl font-serif mb-4">{item.title}</h3>
              <div className="relative w-full overflow-hidden rounded-lg bg-gray-200 h-96">
                <img src={item.after} alt="After" className="w-full h-full object-cover" />
                <div
                  className="absolute top-0 left-0 h-full overflow-hidden transition-all"
                  style={{ width: `${activeSlider[item.id] || 50}%` }}
                >
                  <img src={item.before} alt="Before" className="w-screen h-full object-cover" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={activeSlider[item.id] || 50}
                  onChange={(e) => setActiveSlider({ ...activeSlider, [item.id]: parseInt(e.target.value) })}
                  className="absolute inset-0 w-full h-full cursor-col-resize opacity-0"
                />
                <div className="absolute left-1/2 top-0 h-full w-1 bg-[#c8a45c] pointer-events-none" style={{ left: `${activeSlider[item.id] || 50}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">Drag to compare before and after</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
