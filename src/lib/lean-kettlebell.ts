export const BRAND = {
  name: "LEANMOVEMENT",
  display: "Lean Movement",
  tagline: "Get Lean. Get Strong. Stay Athletic.",
} as const;

export const CONTACT = {
  email: "hello@leanmovement.in",
  phone: "+91 99999 99999",
  whatsapp: "https://wa.me/919999999999",
  instagram: "https://instagram.com/leanmovement",
  location: "Hyderabad, India",
} as const;

export const COACH = {
  name: "Mohith Thotakura",
  title: "Strength & Kettlebell Coach",
  location: "Hyderabad",
  bio: [
    "Mohith built Lean Kettlebell™ for busy professionals who want real coaching — not another PDF program. He leads live sessions three times a week with technique-first progressions built for 45-minute training blocks.",
    "When you join, you train with Mohith live — on camera, with corrections, cues, and a plan that fits your schedule.",
  ],
  credentials: [
    "Strength & kettlebell specialist",
    "Live small-group coaching · Hyderabad",
  ],
  image: {
    unsplashId: "photo-1570440828762-ab7a993dbde8",
    alt: "Male kettlebell trainer in the gym — LEANMOVEMENT coach",
  },
} as const;

export function coachImageUrl(width: number) {
  const q = width >= 1920 ? 90 : width >= 1280 ? 88 : 85;
  return `https://images.unsplash.com/${COACH.image.unsplashId}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 1.25)}&q=${q}&fm=webp&crop=entropy`;
}

export const COACH_IMAGE_DEFAULT = coachImageUrl(1200);

export const LEAN_KETTLEBELL = {
  name: "Lean Program",
  tagline: BRAND.tagline,
  positioning:
    "One live coaching program — strength and endurance, three sessions a week with your coach. Built for busy professionals.",
  liveNote: "Train live with your coach — pick three sessions that fit your week.",
} as const;

/** Homepage hero — free Unsplash, kettlebell swing in gym. */
export const HERO_IMAGE = {
  unsplashId: "photo-1765302892910-748da4a57c10",
  alt: "Athlete swinging a kettlebell during live strength training",
} as const;

const HERO_WIDTHS = [640, 960, 1280, 1920, 2560, 3840] as const;

export function heroImageUrl(width: number) {
  const q = width >= 2560 ? 92 : width >= 1280 ? 88 : 85;
  return `https://images.unsplash.com/${HERO_IMAGE.unsplashId}?auto=format&fit=crop&w=${width}&q=${q}&fm=webp`;
}

export function heroImageSrcSet() {
  return HERO_WIDTHS.map((w) => `${heroImageUrl(w)} ${w}w`).join(", ");
}

export const HERO_IMAGE_DEFAULT = heroImageUrl(1920);

export const MEMBERSHIP_OVERVIEW = {
  title: "One program. Strength + endurance.",
  subtitle: "Live coaching with your coach — not a PDF plan.",
  description:
    "A single Lean Program at ₹6,999/month. You train live three times a week across strength and endurance sessions (45–60 minutes). Choose morning or evening slots that fit your life. All sessions recorded.",
  idealFor: [
    "Busy professionals who can commit to 3 sessions per week",
    "Beginners who want coached strength and endurance progressions",
    "Anyone who wants accountability with a real coach on camera",
  ],
  notFor: [
    "Self-led PDF programs with no live coaching",
    "People who cannot commit to three sessions weekly",
  ],
} as const;

export const SESSION_SCHEDULE = {
  title: "Weekly Schedule",
  subtitle: "2 time windows · Pick any 3 sessions · 60 minutes each",
  timezone: "IST (India Standard Time)",
  batches: [
    { day: "Mon / Wed / Fri", time: "7:00 – 8:00 AM", name: "Morning", type: "Strength & endurance" },
    { day: "Tue / Thu / Sat", time: "7:00 – 8:00 PM", name: "Evening", type: "Strength & endurance" },
  ],
  note: "Choose 3 sessions at signup. Miss a class? Recordings land in your portal.",
} as const;

