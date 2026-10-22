import { hero } from "@/content/site";

import { PillButton } from "./PillButton";
import { RawMaterialField } from "./RawMaterialField";
import { Reveal } from "./Reveal";

/**
 * Abertura em duas colunas no desktop: a promessa à esquerda, o campo de
 * matéria-prima ao lado, sangrando até a borda direita da janela. No mobile
 * o campo desce para baixo do texto e ocupa a largura toda. O H1 sobe linha
 * a linha por máscara CSS — sem JavaScript e sem bloquear a leitura: as
 * linhas chegam ao estado final mesmo se a animação não rodar.
 */
export function Hero() {
  return (
    <section className="section hero" id="topo">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <Reveal>
            <p className="eyebrow-row t-eyebrow">
              <span className="node" aria-hidden="true" />
              {hero.eyebrow}
            </p>
          </Reveal>

          <h1 className="t-display hero-title" aria-label={hero.headline}>
            {hero.headlineLines.map((line, index) => (
              <span className="hero-line" key={line} aria-hidden="true">
                <span style={{ animationDelay: `${120 + index * 110}ms` }}>{line}</span>
              </span>
            ))}
          </h1>

          <Reveal delay={80}>
            <p className="t-lead c-muted hero-lead">{hero.lead}</p>
          </Reveal>

          <Reveal delay={160}>
            <div className="cluster hero-actions">
              <PillButton href={hero.primaryCta.href} variant="primary">
                {hero.primaryCta.label}
              </PillButton>
              <PillButton href={hero.secondaryCta.href} marks={["tl", "br"]}>
                {hero.secondaryCta.label}
              </PillButton>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <dl className="facts">
              {hero.facts.map((fact) => (
                <div className="fact" key={fact.label}>
                  <dt className="t-eyebrow c-tertiary">{fact.label}</dt>
                  <dd className="t-spec fact-value">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={120} className="hero-visual">
          <div className="hero-field">
            <RawMaterialField />
            <p className="sr-only">
              Grânulos de polietileno — a matéria-prima que a Plaswill transforma em filme.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
