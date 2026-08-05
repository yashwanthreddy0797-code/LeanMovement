/**
 * Normalize recording URLs for the member portal player.
 * - YouTube / Vimeo → embed iframe src
 * - Zoom share/play → open externally (Zoom blocks most iframes)
 */

export type RecordingPlayerKind = "embed" | "external";

export function classifyRecordingUrl(raw: string): {
  kind: RecordingPlayerKind;
  src: string;
  label: string;
} {
  const url = raw.trim();
  if (!url) {
    return { kind: "external", src: "#", label: "Open recording" };
  }

  // Already an embed URL
  if (/youtube\.com\/embed\//i.test(url) || /player\.vimeo\.com\/video\//i.test(url)) {
    return { kind: "embed", src: url, label: "Watch" };
  }

  // youtu.be / watch?v=
  const ytWatch = url.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  const ytShort = url.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  const ytId = ytWatch?.[1] ?? ytShort?.[1];
  if (ytId) {
    return {
      kind: "embed",
      src: `https://www.youtube.com/embed/${ytId}`,
      label: "Watch",
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) {
    return {
      kind: "embed",
      src: `https://player.vimeo.com/video/${vimeo[1]}`,
      label: "Watch",
    };
  }

  if (/zoom\.us/i.test(url)) {
    return { kind: "external", src: url, label: "Watch on Zoom" };
  }

  // Unknown https - try embed; browsers will show blank if blocked
  if (/^https?:\/\//i.test(url)) {
    return { kind: "external", src: url, label: "Open recording" };
  }

  return { kind: "external", src: url, label: "Open recording" };
}
