/** Placeholder from early seed - never treat as a real booking link. */
const PLACEHOLDER_HOSTS = new Set(["calendly.com/apex-coaching", "calendly.com/demo"]);

/**
 * Returns a usable Calendly event URL, or "" if missing / still a placeholder.
 * Accepts full event links like https://calendly.com/coach/foundations
 */
export function normalizeCalendlyUrl(raw?: string | null): string {
  const value = (raw ?? "").trim();
  if (!value) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(withProtocol);
    if (!/(^|\.)calendly\.com$/i.test(url.hostname)) return "";

    const pathKey = `${url.hostname.replace(/^www\./i, "")}${url.pathname}`.replace(/\/+$/, "");
    if (PLACEHOLDER_HOSTS.has(pathKey.toLowerCase())) return "";

    // Need at least /username or /username/event
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 1) return "";

    return url.toString();
  } catch {
    return "";
  }
}

export function isCalendlyUrlConfigured(raw?: string | null): boolean {
  return Boolean(normalizeCalendlyUrl(raw));
}
