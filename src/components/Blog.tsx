import { BLOG_POSTS } from "@/lib/site";
import { Container } from "./ui";

export function Blog() {
  return (
    <section id="blog" className="scroll-mt-24 border-t border-line bg-ink py-24 md:py-32">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.26em] text-gold">Insights</p>
          <h2 className="mt-4 font-display text-4xl leading-tight text-bone sm:text-5xl">The Aurum Journal</h2>
          <p className="mt-5 text-base leading-relaxed text-body sm:text-lg">Short notes on fit, fabric and the bespoke process to help you decide with confidence.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <article key={post.id} className="rounded-[2rem] border border-line/70 bg-ink-2 p-6 transition hover:border-gold/50">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.26em] text-gold">{post.category}</p>
                <h3 className="font-display text-2xl text-bone">{post.title}</h3>
                <p className="text-sm leading-relaxed text-body/80">{post.excerpt}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-[13px] text-mute">
                <span>{new Date(post.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
                <a href="#contact" className="font-medium uppercase tracking-[0.2em] text-gold hover:text-gold-2">Enquire</a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3 text-[13px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-gold-2">
            Talk to us about your commission
          </a>
        </div>
      </Container>
    </section>
  );
}
