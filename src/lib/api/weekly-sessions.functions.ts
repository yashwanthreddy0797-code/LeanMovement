import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getEnrollmentFromSiteConfig, saveEnrollmentToSiteConfig } from "@/lib/enrollment/store";
import {
  SESSIONS_TO_PICK,
  SESSION_SLOTS,
  DEFAULT_SESSION_IDS,
  formatWeekRange,
  getWeekStartDate,
  joinUrlForSlot,
  slotLiveState,
  validateSessionSelection,
} from "@/lib/sessions";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { LiveSessionRow } from "@/lib/supabase/types";

const sessionIdSchema = z.string().refine(
  (id) => SESSION_SLOTS.some((slot) => slot.id === id),
  "Invalid session slot",
);

async function fetchLiveSessions(admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>) {
  const { data } = await admin.from("live_sessions").select("*").order("sort_order");
  return (data ?? []) as LiveSessionRow[];
}

export const getMemberWeeklySessions = createServerFn({ method: "GET" })
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const weekStart = getWeekStartDate();
    const liveSessions = await fetchLiveSessions(admin);

    const [{ data: picks, error: picksError }, { data: attendance, error: attendanceError }] =
      await Promise.all([
      admin
        .from("member_weekly_picks")
        .select("session_ids, updated_at")
        .eq("user_id", data.userId)
        .eq("week_start", weekStart)
        .maybeSingle(),
      admin
        .from("session_attendance")
        .select("session_slot_id, attended_at")
        .eq("user_id", data.userId)
        .eq("week_start", weekStart),
    ]);

    let pickedIds = picks?.session_ids ?? [];
    let updatedAt = picks?.updated_at ?? null;

    if (picksError?.code === "PGRST205" || picksError?.message?.includes("member_weekly_picks")) {
      const { data: onboarding } = await admin
        .from("onboarding")
        .select("session_ids, sessions_selected_at")
        .eq("user_id", data.userId)
        .maybeSingle();
      pickedIds = onboarding?.session_ids ?? [];
      updatedAt = onboarding?.sessions_selected_at ?? null;
    }

    if (!pickedIds.length) {
      const now = new Date().toISOString();
      pickedIds = [...DEFAULT_SESSION_IDS];
      await admin.from("member_weekly_picks").upsert(
        {
          user_id: data.userId,
          week_start: weekStart,
          session_ids: pickedIds,
          updated_at: now,
        },
        { onConflict: "user_id,week_start" },
      );
      await admin.from("onboarding").upsert({
        user_id: data.userId,
        session_ids: pickedIds,
        sessions_selected_at: now,
      });
      updatedAt = now;
    }

    const attended =
      attendanceError?.code === "PGRST205"
        ? []
        : (attendance ?? []).map((row) => ({
            slotId: row.session_slot_id,
            attendedAt: row.attended_at,
          }));
    const attendedSlotIds = attended.map((row) => row.slotId);

    const slots = pickedIds.map((slotId) => {
      const slot = SESSION_SLOTS.find((item) => item.id === slotId);
      const joinUrl = joinUrlForSlot(slotId, liveSessions);
      const live = slotLiveState(slotId, weekStart);
      return {
        slotId,
        day: slot?.day ?? "",
        focus: slot?.focus ?? "",
        timeLabel: slot?.timeLabel ?? "",
        brief: slot?.brief ?? "",
        joinUrl,
        liveState: live,
        attended: attendedSlotIds.includes(slotId),
        attendedAt: attended.find((row) => row.slotId === slotId)?.attendedAt ?? null,
      };
    });

    return {
      ok: true as const,
      weekStart,
      weekLabel: formatWeekRange(weekStart),
      pickedIds,
      attendedSlotIds,
      attended,
      slots,
      picksComplete: pickedIds.length === SESSIONS_TO_PICK,
      attendedCount: attendedSlotIds.length,
      updatedAt,
    };
  });

