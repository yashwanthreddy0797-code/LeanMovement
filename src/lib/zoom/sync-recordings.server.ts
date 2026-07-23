import type { SupabaseClient } from "@supabase/supabase-js";
import {
  fetchZoomCloudRecordings,
  isZoomConfigured,
  type SyncedZoomRecording,
} from "@/lib/zoom/recordings.server";

export type ZoomSyncResult = {
  ok: boolean;
  configured: boolean;
  scanned: number;
  inserted: number;
  skipped: number;
  message?: string;
  titles?: string[];
};

/**
 * Pull Zoom cloud recordings into `recordings`.
 * Dedupes on `external_id` (Zoom file id). Does not re-host MP4 files.
 */
export async function syncZoomRecordingsToPortal(
  admin: SupabaseClient,
  options?: { daysBack?: number },
): Promise<ZoomSyncResult> {
  if (!isZoomConfigured()) {
    return {
      ok: false,
      configured: false,
      scanned: 0,
      inserted: 0,
      skipped: 0,
      message:
        "Zoom env missing. Add ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_HOST_EMAIL.",
    };
  }

  let remote: SyncedZoomRecording[];
  try {
    remote = await fetchZoomCloudRecordings(options?.daysBack ?? 14);
  } catch (err) {
    return {
      ok: false,
      configured: true,
      scanned: 0,
      inserted: 0,
      skipped: 0,
      message: err instanceof Error ? err.message : "Zoom sync failed",
    };
  }

  if (!remote.length) {
    return {
      ok: true,
      configured: true,
      scanned: 0,
      inserted: 0,
      skipped: 0,
      message: "No new Zoom cloud recordings found in the lookback window.",
    };
  }

  const ids = remote.map((r) => r.externalId);
  const { data: existing, error: existingError } = await admin
    .from("recordings")
    .select("external_id")
    .in("external_id", ids);

  if (existingError) {
    // Column may not exist yet — surface a clear migration hint.
    if (/external_id|column/i.test(existingError.message)) {
      return {
        ok: false,
        configured: true,
        scanned: remote.length,
        inserted: 0,
        skipped: 0,
        message:
          "Run supabase/recordings-zoom-sync.sql in Supabase SQL Editor, then sync again.",
      };
    }
    return {
      ok: false,
      configured: true,
      scanned: remote.length,
      inserted: 0,
      skipped: 0,
      message: existingError.message,
    };
  }

  const have = new Set((existing ?? []).map((r) => r.external_id).filter(Boolean));
  const toInsert = remote.filter((r) => !have.has(r.externalId));
  const skipped = remote.length - toInsert.length;

  if (!toInsert.length) {
    return {
      ok: true,
      configured: true,
      scanned: remote.length,
      inserted: 0,
      skipped,
      message: "All Zoom recordings already in the portal.",
    };
  }

  const rows = toInsert.map((r) => {
    const recordedAt = r.recordedAt;
    const expiresAt = new Date(new Date(recordedAt).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    return {
      title: r.title,
      session_type: r.sessionType,
      video_url: r.videoUrl,
      duration: r.duration,
      recorded_at: recordedAt,
      expires_at: expiresAt,
      source: "zoom",
      external_id: r.externalId,
      meeting_id: r.meetingId || null,
    };
  });

  const { error: insertError } = await admin.from("recordings").insert(rows);
  if (insertError) {
    return {
      ok: false,
      configured: true,
      scanned: remote.length,
      inserted: 0,
      skipped,
      message: insertError.message,
    };
  }

  return {
    ok: true,
    configured: true,
    scanned: remote.length,
    inserted: toInsert.length,
    skipped,
    titles: toInsert.map((r) => r.title),
    message: `Added ${toInsert.length} Zoom recording(s) to the portal.`,
  };
}
