import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { syncZoomRecordingsToPortal } from "@/lib/zoom/sync-recordings.server";
import { isZoomConfigured } from "@/lib/zoom/recordings.server";

async function verifyCoach(coachId: string) {
  const admin = getSupabaseAdmin();
  if (!admin) throw new Error("Server not configured");
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role")
    .eq("id", coachId)
    .maybeSingle();
  if (!profile || (profile.role !== "coach" && profile.role !== "admin")) {
    throw new Error("Coach access required");
  }
  return admin;
}

export const getZoomSyncStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { configured: isZoomConfigured() };
});

export const coachSyncZoomRecordings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      coachId: z.string().uuid(),
      daysBack: z.number().int().min(1).max(60).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const admin = await verifyCoach(data.coachId);
    return syncZoomRecordingsToPortal(admin, { daysBack: data.daysBack ?? 14 });
  });