export const saveMemberWeeklySessions = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      sessionIds: z.array(sessionIdSchema).length(SESSIONS_TO_PICK),
    }),
  )
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const weekStart = getWeekStartDate();

    const { data: attendance } = await admin
      .from("session_attendance")
      .select("session_slot_id")
      .eq("user_id", data.userId)
      .eq("week_start", weekStart);

    const attendedSlotIds = (attendance ?? []).map((row) => row.session_slot_id);
    const validation = validateSessionSelection(data.sessionIds, attendedSlotIds);
    if (!validation.ok) {
      return { ok: false as const, message: validation.message };
    }

    const { data: membership } = await admin
      .from("memberships")
      .select("status")
      .eq("user_id", data.userId)
      .maybeSingle();

    if (!membership || membership.status !== "active") {
      return { ok: false as const, message: "Active membership required" };
    }

    const now = new Date().toISOString();
    const sessionIds = [...new Set(data.sessionIds)];

    const { error } = await admin.from("member_weekly_picks").upsert(
      {
        user_id: data.userId,
        week_start: weekStart,
        session_ids: sessionIds,
        updated_at: now,
      },
      { onConflict: "user_id,week_start" },
    );

    if (error) return { ok: false as const, message: error.message };

    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name")
      .eq("id", data.userId)
      .maybeSingle();

    await admin.from("onboarding").upsert({
      user_id: data.userId,
      session_ids: sessionIds,
      sessions_selected_at: now,
    });

    if (profile?.email) {
      const config = await getEnrollmentFromSiteConfig(admin, profile.email);
      if (config) {
        await saveEnrollmentToSiteConfig(admin, {
          ...config,
          session_ids: sessionIds,
          updated_at: now,
        });
      }
    }

    return { ok: true as const, sessionIds, weekStart };
  });

export const recordSessionJoin = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      userId: z.string().uuid(),
      sessionSlotId: sessionIdSchema,
    }),
  )
  .handler(async ({ data }) => {
    const admin = getSupabaseAdmin();
    if (!admin) return { ok: false as const, message: "Server not configured" };

    const weekStart = getWeekStartDate();

    const { data: picks } = await admin
      .from("member_weekly_picks")
      .select("session_ids")
      .eq("user_id", data.userId)
      .eq("week_start", weekStart)
      .maybeSingle();

    const pickedIds = picks?.session_ids ?? [];
    if (!pickedIds.includes(data.sessionSlotId)) {
      return { ok: false as const, message: "This session is not in your weekly picks" };
    }

    const slot = SESSION_SLOTS.find((item) => item.id === data.sessionSlotId);
    if (!slot) return { ok: false as const, message: "Invalid session" };

    const { data: existingAttendance } = await admin
      .from("session_attendance")
      .select("session_slot_id")
      .eq("user_id", data.userId)
      .eq("week_start", weekStart);

    const attendedSlotIds = (existingAttendance ?? []).map((row) => row.session_slot_id);
    const attendedFocuses = new Set(
      attendedSlotIds
        .map((id) => SESSION_SLOTS.find((item) => item.id === id)?.focus)
        .filter(Boolean),
    );

    if (attendedFocuses.has(slot.focus) && !attendedSlotIds.includes(data.sessionSlotId)) {
      return {
        ok: false as const,
        message: `You already attended ${slot.focus} this week.`,
      };
    }

    const now = new Date().toISOString();
    const { error } = await admin.from("session_attendance").upsert(
      {
        user_id: data.userId,
        week_start: weekStart,
        session_slot_id: data.sessionSlotId,
        attended_at: now,
      },
      { onConflict: "user_id,week_start,session_slot_id" },
    );

    if (error) return { ok: false as const, message: error.message };

    return { ok: true as const, attendedAt: now };
  });

/** Legacy alias — first-time save after payment. */
export { saveMemberWeeklySessions as saveMemberSessionPicks };
