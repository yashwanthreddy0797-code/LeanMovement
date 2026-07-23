export const BRAND = {
  name: "LEANMOVEMENT",
  display: "Lean Movement",
  tagline: "Train live. Stay lean.",
} as const;

export const CONTACT = {
  email: "coach@leanmovement.in",
  phone: "+91 89779 35936",
  whatsapp: "https://wa.me/918977935936",
  instagram: "https://www.instagram.com/natty.finesse/",
  instagramHandle: "natty.finesse",
  location: "Hyderabad, India",
} as const;

export const COACH = {
  name: "Mohith Chowdary",
  title: "Strength & Kettlebell Coach",
  location: "Hyderabad",
  bio: [
    "Mohith built LEANMOVEMENT for busy professionals who want real coaching — not another PDF program. He leads live sessions three mornings a week with technique-first progressions built for one-hour training blocks.",
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
    "Live coaching designed to help you build strength, improve endurance, move better, and stay lean — with simple equipment and a clear plan.",
  liveNote: "Train live with your coach — three mornings every week.",
} as const;

export const HOME_HERO = {
  headline: "Train live.\nStay lean.",
  sublines: ["Build strength.", "Improve endurance.", "Move better.", "Stay consistent."],
  sessionsLine: "Three live coaching sessions every week.",
} as const;

export const MEMBERSHIP_HERO = {
  headline: "Build a body that's strong, athletic and built to last.",
  sublines: [
    "Live kettlebell coaching.",
    "Three mornings a week.",
    "One coach.",
    "One program.",
  ],
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

export const HOME_STATEMENT = {
  title: "This isn't another workout program.",
  paragraphs: [
    "You don't need more exercises. You don't need another PDF. You need a coach.",
    "At LEANMOVEMENT, we train together three mornings a week. Mohith coaches every session live, fixes your technique, pushes your intensity, and makes sure you're progressing week after week.",
    "You show up. He'll take care of the rest.",
  ],
} as const;

export const MEMBERSHIP_STATEMENT = {
  title: "Train with me.",
  paragraphs: [
    "You don't need another workout plan. You need a system you'll actually stick to.",
    "LEANMOVEMENT is live coaching designed to help you build strength, improve endurance, move better, and stay lean — all with simple equipment and a clear plan.",
    "Every Tuesday, Thursday, and Saturday morning, we train together. Mohith coaches you through every session, corrects your technique, pushes your intensity, and keeps you accountable.",
    "Miss a session? The recording is uploaded to your member portal and remains available for 7 days before it expires.",
  ],
} as const;

export const MEMBERSHIP_OVERVIEW = {
  title: "Live coaching for busy professionals",
  subtitle: "One program. One coach. Three mornings a week.",
  description:
    "A single Lean Program at ₹6,999/month. You train live three times a week — strength, conditioning, and mobility. All sessions recorded for 7 days.",
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
  subtitle: "Tue · Thu · Sat · 6:00 – 7:00 AM IST",
  timezone: "IST (India Standard Time)",
  batches: [
    {
      day: "Tuesday / Thursday / Saturday",
      time: "6:00 – 7:00 AM",
      name: "Morning",
      type: "Strength, conditioning & mobility",
    },
  ],
  note: "Train before work. Finish before the world wakes up. Recordings land in your portal for 7 days.",
} as const;

export const REQUIREMENTS = {
  title: "What You'll Need",
  subtitle: "Two kettlebells. One lighter. One heavier. That's enough.",
  items: [
    {
      label: "Equipment",
      detail: "Two kettlebells — one lighter, one heavier. No expensive equipment. No commercial gym.",
    },
    {
      label: "Space",
      detail: "Your living room, terrace, garage, or small gym. If you can move safely, you have enough space.",
    },
    {
      label: "Time",
      detail: "One hour. Tuesday, Thursday, Saturday. 6:00–7:00 AM. Show up — Mohith handles the rest.",
    },
    {
      label: "Commitment",
      detail: "Consistency beats motivation. Three mornings a week. One hour at a time.",
    },
    {
      label: "Tech",
      detail: "Phone or laptop with stable internet for live sessions via Zoom.",
    },
  ],
} as const;

export const WHO_ITS_FOR = {
  title: "Who This Is For",
  items: [
    "People who want to become stronger",
    "People who want better endurance",
    "People who want to move better",
    "People who want to stay lean all year",
    "People who are tired of starting over",
    "People who value coaching over motivation",
  ],
} as const;

export const WHY_KETTLEBELLS = {
  title: "Why Kettlebells?",
  lead: "Because they work.",
  items: ["Strength", "Conditioning", "Power", "Mobility", "Endurance", "Athleticism"],
  closing: "One tool. Hundreds of movements. Years of progress.",
} as const;

export const FOUNDATIONS = {
  title: "Foundations Session",
  duration: "1 × 60 mins",
  description:
    "Every member begins with a one-on-one Foundations Session before joining the group. Build confidence before you build intensity.",
  items: [
    "Kettlebell setup",
    "Deadlift",
    "Swing",
    "Clean",
    "Press",
    "Goblet squat",
    "Breathing mechanics",
    "Heart rate zones",
    "RPE (Rate of Perceived Exertion)",
    "Safe movement and proper technique",
  ],
  note: "The better your technique, the better your results.",
} as const;

export const LIVE_SESSIONS = {
  title: "Live Sessions",
  schedule: "3 sessions per week · 60 minutes · Tuesday, Thursday, Saturday mornings",
  description:
    "Progressive strength, conditioning, and mobility programming — coached live every session.",
  days: [
    {
      day: "Tue / Thu / Sat",
      name: "Morning",
      focus: "6:00 – 7:00 AM IST · Strength, conditioning & mobility",
    },
  ] as const,
} as const;

export const NUTRITION = {
  title: "Nutrition",
  description:
    "Training gets you stronger. Nutrition keeps you lean. Simple, sustainable guidance built for real life.",
  items: [
    "Personal calorie targets",
    "Protein goals",
    "Macronutrient breakdown",
    "Building balanced meals",
    "Eating out without losing progress",
    "Restaurant and travel nutrition guide",
    "Recovery nutrition",
    "Long-term fat loss habits",
  ],
  closing: "No meal plans. No detoxes. No unnecessary restrictions. Just nutrition you can actually follow.",
} as const;

export const COMMUNITY = {
  title: "Community",
  items: [
    "Private member community",
    "Direct access to your coach",
    "Questions answered",
    "Progress sharing",
    "Ongoing accountability",
  ],
} as const;

/** Short homepage teaser — full list lives on Membership. */
export const HOME_INCLUDED = [
  "Three live coaching sessions every week",
  "One-on-one Foundations Session",
  "Session recordings for 7 days",
  "Direct coach access",
  "Nutrition guidance",
  "Private member community",
] as const;

/** Compact homepage journey — detail expands on Membership. */
export const HOME_JOURNEY = [
  {
    n: "01",
    title: "Foundations",
    detail: "One-on-one technique session before your first live class.",
  },
  {
    n: "02",
    title: "Live coaching",
    detail: "Tue / Thu / Sat · 6–7 AM IST. Strength, conditioning, mobility.",
  },
  {
    n: "03",
    title: "Stay lean",
    detail: "Simple nutrition targets and habits you can actually follow.",
  },
] as const;

export const MEMBERSHIP_INCLUDED = [
  "Three live coaching sessions every week",
  "Progressive strength, conditioning & mobility programming",
  "One-on-one Foundations Session before your first class",
  "Session recordings available for 7 days",
  "Direct access to your coach for training questions",
  "Nutrition guidance for fat loss and performance",
  "Personal calorie, protein and macronutrient targets",
  "Restaurant and eating-out strategies",
  "Private member community",
  "Ongoing accountability",
] as const;

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
    duration: "3× per week · 60 min",
    summary: "Train live with your coach and a small group. Real-time cues, corrections, and energy.",
    description:
      "Tuesday, Thursday, and Saturday mornings — strength, conditioning, and mobility work so you build muscle, engine, and athleticism without burning out. All sessions are recorded.",
    includes: LIVE_SESSIONS.days.map((d) => `${d.day} · ${d.name} — ${d.focus}`),
    outcome: "Join from your portal dashboard when the session goes live.",
  },
  {
    id: "recordings",
    eyebrow: "Never miss a beat",
    title: "Session Recordings",
    duration: "7-day replay",
    summary: "Every live class recorded — watch on your schedule.",
    description:
      "Traveling? Working late? Life happens. Recordings land in your portal library and stay available for 7 days. Same coaching, same session — on your time.",
    includes: [
      "Full session replays after each live class",
      "Organised by session type (Strength, Conditioning, Hybrid)",
      "Available for 7 days after each session",
    ],
    outcome: "Catch up from Portal → Recordings.",
  },
  {
    id: "nutrition",
    eyebrow: "Not meal plans",
    title: "Nutrition Framework",
    duration: "Self-paced guides",
    summary: "How lean people eat — without rigid spreadsheets or cutting out the foods you enjoy.",
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
    title: "Private Member Community",
    duration: "Always on",
    summary: "Questions answered, progress shared, accountability built in.",
    description:
      "A private group with your coach and fellow members. Ask form questions, share wins, stay accountable between sessions. Not a noisy broadcast channel — a real community.",
    includes: COMMUNITY.items,
    outcome: "Invite link unlocks after coach activates your membership.",
  },
] as const;

