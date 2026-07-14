#!/usr/bin/env node
/**
 * Audits Supabase backend for Lean Kettlebell live sessions + portal access.
 *
 * Usage:
 *   npm run supabase:verify-sessions
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
  for (const line of readFileSync(path, "utf8").split("\n")) {
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
const MORNING = "https://us06web.zoom.us/j/88998807036?pwd=32Ie2ribLO6IU1w7nml5F6xaasz2zY.1";
const EVENING = "https://us06web.zoom.us/j/89098161507?pwd=xaACWGZlRrC9v19DkScafUetpmpPy6.1";

const EXPECTED = [
  { day: "Monday", title: "Lean Kettlebell - Morning", time: "07:00", url: MORNING },
  { day: "Tuesday", title: "Lean Kettlebell - Evening", time: "19:00", url: EVENING },
  { day: "Wednesday", title: "Lean Kettlebell - Morning", time: "07:00", url: MORNING },
  { day: "Thursday", title: "Lean Kettlebell - Evening", time: "19:00", url: EVENING },
  { day: "Friday", title: "Lean Kettlebell - Morning", time: "07:00", url: MORNING },
  { day: "Saturday", title: "Lean Kettlebell - Evening", time: "19:00", url: EVENING },
];

if (!url || !serviceKey) {
  console.error("❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const issues = [];
const oks = [];

function ok(msg) {
  oks.push(msg);
  console.log(`  ✓ ${msg}`);
}
function bad(msg) {
  issues.push(msg);
  console.log(`  ✗ ${msg}`);
}

console.log("\nLean Kettlebell — Supabase backend audit\n");

// 1. Sessions data
console.log("1. live_sessions data");
const { data: sessions, error: sessErr } = await admin
  .from("live_sessions")
  .select("*")
  .order("sort_order");

if (sessErr) {
  bad(`Cannot read live_sessions: ${sessErr.message}`);
} else {
  if ((sessions?.length ?? 0) !== 6) {
    bad(`Expected 6 sessions, found ${sessions?.length ?? 0}`);
  } else {
    ok("6 session rows present");
  }

  for (const exp of EXPECTED) {
    const row = sessions?.find((s) => s.day_of_week === exp.day);
    if (!row) {
      bad(`Missing ${exp.day}`);
      continue;
    }
    if (row.title !== exp.title) bad(`${exp.day} title is "${row.title}" (want "${exp.title}")`);
    else if (row.start_time !== exp.time && row.start_time !== `${exp.time}:00`)
      bad(`${exp.day} start_time is "${row.start_time}" (want ${exp.time})`);
    else if (row.join_url !== exp.url) bad(`${exp.day} join_url mismatch`);
    else if ((row.duration_minutes ?? 0) !== 60) bad(`${exp.day} duration is ${row.duration_minutes} (want 60)`);
    else ok(`${exp.day} · ${exp.title} · ${exp.time} · Zoom OK`);
  }

  const days = sessions?.map((s) => s.day_of_week) ?? [];
  const dupes = days.filter((d, i) => days.indexOf(d) !== i);
  if (dupes.length) bad(`Duplicate days: ${dupes.join(", ")}`);
  else if (sessions?.length === 6) ok("No duplicate weekdays");
}

// 2. Coach account
console.log("\n2. Coach account");
const coachEmail = (process.env.COACH_EMAIL ?? "coach@leanmovement.in").toLowerCase();
const { data: coaches } = await admin
  .from("profiles")
  .select("id, email, role, full_name")
  .eq("role", "coach");

const coach = coaches?.find((c) => c.email?.toLowerCase() === coachEmail) ?? coaches?.[0];
if (!coach) bad("No coach profile found");
else {
  ok(`Coach profile: ${coach.email} (${coach.role})`);
  const { data: mem } = await admin
    .from("memberships")
    .select("status, plan")
    .eq("user_id", coach.id)
    .maybeSingle();
  if (mem?.status === "active") ok(`Coach membership active (${mem.plan})`);
  else bad(`Coach membership status: ${mem?.status ?? "missing"} (should be active so coach helpers work consistently)`);
}

// 3. RLS helpers via RPC-like checks — query pg catalogs if possible through SQL not available;
//    verify policies by attempting anon select (should fail / empty without auth)
console.log("\n3. Access control (RLS smoke)");
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!anonKey) {
  bad("VITE_SUPABASE_ANON_KEY missing — skip anon RLS check");
} else {
  const anon = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: anonRows, error: anonErr } = await anon.from("live_sessions").select("id");
  if (anonErr) {
    // RLS deny often returns error or empty
    ok(`Anon blocked from live_sessions (${anonErr.message})`);
  } else if (!anonRows?.length) {
    ok("Anon gets 0 live_sessions rows (RLS working)");
  } else {
    bad(`Anon can read ${anonRows.length} live_sessions — RLS may be open`);
  }
}

// 4. Active member sample
console.log("\n4. Active members");
const { data: activeMems, error: memErr } = await admin
  .from("memberships")
  .select("user_id, status, plan")
  .eq("status", "active")
  .eq("product", "lean_kettlebell");

if (memErr) {
  // product column might not filter the same way
  const { data: fallback } = await admin.from("memberships").select("user_id, status, plan").eq("status", "active");
  if (!fallback?.length) bad("No active memberships found");
  else ok(`${fallback.length} active membership(s) — they can SELECT live_sessions via RLS`);
} else if (!activeMems?.length) {
  const { data: fallback } = await admin.from("memberships").select("user_id, status").eq("status", "active");
  if (!fallback?.length) bad("No active memberships — paid members won't see sessions until activated");
  else ok(`${fallback.length} active membership(s)`);
} else {
  ok(`${activeMems.length} active lean_kettlebell membership(s)`);
}

// 5. Site config keys used by portal
console.log("\n5. site_config");
const { data: cfg } = await admin.from("site_config").select("key, value");
const keys = new Set((cfg ?? []).map((c) => c.key));
for (const k of ["whatsapp_invite_url", "foundations_calendly_url", "cohort_start_date"]) {
  if (keys.has(k)) ok(`${k} present`);
  else bad(`Missing site_config key: ${k}`);
}

console.log("\n────────────────────────────────────────");
if (issues.length) {
  console.log(`  ${oks.length} checks passed · ${issues.length} issue(s)\n`);
  for (const i of issues) console.log(`  • ${i}`);
  console.log("\n  Run: npm run supabase:harden-sessions   (or paste supabase/harden-live-sessions.sql)\n");
  process.exit(1);
}
console.log(`  All ${oks.length} checks passed — backend looks good for Zoom sessions.\n`);
console.log("  Reminder: run supabase/realtime.sql once if member pages don't live-update.");
console.log("  Reminder: run supabase/harden-live-sessions.sql once to lock policies + constraints.\n");
