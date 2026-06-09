const items = [
  "Fat Loss",
  "Muscle Building",
  "Nutrition Coaching",
  "Online Programs",
  "1:1 Coaching",
  "Body Recomposition",
];

export function Ticker() {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="bg-white text-red-500 overflow-hidden border-y-2 border-red-500">
      <div className="flex animate-marquee whitespace-nowrap py-4">
        {repeated.map((item, i) => (
          <span key={i} className="font-display text-2xl md:text-3xl tracking-wider mx-8 flex items-center gap-8">
            {item}
            <span className="text-background/60">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
