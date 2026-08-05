export const BRAND = {
  name: "LEANMOVEMENT",
  display: "Lean Movement",
  tagline: "Evidence-based coaching. Lean. Strong. Sustainable.",
} as const;

export const CONTACT = {
  email: "coach@leanmovement.in",
  phone: "+91 89779 35936",
  whatsapp: "https://wa.me/918977935936",
  instagram: "https://www.instagram.com/natty.finesse/",
  instagramHandle: "natty.finesse",
  location: "Hyderabad, India",
  replyNote: "Email or WhatsApp. I reply within 2 business hours.",
} as const;

export const COACH = {
  name: "Mohith Chowdary",
  title: "Strength & Kettlebell Coach",
  location: "Hyderabad",
  bio: [
    "I coach people who want to get lean, stronger, and healthier - without living in the gym.",
    "I coach the basics done properly: train hard, eat well, recover, repeat.",
  ],
  credentials: [
    "Strength & conditioning coach",
    "Live coaching · Hyderabad",
  ],
  image: {
    unsplashId: "photo-1570440828762-ab7a993dbde8",
    alt: "Male kettlebell trainer in the gym - LEANMOVEMENT coach",
  },
} as const;

export function coachImageUrl(width: number) {
  const q = width >= 1920 ? 90 : width >= 1280 ? 88 : 85;
  return `https://images.unsplash.com/${COACH.image.unsplashId}?auto=format&fit=crop&w=${width}&h=${Math.round(width * 1.25)}&q=${q}&fm=webp&crop=entropy`;
}

export const COACH_IMAGE_DEFAULT = coachImageUrl(1200);

export const LEAN_KETTLEBELL = {
  name: "Lean Movement",
  tagline: BRAND.tagline,
  positioning:
    "Evidence-based coaching for people who want to get lean, stronger, and healthier - without living in the gym.",
  liveNote: "Live coaching with me. Three mornings a week.",
} as const;

export const HOME_HERO = {
  headline: "Train live.\nStay lean.",
  sublines: ["Strength.", "Muscle.", "Conditioning.", "Consistency."],
  sessionsLine: "Live kettlebell coaching - strength, muscle, and conditioning. Three mornings a week.",
} as const;

export const MEMBERSHIP_HERO = {
  headline: "Strong. Lean. Built for life.",
  sublines: [
    "Live coaching.",
    "Personalised training.",
    "Personalised nutrition included.",
    "No fluff.",
  ],
} as const;

/** Homepage hero - free Unsplash, kettlebell swing in gym. */
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
  title: "This is coaching. Not a workout plan.",
  paragraphs: [
    "You don't need more exercises. You need a coach.",
    "Every session is coached live - technique corrected in the moment, training and nutrition dialled in, progress tracked.",
    "You show up. The coaching is handled.",
  ],
} as const;

export const MEMBERSHIP_STATEMENT = {
  title: "Train with me.",
  paragraphs: [
    "Training and nutrition are the focus - strength, muscle, conditioning, and macros, coached together.",
    "Personalised sessions and macros. Meal guidance that fits real life.",
    "The goal isn't to exhaust you. It's to build a body that's capable today and still capable years from now.",
  ],
} as const;

