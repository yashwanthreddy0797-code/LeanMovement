#!/usr/bin/env node
/**
 * Applies supabase/fix-rls.sql when SUPABASE_DB_URL is set.
 * Get the connection string from Supabase → Project Settings → Database → Connection string (URI).
 *
 * Usage:
 *   SUPABASE_DB_URL="postgresql://postgres.[ref]:[password]@..." npm run supabase:fix-rls
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
const sqlPath = resolve(process.cwd(), "supabase/fix-rls.sql");

if (!dbUrl) {
  console.error("\n❌ SUPABASE_DB_URL not set.");
  console.error("   Option A: Add to .env from Supabase → Settings → Database → Connection string");
  console.error("   Option B: Paste supabase/fix-rls.sql into Supabase SQL Editor and Run\n");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("\n✓ fix-rls.sql applied successfully\n");
} catch (err) {
  console.error("\n❌ Failed to apply fix:", err.message);
  console.error("   Try running supabase/fix-rls.sql manually in the SQL Editor.\n");
  process.exit(1);
} finally {
  await client.end();
}