export const MEMBERSHIP_JOURNEY = [
  { step: "01", title: "Enroll & pay", detail: "One program · ₹6,999/mo · portal unlocks after payment." },
  { step: "02", title: "Book Foundations", detail: "One-on-one technique session before your first live class." },
  { step: "03", title: "Train with your coach", detail: "Tue / Thu / Sat · 6:00–7:00 AM · strength + endurance." },
] as const;

export const PRICING_PLANS = [
  {
    id: "standard",
    name: "Lean Program",
    tag: "One program",
    price: "₹6,999",
    period: "per month",
    description:
      "Everything you need. Three live coaching sessions every week, Foundations Session, progressive programming, nutrition guidance, direct coach access, 7-day session recordings, and private community.",
    featured: true,
  },
] as const;

export const INCLUDED_SUMMARY = [
  "Live coaching — strength, conditioning & mobility",
  "3 Zoom live sessions per week · Tue / Thu / Sat",
  "6:00 – 7:00 AM IST",
  "Session recordings in your portal (7 days)",
  "Direct access to your coach",
] as const;

export const COHORT = {
  label: "Program",
  date: "Open enrollment",
  note: "One program. One coach. Become stronger. Stay lean.",
} as const;

export const HOME_QUOTE = {
  text: "Train for the life you want to live, not just the body you want to have.",
  author: "Mohith Chowdary",
} as const;

