import { structure } from "@/content/site";

import { PlantDiagram } from "./drawings";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Estrutura e processo: a prancha técnica da linha de extrusão balão ao lado
 * das quatro etapas, ligadas por um eixo tracejado. O diagrama é o mesmo
 * repertório de desenho dos produtos, agora aplicado à fábrica inteira.
 */
export function Structure() {
  return (
    <section className="section" id="estrutura">
      <div className="wrap">
        <SectionHeader
          number={structure.eyebrow}
          label={structure.eyebrowLabel}
          title={structure.title}
          lead={structure.lead}
        />

        <div className="struct-grid">
          <Reveal className="struct-figure">
            <figure className="plate struct-plate">
              <p className="t-eyebrow c-tertiary">Linha de extrusão balão</p>
              <PlantDiagram />
              <figcaption className="plate-caption t-caption">
                Resina, balão, puxada e bobinadeira no mesmo galpão, em Panambi.
              </figcaption>
            </figure>
          </Reveal>

          <ol className="struct-steps">
            {structure.steps.map((step, index) => (
              <li className="struct-step" key={step.code}>
                <Reveal delay={index * 60}>
                  <span className="struct-num t-code" aria-hidden="true">
                    {index + 1}
                  </span>
                  <div className="stack-sm struct-step-copy">
                    <h3 className="t-subhead">{step.title}</h3>
                    <p className="t-small c-muted">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
