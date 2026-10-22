import { segments } from "@/content/site";

import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Segmentos em coluna única, na ordem de prioridade comercial. O código à
 * esquerda ancora a leitura; o traço tracejado separa sem transformar cada
 * frente em um cartão.
 */
export function Segments() {
  return (
    <section className="section" id="segmentos">
      <div className="wrap">
        <SectionHeader
          number={segments.eyebrow}
          label={segments.eyebrowLabel}
          title={segments.title}
          lead={segments.lead}
        />

        <div className="segment-list">
          {segments.items.map((segment, index) => (
            <Reveal key={segment.code} delay={index * 40}>
              <div className="segment-row">
                <span className="t-code c-tertiary segment-code">{segment.code}</span>
                <div className="stack-sm">
                  <h3 className="t-subhead">{segment.name}</h3>
                  <p className="t-small c-muted">{segment.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
