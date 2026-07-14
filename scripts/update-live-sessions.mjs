#!/usr/bin/env node
/**
 * Replaces live_sessions with Morning (Mon/Wed/Fri) + Evening (Tue/Thu/Sat) Zoom links.
 *
 * Usage:
 *   npm run supabase:update-sessions
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) {
    console.error("❌ No .env file found.");
    process.exit(1);
  }
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env");
  console.error("   Or paste supabase/update-live-sessions.sql into Supabase SQL Editor.\n");
  process.exit(1);
}

const MORNING =
  "https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1";
const EVENING =
  "https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1";

const sessions = [
  {
    day_of_week: "Monday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING,
    sort_order: 1,
  },
  {
    day_of_week: "Tuesday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING,
    sort_order: 2,
  },
  {
    day_of_week: "Wednesday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING,
    sort_order: 3,
  },
  {
    day_of_week: "Thursday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING,
    sort_order: 4,
  },
  {
    day_of_week: "Friday",
    title: "Lean Kettlebell - Morning",
    session_type: "Morning",
    focus: null,
    start_time: "07:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: MORNING,
    sort_order: 5,
  },
  {
    day_of_week: "Saturday",
    title: "Lean Kettlebell - Evening",
    session_type: "Evening",
    focus: null,
    start_time: "19:00",
    timezone: "Asia/Kolkata",
    duration_minutes: 60,
    join_url: EVENING,
    sort_order: 6,
  },
];

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("\nLean Kettlebell — Update live sessions\n");

const { error: delError } = await admin.from("live_sessions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
if (delError) {
  console.error("❌ Failed to clear live_sessions:", delError.message);
  process.exit(1);
}
console.log("✓ Cleared old sessions");

const { data, error: insError } = await admin.from("live_sessions").insert(sessions).select("day_of_week, title, start_time");
if (insError) {
  console.error("❌ Failed to insert sessions:", insError.message);
  process.exit(1);
}

console.log(`✓ Inserted ${data?.length ?? sessions.length} sessions:\n`);
for (const s of data ?? sessions) {
  console.log(`  · ${s.day_of_week.padEnd(10)} ${s.title} @ ${s.start_time}`);
}
console.log("\n  Coach + members will see Zoom join links on Live Schedule.\n");
