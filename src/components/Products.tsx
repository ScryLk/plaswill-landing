"use client";

import { Fragment, useState } from "react";

import {
  catalog,
  productCategories,
  productsByCategory,
  site,
  type Product,
} from "@/content/site";

import { ProductDrawing } from "./drawings";
import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Catálogo agrupado por categoria.
 *
 * A estrutura anterior era uma tabela de cinco linhas — uma por "linha de
 * produto" —, e a simplificação visual funcionava. O problema era de cobertura:
 * o site institucional publica quatorze produtos, e cinco linhas deixavam nove
 * deles sem endereço na página. Quem procurava "saco para pedra" ou "lençol
 * descartável" não encontrava.
 *
 * O que mudou: os quatorze produtos estão aqui, distribuídos em cinco
 * categorias. O índice de categorias no topo é feito de âncoras comuns, sem
 * estado no cliente, então funciona antes da hidratação e não custa JavaScript.
 * A ficha técnica continua abrindo na própria linha, pelo mesmo motivo de
 * antes: manter a pessoa na página.
 *
 * **Por que não virou página por produto.** O brief deixa a decisão em aberto e
 * a resposta depende de conteúdo: uma página de produto precisa de foto real,
 * medida e aplicação, e hoje não há foto de produto nenhuma. Publicar quatorze
 * páginas com prancha técnica e nenhuma imagem criaria páginas vazias para o
 * buscador. A arquitetura já aceita essa evolução — `products` é a fonte, e o
 * código de cada item (`PR-01`…) foi pensado como chave de URL.
 */
export function Products() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section" id="produtos">
      <div className="wrap">
        <SectionHeader
          number="02"
          label="Produtos e soluções"
          title="Cinco categorias, quatorze produtos, uma mesma fábrica."
          lead="Cada item sai da mesma planta em Panambi, com ficha técnica em mãos e amostra antes do pedido."
          action={
            <PillButton href={catalog.href} marks={["tl", "br"]}>
              {catalog.label}
            </PillButton>
          }
        />

        {/* Índice por categoria. Âncoras simples: nenhum estado, nenhum filtro
            escondendo produto de quem usa leitor de tela ou buscador. */}
        <nav className="prod-index" aria-label="Categorias de produto">
          {productCategories.map((category) => (
            <a className="prod-index__item" href={`#cat-${category.id}`} key={category.id}>
              <span className="t-code c-petrol">{category.code}</span>
              <span className="t-caption">{category.name}</span>
              <span className="t-code c-tertiary">
                {productsByCategory(category.id).length}
              </span>
            </a>
          ))}
        </nav>

        <div className="prod-table">
          <div className="prod-head" aria-hidden="true">
            <span>Código</span>
            <span>Produto</span>
            <span>Especificação</span>
            <span>Aplicação</span>
            <span />
          </div>

          {productCategories.map((category) => {
            const items = productsByCategory(category.id);

            return (
              <Fragment key={category.id}>
                <div className="prod-cat" id={`cat-${category.id}`}>
                  <span className="t-code c-petrol prod-cat__code">{category.code}</span>
                  <div className="stack-sm">
                    <h3 className="t-subhead">{category.name}</h3>
                    <p className="t-small c-muted">{category.lead}</p>
                  </div>
                  <span className="t-caption c-tertiary prod-cat__count">
                    {items.length} {items.length === 1 ? "produto" : "produtos"}
                  </span>
                </div>

                {items.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={index}
                    open={openId === product.id}
                    onToggle={() =>
                      setOpenId(openId === product.id ? null : product.id)
                    }
                  />
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProductRow({
  product,
  index,
  open,
  onToggle,
}: {
  product: Product;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `ficha-${product.id}`;

  /**
   * "Pedir amostra" avisa o formulário de qual produto se trata.
   *
   * O evento é disparado antes do salto de âncora, e o `QuoteForm` escuta. Sem
   * isso o visitante teria de reencontrar nos catorze itens do select o produto
   * de onde acabou de sair — e um select com quatorze opções é exatamente o
   * ponto onde a pessoa desiste. Nenhuma navegação nova, nenhum parâmetro de
   * URL: um evento, um campo preenchido na mesma página.
   */
  const requestSample = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("plaswill:produto", { detail: product.name }),
    );
  };

  return (
    <Reveal delay={index * 40}>
      <div className="prod" data-open={open ? "true" : "false"} id={product.id}>
        <button
          type="button"
          className="prod-row"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
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
                  <PillButton
                    href="#orcamento"
                    variant="primary"
                    onClick={requestSample}
                  >
                    Pedir amostra
                  </PillButton>
                  <PillButton href={site.whatsapp.href} marks={["tl", "br"]}>
                    Falar sobre este item
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
                  <ProductDrawing id={product.drawing} subject={product.name} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
