"use client";

import { useEffect, useState } from "react";

import { PillButton } from "./PillButton";

/**
 * Barra de conversão fixa no mobile. Aparece depois que a abertura sai da
 * tela e some ao chegar na faixa de orçamento, para não cobrir o formulário.
 * É só um atalho para a mesma âncora: nenhum estado novo de navegação.
 */
export function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("topo");
      const quote = document.getElementById("orcamento");
      const pastHero = hero ? window.scrollY > hero.offsetHeight * 0.72 : window.scrollY > 640;

      // Uma vez que a faixa de orçamento entra na tela, a barra sai de cena
      // até o fim da página — inclusive sobre o rodapé.
      const atQuote = quote
        ? quote.getBoundingClientRect().top < window.innerHeight * 0.92
        : false;

      setShow(pastHero && !atQuote);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="sticky-cta" data-show={show ? "true" : "false"} inert={!show}>
      <PillButton href="#orcamento" variant="primary" block>
        Solicitar orçamento
      </PillButton>
    </div>
  );
}
