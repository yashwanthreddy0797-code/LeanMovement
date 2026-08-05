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

/** Site config first, then optional VITE_CALENDLY_ONBOARDING_URL fallback. */
export function resolveOnboardingCalendlyUrl(siteConfigUrl?: string | null): string {
  const fromSite = normalizeCalendlyUrl(siteConfigUrl);
  if (fromSite) return fromSite;
  const envUrl = import.meta.env.VITE_CALENDLY_ONBOARDING_URL as string | undefined;
  return normalizeCalendlyUrl(envUrl);
}

export function calendlyUrlWithPrefill(
  baseUrl: string,
  prefill: { name?: string; email?: string; phone?: string },
): string {
  try {
    const url = new URL(baseUrl);
    if (prefill.name) url.searchParams.set("name", prefill.name);
    if (prefill.email) url.searchParams.set("email", prefill.email);
    const digits = prefill.phone?.replace(/\D/g, "");
    if (digits) url.searchParams.set("a1", prefill.phone!);
    return url.toString();
  } catch {
    return baseUrl;
  }
}
