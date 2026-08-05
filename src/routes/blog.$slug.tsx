import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/site/FadeUp";
import { CTABanner } from "@/components/site/CTABanner";
import { POSTS } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} - LEANMOVEMENT Journal` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:image", content: loaderData.post.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-x py-40 text-center">
      <h1 className="font-display text-6xl">Post not found</h1>
      <Link to="/blog" className="mt-8 inline-block text-accent uppercase tracking-[0.2em] text-sm">← Back to journal</Link>
    </div>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData();
  const related = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="relative pt-40 pb-16">
        <div className="container-x">
          <FadeUp>
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent">
              <ArrowLeft size={14} /> Back to Journal
            </Link>
            <span className="block mt-8 text-[11px] uppercase tracking-[0.25em] text-accent">{post.category} · {post.date}</span>
            <h1 className="font-display text-5xl md:text-5xl lg:text-6xl mt-4 max-w-4xl leading-[0.95]">{post.title}</h1>
          </FadeUp>
        </div>
      </section>

      <section className="container-x pb-16">
        <FadeUp>
          <div className="aspect-[21/9] overflow-hidden">
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </div>
        </FadeUp>
      </section>

      <article className="container-x pb-24">
        <FadeUp className="max-w-3xl mx-auto space-y-6 text-lg text-foreground/85 leading-relaxed">
          <p className="text-xl text-foreground/90">{post.excerpt}</p>
          <p>Most fitness content is written for the algorithm, not for the reader. Loud claims, thin substance, no follow-through. This essay is the opposite - long, specific, and built to actually be useful.</p>
          <h2 className="font-display text-4xl text-foreground pt-6">The actual problem.</h2>
          <p>The default playbook for the modern Indian professional is a contradiction: extreme cutting, supplements stacked on supplements, and a training program that ignores how you actually live. It generates burnout, not bodies.</p>
          <p>The fix isn't another protocol. It's a framework that respects your schedule, your kitchen, and your nervous system. Build the framework once, run it for a decade.</p>
          <h2 className="font-display text-4xl text-foreground pt-6">What to do this week.</h2>
          <p>Pick one variable. Hit it daily for seven days. Measure. Adjust. The clients who win aren't the ones who chase intensity - they're the ones who compound boring decisions across long stretches of time.</p>
          <p>That's the whole game.</p>
          <blockquote className="border-l-2 border-accent pl-6 my-8 font-display text-3xl text-foreground">
            The plan you can run for a decade beats the one you abandon in eight weeks.
          </blockquote>
          <p>If this is the kind of thinking you want in your training, book a call. Otherwise, take the framework above and run it. Either way - get to work.</p>
        </FadeUp>
      </article>

      <section className="container-x py-20 border-t border-border">
        <FadeUp className="mb-10">
          <h2 className="font-display text-4xl md:text-5xl">Related Notes.</h2>
        </FadeUp>
        <div className="grid md:grid-cols-3 gap-6">
          {related.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.08}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block border border-border bg-card overflow-hidden hover:border-accent transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
                <div className="p-6">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-accent">{p.category}</span>
                  <h3 className="font-display text-2xl mt-3 group-hover:text-accent transition-colors">{p.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                    Read <ArrowUpRight size={12} />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
