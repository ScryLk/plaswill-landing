"use client";

import { useState } from "react";

import { faq } from "@/content/site";

import { SectionHeader } from "./SectionHeader";

/**
 * Acordeão de perguntas frequentes.
 *
 * O painel anima grid-template-rows de 0fr para 1fr — nunca altura — e o
 * conteúdo recolhido fica com aria-hidden. Isso é seguro porque as respostas
 * são só texto: não existe elemento focável dentro do painel fechado.
 * Se algum dia entrar um link ou botão numa resposta, troque aria-hidden por
 * `inert` (React 19) para não prender foco em conteúdo escondido.
 *
 * Botão com aria-expanded e aria-controls, painel com role="region" e
 * aria-labelledby: o padrão de disclosure, sem biblioteca.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section" id="duvidas">
      <div className="wrap">
        <SectionHeader number={faq.eyebrow} label={faq.eyebrowLabel} title={faq.title} />

        <div className="faq-list">
          {faq.items.map((item, index) => {
            const isOpen = openIndex === index;
            const headerId = `faq-${index}-trigger`;
            const panelId = `faq-${index}-panel`;

            return (
              <div className="faq-item" data-open={isOpen ? "true" : "false"} key={item.question}>
                <h3 style={{ margin: 0 }}>
                  <button
                    type="button"
                    id={headerId}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="t-subhead">{item.question}</span>
                    <span className="faq-plus" aria-hidden="true">
                      <span className="h" />
                      <span className="v" />
                    </span>
                  </button>
                </h3>

                <div
                  className="faq-panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                >
                  <div className="faq-panel-inner" aria-hidden={!isOpen}>
                    <div className="faq-answer t-body">
                      {item.answer.map((paragraph) => (
                        <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
