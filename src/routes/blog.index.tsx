import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { FadeUp } from "@/components/site/FadeUp";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Journal — APEX Coaching" },
      { name: "description", content: "Notes on training, nutrition, and recovery — for the modern Indian lifter. No clickbait, no fluff." },
      { property: "og:title", content: "Journal — APEX Coaching" },
      { property: "og:description", content: "Long-form notes on training and nutrition." },
    ],
  }),
  component: BlogIndex,
});

export const POSTS = [
  { slug: "fat-loss-myths", category: "Fat Loss", title: "Five fat-loss myths costing you months.", excerpt: "The advice you got on Instagram is keeping you stuck. Here's what actually moves the needle.", date: "May 28, 2026",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80" },
  { slug: "indian-diet-muscle-gain", category: "Nutrition", title: "Building muscle on an Indian diet.", excerpt: "Dal, paneer, and atta can absolutely build muscle. The numbers most coaches won't show you.", date: "May 12, 2026",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80" },
  { slug: "sleep-and-recovery", category: "Recovery", title: "Sleep is the program you're skipping.", excerpt: "Why six hours destroys six months of training, and the simple rules to fix it.", date: "Apr 29, 2026",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&q=80" },
  { slug: "home-workout-guide", category: "Training", title: "The minimalist home-workout guide.", excerpt: "Two dumbbells and a pull-up bar can deliver 80% of gym results. Programmed correctly.", date: "Apr 15, 2026",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1200&q=80" },
  { slug: "vegetarian-protein", category: "Nutrition", title: "Hitting 150g protein as a vegetarian.", excerpt: "It's not hard. It's not boring. Here's the playbook for Indian vegetarians.", date: "Mar 30, 2026",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80" },
  { slug: "cardio-vs-weights", category: "Training", title: "Cardio vs weights: stop choosing.", excerpt: "The 'either/or' debate is a trap. The right ratio depends on your actual goal — not your preference.", date: "Mar 12, 2026",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1200&q=80" },
];

function BlogIndex() {
  return (
    <>
      <PageHero eyebrow="The Journal" title="Notes & Essays." subtitle="Training, nutrition, and recovery — written for people who train seriously." compact />

      <section className="container-x py-12 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block border border-border bg-card overflow-hidden h-full hover:border-accent transition-colors">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt="" loading="lazy" className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-accent">{p.category}</span>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="font-display text-3xl mt-4 leading-tight group-hover:text-accent transition-colors">{p.title}</h3>
                  <p className="mt-3 text-sm text-foreground/70">{p.excerpt}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                    Read More <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>
    </>
  );
}
