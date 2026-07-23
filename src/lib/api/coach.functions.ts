import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { MembershipPlan } from "@/lib/supabase/types";

const planSchema = z.enum(["monthly", "quarterly", "founding"]);

async function verifyCoach(coachId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Server not configured");

  const { data, error } = await admin
    .from("profiles")
    .select("role")
    .eq("id", coachId)
    .maybeSingle();

  if (error || !data || (data.role !== "coach" && data.role !== "admin")) {
    throw new Error("Coach access required");
  }
  return admin;
}

function planAmount(_plan: MembershipPlan) {
  return 6999;
}

function renewalDate(plan: MembershipPlan) {
  const d = new Date();
  d.setDate(d.getDate() + (plan === "quarterly" ? 90 : 30));
  return d.toISOString();
}

export const coachUpdateMemberStatus = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      memberId: z.string().uuid(),
      status: z.enum(["pending", "active", "past_due", "cancelled", "expired"]),
      plan: planSchema.optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);

    const updates: Record<string, unknown> = { status: data.status };

    if (data.status === "active") {
      const { data: existing } = await admin
        .from("memberships")
        .select("plan")
        .eq("user_id", data.memberId)
        .maybeSingle();

      const plan = data.plan ?? (existing?.plan as MembershipPlan | undefined) ?? "monthly";
      updates.plan = plan;
      updates.amount_inr = planAmount(plan);
      updates.started_at = new Date().toISOString();
      updates.renews_at = renewalDate(plan);
    }

    const { error } = await admin
      .from("memberships")
      .update(updates)
      .eq("user_id", data.memberId);

    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachUpdateOnboarding = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      memberId: z.string().uuid(),
      foundationsBooked: z.boolean().optional(),
      foundationsCompleted: z.boolean().optional(),
      whatsappJoined: z.boolean().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);

    const { data: row } = await admin
      .from("onboarding")
      .select("*")
      .eq("user_id", data.memberId)
      .maybeSingle();

    const updates: Record<string, unknown> = {};

    if (data.foundationsBooked !== undefined) {
      updates.foundations_booked_at = data.foundationsBooked
        ? row?.foundations_booked_at ?? new Date().toISOString()
        : null;
    }
    if (data.foundationsCompleted !== undefined) {
      updates.foundations_completed_at = data.foundationsCompleted
        ? row?.foundations_completed_at ?? new Date().toISOString()
        : null;
      if (data.foundationsCompleted && !updates.foundations_booked_at && !row?.foundations_booked_at) {
        updates.foundations_booked_at = new Date().toISOString();
      }
    }
    if (data.whatsappJoined !== undefined) {
      updates.whatsapp_joined = data.whatsappJoined;
    }

    const { error } = await admin.from("onboarding").update(updates).eq("user_id", data.memberId);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachUpdateSiteConfig = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      key: z.string().min(1),
      value: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const { error } = await admin
      .from("site_config")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachUpdateLiveSession = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      sessionId: z.string().uuid(),
      joinUrl: z.string().url(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const { error } = await admin
      .from("live_sessions")
      .update({ join_url: data.joinUrl })
      .eq("id", data.sessionId);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachAddRecording = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      title: z.string().min(1),
      sessionType: z.string().min(1),
      videoUrl: z.string().url(),
      duration: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const { error } = await admin.from("recordings").insert({
      title: data.title,
      session_type: data.sessionType,
      video_url: data.videoUrl,
      duration: data.duration ?? "45 min",
      recorded_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });

export const coachDeleteRecording = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      recordingId: z.string().uuid(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    const { error } = await admin.from("recordings").delete().eq("id", data.recordingId);
    if (error) return { ok: false as const, message: error.message };
    return { ok: true as const };
  });
