// Mock data for the portal scaffold. Replace with Lovable Cloud queries later.

import { COACH } from "@/lib/lean-kettlebell";

export const clientProfile = {
  name: "Rahul",
  fullName: "Rahul Mehta",
  email: "rahul@example.com",
  program: "Lean Transformation - 12 Week",
  goal: "Lose 8kg, get leaner and stronger",
  coach: COACH.name,
  dayNumber: 23,
  totalDays: 90,
  membership: "Premium 1:1",
  membershipRenewsOn: "Mar 18, 2026",
};

export const kpis = [
  { label: "Current Weight", value: "78.4", unit: "kg", delta: "-1.2 this week", tone: "down" as const },
  { label: "Goal Weight", value: "72.0", unit: "kg", delta: "6.4 to go", tone: "neutral" as const },
  { label: "Weight Lost", value: "8.6", unit: "kg", delta: "since Jan 12", tone: "up" as const },
  { label: "Body Fat", value: "18.2", unit: "%", delta: "-2.4% in 30d", tone: "down" as const },
  { label: "Daily Protein", value: "158", unit: "g", delta: "Target 165g", tone: "neutral" as const },
  { label: "Water Intake", value: "2.8", unit: "L", delta: "Target 3.5L", tone: "neutral" as const },
  { label: "Workout Streak", value: "14", unit: "days", delta: "Personal best", tone: "up" as const },
  { label: "Sleep Avg", value: "7.4", unit: "hrs", delta: "+0.6 this week", tone: "up" as const },
];

export const weightTrend = [
  { d: "Wk 1", w: 87.0, bf: 24.6 },
  { d: "Wk 2", w: 85.8, bf: 24.0 },
  { d: "Wk 3", w: 84.7, bf: 23.2 },
  { d: "Wk 4", w: 83.9, bf: 22.5 },
  { d: "Wk 5", w: 82.4, bf: 21.8 },
  { d: "Wk 6", w: 81.5, bf: 21.0 },
  { d: "Wk 7", w: 80.6, bf: 20.2 },
  { d: "Wk 8", w: 79.8, bf: 19.4 },
  { d: "Wk 9", w: 79.0, bf: 18.7 },
  { d: "Wk 10", w: 78.4, bf: 18.2 },
];

export const waistTrend = [
  { d: "Wk 1", v: 98 }, { d: "Wk 2", v: 97 }, { d: "Wk 3", v: 95.5 },
  { d: "Wk 4", v: 94 }, { d: "Wk 5", v: 92.5 }, { d: "Wk 6", v: 91 },
  { d: "Wk 7", v: 90 }, { d: "Wk 8", v: 89 }, { d: "Wk 9", v: 88 }, { d: "Wk 10", v: 87 },
];

export const workoutToday = {
  title: "Upper Body - Push Focus",
  duration: "55 min",
  exercises: [
    { name: "Barbell Bench Press", sets: 4, reps: "6-8", rest: "120s", done: true },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", rest: "90s", done: true },
    { name: "Seated Overhead Press", sets: 3, reps: "8-10", rest: "90s", done: false },
    { name: "Cable Lateral Raise", sets: 4, reps: "12-15", rest: "60s", done: false },
    { name: "Triceps Rope Pushdown", sets: 3, reps: "12-15", rest: "60s", done: false },
    { name: "Plank Hold", sets: 3, reps: "60s", rest: "45s", done: false },
  ],
};