export const MEMBERSHIP_QUOTE = {
  text: "You don't need more equipment. You need a system you'll actually stick to.",
  author: "Mohith Chowdary",
} as const;

export const PROGRAM_GALLERY = [
  {
    src: "/images/programs/kb-05.webp",
    alt: "Athlete gripping two blue kettlebells on the gym floor",
    caption: "Double-bell strength work",
  },
  {
    src: "/images/programs/kb-06.webp",
    alt: "Hands holding a black cast-iron kettlebell",
    caption: "Grip, load, progress",
  },
  {
    src: "/images/programs/kb-03.webp",
    alt: "Athlete gripping a black kettlebell ready to train",
    caption: "Engine & endurance sessions",
  },
  {
    src: "/images/programs/kb-08.webp",
    alt: "Kettlebells lined up beside an athlete in a premium gym",
    caption: "Built around the kettlebell",
  },
] as const;

/** Membership hero — full-bleed kettlebell swing (landscape). */
export const PROGRAM_HERO = {
  src: "/images/programs/membership-hero-full.png?v=4",
  alt: "Athlete mid kettlebell swing in a professional gym",
} as const;

/** About page hero — coach with kettlebell (local, premium). */
export const ABOUT_HERO = {
  src: "/images/programs/about-hero.webp",
  alt: "LEANMOVEMENT coach with kettlebell in the gym",
} as const;

