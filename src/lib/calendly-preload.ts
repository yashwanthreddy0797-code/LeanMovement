const CALENDLY_ORIGINS = ["https://calendly.com", "https://assets.calendly.com"] as const;

/** DNS + TLS warmup so the booking iframe starts faster. */
export function preloadCalendly(): void {
  if (typeof document === "undefined") return;

  for (const href of CALENDLY_ORIGINS) {
    if (document.querySelector(`link[data-calendly-preconnect="${href}"]`)) continue;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    link.crossOrigin = "anonymous";
    link.setAttribute("data-calendly-preconnect", href);
    document.head.appendChild(link);

    const dns = document.createElement("link");
    dns.rel = "dns-prefetch";
    dns.href = href;
    document.head.appendChild(dns);
  }
}

/** Build the fast inline iframe src (no widget.js round-trip). */
export function calendlyEmbedSrc(bookingUrl: string, embedDomain?: string): string {
  try {
    const url = new URL(bookingUrl);
    url.searchParams.set("embed_type", "Inline");
    if (embedDomain) url.searchParams.set("embed_domain", embedDomain);
    // Hide landing chrome inside embeds — fewer assets, faster first paint.
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("hide_landing_page_details", "1");
    return url.toString();
  } catch {
    return bookingUrl;
  }
}
