#!/usr/bin/env node
/**
 * Creates the head coach account in Supabase (auth + profile + active membership).
 *
 * Usage:
 *   npm run supabase:create-coach
 *   COACH_EMAIL=you@email.com COACH_PASSWORD='YourPass123!' npm run supabase:create-coach
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
const email = (process.env.COACH_EMAIL ?? "coach@leanmovement.in").toLowerCase().trim();
const password = process.env.COACH_PASSWORD ?? "LeanCoach@2026";
const fullName = process.env.COACH_NAME ?? "Mohith Thotakura";

if (!url || !serviceKey) {
  console.error("❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("\nLean Kettlebell — Create coach account\n");

// Check if user already exists
const { data: listData, error: listError } = await admin.auth.admin.listUsers();
if (listError) {
  console.error("❌ Could not list users:", listError.message);
  process.exit(1);
}

const existing = listData.users.find((u) => u.email?.toLowerCase() === email);
let userId = existing?.id;

if (existing) {
  console.log(`ℹ User already exists: ${email}`);
} else {
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "coach" },
  });

  if (createError) {
    console.error("❌ Failed to create user:", createError.message);
    process.exit(1);
  }

  userId = created.user.id;
  console.log(`✓ Auth user created: ${email}`);
}

if (!userId) {
  console.error("❌ No user id");
  process.exit(1);
}

// Ensure profile is coach (trigger may have set member)
const { error: profileError } = await admin
  .from("profiles")
  .update({ role: "coach", full_name: fullName })
  .eq("id", userId);

if (profileError) {
  console.error("❌ Failed to update profile:", profileError.message);
  process.exit(1);
}
console.log("✓ Profile role set to coach");

// Activate membership — match live Lean Movement plan (₹6,969 / month)
const renews = new Date();
renews.setMonth(renews.getMonth() + 1);

const { error: membershipError } = await admin
  .from("memberships")
  .update({
    status: "active",
    plan: "monthly",
    amount_inr: 6969,
    started_at: new Date().toISOString(),
    renews_at: renews.toISOString(),
  })
  .eq("user_id", userId);

if (membershipError) {
  console.error("❌ Failed to activate membership:", membershipError.message);
  process.exit(1);
}
console.log("✓ Membership activated");

// Ensure onboarding row exists
await admin.from("onboarding").upsert({ user_id: userId });

console.log("\n────────────────────────────────────────");
console.log("  Coach login ready");
console.log("────────────────────────────────────────");
console.log(`  URL:      http://localhost:8080/portal/login`);
console.log(`  Email:    ${email}`);
console.log(`  Password: ${existing ? "(unchanged — use your existing password)" : password}`);
console.log("────────────────────────────────────────");
console.log("\n  After login you’ll land on /portal/coach\n");
if (!existing) {
  console.log("  ⚠ Change this password after first login (Supabase → Authentication → Users)\n");
}