export const meals = [
  { type: "Breakfast", title: "Egg white scramble, oats, berries", p: 38, c: 62, f: 12, img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&q=70&auto=format&fit=crop" },
  { type: "Lunch", title: "Grilled chicken, brown rice, salad", p: 52, c: 70, f: 16, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70&auto=format&fit=crop" },
  { type: "Snack", title: "Greek yogurt, almonds, honey", p: 22, c: 24, f: 10, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=70&auto=format&fit=crop" },
  { type: "Dinner", title: "Pan-seared salmon, quinoa, greens", p: 46, c: 48, f: 22, img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=70&auto=format&fit=crop" },
];

export const nutritionTargets = { p: 165, c: 220, f: 65 };
export const nutritionConsumed = { p: 158, c: 204, f: 60 };

export const messages = [
  { from: "coach", text: "Morning Rahul - how did yesterday's session feel?", time: "8:02 AM" },
  { from: "me", text: "Strong. Hit a PR on bench. Sleep was 7h.", time: "8:12 AM" },
  { from: "coach", text: "Beautiful. Add 2.5kg next session and keep the bar path tight.", time: "8:14 AM" },
  { from: "me", text: "Got it. Sending today's meals shortly.", time: "8:15 AM" },
  { from: "coach", text: "Don't forget your weekly check-in tonight 🙌", time: "10:40 AM" },
];

export const invoices = [
  { id: "INV-0241", date: "Feb 18, 2026", amount: "₹14,999", status: "Paid" },
  { id: "INV-0198", date: "Jan 18, 2026", amount: "₹14,999", status: "Paid" },
  { id: "INV-0152", date: "Dec 18, 2025", amount: "₹14,999", status: "Paid" },
  { id: "INV-0111", date: "Nov 18, 2025", amount: "₹14,999", status: "Paid" },
];

export const communityFeed = [
  { user: "Priya S.", program: "Fat Loss", time: "2h", text: `Down 12kg and finally fitting back into my wedding lehenga. Thank you ${COACH.name.split(" ")[0]} 🙏`, likes: 84, comments: 12, img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=70&auto=format&fit=crop" },
  { user: "Karan M.", program: "Strength Gain", time: "5h", text: "First time deadlifting 180kg. Slow and steady wins.", likes: 142, comments: 22, img: null },
  { user: "Neha A.", program: "Lean & Strong", time: "1d", text: "30 days of consistency. Energy levels are unreal.", likes: 56, comments: 8, img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=70&auto=format&fit=crop" },
];

// ===== COACH =====
export const coachKPIs = [
  { label: "Total Clients", value: "184", delta: "+12 this month" },
  { label: "Active Clients", value: "147", delta: "80% active" },
  { label: "Monthly Revenue", value: "₹14.6L", delta: "+18% MoM" },
  { label: "New Leads", value: "32", delta: "+8 this week" },
  { label: "Pending Check-ins", value: "11", delta: "Review today" },
  { label: "Upcoming Renewals", value: "7", delta: "Next 14 days" },
];

export const coachClients = [
  { name: "Rahul Mehta", program: "Lean Transformation 12W", goal: "Lose 8kg", join: "Jan 12, 2026", renew: "Apr 12, 2026", status: "Active" },
  { name: "Priya Sharma", program: "Fat Loss 16W", goal: "Lose 12kg", join: "Dec 02, 2025", renew: "Mar 24, 2026", status: "Active" },
  { name: "Karan Malhotra", program: "Strength Gain 24W", goal: "+8kg lean", join: "Nov 08, 2025", renew: "May 08, 2026", status: "Active" },
  { name: "Neha Arora", program: "Lean & Strong 12W", goal: "Body recomp", join: "Feb 01, 2026", renew: "May 01, 2026", status: "Active" },
  { name: "Aditya Singh", program: "Fat Loss 8W", goal: "Lose 6kg", join: "Feb 10, 2026", renew: "Apr 10, 2026", status: "Onboarding" },
  { name: "Meera Iyer", program: "Lean Transformation 12W", goal: "Lose 5kg", join: "Oct 15, 2025", renew: "Mar 15, 2026", status: "Renewal due" },
  { name: "Sahil Khanna", program: "Hybrid Athlete 16W", goal: "10K PR", join: "Jan 25, 2026", renew: "May 25, 2026", status: "Active" },
  { name: "Anjali Verma", program: "Fat Loss 12W", goal: "Lose 7kg", join: "Feb 18, 2026", renew: "May 18, 2026", status: "Active" },
];

export const coachCheckins = [
  { client: "Rahul Mehta", date: "Today", weight: "78.4kg", sleep: 8, mood: "Strong", energy: 9, status: "Pending" },
  { client: "Priya Sharma", date: "Today", weight: "64.2kg", sleep: 7, mood: "Tired", energy: 6, status: "Pending" },
  { client: "Karan Malhotra", date: "Yesterday", weight: "82.1kg", sleep: 7, mood: "Good", energy: 8, status: "Reviewed" },
  { client: "Neha Arora", date: "Yesterday", weight: "58.6kg", sleep: 8, mood: "Excellent", energy: 9, status: "Reviewed" },
];

export const coachRevenue = [
  { m: "Sep", r: 9.2 }, { m: "Oct", r: 10.4 }, { m: "Nov", r: 11.1 },
  { m: "Dec", r: 12.0 }, { m: "Jan", r: 13.2 }, { m: "Feb", r: 14.6 },
];

export const coachSignups = [
  { m: "Sep", n: 14 }, { m: "Oct", n: 18 }, { m: "Nov", n: 21 },
  { m: "Dec", n: 24 }, { m: "Jan", n: 28 }, { m: "Feb", n: 32 },
];
