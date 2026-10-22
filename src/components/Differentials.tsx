import { differentials } from "@/content/site";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Lista editorial: à esquerda o diferencial e por que ele aparece na conversa
 * comercial, à direita o que a Plaswill faz no que é verificável.
 *
 * Sem cartão, sem sombra, sem ícone decorativo — a hierarquia é o traço
 * tracejado. O rótulo da coluna direita deixou de ser "Como a Plaswill responde"
 * porque não há mais objeção a responder: a seção apresenta, não rebate.
 */
export function Differentials() {
  return (
    <section className="section" id="diferenciais">
      <div className="wrap">
        <SectionHeader
          number="03"
          label="Diferenciais"
          title="Diferenciais que acompanham sua operação."
          lead="Seis pontos que decidem a compra de embalagem industrial. O que a Plaswill faz em cada um deles."
        />

        <div className="row-list">
          {differentials.map((item, index) => (
            <Reveal key={item.title} delay={index * 50}>
              <div className="row">
                <div className="stack-sm">
                  <p className="t-eyebrow c-tertiary">
                    Diferencial {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="t-subhead">{item.title}</h3>
                  <p className="t-caption c-muted">{item.context}</p>
                </div>

                <div className="stack-sm">
                  <p className="t-eyebrow c-petrol">Na prática</p>
                  <p className="t-body">{item.evidence}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
