"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  configureAnalytics, consentStorageKey, setAnalyticsConsent, track, trackPage,
} from "@/lib/analytics";
import { type AnalyticsConfig, isAllowedSiteHost } from "@/lib/analytics-policy";

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [config, setConfig] = useState<AnalyticsConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    let active = true;
    void fetch("/api/analytics/config").then((response) => response.json()).then((value) => {
      if (!active || !value || !value.enabled || !isAllowedSiteHost(value.siteHost, location.hostname)) return;
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
    const onOpen = () => setOpen(true);
    window.addEventListener("plaswill:privacy-preferences", onOpen);
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
    return () => {
      window.removeEventListener("plaswill:privacy-preferences", onOpen);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("click", onClick);
    };
  }, [config]);

  function choose(allow: boolean) {
    if (!config) return;
    try { localStorage.setItem(consentStorageKey(config), allow ? "accepted" : "rejected"); } catch { /* In-memory choice still works. */ }
    setAccepted(allow);
    setOpen(false);
    void setAnalyticsConsent(allow).catch(() => {});
  }

  if (!config || !open) return null;
  return (
    <section className="analytics-consent analytics-drawer" aria-labelledby="analytics-consent-title" role="region">
      <div className="analytics-drawer-container">
        <div className="analytics-drawer-content">
          <div className="analytics-drawer-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFDE00" strokeWidth="2.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <h2 id="analytics-consent-title" className="analytics-drawer-title">
              Privacidade & Cookies de Navegação
            </h2>
          </div>
          <p className="analytics-drawer-text">
            Com sua autorização, utilizamos cookies analíticos (PostHog) para entender o interesse nos produtos, fichas técnicas e orçamentos da Plaswill. 
            Não gravamos telas nem coletamos dados pessoais digitados em formulários. Saiba mais em nossa{" "}
            <a href="/politica-de-privacidade" className="analytics-drawer-link">Política de privacidade</a>.
          </p>
        </div>
        <div className="analytics-consent-actions analytics-drawer-actions">
          <button type="button" className="analytics-btn-reject" onClick={() => choose(false)}>
            {accepted ? "Revogar consentimento" : "Recusar cookies"}
          </button>
          <button type="button" className="analytics-btn-accept" onClick={() => choose(true)}>
            Aceitar cookies
          </button>
        </div>
      </div>
    </section>
  );
}