export const ABOUT_GALLERY = [
  {
    src: "/images/programs/about-strip-01.webp",
    alt: "Athlete mid kettlebell swing",
  },
  {
    src: "/images/programs/kb-04.webp",
    alt: "Professional kettlebells lined up on the gym floor",
  },
  {
    src: "/images/programs/kb-07.webp",
    alt: "Black kettlebell on the training floor",
  },
  {
    src: "/images/programs/kb-01.webp",
    alt: "Athlete holding a kettlebell ready to train",
  },
] as const;

/** Legacy Unsplash helper — prefer local PROGRAM_GALLERY / PROGRAM_HERO. */
export function programImageUrl(unsplashId: string, width = 1600) {
  const q = width >= 2400 ? 92 : width >= 1600 ? 90 : 88;
  return `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=${width}&q=${q}&fm=webp`;
}

export const PROGRAM_BENEFITS = [
  {
    title: "Clear structure — no guesswork",
    detail: "A fixed weekly schedule. Show up Tue, Thu, Sat — train, progress.",
  },
  {
    title: "Real coach on camera",
    detail: "Corrections, cues, and accountability in every session — not a pre-recorded video bank.",
  },
  {
    title: "Built for busy schedules",
    detail: "One hour, three mornings a week. Train before work starts.",
  },
  {
    title: "Never fall behind",
    detail: "Miss a class? Recordings land in your portal for 7 days.",
  },
  {
    title: "Home-friendly setup",
    detail: "Two kettlebells and space to move. No commercial gym required.",
  },
  {
    title: "Nutrition + community",
    detail: "Simple eating framework and a private member community with your coach.",
  },
] as const;

export const PROGRAM_STAGES = [
  {
    stage: "01",
    title: "Foundations",
    detail:
      "One dedicated technique session before your first live class — swing, clean, press, squat, breathing, and effort literacy.",
  },
  {
    stage: "02",
    title: "Live training",
    detail:
      "Three coached sessions every week across strength, conditioning, and mobility. Real-time cues in a small group.",
  },
  {
    stage: "03",
    title: "Sustain & progress",
    detail:
      "Recordings, circuits, nutrition framework, and community accountability so consistency sticks month after month.",
  },
] as const;

export const FAQ = [
  {
    q: "Is this beginner friendly?",
    a: "Yes. Everyone starts with a Foundations Session before joining the live classes, so you'll learn every movement correctly from day one.",
  },
  {
    q: "Do I need a gym?",
    a: "No. Two kettlebells and enough room to move are all you need.",
  },
  {
    q: "What if I miss a class?",
    a: "Every session is uploaded to your portal. Recordings remain available for 7 days before they expire.",
  },
  {
    q: "Will this help me lose fat?",
    a: "Yes — if you train consistently and follow the nutrition guidance, you'll get leaner while becoming stronger and fitter. We're building a body that's capable for life, not chasing quick weight loss.",
  },
  {
    q: "When will I see results?",
    a: "You'll feel stronger before you look stronger. Stay consistent for a few weeks and you'll notice the difference. Stay consistent for a few months and everyone else will too.",
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

export const HOME_CLOSING = {
  headline: "Strong enough to lift. Fit enough to run. Consistent enough to keep it.",
  subline: "Live coaching. Tuesday, Thursday, Saturday. 6:00–7:00 AM IST.",
} as const;

export const MEMBERSHIP_CLOSING = {
  headline: "Train live. Stay lean.",
  sublines: ["Build strength.", "Improve endurance.", "Move with confidence.", "Stay consistent."],
} as const;
