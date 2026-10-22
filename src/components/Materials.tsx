import { materials } from "@/content/site";

import { PillButton } from "./PillButton";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Materiais e meio ambiente.
 *
 * Duas colunas, por um motivo de conteúdo e não de layout: à esquerda o que a
 * empresa faz (o processo de recuperação do polietileno), à direita o que ela
 * ainda não pode afirmar. Publicar só a coluna da esquerda seria o greenwashing
 * que o brief proíbe; publicar só a direita seria não dizer nada sobre um tema
 * que o site institucional atual já levanta.
 *
 * A lista da direita não é uma promessa de roadmap — é a razão pela qual o site
 * está silencioso sobre percentual, certificação e equivalência técnica. Quem
 * cobrar o dado vê que a ausência é uma escolha declarada, e o comercial recebe
 * a pergunta com contexto.
 */
export function Materials() {
  return (
    <section className="section" id="materiais">
      <div className="wrap">
        <SectionHeader
          number={materials.eyebrow}
          label={materials.eyebrowLabel}
          title={materials.title}
          lead={materials.lead}
        />

        <div className="materials-grid">
          <Reveal>
            <ol className="capability-list">
              {materials.steps.map((step) => (
                <li className="capability" key={step.code}>
                  <span className="t-code c-petrol capability-code">{step.code}</span>
                  <div className="stack-sm">
                    <h3 className="t-subhead">{step.title}</h3>
                    <p className="t-small c-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={100}>
            <aside className="materials-note">
              <p className="t-eyebrow c-petrol">{materials.pending.title}</p>
              <ul className="materials-pending">
                {materials.pending.items.map((item) => (
                  <li className="t-small c-muted" key={item}>
                    {item}
                  </li>
                ))}
              </ul>
              <PillButton href={materials.cta.href}>{materials.cta.label}</PillButton>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
