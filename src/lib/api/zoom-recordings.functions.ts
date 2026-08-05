import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { accessTokenSchema } from "@/lib/api/auth-input";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { authErrorMessage, requireCoachCaller } from "@/lib/supabase/server-auth";
import { syncZoomRecordingsToPortal } from "@/lib/zoom/sync-recordings.server";
import { isZoomConfigured } from "@/lib/zoom/recordings.server";

export const getZoomSyncStatus = createServerFn({ method: "GET" }).handler(async () => {
  return { configured: isZoomConfigured() };
});

export const coachSyncZoomRecordings = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      accessToken: accessTokenSchema,
      coachId: z.string().uuid(),
      daysBack: z.number().int().min(1).max(60).optional(),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const { admin } = await requireCoachCaller(data.accessToken, data.coachId);
      return syncZoomRecordingsToPortal(admin, { daysBack: data.daysBack ?? 14 });
    } catch (err) {
      return { ok: false as const, message: authErrorMessage(err) };
    }
  });
