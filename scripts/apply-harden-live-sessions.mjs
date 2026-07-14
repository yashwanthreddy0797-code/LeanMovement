#!/usr/bin/env node
/**
 * Applies supabase/harden-live-sessions.sql
 *
 * Prefers SUPABASE_DB_URL / DATABASE_URL. If missing, prints SQL Editor instructions.
 *
 * Usage:
 *   npm run supabase:harden-sessions
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
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

const dbUrl = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL;
const sqlPath = resolve(process.cwd(), "supabase/harden-live-sessions.sql");
const sql = readFileSync(sqlPath, "utf8");

if (!dbUrl) {
  console.error("\n❌ SUPABASE_DB_URL not set.");
  console.error("   Paste supabase/harden-live-sessions.sql into Supabase → SQL Editor → Run\n");
  process.exit(1);
}

const { default: pg } = await import("pg");
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  await client.query(sql);
  console.log("\n✓ harden-live-sessions.sql applied\n");
} catch (err) {
  console.error("\n❌ Failed:", err.message);
  console.error("   Paste supabase/harden-live-sessions.sql into Supabase SQL Editor instead.\n");
  process.exit(1);
} finally {
  await client.end();
}
