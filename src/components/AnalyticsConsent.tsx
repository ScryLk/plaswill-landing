"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  configureAnalytics, consentStorageKey, setAnalyticsConsent, track, trackPage,
} from "@/lib/analytics";
import type { AnalyticsConfig } from "@/lib/analytics-policy";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/analytics/config").then((response) => response.json()).then((value) => {
      if (!active || !value.enabled || value.siteHost !== location.hostname) return;
      setConfig(value);
      configureAnalytics(value);
      let choice: string | null = null;
      try { choice = localStorage.getItem(consentStorageKey(value)); } catch { /* Default to no consent. */ }
      setOpen(choice !== "accepted" && choice !== "rejected");
      setAccepted(choice === "accepted");
      void setAnalyticsConsent(choice === "accepted").catch(() => {});
    }).catch(() => {}); // Measurement failure must not affect the commercial site.
    return () => { active = false; };
  }, []);

  useEffect(() => { trackPage(); }, [pathname]);

  useEffect(() => {
    if (!config) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== consentStorageKey(config) && event.key !== null) return;
      const allow = event.newValue === "accepted";
      setAccepted(allow);
      setOpen(event.newValue === null);
      void setAnalyticsConsent(allow).catch(() => {});
    };
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const section = anchor.closest("section[id]")?.id
        ?? (anchor.closest("footer") ? "footer" : anchor.closest("header, nav") ? "header"
          : anchor.closest(".sticky-cta") ? "sticky" : "other");
      const product = anchor.closest("[data-product-id]")?.getAttribute("data-product-id") ?? undefined;
      // Never capture href, textContent, DOM attributes or the prefilled WhatsApp message.
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/.test(href)) track("whatsapp_click", { section, product });
      else if (href.startsWith("tel:")) track("phone_click", { section });
      else if (href.startsWith("mailto:")) track("email_click", { section });
      else if ((href === "#orcamento" || href === "/#orcamento") && !product) track("quote_cta_clicked", { section });
    };
    window.addEventListener("storage", onStorage);
    document.addEventListener("click", onClick);
    return () => { window.removeEventListener("storage", onStorage); document.removeEventListener("click", onClick); };
  }, [config]);

  function choose(allow: boolean) {
    if (!config) return;
    try { localStorage.setItem(consentStorageKey(config), allow ? "accepted" : "rejected"); } catch { /* In-memory choice still works. */ }
    setAccepted(allow);
    setOpen(false);
    void setAnalyticsConsent(allow).catch(() => {});
  }

  if (!config) return null;
  return (
    <>
      <button type="button" className="analytics-preferences" onClick={() => setOpen(true)}>
        Preferências de privacidade
      </button>
      {open ? (
        <section className="analytics-consent" aria-labelledby="analytics-consent-title">
          <h2 id="analytics-consent-title" className="t-subhead">Medição opcional de uso</h2>
          <p className="t-small">Com sua autorização, usamos o PostHog para medir visitas e interações com produtos e contatos. Os campos do formulário não são enviados à ferramenta. Você pode recusar e continuar usando o site.</p>
          <a href="/politica-de-privacidade" className="t-small link-underline">Política de privacidade</a>
          <div className="analytics-consent-actions">
            <button type="button" className="pill t-button" onClick={() => choose(false)}>{accepted ? "Revogar consentimento" : "Recusar medição"}</button>
            <button type="button" className="pill t-button" onClick={() => choose(true)}>Aceitar medição</button>
          </div>
        </section>
      ) : null}
    </>
  );
}
