export const BRAND = {
  name: "LEANMOVEMENT",
  display: "Lean Movement",
  tagline: "Get Lean. Get Strong. Stay Athletic.",
} as const;

export const COACH = {
  name: "Mohith Thotakura",
  title: "Strength & Kettlebell Coach",
  location: "Hyderabad",
  bio: [
    "Mohith Thotakura built Lean Kettlebell™ around one idea: busy professionals deserve real coaching — not another PDF program. He leads live sessions three times a week, teaches proper kettlebell technique from the ground up, and keeps every member accountable inside a small, focused group.",
    "His approach is technique-first, progression-driven, and built for people who have 45 minutes — not two hours. Foundations before load. Consistency before intensity. Every session is coached, recorded, and designed to make you stronger, leaner, and more athletic without living in the gym.",
    "When you join, you train with Mohith live — on camera, in real time — with corrections, cues, and a plan that actually fits your schedule.",
  ],
  credentials: [
    "Strength & kettlebell specialist",
    "Live small-group coaching",
    "Foundations & technique onboarding",
    "Based in Hyderabad · trains members across India",
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
  name: "Live Coaching Membership",
  tagline: BRAND.tagline,
  positioning:
    "A live kettlebell coaching membership for busy professionals who want visible abs, muscle, and athletic fitness through short, effective workouts.",
  liveNote: "All sessions happen live — train with your coach three times a week.",
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
  title: "What is Lean Kettlebell™?",
  subtitle: "A live coaching membership — not a PDF program.",
  description:
    "You join coached kettlebell sessions three times a week with a real coach on video. Every session is recorded. You get a foundations onboarding, a simple nutrition framework, on-demand circuits, and a private WhatsApp community. Built for busy professionals who want visible abs, muscle, and athletic fitness without living in the gym.",
  idealFor: [
    "Busy professionals with 45–60 minutes, three days a week",
    "Beginners who want proper technique before going heavy",
    "Intermediate lifters who want structure and accountability",
    "Anyone tired of random YouTube workouts with no progression",
  ],
  notFor: [
    "Custom 1:1 programming spreadsheets",
    "Rigid meal plans or calorie-counting apps",
    "Bodybuilding split routines or bro-science",
  ],
} as const;

export const SESSION_SCHEDULE = {
  title: "Weekly Schedule",
  subtitle: "3 live sessions · 45 minutes each · All recorded",
  timezone: "IST (India Standard Time)",
  batches: [
    { day: "Monday", time: "7:00 AM", name: "Strength", type: "Heavy & structural" },
    { day: "Wednesday", time: "7:00 AM", name: "Conditioning", type: "Engine & intervals" },
    { day: "Saturday", time: "8:00 AM", name: "Hybrid Athlete", type: "Power, core & flow" },
  ],
  note: "Miss a session? Recordings are in your portal within hours — catch up anytime.",
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
  title: "12 Live Sessions Per Month",
  schedule: "3 sessions per week · 45 minutes each",
  description: "Train live with your coach. All sessions recorded — members can catch up anytime.",
  days: [
    {
      day: "Monday",
      name: "Strength",
      focus: "Heavy KB work, carries, presses, squats, deadlifts",
    },
    {
      day: "Wednesday",
      name: "Conditioning",
      focus: "EMOMs, intervals, complexes, heart rate work",
    },
    {
      day: "Saturday",
      name: "Hybrid Athlete",
      focus: "Mixed sessions — power, core, mobility, KB flow",
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
  { step: "01", title: "Enroll & pay", detail: "Pick your plan and checkout in under 2 minutes." },
  { step: "02", title: "Portal access", detail: "Sign in with your email — dashboard, schedule, and onboarding unlock." },
  { step: "03", title: "Book Foundations", detail: "60-min technique session before your first live class." },
  { step: "04", title: "Join live sessions", detail: "Mon · Wed · Sat — train with your coach three times a week." },
] as const;

export const PRICING_PLANS = [
  {
    id: "standard",
    name: "Standard Membership",
    tag: "Monthly",
    price: "₹7,999",
    period: "per month",
    description: "Full membership — live sessions, recordings, nutrition framework, and community.",
    featured: true,
  },
  {
    id: "quarterly",
    name: "Quarterly",
    tag: "3-Month Commitment",
    price: "₹21,999",
    period: "every 3 months",
    description: "Same membership, billed quarterly. Best for members ready to commit.",
    featured: false,
  },
  {
    id: "founding",
    name: "Founding Members",
    tag: "Limited Slots",
    price: "₹5,999",
    period: "per month",
    description: "Early supporter pricing. Same access — limited availability.",
    featured: false,
  },
] as const;

export const INCLUDED_SUMMARY = [
  "Initial 60-min Foundations session (recorded)",
  "12 live coached sessions per month",
  "Session recordings — catch up anytime",
  "Nutrition framework (not meal plans)",
  "Private WhatsApp community",
  "5 kettlebell circuits library",
] as const;

export const COHORT = {
  label: "Next cohort starts",
  date: "April 2026",
  note: "Foundations session scheduled before your first live class.",
} as const;

export const FAQ = [
  {
    q: "Is this online coaching or live training?",
    a: "Live training. You join coached kettlebell sessions three times a week — not a PDF program or spreadsheet. This is a small-group virtual studio experience.",
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded. Catch up on your schedule — you never fall behind because life got busy.",
  },
  {
    q: "Do I need kettlebells?",
    a: "Yes. At minimum one kettlebell to start; two or three weights as you progress is ideal. We'll cover setup and recommendations in your Foundations session.",
  },
  {
    q: "Is this suitable for beginners?",
    a: "Yes — with the Foundations session first. Every member completes a 60-minute technique session before joining regular classes.",
  },
  {
    q: "How much time do I need per week?",
    a: "Three 45-minute live sessions per week. Short, effective, and built for busy professionals.",
  },
  {
    q: "What about nutrition — do I get meal plans?",
    a: "No rigid meal plans. You get a practical framework: calorie and protein targets, flexible dieting, restaurant and travel guides — how lean people eat, not chicken at 2 pm.",
  },
  {
    q: "What if I travel often?",
    a: "Recordings are always available. The nutrition framework includes a travel eating guide. Many members train from hotel rooms with a single kettlebell.",
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
