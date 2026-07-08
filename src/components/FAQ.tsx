import { useState } from "react";
import { FAQ } from "../lib/site";
import { Container, Reveal, SectionHeading, Button } from "./ui";
import { cn } from "../utils/cn";
import { whatsappLink } from "../lib/site";

function Plus({ open }: { open: boolean }) {
  return <span className="relative grid h-5 w-5 shrink-0 place-items-center text-gold"><span className="absolute h-px w-3.5 bg-current" /><span className={cn("absolute h-3.5 w-px bg-current transition-transform duration-300", open && "rotate-90 opacity-0")} /></span>;
}

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="scroll-mt-24 border-t border-line bg-ink-2 py-24 md:py-32">
      <Container>
        <SectionHeading align="center" eyebrow="Good to know" title="Questions, answered" intro="Everything you might want to know before we meet - and anything else, just ask on WhatsApp." />
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-line border-y border-line">
          {FAQ.map((item, i) => { const isOpen = open === i; return <div key={item.q}><button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 py-5 text-left"><span className={cn("font-display text-xl transition-colors duration-300 sm:text-2xl", isOpen ? "text-gold" : "text-bone")}>{item.q}</span><Plus open={isOpen} /></button><div className={cn("grid transition-all duration-300 ease-out", isOpen ? "grid-rows-[1fr] pb-6 opacity-100" : "grid-rows-[0fr] opacity-0")}><div className="overflow-hidden"><p className="max-w-2xl pr-10 text-[15px] leading-relaxed text-mute">{item.a}</p></div></div></div>; })}
        </div>
        <Reveal delay={100}><div className="mt-12 flex flex-col items-center gap-5 text-center"><p className="text-[15px] text-mute">Still have a question?</p><Button href={whatsappLink("Hello Aurum Bespoke, I have a question.")}>Ask on WhatsApp</Button></div></Reveal>
      </Container>
    </section>
  );
}
