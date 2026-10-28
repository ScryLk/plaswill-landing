/** Public ingestion configuration only. Never read or expose a personal API key here. */
export type AnalyticsConfig = {
  enabled: true;
  token: string;
  host: string;
  siteHost: string;
  environment: "production" | "staging";
};

export function publicAnalyticsConfig(env: Record<string, string | undefined>): AnalyticsConfig | null {
  const host = env.POSTHOG_INGESTION_HOST;
  const siteHost = env.POSTHOG_SITE_HOST;
  const environment = env.POSTHOG_ENVIRONMENT;
  if (env.POSTHOG_ENABLED !== "true" || !/^phc_[A-Za-z0-9_-]+$/.test(env.POSTHOG_PROJECT_TOKEN ?? "")) return null;
  if (host !== "https://us.i.posthog.com" && host !== "https://eu.i.posthog.com") return null;
  if (!siteHost || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(siteHost)) return null;
  if (environment !== "production" && environment !== "staging") return null;
  return { enabled: true, token: env.POSTHOG_PROJECT_TOKEN!, host, siteHost, environment };
}

export const analyticsEvents = [
  "$pageview", "product_details_opened", "sample_request_started", "quote_cta_clicked",
  "whatsapp_click", "phone_click", "email_click", "quote_form_started",
  "quote_validation_attempted", "quote_whatsapp_open_attempted",
] as const;
export type AnalyticsEvent = (typeof analyticsEvents)[number];

const properties = new Set([
  "token", "distinct_id", "$device_id", "$session_id", "$window_id", "$lib", "$lib_version",
  "$browser", "$browser_version", "$os", "$os_version", "$device_type", "$is_identified",
  "site_host", "environment", "schema_version", "page_path", "section", "product_id",
  "product_category", "valid", "utm_source", "utm_medium", "utm_campaign", "traffic_source",
]);

/** A final allowlist also removes SDK-generated URLs, titles, referrers and person properties. */
export function sanitizeAnalyticsEvent<T extends { event: string; properties: Record<string, unknown> }>(event: T): T | null {
  if (!(analyticsEvents as readonly string[]).includes(event.event)) return null;
  const safe = { ...event };
  // The SDK can attach person updates at the top level as well as in properties.
  for (const key of ["$set", "$set_once", "$unset"]) delete (safe as Record<string, unknown>)[key];
  return {
    ...safe,
    properties: {
      ...Object.fromEntries(Object.entries(event.properties).filter(([key, value]) =>
        properties.has(key) && (typeof value === "string" || typeof value === "boolean" || typeof value === "number"))),
      $process_person_profile: false,
    },
  };
}

/** Campaign labels must be non-personal short codes, never user data. */
export function campaignCode(value: string | null): string | undefined {
  return value && /^[a-zA-Z][a-zA-Z0-9_.-]{0,63}$/.test(value) && !/\d{6}/.test(value) ? value : undefined;
}

export function trafficSource(referrer: string, siteHost: string): string {
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname;
    if (host === siteHost) return "internal";
    for (const [domain, source] of [
      ["google.com", "google"], ["google.com.br", "google"], ["bing.com", "bing"],
      ["instagram.com", "instagram"], ["facebook.com", "facebook"], ["linkedin.com", "linkedin"],
    ]) if (host === domain || host.endsWith(`.${domain}`)) return source;
    return "other";
  } catch { return "other"; }
}
