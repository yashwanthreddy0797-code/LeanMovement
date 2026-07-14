// LEANMOVEMENT member portal — demo data for client preview

import { COACH } from "@/lib/lean-kettlebell";

export const memberProfile = {
  name: "Rahul",
  fullName: "Rahul Mehta",
  email: "rahul@example.com",
  membership: "Lean Program",
  plan: "Monthly",
  price: "₹6,999",
  coach: COACH.name,
  memberSince: "Mar 1, 2026",
  membershipRenewsOn: "Apr 1, 2026",
  foundationsComplete: true,
  sessionsThisMonth: 8,
  totalSessionsPerMonth: 12,
};

export const nextLiveSession = {
  title: "Lean Kettlebell - Morning",
  day: "Monday",
  date: "Mar 3, 2026",
  time: "7:00 AM IST",
  duration: "60 min",
  type: "Strength",
  status: "upcoming" as const,
  joinUrl: "https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1",
  coach: COACH.name,
};

export const weeklySchedule = [
  {
    day: "Monday",
    date: "This week",
    title: "Lean Kettlebell - Morning",
    focus: "",
    time: "7:00 AM IST",
    status: "upcoming" as const,
    isToday: true,
  },
  {
    day: "Tuesday",
    date: "This week",
    title: "Lean Kettlebell - Evening",
    focus: "",
    time: "7:00 PM IST",
    status: "scheduled" as const,
    isToday: false,
  },
  {
    day: "Wednesday",
    date: "This week",
    title: "Lean Kettlebell - Morning",
    focus: "",
    time: "7:00 AM IST",
    status: "scheduled" as const,
    isToday: false,
  },
  {
    day: "Thursday",
    date: "This week",
    title: "Lean Kettlebell - Evening",
    focus: "",
    time: "7:00 PM IST",
    status: "scheduled" as const,
    isToday: false,
  },
  {
    day: "Friday",
    date: "This week",
    title: "Lean Kettlebell - Morning",
    focus: "",
    time: "7:00 AM IST",
    status: "scheduled" as const,
    isToday: false,
  },
  {
    day: "Saturday",
    date: "This week",
    title: "Lean Kettlebell - Evening",
    focus: "",
    time: "7:00 PM IST",
    status: "scheduled" as const,
    isToday: false,
  },
];

export const recordings = [
  {
    id: "1",
    title: "Strength — Heavy KB & Carries",
    date: "Feb 24, 2026",
    duration: "47 min",
    type: "Strength",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=70&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Conditioning — EMOM Complex",
    date: "Feb 26, 2026",
    duration: "44 min",
    type: "Conditioning",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=70&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Hybrid Athlete — Power & Flow",
    date: "Mar 1, 2026",
    duration: "46 min",
    type: "Hybrid",
    thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=70&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Foundations — Swing & Clean Mechanics",
    date: "Feb 20, 2026",
    duration: "58 min",
    type: "Foundations",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=70&auto=format&fit=crop",
  },
];

export const circuits = [
  {
    id: "1",
    name: "The Engine Builder",
    duration: "20 min",
    rounds: "4 rounds",
    difficulty: "Intermediate",
    exercises: ["KB Swings × 20", "Goblet Squats × 12", "Push Press × 10", "Rest 60s"],
    description: "Build conditioning without sacrificing technique. Heart rate focused.",
  },
  {
    id: "2",
    name: "Strength Complex A",
    duration: "25 min",
    rounds: "5 sets",
    difficulty: "Intermediate",
    exercises: ["Clean × 5", "Front Squat × 5", "Press × 5", "Rest 90s"],
    description: "Heavy, controlled complex work. Focus on crisp transitions.",
  },
  {
    id: "3",
    name: "Travel KB Flow",
    duration: "15 min",
    rounds: "3 rounds",
    difficulty: "All levels",
    exercises: ["Halos × 10/side", "Goblet Squat × 15", "Single-arm Row × 12", "Rest 45s"],
    description: "Minimal equipment. Hotel-friendly. Keep the habit alive on the road.",
  },
  {
    id: "4",
    name: "Hybrid Finisher",
    duration: "18 min",
    rounds: "EMOM 18",
    difficulty: "Advanced",
    exercises: ["Min 0: Swings × 15", "Min 1: Cleans × 8", "Min 2: Rest", "Repeat"],
    description: `Power, engine, and mental grit. ${COACH.name.split(" ")[0]}'s Saturday session condensed.`,
  },
  {
    id: "5",
    name: "Mobility & Activation",
    duration: "12 min",
    rounds: "2 rounds",
    difficulty: "All levels",
    exercises: ["World's Greatest Stretch", "KB Arm Bar", "Hip CARs", "Breathing drill"],
    description: "Pre-session prep or recovery day. Non-negotiable movement quality.",
  },
];

export const nutritionFramework = {
  calorieTarget: 2200,
  proteinTarget: 165,
  proteinPerKg: "1.8–2.2g/kg",
  sections: [
    {
      title: "Calorie targets",
      body: "Set a moderate deficit for fat loss or maintenance calories for recomposition. Adjust every 2–3 weeks based on progress, not daily scale noise.",
    },
    {
      title: "Protein first",
      body: "Hit your protein target before optimizing anything else. Lean meats, eggs, dal, paneer, Greek yogurt — pick what fits your life.",
    },
    {
      title: "Flexible dieting",
      body: "No banned foods. Fit treats into your targets. Sustainability beats perfection every time.",
    },
    {
      title: "Restaurant framework",
      body: "Protein-forward order. Skip the bread basket. Ask for extra vegetables. Don't let one meal derail the week.",
    },
    {
      title: "Travel eating",
      body: "Protein shake + fruit for backup. Hotel eggs and dal work. One missed meal isn't a crisis — the next one is.",
    },
    {
      title: "Supplements",
      body: "Optional: whey, creatine, vitamin D, omega-3. Food first. Supplements fill gaps, not replace meals.",
    },
  ],
};

export const memberInvoices = [
  { id: "INV-LK-0042", date: "Mar 1, 2026", amount: "₹7,999", status: "Paid" },
  { id: "INV-LK-0031", date: "Feb 1, 2026", amount: "₹7,999", status: "Paid" },
];

export const whatsAppCommunity = {
  groupName: "LEANMOVEMENT — Members",
  members: 24,
  inviteUrl: "https://chat.whatsapp.com/demo-lean-kettlebell",
  description: "Private WhatsApp group for accountability, questions, and progress sharing.",
};
