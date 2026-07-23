import { BLOG_POSTS } from "@/lib/site";

export function Blog() {
  return (
    <section id="blog" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">The Aurum Journal</h2>
          <p className="text-lg text-gray-600">Insights on tailoring, fabric, and the art of bespoke</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article key={post.id} className="group border border-gray-200 rounded-lg overflow-hidden hover:border-[#c8a45c] transition">
              <div className="h-48 bg-gradient-to-br from-[#09090a] to-[#c8a45c] flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <p className="text-sm font-semibold text-gray-300">{post.category}</p>
                  <h3 className="text-xl font-serif mt-2">{post.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()}</span>
                  <a href={`#blog/${post.slug}`} className="text-[#c8a45c] font-semibold hover:underline text-sm">
                    Read →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-16">
          <a href="#blog" className="inline-block px-8 py-3 bg-[#c8a45c] text-[#09090a] rounded font-semibold hover:bg-opacity-90 transition">
            View All Articles
          </a>
        </div>
      </div>
    </section>
  );
}
