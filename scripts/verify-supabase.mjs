#!/usr/bin/env node
/**
 * Verifies Supabase env vars and API connectivity.
 * Usage: npm run supabase:verify
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) {
    console.error("❌ No .env file found. Copy .env.example → .env and fill in Supabase keys.");
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
const anon = process.env.VITE_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("\nLean Kettlebell — Supabase check\n");

if (!url || url.includes("your-project")) {
  console.error("❌ VITE_SUPABASE_URL missing or placeholder");
  process.exit(1);
}
if (!anon || anon.includes("your-anon")) {
  console.error("❌ VITE_SUPABASE_ANON_KEY missing or placeholder");
  process.exit(1);
}

console.log("✓ VITE_SUPABASE_URL set");
console.log("✓ VITE_SUPABASE_ANON_KEY set");
console.log(service ? "✓ SUPABASE_SERVICE_ROLE_KEY set" : "⚠ SUPABASE_SERVICE_ROLE_KEY not set (needed for webhooks)");

const res = await fetch(`${url}/rest/v1/live_sessions?select=day_of_week&limit=1`, {
  headers: {
    apikey: service ?? anon,
    Authorization: `Bearer ${service ?? anon}`,
  },
});

if (!res.ok) {
  const body = await res.text();
  console.error(`\n❌ API request failed (${res.status})`);
  console.error("   Did you run supabase/schema.sql in the SQL Editor?");
  console.error(body.slice(0, 200));
  process.exit(1);
}

const data = await res.json();
console.log(`\n✓ Connected — live_sessions reachable (${data.length} row sample)`);

const enrollmentCheck = await fetch(
  `${url}/rest/v1/enrollment_intents?select=id&limit=1`,
  {
    headers: {
      apikey: service ?? anon,
      Authorization: `Bearer ${service ?? anon}`,
    },
  },
);
if (!enrollmentCheck.ok) {
  const body = await enrollmentCheck.text();
  if (body.includes("enrollment_intents") || body.includes("PGRST205")) {
    console.error("\n❌ enrollment_intents table missing — /join enrollment will fail.");
    console.error("   Run supabase/enrollment-intents.sql in Supabase SQL Editor");
    console.error("   Or: npm run supabase:enrollment (needs SUPABASE_DB_URL in .env)\n");
    process.exit(1);
  }
} else {
  console.log("✓ enrollment_intents table exists");
}

// Anon key must not hit RLS recursion (profiles policies)
const rlsCheck = await fetch(`${url}/rest/v1/profiles?select=id&limit=1`, {
  headers: { apikey: anon, Authorization: `Bearer ${anon}` },
});
if (!rlsCheck.ok) {
  const body = await rlsCheck.text();
  if (body.includes("infinite recursion") || body.includes("42P17")) {
    console.error("\n❌ RLS policy recursion on profiles — portal auth will break.");
    console.error("   Run supabase/fix-rls.sql in Supabase SQL Editor, then re-run this check.");
    process.exit(1);
  }
  console.warn(`\n⚠ profiles anon check returned ${rlsCheck.status} (expected for locked-down RLS)`);
} else {
  console.log("✓ RLS policies OK (no recursion on profiles)");
}

console.log("\nNext: npm run dev → /portal/signup → set role=coach in profiles table\n");
