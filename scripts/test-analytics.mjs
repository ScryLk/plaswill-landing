import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/analytics-policy.ts", import.meta.url), "utf8");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { publicAnalyticsConfig, sanitizeAnalyticsEvent, campaignCode, trafficSource } = await import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
const env = { POSTHOG_ENABLED: "true", POSTHOG_PROJECT_TOKEN: "phc_test", POSTHOG_INGESTION_HOST: "https://eu.i.posthog.com", POSTHOG_SITE_HOST: "site.plaswill.tech", POSTHOG_ENVIRONMENT: "staging" };

test("disabled or incomplete configuration fails closed", () => {
  assert.equal(publicAnalyticsConfig({}), null);
  for (const key of Object.keys(env)) assert.equal(publicAnalyticsConfig({ ...env, [key]: "" }), null);
  assert.equal(publicAnalyticsConfig({ ...env, POSTHOG_PROJECT_TOKEN: "phx_private" }), null);
  assert.equal(publicAnalyticsConfig({ ...env, POSTHOG_INGESTION_HOST: "https://attacker.example" }), null);
  assert.equal(publicAnalyticsConfig({ ...env, POSTHOG_ENVIRONMENT: "dev" }), null);
});
test("public configuration never exposes server credentials", () => {
  const result = publicAnalyticsConfig({ ...env, POSTHOG_PERSONAL_API_KEY: "private-sentinel", GH_TOKEN: "secret" });
  assert.equal(result.environment, "staging");
  assert.equal(JSON.stringify(result).includes("sentinel"), false);
  assert.deepEqual(Object.keys(result).sort(), ["enabled", "environment", "host", "siteHost", "token"]);
});
test("only contracted events and scalar properties cross the collection boundary", () => {
  assert.equal(sanitizeAnalyticsEvent({ event: "$autocapture", properties: {} }), null);
  assert.equal(sanitizeAnalyticsEvent({ event: "$snapshot", properties: {} }), null);
  const result = sanitizeAnalyticsEvent({ event: "whatsapp_click", $set: { email: "private" }, $set_once: { name: "private" }, properties: {
    distinct_id: "anonymous-id", "$session_id": "session", page_path: "/", product_id: "known-product",
    email: "person@example.com", phone: "555555", message: "private", "$current_url": "https://site/?email=private",
    "$referrer": "https://private.example/", "$set": { email: "private" }, "$initial_person_info": {},
  } });
  assert.deepEqual(result.properties, { distinct_id: "anonymous-id", "$session_id": "session", page_path: "/", product_id: "known-product", $process_person_profile: false });
  assert.equal("$set" in result, false);
  assert.equal("$set_once" in result, false);
});
test("campaign and referrer filtering never forwards raw contact strings or unknown referrer hosts", () => {
  for (const value of [null, "person@example.com", "555533758522", "https://private.example/a", "promo-123456", "a".repeat(65)]) assert.equal(campaignCode(value), undefined);
  assert.equal(campaignCode("google_cpc-2026"), "google_cpc-2026");
  assert.equal(trafficSource("https://www.google.com/search?q=private", "site.plaswill.tech"), "google");
  assert.equal(trafficSource("https://google.com.attacker.example/", "site.plaswill.tech"), "other");
  assert.equal(trafficSource("https://site.plaswill.tech/a", "site.plaswill.tech"), "internal");
  assert.equal(trafficSource("", "site.plaswill.tech"), "direct");
});
