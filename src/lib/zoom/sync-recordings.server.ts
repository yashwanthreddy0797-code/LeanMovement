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
  updated: number;
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
      updated: 0,
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
      updated: 0,
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
      updated: 0,
      skipped: 0,
      message: "No new Zoom cloud recordings found in the lookback window.",
    };
  }

  const ids = remote.map((r) => r.externalId);
  const { data: existing, error: existingError } = await admin
    .from("recordings")
    .select("id, external_id, video_url")
    .in("external_id", ids);

  if (existingError) {
    // Column may not exist yet - surface a clear migration hint.
    if (/external_id|column/i.test(existingError.message)) {
      return {
        ok: false,
        configured: true,
        scanned: remote.length,
        inserted: 0,
        updated: 0,
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
      updated: 0,
      skipped: 0,
      message: existingError.message,
    };
  }

  const existingByExternalId = new Map(
    (existing ?? [])
      .filter((row): row is { id: string; external_id: string; video_url: string } =>
        Boolean(row.external_id),
      )
      .map((row) => [row.external_id, row]),
  );
  const toInsert = remote.filter((r) => !existingByExternalId.has(r.externalId));
  const toRefresh = remote.filter((r) => {
    const row = existingByExternalId.get(r.externalId);
    return Boolean(row && row.video_url !== r.videoUrl);
  });
  const skipped = remote.length - toInsert.length - toRefresh.length;

  let updated = 0;
  for (const r of toRefresh) {
    const row = existingByExternalId.get(r.externalId);
    if (!row) continue;
    const { error: updateError } = await admin
      .from("recordings")
      .update({ video_url: r.videoUrl })
      .eq("id", row.id);
    if (updateError) {
      return {
        ok: false,
        configured: true,
        scanned: remote.length,
        inserted: 0,
        updated,
        skipped,
        message: updateError.message,
      };
    }
    updated += 1;
  }

  if (!toInsert.length) {
    const parts: string[] = [];
    if (updated > 0) {
      parts.push(`Updated passcode links on ${updated} recording(s).`);
    } else {
      parts.push("All Zoom recordings already in the portal.");
    }
    return {
      ok: true,
      configured: true,
      scanned: remote.length,
      inserted: 0,
      updated,
      skipped,
      message: parts.join(" "),
    };
  }

  const now = Date.now();
  const rows = toInsert.map((r) => {
    const recordedAt = r.recordedAt;
    // Members keep access for 7 days after the class.
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
      updated,
      skipped,
      message: insertError.message,
    };
  }

  const alreadyExpiredForMembers = rows.filter(
    (row) => new Date(row.expires_at).getTime() <= now,
  ).length;

  let message = `Added ${toInsert.length} Zoom recording(s) to the portal.`;
  if (updated > 0) {
    message += ` Updated passcode links on ${updated}.`;
  }
  if (alreadyExpiredForMembers > 0) {
    message += ` ${alreadyExpiredForMembers} are past the 7-day member window (coach can still preview).`;
  }

  return {
    ok: true,
    configured: true,
    scanned: remote.length,
    inserted: toInsert.length,
    updated,
    skipped,
    titles: toInsert.map((r) => r.title),
    message,
  };
}