export const MEMBERSHIP_OVERVIEW = {
  title: "Live coaching for busy people",
  subtitle: "One program. One coach. Three mornings a week.",
  description:
    "₹6,969/month. Live coaching, progressive programming, and personalised nutrition included. Sessions recorded for 7 days.",
  idealFor: [
    "People who can commit to three sessions a week",
    "Anyone who wants coached strength, conditioning, and nutrition",
    "People who value evidence and consistency over hype",
  ],
  notFor: [
    "PDF plans with no coaching",
    "People who can't commit to three sessions weekly",
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
  note: "One hour. Three mornings. Before work. Recordings stay available for 7 days.",
} as const;

export const EQUIPMENT_MINIMUM =
  "As a minimum, you'll need a pair of kettlebells (one lighter, one heavier), a mat, and enough space to train safely." as const;

export const REQUIREMENTS = {
  title: "What You'll Need",
  subtitle: "A pair of kettlebells, a mat, and room to move. That's enough.",
  items: [
    {
      label: "Equipment",
      detail:
        "A pair of kettlebells - one lighter, one heavier - plus a mat. No commercial gym required.",
    },
    {
      label: "Space",
      detail: "Your living room, terrace, garage, or small gym. If you can move safely, you have enough space.",
    },
    {
      label: "Time",
      detail: "One hour, three mornings a week. Show up. I handle the coaching.",
    },
    {
      label: "Commitment",
      detail: "Consistency over perfection. One hour at a time.",
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
    "Before your first live class, we do a one-on-one Foundations Session. Technique first. Then intensity.",
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
  note: "Better technique. Better progress.",
} as const;

export const LIVE_SESSIONS = {
  title: "Live Sessions",
  schedule: "3 sessions per week · 60 minutes · Tuesday, Thursday, Saturday mornings",
  description:
    "Progressive strength, conditioning, and mobility. Coached live every session.",
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
    "Nutrition is part of the coaching. Not an add-on. Personalised targets and meal guidance for real life.",
  items: [
    "Personal macro targets",
    "Protein goals",
    "Carb and fat targets",
    "Meal guidance for real life",
    "Eating out without losing progress",
    "Travel nutrition",
    "Recovery nutrition",
    "Sustainable fat-loss habits",
  ],
  closing: "No detoxes. No extreme cuts. Nutrition you can follow.",
} as const;

export const COMMUNITY = {
  title: "Community",
  items: [
    "Private member community",
    "Direct access to me",
    "Questions answered",
    "Progress shared",
    "Ongoing accountability",
  ],
} as const;

/** Short homepage teaser - full list lives on Membership. */
export const HOME_INCLUDED = [
  "Live coached sessions - three mornings a week",
  "Personalised training and progressive programming",
  "Personalised nutrition included - macros and meal guidance",
  EQUIPMENT_MINIMUM,
  "Foundations technique session with me",
  "Progress reviews, technique feedback, accountability",
  "Session recordings for 7 days",
] as const;

/** Compact homepage steps - detail expands on Membership. */
export const HOME_JOURNEY = [
  {
    n: "01",
    title: "Foundations",
    detail: "One-on-one technique session with me before your first live class.",
  },
  {
    n: "02",
    title: "Live coaching",
    detail: "Strength, muscle, and conditioning. Coached live. Three mornings a week.",
  },
  {
    n: "03",
    title: "Nutrition",
    detail: "Personalised nutrition included in your coaching. Habits that stick.",
  },
] as const;

export const MEMBERSHIP_INCLUDED = [
  "Three live coached sessions every week",
  "Personalised training and progressive programming",
  "Personalised nutrition included in the coaching price",
  "Protein, carb, and fat (macro) targets",
  "Meal guidance that fits real life",
  "One-on-one Foundations Session before your first class",
  "Exercise technique feedback every session",
  "Regular progress reviews",
  "Accountability and ongoing support",
  "Session recordings for 7 days",
] as const;

export const MEMBERSHIP_PILLARS = [
  {
    id: "foundations",
    eyebrow: "Step 1 · Onboarding",
    title: "Foundations Session",
    duration: "1 × 60 minutes",
    summary: "One-on-one technique session with me before your first live class.",
    description:
      "We cover setup, key lifts, breathing, and effort. So you can train live with clean technique from day one.",
    includes: FOUNDATIONS.items,
    outcome: "Saved in your portal for reference.",
  },
  {
    id: "live",
    eyebrow: "Core · 12 sessions/month",
    title: "Live Coached Sessions",
    duration: "3× per week · 60 min",
    summary: "Train live with me. Real-time technique feedback. Progressive programming.",
    description:
      "Tuesday, Thursday, and Saturday mornings. Strength, muscle, and conditioning. Coached live. Recorded for 7 days.",
    includes: LIVE_SESSIONS.days.map((d) => `${d.day} · ${d.name} - ${d.focus}`),
    outcome: "Join from your portal when the session goes live.",
  },
  {
    id: "recordings",
    eyebrow: "If you miss a class",
    title: "Session Recordings",
    duration: "7-day replay",
    summary: "Every live class is recorded. Watch when you can.",
    description:
      "Miss a morning? The recording is in your portal for 7 days. Same session. Same coaching.",
    includes: [
      "Full session replays after each live class",
      "Organised by session type",
      "Available for 7 days after each session",
    ],
    outcome: "Portal → Recordings.",
  },
  {
    id: "nutrition",
    eyebrow: "Included in coaching",
    title: "Personalised Nutrition",
    duration: "Part of your coaching",
    summary: "Nutrition is included in the coaching price. Not an add-on.",
    description:
      "Macro targets for protein, carbs, and fat. Meal guidance that fits real life. Built for progress you can sustain.",
    includes: NUTRITION.items,
    outcome: "Portal → Nutrition.",
  },
  {
    id: "circuits",
    eyebrow: "On-demand",
    title: "Kettlebell Circuits Library",
    duration: "5 guided circuits",
    summary: "Short sessions for days between live classes or when you travel.",
    description:
      "Conditioning, strength complexes, travel flows, and mobility. Complements live coaching. Does not replace it.",
    includes: [
      "The Engine Builder - 20 min conditioning",
      "Strength Complex A - heavy controlled work",
      "Travel KB Flow - hotel-friendly",
      "Hybrid Finisher - power & grit",
      "Mobility & Activation - pre-session prep",
    ],
    outcome: "Portal → Circuits.",
  },
  {
    id: "community",
    eyebrow: "Accountability",
    title: "Private Member Community",
    duration: "Ongoing",
    summary: "Ask questions. Share progress. Stay accountable.",
    description:
      "A private group with me and other members. Form check. Support. Consistency between sessions.",
    includes: COMMUNITY.items,
    outcome: "Invite link after membership is active.",
  },
] as const;

export const MEMBERSHIP_JOURNEY = [
  { step: "01", title: "Enroll & pay", detail: "One program · ₹6,969/mo · portal access after payment." },
  { step: "02", title: "Book Foundations", detail: "One-on-one technique session with me before your first live class." },
  { step: "03", title: "Train with me", detail: "Tue / Thu / Sat · 6:00–7:00 AM · strength, muscle, conditioning." },
] as const;

export const PRICING_PLANS = [
  {
    id: "standard",
    name: "Lean Movement",
    tag: "One program",
    price: "₹6,969",
    period: "per month",
    description:
      "Live coaching and personalised nutrition included. Training, macros, progress reviews, and accountability - one price.",
    featured: true,
  },
] as const;

export const INCLUDED_SUMMARY = [
  "Live coaching - strength, muscle & conditioning",
  "Personalised nutrition included",
  "Pair of kettlebells, mat, and space to train",
  "Foundations session + 7-day recordings",
] as const;

export const COHORT = {
  label: "Program",
  date: "Open enrollment",
  note: "One program. One coach. Lean. Strong. Sustainable.",
} as const;

export const HOME_QUOTE = {
  text: "Consistency over perfection. Progress you can measure.",
  author: "Mohith Chowdary",
} as const;

export const MEMBERSHIP_QUOTE = {
  text: "I don't coach extremes. I coach what works.",
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

/** Membership hero - full-bleed kettlebell swing (landscape). */
export const PROGRAM_HERO = {
  src: "/images/programs/membership-hero-full.png?v=4",
  alt: "Athlete mid kettlebell swing in a professional gym",
} as const;

/** About page full-bleed hero. Set 2: training pose. */
export const ABOUT_PAGE_HERO = {
  src: "/images/coach/about-training-pose.webp",
  srcFallback: "/images/coach/about-training-pose-hq.jpg",
  alt: "Mohith Chowdary - strength and conditioning training",
} as const;

/** Coach portrait - about page + contact. Set 2: beach lifestyle. */
export const ABOUT_HERO = {
  src: "/images/coach/about-hero-beach.png",
  alt: "Mohith Chowdary - lean, athletic physique",
} as const;

/** About page - training feature visual. Set 2: gym locker. */
export const ABOUT_TRAINING_FEATURE = {
  src: "/images/coach/about-coach-locker.png",
  alt: "Mohith Chowdary - strength and kettlebell coach in the gym",
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

/** Legacy Unsplash helper - prefer local PROGRAM_GALLERY / PROGRAM_HERO. */
export function programImageUrl(unsplashId: string, width = 1600) {
  const q = width >= 2400 ? 92 : width >= 1600 ? 90 : 88;
  return `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=${width}&q=${q}&fm=webp`;
}

export const PROGRAM_BENEFITS = [
  {
    title: "Clear structure",
    detail: "Fixed weekly schedule. Tue, Thu, Sat. Show up. Progress.",
  },
  {
    title: "Live coaching",
    detail: "Technique feedback and accountability every session. Not a pre-recorded library.",
  },
  {
    title: "Built for real schedules",
    detail: "One hour, three mornings a week. Before work.",
  },
  {
    title: "Miss a class?",
    detail: "Recordings stay in your portal for 7 days.",
  },
  {
    title: "Home-friendly setup",
    detail: EQUIPMENT_MINIMUM,
  },
  {
    title: "Nutrition included",
    detail: "Personalised nutrition is part of the coaching price. Plus ongoing support.",
  },
] as const;

export const PROGRAM_STAGES = [
  {
    stage: "01",
    title: "Foundations",
    detail:
      "One technique session before your first live class - swing, clean, press, squat, breathing, and effort.",
  },
  {
    stage: "02",
    title: "Live training",
    detail:
      "Three coached sessions every week. Strength, conditioning, mobility. Real-time feedback.",
  },
  {
    stage: "03",
    title: "Progress & habits",
    detail:
      "Recordings, nutrition, and accountability so consistency sticks month after month.",
  },
] as const;

export const FAQ = [
  {
    q: "Is this beginner friendly?",
    a: "Yes. Everyone starts with a Foundations Session. You learn the movements correctly before joining live classes.",
  },
  {
    q: "Do I need a gym?",
    a: `No. ${EQUIPMENT_MINIMUM}`,
  },
  {
    q: "What if I miss a class?",
    a: "Every session goes to your portal. Recordings stay available for 7 days.",
  },
  {
    q: "Is nutrition included?",
    a: "Yes. Personalised nutrition is part of the coaching price - macros and meal guidance. Not an add-on.",
  },
  {
    q: "Will this help me get leaner?",
    a: "If you train consistently and follow the nutrition coaching, yes. We build strength and performance first. Fat loss follows sustainable habits - not extreme cuts.",
  },
  {
    q: "When will I see progress?",
    a: "You'll feel stronger before you look different. Stay consistent for a few weeks. Stay consistent for a few months and it shows.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cards, UPI, and net banking via Razorpay.",
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
      "Showing up live changed everything. I actually train now - not just read about training.",
    name: "Anika",
    detail: "Consultant · Mumbai",
    since: "2025",
  },
] as const;

export const HOME_CLOSING = {
  headline: "Strong. Athletic. Built to last.",
  subline: "Live coaching for training and nutrition - structured, sustainable, and built for busy schedules.",
} as const;

export const MEMBERSHIP_CLOSING = {
  headline: "Ready when you are.",
  sublines: ["Start with Foundations.", "Then train live with me."],
} as const;
