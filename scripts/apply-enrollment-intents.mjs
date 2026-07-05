#!/usr/bin/env node
/**
 * Applies supabase/enrollment-intents.sql when SUPABASE_DB_URL is set.
 * Get the connection string from Supabase → Project Settings → Database → Connection string (URI).
 *
 * Usage:
 *   SUPABASE_DB_URL="postgresql://postgres.[ref]:[password]@..." npm run supabase:enrollment
 *
 * Or paste supabase/enrollment-intents.sql into Supabase → SQL Editor → Run
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import pg from "pg";

const { Client } = pg;

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
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

const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
const sqlPath = resolve(process.cwd(), "supabase/enrollment-intents.sql");

if (!dbUrl) {
  console.error("\n❌ SUPABASE_DB_URL not set in .env");
  console.error("\n   Quick fix (2 min):");
  console.error("   1. Open https://supabase.com/dashboard/project/owuzcjyizzuhzeomhvep/sql/new");
  console.error("   2. Paste the contents of supabase/enrollment-intents.sql");
  console.error("   3. Click Run");
  console.error("\n   Then retry Submit enrollment on /join\n");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("\n✓ enrollment-intents.sql applied successfully");
  console.log("  Retry Submit enrollment on http://localhost:8080/join\n");
} catch (err) {
  console.error("\n❌ Failed to apply migration:", err.message);
  console.error("   Run supabase/enrollment-intents.sql manually in the SQL Editor.\n");
  process.exit(1);
} finally {
  await client.end();
}