export const REQUIREMENTS = {
  title: "Requirements to Join",
  subtitle: "No prior fitness experience needed — we teach you everything.",
  items: [
    { label: "Equipment", detail: "At least one kettlebell to start. Two or three weights as you progress is ideal." },
    { label: "Space", detail: "Enough room to swing safely — home, terrace, or small gym corner works." },
    { label: "Time", detail: "45 minutes, three days per week. Plus one 60-min Foundations session before your first class." },
    { label: "Mindset", detail: "Willingness to show up live, learn technique, and stay consistent for at least 4 weeks." },
    { label: "Tech", detail: "Phone or laptop with stable internet for live sessions via Google Meet." },
  ],
} as const;

export const FOUNDATIONS = {
  title: "Initial Foundations Session",
  duration: "1 × 60 mins",
  description:
    "Before joining regular classes, every member gets a dedicated foundations session covering technique and training literacy.",
  items: [
    "Kettlebell setup",
    "Swing mechanics",
    "Deadlift",
    "Clean",
    "Press",
    "Goblet squat",
    "Breathing mechanics",
    "Heart rate education",
    "RPE education",
  ],
  note: "Recorded for future reference.",
} as const;

export const LIVE_SESSIONS = {
  title: "Live Sessions",
  schedule: "3 sessions per week · 60 minutes · Morning or evening",
  description:
    "Two coaching windows every week. Pick any three sessions when you join — strength, endurance, and hybrid work with your coach.",
  days: [
    {
      day: "Mon / Wed / Fri",
      name: "Morning",
      focus: "7:00 – 8:00 AM IST · Strength & endurance",
    },
    {
      day: "Tue / Thu / Sat",
      name: "Evening",
      focus: "7:00 – 8:00 PM IST · Strength & endurance",
    },
  ] as const,
} as const;

export const NUTRITION = {
  title: "Nutrition Framework",
  description: "Not meal plans. A simple framework for how lean people eat.",
  items: [
    "Calorie targets",
    "Protein targets",
    "Flexible dieting guide",
    "Restaurant framework",
    "Travel eating guide",
    "Supplement recommendations",
    "Simple food choices",
  ],
} as const;

export const COMMUNITY = {
  title: "Community",
  items: ["Private WhatsApp group", "Questions answered", "Progress sharing", "Accountability"],
} as const;

export const MEMBERSHIP_PILLARS = [
  {
    id: "foundations",
    eyebrow: "Step 1 · Onboarding",
    title: "Foundations Session",
    duration: "1 × 60 minutes",
    summary: "Before your first live class, every member completes a dedicated technique session with your coach.",
    description:
      "This is not a workout — it's training literacy. You learn how to set up, move safely, and understand effort levels so you can follow live classes with confidence from day one.",
    includes: FOUNDATIONS.items,
    outcome: "Recorded and saved in your portal for reference.",
  },
  {
    id: "live",
    eyebrow: "Core · 12 sessions/month",
    title: "Live Coached Sessions",
    duration: "3× per week · 45 min",
    summary: "Train live with your coach and a small group. Real-time cues, corrections, and energy.",
    description:
      "Each week follows a deliberate split — strength, conditioning, and hybrid work — so you build muscle, engine, and athleticism without burning out. All sessions are recorded.",
    includes: LIVE_SESSIONS.days.map((d) => `${d.day} · ${d.name} — ${d.focus}`),
    outcome: "Join from your portal dashboard when the session goes live.",
  },
  {
    id: "recordings",
    eyebrow: "Never miss a beat",
    title: "Session Recordings",
    duration: "Unlimited replay",
    summary: "Every live class recorded — watch on your schedule.",
    description:
      "Traveling? Working late? Life happens. Recordings land in your portal library so you never fall behind. Same coaching, same session — on your time.",
    includes: [
      "Full session replays after each live class",
      "Organised by session type (Strength, Conditioning, Hybrid)",
      "Available for the duration of your membership",
    ],
    outcome: "Catch up anytime from Portal → Recordings.",
  },
  {
    id: "nutrition",
    eyebrow: "Not meal plans",
    title: "Nutrition Framework",
    duration: "Self-paced guides",
    summary: "How lean people eat — without chicken at 2 pm or rigid spreadsheets.",
    description:
      "You get calorie and protein targets, flexible dieting principles, and practical guides for restaurants, travel, and daily life. Built for Indian professionals who eat out and travel often.",
    includes: NUTRITION.items,
    outcome: "Access from Portal → Nutrition.",
  },
  {
    id: "circuits",
    eyebrow: "On-demand",
    title: "Kettlebell Circuits Library",
    duration: "5 guided circuits",
    summary: "Short, structured workouts for days between live sessions or when you travel.",
    description:
      "Follow-along kettlebell circuits — engine builders, strength complexes, travel flows, and mobility work. Complement your live training, not replace it.",
    includes: [
      "The Engine Builder — 20 min conditioning",
      "Strength Complex A — heavy controlled work",
      "Travel KB Flow — hotel-friendly",
      "Hybrid Finisher — power & grit",
      "Mobility & Activation — pre-session prep",
    ],
    outcome: "Access from Portal → Circuits.",
  },
  {
    id: "community",
    eyebrow: "Accountability",
    title: "Private WhatsApp Community",
    duration: "Always on",
    summary: "Questions answered, progress shared, accountability built in.",
    description:
      "A private group with your coach and fellow members. Ask form questions, share wins, stay accountable between sessions. Not a noisy broadcast channel — a real community.",
    includes: COMMUNITY.items,
    outcome: "Invite link unlocks after coach activates your membership.",
  },
] as const;

