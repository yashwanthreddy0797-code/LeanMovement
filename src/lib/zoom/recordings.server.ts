/**
 * Zoom Server-to-Server OAuth + cloud recording sync.
 * Low-maintenance: stores Zoom share/play URLs in `recordings` (no MP4 hosting).
 */

type ZoomTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type ZoomRecordingFile = {
  id: string;
  recording_type?: string;
  file_type?: string;
  play_url?: string;
  download_url?: string;
  recording_start?: string;
  file_size?: number;
};

type ZoomMeetingRecording = {
  uuid?: string;
  id?: number | string;
  topic?: string;
  start_time?: string;
  duration?: number;
  share_url?: string;
  /** Splice into share_url / play_url as ?pwd= so members skip the passcode screen. */
  recording_play_passcode?: string;
  recording_files?: ZoomRecordingFile[];
};

type ZoomRecordingsResponse = {
  meetings?: ZoomMeetingRecording[];
  next_page_token?: string;
};

export type SyncedZoomRecording = {
  externalId: string;
  meetingId: string;
  title: string;
  sessionType: string;
  videoUrl: string;
  duration: string;
  recordedAt: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

function requireZoomEnv() {
  const accountId = process.env.ZOOM_ACCOUNT_ID?.trim();
  const clientId = process.env.ZOOM_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOOM_CLIENT_SECRET?.trim();
  const hostEmail = process.env.ZOOM_HOST_EMAIL?.trim();

  if (!accountId || !clientId || !clientSecret) {
    throw new Error(
      "Zoom not configured. Set ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET.",
    );
  }
  if (!hostEmail) {
    throw new Error("Set ZOOM_HOST_EMAIL to the Zoom account email that hosts live classes.");
  }

  return { accountId, clientId, clientSecret, hostEmail };
}

export function isZoomConfigured() {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID?.trim() &&
      process.env.ZOOM_CLIENT_ID?.trim() &&
      process.env.ZOOM_CLIENT_SECRET?.trim() &&
      process.env.ZOOM_HOST_EMAIL?.trim(),
  );
}

async function getZoomAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.value;
  }

  const { accountId, clientId, clientSecret } = requireZoomEnv();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = new URL("https://zoom.us/oauth/token");
  url.searchParams.set("grant_type", "account_credentials");
  url.searchParams.set("account_id", accountId);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Zoom OAuth failed (${res.status}): ${body.slice(0, 240)}`);
  }

  const json = (await res.json()) as ZoomTokenResponse;
  cachedToken = {
    value: json.access_token,
    expiresAt: now + json.expires_in * 1000,
  };
  return json.access_token;
}

function pickBestFile(files: ZoomRecordingFile[]): ZoomRecordingFile | null {
  const mp4 = files.filter((f) => (f.file_type ?? "").toUpperCase() === "MP4");
  if (!mp4.length) return null;

  const preferred = [
    "shared_screen_with_speaker_view",
    "shared_screen_with_gallery_view",
    "active_speaker",
    "gallery_view",
    "shared_screen",
  ];

  for (const type of preferred) {
    const match = mp4.find((f) => f.recording_type === type);
    if (match) return match;
  }
  return mp4[0] ?? null;
}

function sessionTypeFromStart(iso?: string): string {
  if (!iso) return "Live session";
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date(iso)),
  );
  if (hour < 12) return "Morning";
  return "Evening";
}

function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return "45 min";
  return `${minutes} min`;
}

function titleForMeeting(meeting: ZoomMeetingRecording): string {
  const topic = meeting.topic?.trim() || "Lean Kettlebell live session";
  if (!meeting.start_time) return topic;
  const date = new Date(meeting.start_time).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  return `${topic} — ${date}`;
}

function withRecordingPasscode(url: string, passcode?: string): string {
  const pwd = passcode?.trim();
  if (!pwd) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.get("pwd")) {
      parsed.searchParams.set("pwd", pwd);
    }
    return parsed.toString();
  } catch {
    // Fallback if Zoom returns a non-standard URL
    if (/[?&]pwd=/i.test(url)) return url;
    return `${url}${url.includes("?") ? "&" : "?"}pwd=${encodeURIComponent(pwd)}`;
  }
}

function playableUrl(meeting: ZoomMeetingRecording, file: ZoomRecordingFile): string | null {
  const share = meeting.share_url?.trim();
  if (share) return withRecordingPasscode(share, meeting.recording_play_passcode);
  const play = file.play_url?.trim();
  if (play) return withRecordingPasscode(play, meeting.recording_play_passcode);
  return null;
}

/** Fetch cloud recordings for the host user from Zoom (last N days). */
export async function fetchZoomCloudRecordings(daysBack = 14): Promise<SyncedZoomRecording[]> {
  const { hostEmail } = requireZoomEnv();
  const token = await getZoomAccessToken();

  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);

  const collected: SyncedZoomRecording[] = [];
  let nextPageToken = "";

  do {
    const url = new URL(
      `https://api.zoom.us/v2/users/${encodeURIComponent(hostEmail)}/recordings`,
    );
    url.searchParams.set("from", from.toISOString().slice(0, 10));
    url.searchParams.set("to", to.toISOString().slice(0, 10));
    url.searchParams.set("page_size", "30");
    if (nextPageToken) url.searchParams.set("next_page_token", nextPageToken);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Zoom recordings fetch failed (${res.status}): ${body.slice(0, 300)}`);
    }

    const json = (await res.json()) as ZoomRecordingsResponse;
    for (const meeting of json.meetings ?? []) {
      const file = pickBestFile(meeting.recording_files ?? []);
      if (!file?.id) continue;
      const videoUrl = playableUrl(meeting, file);
      if (!videoUrl) continue;

      collected.push({
        externalId: file.id,
        meetingId: String(meeting.uuid ?? meeting.id ?? ""),
        title: titleForMeeting(meeting),
        sessionType: sessionTypeFromStart(meeting.start_time ?? file.recording_start),
        videoUrl,
        duration: formatDuration(meeting.duration),
        recordedAt: meeting.start_time ?? file.recording_start ?? new Date().toISOString(),
      });
    }

    nextPageToken = json.next_page_token ?? "";
  } while (nextPageToken);

  return collected;
}
