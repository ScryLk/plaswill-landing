// Uses a local production server; every external request is intercepted.
// Supply PLAYWRIGHT_MODULE with an absolute module path if Playwright is installed outside this repo.
import assert from "node:assert/strict";
import { gunzipSync } from "node:zlib";
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", headless: true, args: ["--no-sandbox"] });
const base = process.env.ANALYTICS_TEST_BASE_URL || "http://127.0.0.1:3000";
const config = { enabled: true, token: "phc_fixture_only", host: "https://eu.i.posthog.com", siteHost: new URL(base).hostname, environment: "staging" };

function decode(request) {
  let body = request.postDataBuffer();
  if (!body) return [];
  if (body[0] === 0x1f && body[1] === 0x8b) body = gunzipSync(body);
  const parsed = JSON.parse(body.toString());
  return Array.isArray(parsed) ? parsed : parsed.batch ?? [parsed];
}

try {
  const context = await browser.newContext({ userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" });
  const events = [], external = [], errors = [];
  await context.route("**/*", async (route) => {
    const request = route.request(), url = new URL(request.url());
    if (url.origin === new URL(base).origin) {
      if (url.pathname === "/api/analytics/config") return route.fulfill({ json: config });
      return route.continue();
    }
    external.push(request.url());
    if (request.method() === "POST" && url.hostname.endsWith("posthog.com")) {
      try { events.push(...decode(request)); } catch (error) { errors.push(error.message); }
    }
    return route.fulfill({ status: 200, contentType: "application/json", body: '{"status":1}' });
  });
  await context.addInitScript(() => {
    window.open = () => null;
    // Exercise the normal visitor path while retaining the production SDK's bot filter.
    Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false });
  });
  const page = await context.newPage();
  page.on("console", (message) => { if (message.type() === "error" || message.type() === "warning") console.log("Browser:", message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/?email=PRIVATE_SENTINEL&utm_source=google&utm_campaign=launch_2026`);
  await page.getByRole("button", { name: "Aceitar medição", exact: true }).waitFor();
  await page.waitForTimeout(500);
  assert.equal(external.length, 0, "No third-party request before consent");
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_"))), []);
  await page.getByRole("button", { name: "Recusar medição", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Preferências de privacidade" }).waitFor();
  assert.equal(await page.getByRole("button", { name: "Aceitar medição", exact: true }).count(), 0);
  assert.equal(external.length, 0, "Refusal survives reload");
  await page.getByRole("button", { name: "Preferências de privacidade" }).click();
  await page.getByRole("button", { name: "Aceitar medição", exact: true }).click();
  await page.waitForTimeout(6500);
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal(events.filter((e) => e.event === "$pageview").length, 1, "One initial pageview");

  // Suppress real navigation while retaining the app's delegated click handler.
  await page.evaluate(() => document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) event.preventDefault();
  }, true));
  const product = page.locator(".prod").first();
  await product.locator(".prod-row").evaluate((button) => button.click());
  await product.getByText("Pedir amostra", { exact: true }).evaluate((anchor) => anchor.click());
  await product.getByText("Falar sobre este item", { exact: true }).evaluate((anchor) => anchor.click());
  await product.locator(".prod-row").evaluate((button) => button.click()); // Closing is not an opening event.
  await page.locator('footer a[href^="tel:"]').first().evaluate((anchor) => anchor.click());
  await page.locator('footer a[href^="mailto:"]').first().evaluate((anchor) => anchor.click());
  await page.locator('a[href="/#orcamento"]').evaluateAll((anchors) => {
    const anchor = anchors.find((item) => !item.closest("[data-product-id]"));
    if (!anchor) throw new Error("Missing quote CTA");
    anchor.click();
  });
  await page.locator(".quote-form button[type=submit]").evaluate((button) => button.click());
  await page.locator("#f-name").fill("PRIVATE_SENTINEL");
  await page.locator("#f-company").fill("PRIVATE_COMPANY");
  await page.locator("#f-email").fill("private@example.com");
  await page.locator("#f-phone").fill("555533758522");
  await page.locator("#f-message").fill("PRIVATE_MESSAGE");
  await page.locator(".quote-form button[type=submit]").evaluate((button) => button.click());
  await page.waitForTimeout(4500);
  assert.equal(errors.length, 0, errors.join("\n"));
  const count = (name) => events.filter((e) => e.event === name).length;
  for (const name of ["product_details_opened", "sample_request_started", "whatsapp_click", "quote_form_started", "quote_whatsapp_open_attempted"]) assert.equal(count(name), 1, name);
  assert.equal(count("quote_validation_attempted"), 2);
  assert.equal(count("phone_click"), 1);
  assert.equal(count("email_click"), 1);
  assert.deepEqual(events.filter((e) => e.event === "quote_validation_attempted").map((e) => e.properties.valid), [false, true]);
  assert.equal(count("quote_cta_clicked"), 1, "Only the explicit CTA counts; sample click is not duplicated");
  const serialized = JSON.stringify(events);
  for (const secret of ["PRIVATE_SENTINEL", "PRIVATE_COMPANY", "private@example.com", "555533758522", "PRIVATE_MESSAGE", "$current_url", "$referrer", "$set"]) assert.equal(serialized.includes(secret), false, secret);
  assert.ok(events.every((event) => event.properties.site_host === config.siteHost && event.properties.environment === "staging"));
  assert.ok(events.every((event) => event.properties.distinct_id && event.properties.$session_id));
  assert.ok(events.every((event) => event.properties.$process_person_profile === false));
  assert.ok(events.find((event) => event.event === "whatsapp_click").properties.product_id);

  const otherTab = await context.newPage();
  await otherTab.goto(`${base}/segmentos`);
  await otherTab.getByRole("button", { name: "Preferências de privacidade" }).waitFor();
  await otherTab.waitForTimeout(4500);
  assert.equal(count("$pageview"), 2, "Consent enables the next page without another prompt");
  assert.equal(new Set(events.map((event) => event.properties.distinct_id)).size, 1, "Anonymous browser identity survives navigation");

  await page.getByRole("button", { name: "Preferências de privacidade" }).click();
  await page.getByRole("button", { name: "Revogar consentimento" }).click();
  await otherTab.waitForTimeout(100);
  await otherTab.evaluate(() => {
    const anchor = document.querySelector('footer a[href^="mailto:"]');
    anchor.addEventListener("click", (event) => event.preventDefault());
    anchor.click();
  });
  const countBeforeRevoke = events.length;
  await product.locator(".prod-row").evaluate((button) => button.click());
  await page.waitForTimeout(4500);
  assert.equal(events.length, countBeforeRevoke, "Revocation stops collection");
  assert.deepEqual(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_"))), [], "Revocation clears SDK persistence");
  await otherTab.close();
  await page.reload();
  await page.waitForTimeout(1000);
  assert.equal(events.length, countBeforeRevoke, "Revocation survives reload");

  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole("button", { name: "Preferências de privacidade" }).click();
    const box = await page.locator(".analytics-consent").boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= width && box.y >= 0 && box.y + box.height <= 900);
    await page.getByRole("button", { name: "Recusar medição", exact: true }).click();
  }
  console.log("PASS: consent/refusal/revocation, real SDK payloads, commercial events, no PII, product attribution, mobile/tablet/desktop");
  await context.close();

  const disabled = await browser.newContext();
  let requests = 0;
  await disabled.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== new URL(base).origin) { requests++; return route.abort(); }
    return route.continue();
  });
  const off = await disabled.newPage();
  await off.goto(base);
  await off.waitForTimeout(500);
  assert.equal((await (await off.request.get(`${base}/api/analytics/config`)).json()).enabled, false);
  assert.equal(await off.getByRole("button", { name: "Preferências de privacidade" }).count(), 0);
  assert.equal(requests, 0);
  console.log("PASS: real runtime configuration defaults to disabled, no external requests");
  await disabled.close();
} finally { await browser.close(); }
