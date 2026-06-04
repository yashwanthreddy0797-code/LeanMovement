export interface Post {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

export const POSTS: Post[] = [
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
