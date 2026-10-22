"use client";

import { useState } from "react";

import { products, site } from "@/content/site";

import { ProductDrawing } from "./drawings";
import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Catálogo em tabela no desktop e lista no mobile.
 *
 * A ficha técnica abre na própria linha — mantém a pessoa na página e evita
 * uma página por produto antes de existir catálogo oficial. O painel usa
 * grid-template-rows 0fr → 1fr e `inert` quando fechado, para que os links
 * internos não recebam foco enquanto o bloco está recolhido.
 */
export function Products() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section" id="produtos">
      <div className="wrap">
        <SectionHeader
          number="02"
          label="Produtos e soluções"
          title="Cinco linhas, uma mesma fábrica."
          lead="Cada linha sai da mesma planta em Panambi, com ficha técnica em mãos e amostra antes do pedido."
        />

        <div className="prod-table">
          <div className="prod-head" aria-hidden="true">
            <span>Código</span>
            <span>Produto</span>
            <span>Especificação</span>
            <span>Aplicação</span>
            <span />
          </div>

          {products.map((product, index) => {
            const open = openId === product.id;
            const panelId = `ficha-${product.id}`;

            return (
              <Reveal key={product.id} delay={index * 40}>
                <div className="prod" data-open={open ? "true" : "false"} id={product.id}>
                  <button
                    type="button"
                    className="prod-row"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : product.id)}
                  >
                    <span className="t-code c-tertiary prod-code">{product.code}</span>
                    <span className="t-subhead prod-name">{product.name}</span>
                    <span className="t-caption c-muted prod-spec">{product.specs[0].value}</span>
                    <span className="t-caption c-muted prod-app">{product.short}</span>
                    <span className="prod-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>

                  <div className="prod-panel" id={panelId} data-open={open ? "true" : "false"}>
                    <div className="prod-panel-clip">
                      <div className="prod-panel-body" inert={!open}>
                        <div className="prod-benefit">
                          <p className="t-eyebrow c-petrol">O que muda na operação</p>
                          <p className="t-body">{product.benefit}</p>
                          <ul className="tag-row prod-tags">
                            {product.applications.map((application) => (
                              <li className="tag t-caption" key={application}>
                                {application}
                              </li>
                            ))}
                          </ul>
                          <div className="cluster prod-actions">
                            <PillButton href="#orcamento" variant="primary">
                              Pedir amostra
                            </PillButton>
                            <PillButton href={site.whatsapp.href} marks={["tl", "br"]}>
                              Falar sobre esta linha
                            </PillButton>
                          </div>
                        </div>

                        <div className="prod-sheet">
                          <p className="t-eyebrow c-tertiary">Ficha técnica</p>
                          <dl className="spec-list">
                            {product.specs.map((spec) => (
                              <div className="spec-row" key={spec.label}>
                                <dt className="t-eyebrow">{spec.label}</dt>
                                <dd className="t-spec">{spec.value}</dd>
                              </div>
                            ))}
                          </dl>
                          <div className="prod-drawing">
                            <ProductDrawing id={product.drawing} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
