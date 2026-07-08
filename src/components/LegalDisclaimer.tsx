import { DISCLAIMER } from "../lib/site";

export function LegalDisclaimer() {
  return (
    <section className="border-t border-line bg-ink py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:px-12">
        <h3 className="font-display text-2xl text-bone">{DISCLAIMER.title}</h3>
        <ul className="mt-6 space-y-3 text-[13px] leading-relaxed text-mute">
          {DISCLAIMER.lines.map((line) => (
            <li key={line} className="flex items-start gap-2">
              <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