export const MEMBERSHIP_JOURNEY = [
  { step: "01", title: "Enroll & pick sessions", detail: "One program · ₹6,999/mo · choose 3 live slots." },
  { step: "02", title: "Pay & get access", detail: "Portal unlocks after payment — calendar with your sessions." },
  { step: "03", title: "Train with your coach", detail: "Morning or evening batches · strength + endurance." },
] as const;

export const PRICING_PLANS = [
  {
    id: "standard",
    name: "Lean Program",
    tag: "One program",
    price: "₹6,999",
    period: "per month",
    description:
      "Live strength and endurance coaching. Three sessions per week with your coach — morning or evening slots. All recorded.",
    featured: true,
  },
] as const;

export const INCLUDED_SUMMARY = [
  "Live coaching — strength & endurance",
  "3 sessions per week (you choose which 3)",
  "Morning: Mon / Wed / Fri · 7–8 AM",
  "Evening: Tue / Thu / Sat · 7–8 PM",
  "Session recordings in your portal",
  "Direct access to your coach",
] as const;

export const COHORT = {
  label: "Program",
  date: "Open enrollment",
  note: "Pick your 3 sessions at signup. Your coach is notified when you register.",
} as const;

export const FAQ = [
  {
    q: "What is the Lean Program?",
    a: "One live coaching program at ₹6,999/month covering strength and endurance. You train with your coach three times a week — not a PDF or self-led plan.",
  },
  {
    q: "When are the sessions?",
    a: "Two windows: Mon/Wed/Fri 7–8 AM, and Tue/Thu/Sat 7–8 PM (IST). At signup you choose any 3 of these six slots.",
  },
  {
    q: "Can I mix morning and evening?",
    a: "Yes. Pick any three sessions across both windows so the week fits your schedule.",
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded. Catch up from your portal when life gets busy.",
  },
  {
    q: "Do I train with the coach directly?",
    a: "Yes. This is live coached training. Your portal connects you to your coach — calendar, sessions, and support.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major Indian cards, UPI, and net banking via Razorpay.",
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "I've worked with three coaches before. None of them treated me like an adult. LEANMOVEMENT does. The work is hard. The instruction is clear. The results are obvious.",
    name: "Vikram",
    detail: "Founder · Hyderabad",
    since: "2025",
  },
  {
    quote:
      "No fluff. No fads. Just a system that fits into a 60-hour work week. That's all I needed.",
    name: "Saurabh",
    detail: "Tech · Bangalore",
    since: "2024",
  },
  {
    quote:
      "Showing up live changed everything. I actually train now — not just read about training.",
    name: "Anika",
    detail: "Consultant · Mumbai",
    since: "2025",
  },
] as const;

