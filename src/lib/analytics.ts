import type { PostHog } from "posthog-js";

import { products } from "@/content/site";
import { newsPosts } from "@/content/news";
import {
  campaignCode, sanitizeAnalyticsEvent, trafficSource,
  type AnalyticsConfig, type AnalyticsEvent,
} from "./analytics-policy";

let client: PostHog | undefined;
let config: AnalyticsConfig | undefined;
let consent = false;
let loading: Promise<void> | undefined;
let lastPage: string | undefined;
let acquisition: Record<string, string> = {};
const paths = new Set(["/", "/abertura", "/institucional", "/segmentos", "/perguntas-frequentes", "/politica-de-privacidade",
  ...newsPosts.map((post) => `/noticias/${post.slug}`)]);

export function configureAnalytics(value: AnalyticsConfig) {
  config = value;
}

export function consentStorageKey(value: AnalyticsConfig) {
  return `plaswill:analytics:v1:${value.environment}:${value.siteHost}`;
}

export function productProperties(idOrName: string) {
  const product = products.find((item) => item.id === idOrName || item.name === idOrName);
  return product ? { product_id: product.id, product_category: product.category } : {};
}

/** Explicit attributes only: callers cannot attach form contents or contact URLs. */
export function track(event: AnalyticsEvent, attributes: {
  product?: string;
  section?: string;
  valid?: boolean;
} = {}) {
  if (!consent || !client || !config || location.hostname !== config.siteHost) return;
  const page = paths.has(location.pathname) ? location.pathname : "/other";
  client.capture(event, {
    site_host: config.siteHost, environment: config.environment, schema_version: 1,
    page_path: page, ...acquisition,
    ...(attributes.product ? productProperties(attributes.product) : {}),
    ...(attributes.section && /^(produtos|orcamento|topo|header|footer|sticky|other)$/.test(attributes.section)
      ? { section: attributes.section } : {}),
    ...(typeof attributes.valid === "boolean" ? { valid: attributes.valid } : {}),
  });
}

export function trackPage() {
  const page = paths.has(location.pathname) ? location.pathname : "/other";
  if (!consent || !client || page === lastPage) return;
  lastPage = page;
  track("$pageview");
}

export async function setAnalyticsConsent(accepted: boolean) {
  consent = accepted;
  if (!accepted) {
    lastPage = undefined;
    acquisition = {};
    client?.opt_out_capturing();
    return;
  }
  if (!config || location.hostname !== config.siteHost) return;
  if (!client) {
    loading ??= (async () => {
      // No PostHog code, persistence or external requests before explicit consent.
      const { default: posthog } = await import("posthog-js");
      if (!consent || !config) return;
      client = posthog.init(config.token, {
        api_host: config.host,
        persistence: "localStorage",
        persistence_name: `plaswill_${config.environment}_${config.siteHost}`,
        opt_out_capturing_persistence_type: "localStorage",
        opt_out_persistence_by_default: true,
        cross_subdomain_cookie: false,
        autocapture: false, capture_pageview: false, capture_pageleave: false,
        capture_performance: false, capture_exceptions: false, rageclick: false,
        capture_dead_clicks: false, enable_heatmaps: false,
        disable_session_recording: true, enable_recording_console_log: false,
        disable_surveys: true, disable_external_dependency_loading: true,
        advanced_disable_flags: true, person_profiles: "never",
        save_referrer: false, save_campaign_params: false, store_google: false,
        before_send: (event) => consent && event ? sanitizeAnalyticsEvent(event) : null,
      });
    })().finally(() => { loading = undefined; });
    await loading;
  }
  if (!consent || !client || !config) return;
  client.opt_in_capturing({ captureEventName: false });
  const query = new URLSearchParams(location.search);
  acquisition = { traffic_source: trafficSource(document.referrer, config.siteHost) };
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const code = campaignCode(query.get(key));
    if (code) acquisition[key] = code;
  }
  trackPage();
}
