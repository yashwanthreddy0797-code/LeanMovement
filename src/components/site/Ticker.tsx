const items = [
  "Fat Loss",
  "Muscle Building",
  "Nutrition Coaching",
  "Online Programs",
  "1:1 Coaching",
  "Body Recomposition",
];

export function Ticker() {
  return (
    <div className="bg-white text-red-500 overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap py-4 will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <span key={i} className="font-display text-2xl md:text-3xl tracking-wider mx-8 flex items-center gap-8">
                {item}
                <span className="text-red-500/60">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
