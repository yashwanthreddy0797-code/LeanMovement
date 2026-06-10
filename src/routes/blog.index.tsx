import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";
import { POSTS } from "@/lib/posts";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — LEANMOVEMENT Coaching" },
      { name: "description", content: "Notes on training, nutrition, and recovery — for the modern Indian lifter. No clickbait, no fluff." },
      { property: "og:title", content: "Journal — LEANMOVEMENT Coaching" },
      { property: "og:description", content: "Long-form notes on training and nutrition." },
    ],
  }),
  component: BlogIndex,
});




function BlogIndex() {
  return (
    <>
      <PageHero eyebrow="The Journal" title="Notes & Essays." subtitle="Training, nutrition, and recovery — written for people who train seriously." compact />

      <section className="bg-white text-black">
        <div className="container-x py-20 pb-32">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POSTS.map((p, i) => (
              <FadeUp key={p.slug} delay={i * 0.07}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block border border-black/10 bg-white overflow-hidden h-full hover:border-accent transition-colors shadow-[0_8px_40px_-20px_rgba(0,0,0,0.15)]">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-accent">{p.category}</span>
                      <span className="text-[11px] uppercase tracking-[0.2em] text-black/55">{p.date}</span>
                    </div>
                    <h3 className="font-display text-3xl mt-4 leading-tight text-black group-hover:text-accent transition-colors">{p.title}</h3>
                    <p className="mt-3 text-sm text-black/70">{p.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                      Read More <ArrowUpRight size={14} />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
