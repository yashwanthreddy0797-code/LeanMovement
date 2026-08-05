import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { MemberIntake } from "@/lib/supabase/types";

const intakeSchema = z.object({
  userId: z.string().uuid(),
  full_name: z.string().trim().min(1).max(120),
  age: z.coerce.number().int().min(13).max(99).optional().nullable(),
  height: z.string().trim().max(40).optional().nullable(),
  weight: z.string().trim().max(40).optional().nullable(),
  occupation: z.string().trim().max(120).optional().nullable(),
  goal: z.string().trim().min(1).max(500),
  biggest_struggle: z.string().trim().max(500).optional().nullable(),
  training_experience: z.enum([
    "Complete beginner",
    "Less than 1 year",
    "1–3 years",
    "3+ years",
  ] as const),
  training_days_per_week: z.enum(["2 days", "3 days", "4 days", "5 days", "6+ days"] as const),
  why_now: z.string().trim().max(500).optional().nullable(),
  instagram_handle: z.string().trim().max(80).optional().nullable(),
  phone: z.string().trim().max(40).optional().nullable(),
});

export type MemberIntakeInput = z.infer<typeof intakeSchema>;

function normalizeInstagram(handle: string | null | undefined) {
  if (!handle) return null;
  const trimmed = handle.trim().replace(/^@/, "");
  return trimmed || null;
}

export const getMemberIntake = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, intake: null as MemberIntake | null };

    const { data: row, error } = await admin
      .from("member_intake")
      .select("*")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (error) {
      if (/member_intake|relation|schema/i.test(error.message)) {
        return { ok: false as const, intake: null, needsMigration: true as const };
      }
      return { ok: false as const, intake: null, message: error.message };
    }

    return { ok: true as const, intake: (row as MemberIntake | null) ?? null };
  });

export const submitMemberIntake = createServerFn({ method: "POST" })
  .inputValidator(intakeSchema)
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) {
      return { ok: false as const, message: "Server not configured" };
    }

    const now = new Date().toISOString();
    const row = {
      user_id: data.userId,
      full_name: data.full_name,
      age: data.age ?? null,
      height: data.height?.trim() || null,
      weight: data.weight?.trim() || null,
      occupation: data.occupation?.trim() || null,
      goal: data.goal,
      biggest_struggle: data.biggest_struggle?.trim() || null,
      training_experience: data.training_experience,
      training_days_per_week: data.training_days_per_week,
      why_now: data.why_now?.trim() || null,
      instagram_handle: normalizeInstagram(data.instagram_handle),
      phone: data.phone?.trim() || null,
      completed_at: now,
      updated_at: now,
    };

    const { error } = await admin.from("member_intake").upsert(row, { onConflict: "user_id" });

    if (error) {
      if (/member_intake|relation|schema/i.test(error.message)) {
        return {
          ok: false as const,
          message: "Run supabase/member-intake.sql in Supabase SQL Editor, then try again.",
        };
      }
      return { ok: false as const, message: error.message };
    }

    return { ok: true as const };
  });

export const coachListMemberIntakes = createServerFn({ method: "GET" })
  .inputValidator(z.object({ coachId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, intakes: [] as MemberIntake[] };

    const { data: coach } = await admin
      .from("profiles")
      .select("role")
      .eq("id", data.coachId)
      .maybeSingle();

    if (!coach || (coach.role !== "coach" && coach.role !== "admin")) {
      return { ok: false as const, intakes: [] as MemberIntake[] };
    }

    const { data: rows, error } = await admin
      .from("member_intake")
      .select("*")
      .order("completed_at", { ascending: false });

    if (error) {
      return { ok: false as const, intakes: [] as MemberIntake[], message: error.message };
    }

    return { ok: true as const, intakes: (rows ?? []) as MemberIntake[] };
  });
