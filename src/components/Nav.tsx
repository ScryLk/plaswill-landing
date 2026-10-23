"use client";

import { useEffect, useState } from "react";

import { nav, site } from "@/content/site";

import { PillButton } from "./PillButton";
import { Wordmark } from "./Wordmark";

/**
 * Navegação em barra flutuante de vidro, contorno tracejado e raio de cápsula.
 * No mobile vira um painel; no desktop os itens aparecem na própria barra.
 */
export function Nav({ logoSrc }: { logoSrc?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="nav-shell">
        <nav className="nav-pill" aria-label="Navegação principal">
          <a className="nav-brand" href="/#topo" aria-label={`${site.name} — início`}>
            <Wordmark src={logoSrc} />
          </a>

          <div className="nav-links">
            {nav.map((item) => (
              <a key={item.id} className="nav-link t-caption" href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <PillButton
              href="/#orcamento"
              variant="primary"
              className="nav-cta"
              marks={["tl", "br"]}
            >
              Solicitar orçamento
            </PillButton>

            <button
              type="button"
              className="nav-toggle t-caption"
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Fechar" : "Menu"}
            </button>
          </div>
        </nav>
      </div>

      {/* O painel existe sempre (só oculto) para o aria-controls do botão
          apontar para um elemento real, inclusive antes da primeira abertura. */}
      <div className="nav-panel" id="menu-mobile" hidden={!open}>
        <ul className="nav-panel-list">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                className="nav-panel-link t-body"
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="nav-panel-link t-body"
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              WhatsApp {site.whatsapp.label}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
