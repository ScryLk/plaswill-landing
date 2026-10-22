import { differentials } from "@/content/site";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Lista editorial: de um lado a objeção e o que o mercado faz, do outro a
 * resposta da Plaswill. Sem cartão, sem sombra — hierarquia por traço tracejado.
 */
export function Differentials() {
  return (
    <section className="section" id="diferenciais">
      <div className="wrap">
        <SectionHeader
          number="03"
          label="Diferenciais"
          title="Onde o fornecimento costuma falhar."
          lead="Cinco problemas que aparecem em quase toda cotação de embalagem industrial. O que a Plaswill faz em cada um deles."
        />

        <div className="row-list">
          {differentials.map((item, index) => (
            <Reveal key={item.pain} delay={index * 50}>
              <div className="row">
                <div className="stack-sm">
                  <p className="t-eyebrow c-tertiary">Objeção {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="t-subhead">{item.pain}</h3>
                  <p className="t-caption c-muted">{item.market}</p>
                </div>

                <div className="stack-sm">
                  <p className="t-eyebrow c-petrol">Como a Plaswill responde</p>
                  <p className="t-body">{item.plaswill}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
